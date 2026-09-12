import {
  WIREFRAME_GLOBE_CAMERA_FOV,
  WIREFRAME_GLOBE_CAMERA_Z,
  WIREFRAME_GLOBE_LINE_WIDTH_PX,
  WIREFRAME_GLOBE_RADIUS,
  WIREFRAME_GLOBE_ROTATION_RAD_S,
  WIREFRAME_GLOBE_SEGMENTS,
  WIREFRAME_GLOBE_WIDTH_RATIO,
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

function widthFitScale(aspect: number) {
  const fovRad = (WIREFRAME_GLOBE_CAMERA_FOV * Math.PI) / 180;
  const visibleHeight =
    2 * Math.tan(fovRad / 2) * WIREFRAME_GLOBE_CAMERA_Z;
  const visibleWidth = visibleHeight * aspect;
  const targetDiameter = visibleWidth * WIREFRAME_GLOBE_WIDTH_RATIO;
  return targetDiameter / (2 * WIREFRAME_GLOBE_RADIUS);
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
    0.1,
    20,
  );
  camera.position.z = WIREFRAME_GLOBE_CAMERA_Z;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
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
    opacity: 0.16,
    depthWrite: false,
    worldUnits: false,
  });
  material.resolution.set(1, 1);

  const lines = new LineSegments2(geometry, material);
  // Stronger axial tilt so the wireframe reads clearly as a globe.
  lines.rotation.x = 0.52;
  lines.rotation.z = -0.22;
  lines.computeLineDistances();
  scene.add(lines);

  let disposed = false;

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
      lines.scale.setScalar(widthFitScale(camera.aspect));
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
      lines.rotation.y += WIREFRAME_GLOBE_ROTATION_RAD_S * dtSeconds;
      renderer.render(scene, camera);
    },

    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      scene.remove(lines);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
