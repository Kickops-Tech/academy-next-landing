/**
 * GPU upload for the hover pixelate trail mask.
 *
 * @module core/lib/image-glitch/pixelate-trail-webgl
 */

import type { GlitchRenderer } from "@core/lib/image-glitch/glitch-webgl";

export function createTrailTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("Failed to create trail texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

export function uploadTrailMask(
  renderer: GlitchRenderer,
  trailTexture: WebGLTexture,
  mask: Uint8Array,
  cols: number,
  rows: number,
): void {
  const { gl } = renderer;
  if (gl.isContextLost()) return;

  const rgba = new Uint8Array(cols * rows * 4);
  for (let i = 0; i < mask.length; i++) {
    const v = mask[i];
    const o = i * 4;
    rgba[o] = v;
    rgba[o + 1] = v;
    rgba[o + 2] = v;
    rgba[o + 3] = 255;
  }

  gl.bindTexture(gl.TEXTURE_2D, trailTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  // Bust layers upload with FLIP_Y; reset so trail rows match shader vUv (bottom-left).
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    cols,
    rows,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    rgba,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
}
