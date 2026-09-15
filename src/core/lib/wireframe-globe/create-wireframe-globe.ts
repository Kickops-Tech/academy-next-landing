import {
  WIREFRAME_GLOBE_CAMERA_FOV,
  WIREFRAME_GLOBE_CAMERA_Z,
  WIREFRAME_GLOBE_INTERIOR_SCALE,
  WIREFRAME_GLOBE_LINE_WIDTH_PX,
  WIREFRAME_GLOBE_RADIUS,
  WIREFRAME_GLOBE_ROTATION_RAD_S,
  WIREFRAME_GLOBE_SEGMENTS,
  WIREFRAME_GLOBE_WAVE_AMP,
  WIREFRAME_GLOBE_WAVE_DIAGONAL,
  WIREFRAME_GLOBE_WAVE_FREQ,
  WIREFRAME_GLOBE_WAVE_SHARPNESS,
  WIREFRAME_GLOBE_WAVE_SPEED,
} from "@core/constants/wireframe-globe";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";

export type WireframeGlobeHandle = {
  setSize: (width: number, height: number, dpr: number) => void;
  setLineColor: (hex: string, opacity: number) => void;
  /** Linear RGB 0–1 + opacity — for smooth theme blends. */
  setLineRgba: (r: number, g: number, b: number, opacity: number) => void;
  tick: (dtSeconds: number) => void;
  dispose: () => void;
};

type WaveUniforms = {
  uWaveTime: { value: number };
  uWaveAmp: { value: number };
  uWaveFreq: { value: number };
  uWaveSpeed: { value: number };
  uWaveDiagonal: { value: number };
  uWaveSharpness: { value: number };
};

/**
 * Flat xyz pairs for each segment endpoint (LineSegmentsGeometry.setPositions).
 */
function createLatLongPositions(radius: number, segments: number): Float32Array {
  const positions: number[] = [];

  // Longitudes (meridians)
  for (let i = 0; i < segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    for (let j = 0; j < segments; j += 1) {
      const phi0 = (j / segments) * Math.PI - Math.PI / 2;
      const phi1 = ((j + 1) / segments) * Math.PI - Math.PI / 2;
      const cos0 = Math.cos(phi0);
      const sin0 = Math.sin(phi0);
      const cos1 = Math.cos(phi1);
      const sin1 = Math.sin(phi1);
      positions.push(
        radius * cos0 * cosT,
        radius * sin0,
        radius * cos0 * sinT,
        radius * cos1 * cosT,
        radius * sin1,
        radius * cos1 * sinT,
      );
    }
  }

  // Latitudes (parallels) — skip poles
  for (let j = 1; j < segments; j += 1) {
    const phi = (j / segments) * Math.PI - Math.PI / 2;
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);
    const y = radius * sinP;
    const ringR = radius * cosP;
    for (let i = 0; i < segments; i += 1) {
      const t0 = (i / segments) * Math.PI * 2;
      const t1 = ((i + 1) / segments) * Math.PI * 2;
      positions.push(
        ringR * Math.cos(t0),
        y,
        ringR * Math.sin(t0),
        ringR * Math.cos(t1),
        y,
        ringR * Math.sin(t1),
      );
    }
  }

  return new Float32Array(positions);
}

/**
 * Fixed interior scale — camera stays inside the sphere on all viewports.
 * (Former width-fit placed the camera outside a ~0.7× viewport globe.)
 */
function interiorScale() {
  return WIREFRAME_GLOBE_INTERIOR_SCALE;
}

function createWaveUniformState(): WaveUniforms {
  return {
    uWaveTime: { value: 0 },
    uWaveAmp: { value: WIREFRAME_GLOBE_WAVE_AMP },
    uWaveFreq: { value: WIREFRAME_GLOBE_WAVE_FREQ },
    uWaveSpeed: { value: WIREFRAME_GLOBE_WAVE_SPEED },
    uWaveDiagonal: { value: WIREFRAME_GLOBE_WAVE_DIAGONAL },
    uWaveSharpness: { value: WIREFRAME_GLOBE_WAVE_SHARPNESS },
  };
}

/**
 * Inject a diagonal top→bottom opacity wave into LineMaterial (screen-space lines).
 */
function attachOpacityWave(
  material: LineMaterial,
  wave: WaveUniforms,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWaveTime = wave.uWaveTime;
    shader.uniforms.uWaveAmp = wave.uWaveAmp;
    shader.uniforms.uWaveFreq = wave.uWaveFreq;
    shader.uniforms.uWaveSpeed = wave.uWaveSpeed;
    shader.uniforms.uWaveDiagonal = wave.uWaveDiagonal;
    shader.uniforms.uWaveSharpness = wave.uWaveSharpness;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <clipping_planes_pars_vertex>",
        `#include <clipping_planes_pars_vertex>
        varying vec3 vWavePos;`,
      )
      .replace(
        "void main() {",
        `void main() {
          vWavePos = ( position.y < 0.5 ) ? instanceStart : instanceEnd;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <clipping_planes_pars_fragment>",
        `#include <clipping_planes_pars_fragment>
        uniform float uWaveTime;
        uniform float uWaveAmp;
        uniform float uWaveFreq;
        uniform float uWaveSpeed;
        uniform float uWaveDiagonal;
        uniform float uWaveSharpness;
        varying vec3 vWavePos;`,
      )
      .replace(
        "float alpha = opacity;",
        `float alpha = opacity;
          float axis = vWavePos.y + vWavePos.x * uWaveDiagonal;
          float waveT = 0.5 + 0.5 * sin( axis * uWaveFreq - uWaveTime * uWaveSpeed );
          waveT = pow( max( waveT, 0.0 ), uWaveSharpness );
          // Thin transparent arc only — never raise alpha above theme opacity.
          alpha *= mix( 1.0, 1.0 - uWaveAmp, waveT );
          alpha = clamp( alpha, 0.0, 1.0 );`,
      );
  };

  material.customProgramCacheKey = () => "wireframe-globe-opacity-wave-v3";
  material.needsUpdate = true;
}

/**
 * Imperative Three.js wireframe globe bound to an existing canvas.
 * Uses fat screen-space lines (LineSegments2) so thickness is visible in WebGL.
 */
export function createWireframeGlobe(
  canvas: HTMLCanvasElement,
): WireframeGlobeHandle {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    WIREFRAME_GLOBE_CAMERA_FOV,
    1,
    0.02,
    20,
  );
  // Slightly off-center so rotation reads as being inside the mesh.
  camera.position.z = WIREFRAME_GLOBE_CAMERA_Z;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);

  const geometry = new LineSegmentsGeometry();
  geometry.setPositions(
    createLatLongPositions(WIREFRAME_GLOBE_RADIUS, WIREFRAME_GLOBE_SEGMENTS),
  );

  const material = new LineMaterial({
    color: new Color("#121212"),
    linewidth: WIREFRAME_GLOBE_LINE_WIDTH_PX,
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    worldUnits: false,
  });
  material.resolution.set(1, 1);

  const wave = createWaveUniformState();
  attachOpacityWave(material, wave);

  const lines = new LineSegments2(geometry, material);
  // Stronger axial tilt so the wireframe reads clearly as a globe.
  lines.rotation.x = 0.52;
  lines.rotation.z = -0.22;
  lines.computeLineDistances();
  scene.add(lines);

  let disposed = false;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;

  const syncWaveAmp = () => {
    wave.uWaveAmp.value = reducedMotion ? 0 : WIREFRAME_GLOBE_WAVE_AMP;
  };
  syncWaveAmp();

  const onMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches;
    syncWaveAmp();
  };
  motionQuery.addEventListener("change", onMotionChange);

  return {
    setSize(width, height, dpr) {
      if (disposed || width <= 0 || height <= 0) {
        return;
      }
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      material.resolution.set(width, height);
      lines.scale.setScalar(interiorScale());
    },

    setLineColor(hex, opacity) {
      if (disposed) {
        return;
      }
      material.color.set(hex);
      material.opacity = opacity;
      material.needsUpdate = true;
    },

    setLineRgba(r, g, b, opacity) {
      if (disposed) {
        return;
      }
      material.color.setRGB(r, g, b);
      material.opacity = opacity;
      material.needsUpdate = true;
    },

    tick(dtSeconds) {
      if (disposed) {
        return;
      }
      if (!reducedMotion && dtSeconds > 0) {
        lines.rotation.y += WIREFRAME_GLOBE_ROTATION_RAD_S * dtSeconds;
        wave.uWaveTime.value += dtSeconds;
      }
      renderer.render(scene, camera);
    },

    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      motionQuery.removeEventListener("change", onMotionChange);
      scene.remove(lines);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
