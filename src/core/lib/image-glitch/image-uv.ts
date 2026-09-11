/**
 * Map pointer / canvas coordinates to image UV (matches shader fitUV).
 *
 * @module core/lib/image-glitch/image-uv
 */

export type ImageGlitchFit = "contain" | "cover";

export interface ImageUvPoint {
  x: number;
  y: number;
  inside: boolean;
}

/**
 * Convert normalized canvas UV (origin bottom-left, 0–1) to image UV.
 */
export function canvasUvToImageUv(
  canvasU: number,
  canvasV: number,
  canvasAspect: number,
  imageAspect: number,
  fit: ImageGlitchFit = "contain",
): ImageUvPoint {
  let x = canvasU;
  let y = canvasV;

  if (fit === "cover") {
    if (canvasAspect > imageAspect) {
      const scale = canvasAspect / imageAspect;
      x = (x - 0.5) * scale + 0.5;
    } else {
      const scale = imageAspect / canvasAspect;
      y = (y - 0.5) * scale + 0.5;
    }
  } else if (canvasAspect > imageAspect) {
    const scale = imageAspect / canvasAspect;
    const offset = (1 - scale) * 0.5;
    x = (x - offset) / scale;
  } else {
    const scale = canvasAspect / imageAspect;
    const offset = (1 - scale) * 0.5;
    y = (y - offset) / scale;
  }

  const inside =
    x >= -1e-6 && x <= 1 + 1e-6 && y >= -1e-6 && y <= 1 + 1e-6;
  return {
    x: Math.min(1, Math.max(0, x)),
    y: Math.min(1, Math.max(0, y)),
    inside,
  };
}

/**
 * Convert a pointer position inside a container to image UV.
 */
export function clientPointToImageUv(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  imageAspect: number,
  fit: ImageGlitchFit = "contain",
): ImageUvPoint {
  const canvasU = (clientX - rect.left) / rect.width;
  const canvasV = 1 - (clientY - rect.top) / rect.height;
  const canvasAspect = rect.width / rect.height;
  return canvasUvToImageUv(canvasU, canvasV, canvasAspect, imageAspect, fit);
}

/**
 * Normalized canvas UV (origin bottom-left, matches shader `vUv`).
 */
export function clientPointToCanvasUv(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): ImageUvPoint {
  return {
    x: (clientX - rect.left) / rect.width,
    y: 1 - (clientY - rect.top) / rect.height,
    inside:
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom,
  };
}

function isPointInRect(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

/**
 * Map a pointer inside a hover root onto the media box by clamping to mediaRect.
 * `inside` when the mapped point lands on the image (not letterbox padding).
 */
export function clientPointToMediaCanvasUv(
  clientX: number,
  clientY: number,
  mediaRect: DOMRect,
  hoverRootRect: DOMRect,
  imageAspect: number,
  fit: ImageGlitchFit = "contain",
): ImageUvPoint {
  if (!isPointInRect(clientX, clientY, hoverRootRect)) {
    return { x: 0, y: 0, inside: false };
  }

  const clampedX = Math.min(Math.max(clientX, mediaRect.left), mediaRect.right);
  const clampedY = Math.min(Math.max(clientY, mediaRect.top), mediaRect.bottom);

  const canvasUv = clientPointToCanvasUv(clampedX, clampedY, mediaRect);
  const imageUv = canvasUvToImageUv(
    canvasUv.x,
    canvasUv.y,
    mediaRect.width / mediaRect.height,
    imageAspect,
    fit,
  );

  return {
    x: canvasUv.x,
    y: canvasUv.y,
    inside: imageUv.inside,
  };
}
