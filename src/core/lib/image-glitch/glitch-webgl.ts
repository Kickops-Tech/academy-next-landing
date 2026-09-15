/**
 * WebGL2 setup and draw loop for the shared image glitch effect.
 *
 * @module core/lib/image-glitch/glitch-webgl
 */

import {
  GLITCH_FRAGMENT_SHADER,
  GLITCH_VERTEX_SHADER,
} from "@core/lib/image-glitch/glitch-shaders";
import { GLITCH_SIGNAL_FRAGMENT_SHADER } from "@core/lib/image-glitch/glitch-shaders-signal";
import {
  GLITCH_SIGNAL_PRESETS,
  type GlitchSignalPreset,
  type GlitchSignalPresetId,
} from "@core/lib/image-glitch/glitch-signal-presets";
import { createTrailTexture } from "@core/lib/image-glitch/pixelate-trail-webgl";

export type ImageGlitchFit = "contain" | "cover";

/** Which fragment program to compile. Legacy vaporwave vs Kickops signal. */
export type GlitchShaderVariant = "vaporwave" | "signal";

/**
 * Runtime WebGL state for one glitch canvas instance.
 */
export interface GlitchRenderer {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  cellTexture: WebGLTexture;
  trailTexture: WebGLTexture;
  layerTextures: WebGLTexture[];
  variant: GlitchShaderVariant;
  uniforms: {
    resolution: WebGLUniformLocation | null;
    gridSize: WebGLUniformLocation | null;
    imageAspect: WebGLUniformLocation | null;
    fitMode: WebGLUniformLocation | null;
    proceduralPixelate: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    glitchMix: WebGLUniformLocation | null;
    trailSize: WebGLUniformLocation | null;
    trailMask: WebGLUniformLocation | null;
    cellData: WebGLUniformLocation | null;
    textures: (WebGLUniformLocation | null)[];
    shiftAmp: WebGLUniformLocation | null;
    chromaAmp: WebGLUniformLocation | null;
    invertChance: WebGLUniformLocation | null;
    stripActiveThreshold: WebGLUniformLocation | null;
  };
  destroy: () => void;
}

export type CreateGlitchRendererOptions = {
  variant?: GlitchShaderVariant;
};

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  variant: GlitchShaderVariant,
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, GLITCH_VERTEX_SHADER);
  const fragmentSource =
    variant === "signal"
      ? GLITCH_SIGNAL_FRAGMENT_SHADER
      : GLITCH_FRAGMENT_SHADER;
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }
  return program;
}

function createQuadVao(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  if (!vao || !buffer) throw new Error("Failed to create VAO/buffer");

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return vao;
}

function createEmptyTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("Failed to create texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

/**
 * Initialize WebGL2 on a canvas element.
 */
export function createGlitchRenderer(
  canvas: HTMLCanvasElement,
  options: CreateGlitchRendererOptions = {},
): GlitchRenderer {
  const variant = options.variant ?? "vaporwave";
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    // Premultiplied output — required for correct transparent PNG compositing
    // on iOS Safari (non-premultiplied + white RGB in a=0 texels → white bands).
    premultipliedAlpha: true,
    antialias: false,
  });
  if (!gl) throw new Error("WebGL2 not supported");

  const program = createProgram(gl, variant);
  const vao = createQuadVao(gl, program);
  const cellTexture = createEmptyTexture(gl);
  const trailTexture = createTrailTexture(gl);
  const layerTextures = Array.from({ length: 4 }, () => createEmptyTexture(gl));

  const uniforms = {
    resolution: gl.getUniformLocation(program, "uResolution"),
    gridSize: gl.getUniformLocation(program, "uGridSize"),
    imageAspect: gl.getUniformLocation(program, "uImageAspect"),
    fitMode: gl.getUniformLocation(program, "uFitMode"),
    proceduralPixelate: gl.getUniformLocation(program, "uProceduralPixelate"),
    time: gl.getUniformLocation(program, "uTime"),
    glitchMix: gl.getUniformLocation(program, "uGlitchMix"),
    trailSize: gl.getUniformLocation(program, "uTrailSize"),
    trailMask: gl.getUniformLocation(program, "uTrailMask"),
    cellData: gl.getUniformLocation(program, "uCellData"),
    textures: [0, 1, 2, 3].map((i) =>
      gl.getUniformLocation(program, `uTex${i}`),
    ),
    shiftAmp: gl.getUniformLocation(program, "uShiftAmp"),
    chromaAmp: gl.getUniformLocation(program, "uChromaAmp"),
    invertChance: gl.getUniformLocation(program, "uInvertChance"),
    stripActiveThreshold: gl.getUniformLocation(
      program,
      "uStripActiveThreshold",
    ),
  };

  gl.useProgram(program);
  for (let i = 0; i < 4; i++) {
    gl.uniform1i(uniforms.textures[i], i);
  }
  gl.uniform1i(uniforms.cellData, 4);
  gl.uniform1i(uniforms.trailMask, 5);
  gl.uniform1f(uniforms.imageAspect, 1);
  gl.uniform1i(uniforms.fitMode, 0);
  gl.uniform1i(uniforms.proceduralPixelate, 0);

  if (variant === "signal") {
    const preset = GLITCH_SIGNAL_PRESETS.landing;
    gl.uniform1f(uniforms.shiftAmp, preset.shiftAmp);
    gl.uniform1f(uniforms.chromaAmp, preset.chromaAmp);
    gl.uniform1f(uniforms.invertChance, preset.invertChance);
    gl.uniform1f(uniforms.stripActiveThreshold, preset.stripActiveThreshold);
  }

  const destroy = () => {
    gl.deleteProgram(program);
    gl.deleteVertexArray(vao);
    gl.deleteTexture(cellTexture);
    gl.deleteTexture(trailTexture);
    for (const tex of layerTextures) gl.deleteTexture(tex);
  };

  return {
    gl,
    program,
    vao,
    cellTexture,
    trailTexture,
    layerTextures,
    variant,
    uniforms,
    destroy,
  };
}

/**
 * Load PNGs and upload into the renderer's layer texture slots.
 * Fewer than 4 URLs duplicate the first image into remaining slots.
 */
export function loadGlitchTextures(
  renderer: GlitchRenderer,
  urls: readonly string[],
  isStale?: () => boolean,
): Promise<{ width: number; height: number }> {
  const { gl, layerTextures } = renderer;
  if (urls.length < 1) {
    return Promise.reject(new Error("At least one texture URL required"));
  }

  return Promise.all(
    urls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${url}`));
          img.src = url;
        }),
    ),
  ).then((images) => {
    if (isStale?.()) {
      throw new Error("Stale texture upload");
    }

    const upload = (image: HTMLImageElement, index: number) => {
      gl.bindTexture(gl.TEXTURE_2D, layerTextures[index]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
    };

    images.forEach((image, index) => upload(image, index));
    for (let i = images.length; i < 4; i++) {
      upload(images[0], i);
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return {
      width: images[0].naturalWidth,
      height: images[0].naturalHeight,
    };
  });
}

/**
 * Upload cell mask data (RGBA per grid cell).
 */
export function uploadCellData(
  renderer: GlitchRenderer,
  pixels: Uint8Array,
  cols: number,
  rows: number,
): void {
  const { gl, cellTexture } = renderer;
  if (gl.isContextLost()) return;

  gl.bindTexture(gl.TEXTURE_2D, cellTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    cols,
    rows,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Resize drawing buffer to CSS size × DPR (capped).
 */
export function resizeGlitchCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  maxDpr = 2,
): void {
  const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.floor(cssWidth * dpr));
  const h = Math.max(1, Math.floor(cssHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

export interface DrawGlitchParams {
  cols: number;
  rows: number;
  time: number;
  glitchMix: number;
  trailCols: number;
  trailRows: number;
  imageAspect: number;
  fit: ImageGlitchFit;
  proceduralPixelate: boolean;
  /** Signal preset floats; ignored for vaporwave. */
  signalPreset?: GlitchSignalPreset | GlitchSignalPresetId;
}

function resolveSignalPreset(
  preset?: GlitchSignalPreset | GlitchSignalPresetId,
): GlitchSignalPreset {
  if (!preset) {
    return GLITCH_SIGNAL_PRESETS.landing;
  }
  if (typeof preset === "string") {
    return GLITCH_SIGNAL_PRESETS[preset];
  }
  return preset;
}

/**
 * Draw one frame of the glitch image.
 */
export function drawGlitchFrame(
  renderer: GlitchRenderer,
  canvas: HTMLCanvasElement,
  params: DrawGlitchParams,
): void {
  const { gl, program, vao, cellTexture, layerTextures, uniforms, variant } =
    renderer;

  if (gl.isContextLost()) return;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, layerTextures[0]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, layerTextures[1]);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, layerTextures[2]);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, layerTextures[3]);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, cellTexture);
  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, renderer.trailTexture);

  gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  gl.uniform2f(uniforms.gridSize, params.cols, params.rows);
  gl.uniform1f(uniforms.imageAspect, params.imageAspect);
  gl.uniform1i(uniforms.fitMode, params.fit === "cover" ? 1 : 0);
  gl.uniform1i(uniforms.proceduralPixelate, params.proceduralPixelate ? 1 : 0);
  gl.uniform1f(uniforms.time, params.time);
  gl.uniform1f(uniforms.glitchMix, params.glitchMix);
  gl.uniform2f(uniforms.trailSize, params.trailCols, params.trailRows);

  if (variant === "signal") {
    const preset = resolveSignalPreset(params.signalPreset);
    gl.uniform1f(uniforms.shiftAmp, preset.shiftAmp);
    gl.uniform1f(uniforms.chromaAmp, preset.chromaAmp);
    gl.uniform1f(uniforms.invertChance, preset.invertChance);
    gl.uniform1f(uniforms.stripActiveThreshold, preset.stripActiveThreshold);
  }

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
}
