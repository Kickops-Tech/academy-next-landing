/**
 * Kickops “signal” glitch fragment — yellow/green chromatic (no gray plate),
 * random hard line shift/invert. Alpha-aware bleed past the cutout.
 * Legacy vaporwave stays in glitch-shaders.ts.
 *
 * @module core/lib/image-glitch/glitch-shaders-signal
 */

/**
 * Fragment shader for signal glitch. Shares vertex + most uniforms with vaporwave.
 * Extra: uShiftAmp, uChromaAmp, uInvertChance, uStripActiveThreshold.
 * Only samples uTex0 (base bust); trail pixelates the same layer.
 */
export const GLITCH_SIGNAL_FRAGMENT_SHADER = `#version 300 es
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

uniform float uShiftAmp;
uniform float uChromaAmp;
uniform float uInvertChance;
uniform float uStripActiveThreshold;

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

const vec3 KICKOPS_YELLOW = vec3(1.0, 0.8862745, 0.4784314);
const vec3 KICKOPS_GREEN = vec3(0.7098039, 0.8039216, 0.7294118);

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

float luma(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

vec3 toGray(vec3 c) {
  return vec3(luma(c));
}

float glitchStripId(vec2 uv, float seed) {
  float density = 16.0 + hash(vec2(seed, 0.9)) * 22.0;
  float rawLine = floor(uv.y * density);
  float thick = 2.0 + floor(hash(vec2(rawLine * 0.11, seed + 2.1)) * 7.0);
  return floor(rawLine / thick);
}

bool stripGlitchActive(float stripId, float seed) {
  return hash(vec2(stripId, seed * 2.7)) > uStripActiveThreshold;
}

/**
 * Hard line glitch: constant X shift and/or flip H/V.
 * UV may leave the opaque cutout so strips/ghosts can bleed into transparency.
 */
vec2 signalStripUv(vec2 uv, float seed, float strength) {
  float stripId = glitchStripId(uv, seed);
  if (!stripGlitchActive(stripId, seed)) {
    return uv;
  }

  float tickRate = 22.0 + hash(vec2(seed, 4.1)) * 26.0;
  float tick = floor(uTime * tickRate);

  float h = hash(vec2(stripId, seed + tick * 1.31));
  float h2 = hash(vec2(stripId + 9.0, seed + tick * 0.87));

  float dir = mod(stripId + tick, 2.0) < 1.0 ? 1.0 : -1.0;
  if (h > 0.88) {
    dir = -dir;
  }

  float amp = uShiftAmp * strength * (0.55 + h2 * 0.55);
  vec2 sampleUv = uv + vec2(dir * amp, 0.0);

  float invRoll = hash(vec2(stripId + 1.7, seed + tick * 0.53));
  if (invRoll < uInvertChance * 0.45) {
    sampleUv.x = 1.0 - sampleUv.x;
  } else if (invRoll < uInvertChance) {
    sampleUv.y = 1.0 - sampleUv.y;
  }

  return sampleUv;
}

vec4 fetchBust(vec2 uv) {
  if (!inImage(uv)) {
    return vec4(0.0);
  }
  return texture(uTex0, uv);
}

/** Luma gated by alpha — transparent texels never inject black. */
float lumaMasked(vec4 t) {
  return luma(t.rgb) * smoothstep(0.02, 0.12, t.a);
}

/**
 * Signal sample: brand yellow/green chromatic only (no mid stops — they glow)
 * plus micro strip displace. Fast flip; smear loop carries the trail.
 */
vec4 sampleSignalRgba(vec2 uv, float seed, float strength) {
  vec2 duv = signalStripUv(uv, seed, strength);
  vec4 base = fetchBust(duv);

  // Faster chroma flip — smear loop below keeps presence without strobing.
  float tick = floor(uTime * 11.0);
  float flip = mod(tick, 2.0) * 2.0 - 1.0;
  float ca = uChromaAmp * strength;

  vec2 yOff = vec2(ca * flip * 1.2, 0.0);
  vec2 gOff = vec2(-ca * flip * 1.85, 0.0);

  float yL = max(lumaMasked(fetchBust(duv + yOff)), lumaMasked(fetchBust(uv + yOff)));
  float gL = max(lumaMasked(fetchBust(duv + gOff)), lumaMasked(fetchBust(uv + gOff)));

  float yAlpha = max(fetchBust(duv + yOff).a, fetchBust(uv + yOff).a);
  float gAlpha = max(fetchBust(duv + gOff).a, fetchBust(uv + gOff).a);

  // Brand ghosts only — silhouette kept readable, no soft/mid fill.
  vec3 premul = base.rgb * base.a * 0.28;
  premul += KICKOPS_YELLOW * yL * 0.48;
  premul += KICKOPS_GREEN * gL * 0.78;

  float outA = max(base.a, max(yAlpha * 0.58, gAlpha * 0.7));
  outA = clamp(outA, 0.0, 1.0);

  vec3 straight = outA > 0.001 ? premul / outA : vec3(0.0);
  return vec4(straight, outA);
}

vec4 smearDisplaced(vec2 uv, float seed, float strength) {
  vec3 premulAcc = vec3(0.0);
  float aAcc = 0.0;
  float wsum = 0.0;
  // Longer smear trail — compensates faster chroma flip + no mid layers.
  for (int i = 0; i < 7; i++) {
    float t = float(i) / 6.0;
    float localStrength = strength * (0.55 + 0.45 * t);
    vec4 s = sampleSignalRgba(uv, seed + t * 0.05, localStrength);
    float w = 1.0 - abs(t - 1.0) * 0.5;
    premulAcc += s.rgb * s.a * w;
    aAcc += s.a * w;
    wsum += w;
  }
  float outA = clamp(aAcc / max(wsum, 0.001), 0.0, 1.0);
  vec3 straight =
    outA > 0.001 ? (premulAcc / max(wsum, 0.001)) / outA : vec3(0.0);
  return vec4(straight, outA);
}

vec2 quantizeCanvasUv(vec2 canvasUv) {
  ivec2 block = ivec2(floor(canvasUv * uTrailSize));
  block = clamp(block, ivec2(0), ivec2(uTrailSize) - 1);
  return (vec2(block) + 0.5) / uTrailSize;
}

vec3 samplePixelatedBase(vec2 vUvCoord) {
  vec2 qVv = quantizeCanvasUv(vUvCoord);
  vec2 quantUv = fitUV(qVv);
  vec4 base = fetchBust(quantUv);
  float levels = 5.0;
  return floor(base.rgb * levels + 0.5) / levels;
}

float hoverPixelateMask(vec2 canvasUv) {
  if (uTrailSize.x < 1.0 || uTrailSize.y < 1.0) return 0.0;
  ivec2 block = ivec2(floor(canvasUv * uTrailSize));
  block = clamp(block, ivec2(0), ivec2(uTrailSize) - 1);
  return texelFetch(uTrailMask, block, 0).r;
}

vec4 renderBust(vec2 vUvCoord) {
  vec2 imageUv = fitUV(vUvCoord);
  if (!inImage(imageUv)) return vec4(0.0);

  vec4 clean = fetchBust(imageUv);

  if (uGlitchMix < 0.001) return clean;

  float globalSeed = hash(vec2(floor(uTime * 3.5), 11.3));

  vec2 cellCoord = floor(imageUv * uGridSize);
  cellCoord = clamp(cellCoord, vec2(0.0), uGridSize - 1.0);
  vec4 cellData = texelFetch(uCellData, ivec2(cellCoord), 0);
  int mode = int(cellData.r * 255.0 + 0.5);
  float paramG = cellData.g * 255.0;
  float cellSeed = cellData.b / 255.0;
  float life = cellData.a / 255.0;
  float envelope = lifecycleEnvelope(life);

  float strength = 1.0;
  if (mode != MODE_DEFAULT) {
    if (mode > MODE_SMEAR) mode = MODE_SLICE;
    strength = paramG / 255.0 * 1.8 + 0.85;
    strength *= mix(1.0, max(envelope, 0.75), 0.45);
  }

  float seed = mix(globalSeed, cellSeed, mode != MODE_DEFAULT ? 0.35 : 0.0);

  vec4 glitched =
    mode == MODE_SMEAR
      ? smearDisplaced(imageUv, seed, strength)
      : sampleSignalRgba(imageUv, seed, strength);

  // Outside the cutout, keep ghost/displacement alpha so fringes can spill.
  float m = uGlitchMix;
  if (clean.a < 0.04) {
    return vec4(glitched.rgb, glitched.a * m);
  }

  vec3 rgb = mix(clean.rgb, glitched.rgb, m);
  float a = max(clean.a, glitched.a * m);
  return vec4(rgb, a);
}

vec4 sampleTrailBlockColor(vec2 vUvCoord) {
  vec2 qVv = quantizeCanvasUv(vUvCoord);
  vec2 quantUv = fitUV(qVv);
  vec4 pix = fetchBust(quantUv);

  // Block center often sits in transparent padding while the stamp still
  // covers opaque corners (ear/hair). Fall back to the fragment sample so
  // those texels still pixelate.
  if (pix.a < 0.08) {
    pix = fetchBust(fitUV(vUvCoord));
    if (pix.a < 0.08) {
      return vec4(0.0);
    }
  }

  // Hover brush stays grayscale — never pull Kickops chroma from renderBust.
  float g = floor(luma(pix.rgb) * 5.0 + 0.5) / 5.0;
  return vec4(vec3(g), pix.a);
}

void main() {
  vec2 imageUv = fitUV(vUv);

  if (!inImage(imageUv)) {
    fragColor = vec4(0.0);
    return;
  }

  vec4 col = renderBust(vUv);
  float bustAlpha = fetchBust(imageUv).a;

  float mask = hoverPixelateMask(vUv);
  if (mask >= 0.02 && bustAlpha >= 0.08) {
    vec4 blockCol = sampleTrailBlockColor(vUv);
    float trailW = mask * smoothstep(0.08, 0.28, bustAlpha) * blockCol.a;
    col.rgb = mix(col.rgb, blockCol.rgb, clamp(trailW, 0.0, 1.0));
    col.a = max(col.a, blockCol.a * trailW);
  }

  // Premultiply for WebGL canvas compositing (iOS Safari).
  fragColor = vec4(col.rgb * col.a, col.a);
}
`;
