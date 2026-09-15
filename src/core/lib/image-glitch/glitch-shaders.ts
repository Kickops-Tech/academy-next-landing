/**
 * GLSL sources for the shared vaporwave / CRT image glitch renderer.
 *
 * @module core/lib/image-glitch/glitch-shaders
 */

/** Full-screen quad vertex shader (NDC). */
export const GLITCH_VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/**
 * Fragment shader: base texture with sparse horizontal-slice glitches
 * (displacement, chromatic aberration, smear, scanlines) driven by the CPU grid.
 * uFitMode 0=contain, 1=cover. uProceduralPixelate 1=quantize+posterize (no accent layer).
 */
export const GLITCH_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uGridSize;
uniform float uImageAspect;
uniform int uFitMode;
uniform int uProceduralPixelate;
uniform float uTime;
uniform float uGlitchMix;
uniform vec2 uTrailSize;

uniform sampler2D uTrailMask;

uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uTex3;
uniform sampler2D uCellData;

const int MODE_DEFAULT = 0;
const int MODE_SLICE = 1;
const int MODE_CHROMA = 2;
const int MODE_SMEAR = 3;
const int MODE_LAYER = 4;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float lifecycleEnvelope(float life) {
  float fadeIn = smoothstep(0.0, 0.05, life);
  float fadeOut = 1.0 - smoothstep(0.65, 1.0, life);
  return fadeIn * fadeOut;
}

vec2 containUV(vec2 uv) {
  float canvasAspect = uResolution.x / uResolution.y;
  if (canvasAspect > uImageAspect) {
    float scale = uImageAspect / canvasAspect;
    float offset = (1.0 - scale) * 0.5;
    uv.x = (uv.x - offset) / scale;
  } else {
    float scale = canvasAspect / uImageAspect;
    float offset = (1.0 - scale) * 0.5;
    uv.y = (uv.y - offset) / scale;
  }
  return uv;
}

vec2 coverUV(vec2 uv) {
  float canvasAspect = uResolution.x / uResolution.y;
  if (canvasAspect > uImageAspect) {
    float scale = canvasAspect / uImageAspect;
    uv.x = (uv.x - 0.5) * scale + 0.5;
  } else {
    float scale = uImageAspect / canvasAspect;
    uv.y = (uv.y - 0.5) * scale + 0.5;
  }
  return uv;
}

vec2 fitUV(vec2 uv) {
  return uFitMode == 1 ? coverUV(uv) : containUV(uv);
}

bool inImage(vec2 uv) {
  return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
}

vec2 clampUv(vec2 uv) {
  return clamp(uv, vec2(0.001), vec2(0.999));
}

vec4 fetchBustLayer(int layer, vec2 uv) {
  if (layer == 1) return texture(uTex1, uv);
  if (layer == 2) return texture(uTex2, uv);
  if (layer == 3) return texture(uTex3, uv);
  return texture(uTex0, uv);
}

// Thick horizontal strips (2–11 scanlines merged) — reference-style blocks.
float glitchStripId(vec2 uv, float seed) {
  float density = 24.0 + hash(vec2(seed, 0.9)) * 48.0;
  float rawLine = floor(uv.y * density);
  float thick = 2.0 + floor(hash(vec2(rawLine * 0.11, seed + 2.1)) * 9.0);
  return floor(rawLine / thick);
}

bool stripGlitchActive(float stripId, float seed) {
  return hash(vec2(stripId, seed * 2.7)) > 0.46;
}

// Snappy stepped strip shift — fast, jagged, not smooth sine.
float glitchStripShift(vec2 uv, float seed, float strength) {
  float stripId = glitchStripId(uv, seed);
  if (!stripGlitchActive(stripId, seed)) return 0.0;

  float tickRate = 20.0 + hash(vec2(seed, 4.1)) * 32.0;
  float tick = floor(uTime * tickRate);

  float h = hash(vec2(stripId, seed + tick * 1.31));
  float h2 = hash(vec2(stripId + 9.0, seed + tick * 0.87));
  float h3 = hash(vec2(stripId, tick * 2.17 + seed * 5.3));

  float waveStep = floor(uv.y * (3.5 + hash(vec2(seed, 2.2)) * 7.0) + tick * 0.41);
  float waveDir = sign(hash(vec2(waveStep, seed + tick * 0.63)) - 0.5);

  float dir = sign(h - 0.5);
  float cycle = mod(tick + stripId, 3.0);
  if (cycle < 1.0) dir = 1.0;
  else if (cycle < 2.0) dir = -1.0;

  float amp = strength * (0.014 + h2 * 0.038);
  return dir * amp * (0.55 + 0.45 * waveDir) * (0.65 + 0.35 * h3);
}

// Displaced strip sample with RGB split (chromatic aberration).
vec3 sampleGlitchStrip(vec2 uv, float shiftX, float strength, float seed) {
  if (abs(shiftX) < 0.000001) {
    return texture(uTex0, uv).rgb;
  }

  float tick = floor(uTime * (22.0 + hash(vec2(seed, 6.2)) * 18.0));
  float ca = abs(shiftX) * 2.4 + strength * 0.007;
  float flip = mod(tick + floor(hash(vec2(seed, shiftX * 800.0)) * 2.0), 2.0) * 2.0 - 1.0;

  vec2 base = clampUv(uv + vec2(shiftX, 0.0));
  vec3 col = vec3(
    texture(uTex0, clampUv(base + vec2(ca * flip * 2.6, 0.0))).r,
    texture(uTex0, base).g,
    texture(uTex0, clampUv(base - vec2(ca * flip * 2.2, 0.0))).b
  );

  float fringe = ca * 42.0;
  col += vec3(0.16, 0.03, 0.19) * fringe;
  col += vec3(0.04, 0.14, 0.05) * fringe * 0.45;

  return col;
}

float scanlinePulse() {
  float tick = floor(uTime * 6.5);
  float snap = 0.68 + 0.32 * hash(vec2(tick, 3.7));
  float breathe = 0.78 + 0.22 * sin(uTime * 2.4);
  return snap * breathe;
}

// Occasional light defocus — episodic, ~every 3s.
float occasionalBlurMix() {
  float slot = floor(uTime * 0.32);
  float trigger = step(0.76, hash(vec2(slot, 7.1)));
  float phase = fract(uTime * 0.32);
  float fade = smoothstep(0.0, 0.12, phase) * (1.0 - smoothstep(0.5, 0.95, phase));
  return trigger * fade;
}

vec3 softBlur(vec2 uv, float radius) {
  vec3 acc = vec3(0.0);
  acc += texture(uTex0, clampUv(uv)).rgb * 0.34;
  acc += texture(uTex0, clampUv(uv + vec2(radius, 0.0))).rgb * 0.165;
  acc += texture(uTex0, clampUv(uv - vec2(radius, 0.0))).rgb * 0.165;
  acc += texture(uTex0, clampUv(uv + vec2(0.0, radius * 0.55))).rgb * 0.165;
  acc += texture(uTex0, clampUv(uv - vec2(0.0, radius * 0.55))).rgb * 0.165;
  return acc;
}

vec3 smearSample(vec2 uv, float shift, float seed) {
  float off = glitchStripShift(uv, seed, shift);
  if (abs(off) < 0.00001) return texture(uTex0, uv).rgb;

  vec3 acc = vec3(0.0);
  float wsum = 0.0;

  for (int i = 0; i < 5; i++) {
    float t = float(i) / 4.0;
    float dx = off * t;
    float w = 1.0 - abs(t - 1.0) * 0.7;
    acc += sampleGlitchStrip(uv, dx, shift, seed) * w;
    wsum += w;
  }

  return acc / max(wsum, 0.001);
}

vec3 applyScanlines(vec3 col, vec2 imageUv, float pulse) {
  float y = imageUv.y * uResolution.y;
  float fine = 0.78 + 0.22 * sin(y * 3.14159265);
  float coarse = 0.84 + 0.16 * sin(y * 3.14159265 * 0.48);
  float scan = mix(fine, coarse, 0.4);
  scan *= 0.82 + 0.18 * pulse;
  return col * scan;
}

vec3 applyGrain(vec3 col, vec2 imageUv, float seed) {
  float n = hash(imageUv * uResolution.xy * 0.45 + vec2(seed, uTime * 0.3));
  return col + (n - 0.5) * 0.035;
}

// Snap canvas UV to pixel-block grid (matches CPU trail mask indexing).
vec2 quantizeCanvasUv(vec2 canvasUv) {
  ivec2 block = ivec2(floor(canvasUv * uTrailSize));
  block = clamp(block, ivec2(0), ivec2(uTrailSize) - 1);
  return (vec2(block) + 0.5) / uTrailSize;
}

// Large pixel blocks — accent layer when available, else procedural posterize.
vec3 samplePixelatedLayers(vec2 vUvCoord) {
  vec2 qVv = quantizeCanvasUv(vUvCoord);
  vec2 quantUv = clampUv(fitUV(qVv));

  vec4 baseSample = texture(uTex0, quantUv);
  // Block center in transparent padding — use local fragment so edge stamps paint.
  if (baseSample.a < 0.08) {
    quantUv = clampUv(fitUV(vUvCoord));
    baseSample = texture(uTex0, quantUv);
  }
  vec3 base = baseSample.rgb;
  float levels = 5.0;

  if (uProceduralPixelate == 1) {
    return floor(base * levels + 0.5) / levels;
  }

  vec4 accent = texture(uTex1, quantUv);
  if (accent.a > 0.04) return accent.rgb;
  float accentMix = accent.a > 0.02 ? 1.0 : 0.94;
  vec3 pix = mix(base, accent.rgb, accentMix);
  return floor(pix * levels + 0.5) / levels;
}

float hoverPixelateMask(vec2 canvasUv) {
  if (uTrailSize.x < 1.0 || uTrailSize.y < 1.0) return 0.0;

  ivec2 block = ivec2(floor(canvasUv * uTrailSize));
  block = clamp(block, ivec2(0), ivec2(uTrailSize) - 1);
  return texelFetch(uTrailMask, block, 0).r;
}

vec3 applyGlitch(
  vec2 imageUv,
  int mode,
  float paramG,
  float seed,
  float life
) {
  float strength = paramG / 255.0 * 2.6 + 0.55;
  vec3 col;

  if (mode == MODE_SMEAR) {
    col = smearSample(imageUv, strength, seed);
  } else if (mode == MODE_CHROMA) {
    float off = glitchStripShift(imageUv, seed, strength * 0.85);
    col = sampleGlitchStrip(imageUv, off, strength * 1.15, seed);
  } else if (mode == MODE_LAYER) {
    int layer = int(paramG + 0.5);
    float off = glitchStripShift(imageUv, seed, strength);
    vec2 uv = clampUv(imageUv + vec2(off, 0.0));
    col = sampleGlitchStrip(imageUv, off, strength, seed);
    vec4 overlay = fetchBustLayer(layer, uv);
    float blend = overlay.a > 0.02 ? overlay.a : 1.0;
    col = mix(col, overlay.rgb, 0.45 * blend);
  } else {
    float off = glitchStripShift(imageUv, seed, strength);
    col = sampleGlitchStrip(imageUv, off, strength, seed);
  }

  return col;
}

// Full image render at canvas UV (base, sparse glitch, scanlines, grain).
vec3 renderBust(vec2 vUvCoord) {
  vec2 imageUv = fitUV(vUvCoord);
  if (!inImage(imageUv)) return vec3(0.0);

  vec2 centerUv = clampUv(imageUv);
  vec3 clean = texture(uTex0, centerUv).rgb;

  if (uGlitchMix < 0.001) return clean;

  vec3 col = clean;

  vec2 cellCoord = floor(imageUv * uGridSize);
  cellCoord = clamp(cellCoord, vec2(0.0), uGridSize - 1.0);
  vec4 cellData = texelFetch(uCellData, ivec2(cellCoord), 0);
  int mode = int(cellData.r * 255.0 + 0.5);

  float paramG = cellData.g * 255.0;
  float seed = cellData.b / 255.0;
  float life = cellData.a / 255.0;
  float envelope = lifecycleEnvelope(life);

  float pulse = scanlinePulse();

  if (mode != MODE_DEFAULT) {
    vec3 glitched = applyGlitch(centerUv, mode, paramG, seed, life);
    col = mix(col, glitched, max(envelope, 0.82));
    pulse = max(pulse, 0.92);
  }

  float blurMix = occasionalBlurMix();
  if (blurMix > 0.001) {
    vec3 blurred = softBlur(centerUv, 0.003 + blurMix * 0.003);
    col = mix(col, blurred, blurMix * 0.5);
  }

  col = applyScanlines(col, imageUv, pulse);
  col = applyGrain(col, imageUv, seed);

  return mix(clean, col, uGlitchMix);
}

// Trail: chunky pixel blocks from bust only; never inflate alpha off-silhouette.
vec3 sampleTrailBlockColor(vec2 vUvCoord) {
  vec2 qVv = quantizeCanvasUv(vUvCoord);
  vec3 pix = samplePixelatedLayers(qVv);
  if (uGlitchMix < 0.001) return pix;

  vec3 glitchBlock = renderBust(qVv);
  return mix(pix, glitchBlock, 0.38);
}

void main() {
  vec2 imageUv = fitUV(vUv);

  if (!inImage(imageUv)) {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  float alpha = texture(uTex0, clampUv(imageUv)).a;
  vec3 col = renderBust(vUv);

  float mask = hoverPixelateMask(vUv);
  if (mask >= 0.02 && alpha >= 0.08) {
    vec3 blockCol = sampleTrailBlockColor(vUv);
    vec2 qUv = clampUv(fitUV(quantizeCanvasUv(vUv)));
    float blockA = uProceduralPixelate == 1
      ? texture(uTex0, qUv).a
      : max(texture(uTex0, qUv).a, texture(uTex1, qUv).a);
    // Center of the block may be empty while this fragment is opaque.
    if (blockA < 0.08) {
      blockA = alpha;
    }
    if (blockA >= 0.08) {
      // Mask alone drives coverage — opaque blocks over the silhouette.
      col = mix(col, blockCol, mask);
    }
  }

  fragColor = vec4(col * alpha, alpha);
}
`;
