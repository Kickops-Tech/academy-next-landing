/**
 * CPU mask for hover pixelate — whole pixel blocks light up and fade out.
 *
 * @module core/lib/image-glitch/pixelate-trail
 */

export interface PixelateTrail {
  cols: number;
  rows: number;
  /** Mask strength per pixel block (0–255). */
  pixels: Uint8Array;
}

export function createPixelateTrail(cols: number, rows: number): PixelateTrail {
  return {
    cols,
    rows,
    pixels: new Uint8Array(cols * rows),
  };
}

export function clearPixelateTrail(trail: PixelateTrail): void {
  trail.pixels.fill(0);
}

function cellIndex(cols: number, col: number, row: number): number {
  return row * cols + col;
}

function canvasUvToBlock(
  uvX: number,
  uvY: number,
  cols: number,
  rows: number,
): { col: number; row: number } {
  const col = Math.min(cols - 1, Math.max(0, Math.floor(uvX * cols)));
  const row = Math.min(rows - 1, Math.max(0, Math.floor(uvY * rows)));
  return { col, row };
}

/** Light whole pixel blocks centered on canvas UV (0–1, bottom-left). */
export function stampPixelateBlocksAt(
  trail: PixelateTrail,
  uvX: number,
  uvY: number,
  strength = 255,
  blockSpan = 1,
): void {
  if (uvX < 0 || uvX > 1 || uvY < 0 || uvY > 1) return;

  const { col: centerCol, row: centerRow } = canvasUvToBlock(
    uvX,
    uvY,
    trail.cols,
    trail.rows,
  );
  const span = Math.max(1, blockSpan | 1);
  const half = Math.floor(span / 2);
  const { cols, rows, pixels } = trail;

  for (let dy = -half; dy <= half; dy++) {
    const row = centerRow + dy;
    if (row < 0 || row >= rows) continue;

    for (let dx = -half; dx <= half; dx++) {
      const col = centerCol + dx;
      if (col < 0 || col >= cols) continue;

      const i = cellIndex(cols, col, row);
      if (strength > pixels[i]) pixels[i] = strength;
    }
  }
}

/** Fade lit blocks each frame so marks dissolve gradually. */
export function decayPixelateTrail(trail: PixelateTrail, amount = 4): void {
  const { pixels } = trail;
  for (let i = 0; i < pixels.length; i++) {
    if (pixels[i] <= amount) pixels[i] = 0;
    else pixels[i] -= amount;
  }
}

/**
 * Light every trail cell. Shader still gates paint by bust alpha, so letterbox
 * stays clean while the full silhouette pixelates.
 */
export function stampPixelateAll(trail: PixelateTrail, strength = 255): void {
  const v = Math.max(0, Math.min(255, strength | 0));
  trail.pixels.fill(v);
}
