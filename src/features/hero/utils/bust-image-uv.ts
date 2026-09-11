/**
 * Hero bust UV helpers — thin wrappers around shared image-uv with bust aspect.
 *
 * @module features/hero/utils/bust-image-uv
 */

import { HERO_BUST_ASPECT } from "@features/hero/constants/hero-bust-layers";
import {
  canvasUvToImageUv as sharedCanvasUvToImageUv,
  clientPointToCanvasUv,
  clientPointToImageUv as sharedClientPointToImageUv,
  clientPointToMediaCanvasUv,
  type ImageUvPoint,
} from "@core/lib/image-glitch/image-uv";

export type { ImageUvPoint };

export function canvasUvToImageUv(
  canvasU: number,
  canvasV: number,
  canvasAspect: number,
): ImageUvPoint {
  return sharedCanvasUvToImageUv(
    canvasU,
    canvasV,
    canvasAspect,
    HERO_BUST_ASPECT,
    "contain",
  );
}

export function clientPointToImageUv(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): ImageUvPoint {
  return sharedClientPointToImageUv(
    clientX,
    clientY,
    rect,
    HERO_BUST_ASPECT,
    "contain",
  );
}

export { clientPointToCanvasUv };

export function clientPointToHeroBustImageUv(
  clientX: number,
  clientY: number,
  bustRect: DOMRect,
  heroRect: DOMRect,
): ImageUvPoint {
  const canvas = clientPointToHeroBustCanvasUv(
    clientX,
    clientY,
    bustRect,
    heroRect,
  );
  if (!canvas.inside) return { x: 0, y: 0, inside: false };
  return canvasUvToImageUv(
    canvas.x,
    canvas.y,
    bustRect.width / bustRect.height,
  );
}

export function clientPointToHeroBustCanvasUv(
  clientX: number,
  clientY: number,
  bustRect: DOMRect,
  heroRect: DOMRect,
): ImageUvPoint {
  return clientPointToMediaCanvasUv(
    clientX,
    clientY,
    bustRect,
    heroRect,
    HERO_BUST_ASPECT,
    "contain",
  );
}
