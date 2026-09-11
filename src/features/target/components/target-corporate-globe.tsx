"use client";

import {
  TARGET_GLOBE_DOT_CORE_R,
  TARGET_GLOBE_DOT_FADE_IN_S,
  TARGET_GLOBE_DOT_HALO_R,
  TARGET_GLOBE_DOT_LIFECYCLE_S,
  TARGET_GLOBE_DOT_PULSE_TOTAL_S,
  TARGET_GLOBE_DOT_STAGGER_S,
  TARGET_GLOBE_VIEWBOX,
  TARGET_GLOBE_WIREFRAME_SRC,
} from "@features/target/constants/target-globe-config";
import { useGlobeDotBatch } from "@features/target/hooks/use-globe-dot-batch";

export function TargetCorporateGlobe() {
  const batch = useGlobeDotBatch();

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${TARGET_GLOBE_VIEWBOX.width} ${TARGET_GLOBE_VIEWBOX.height}`}
      className="size-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <image
        href={TARGET_GLOBE_WIREFRAME_SRC}
        width={TARGET_GLOBE_VIEWBOX.width}
        height={TARGET_GLOBE_VIEWBOX.height}
        preserveAspectRatio="xMidYMid meet"
      />

      {batch.dots.map((dot) => {
        const delayS = dot.sequenceIndex * TARGET_GLOBE_DOT_STAGGER_S;
        const lifecycleAnimation = `target-globe-dot-lifecycle ${TARGET_GLOBE_DOT_LIFECYCLE_S}s ease-out ${delayS}s forwards`;
        const haloAnimation = `target-globe-dot-halo-pulse ${TARGET_GLOBE_DOT_PULSE_TOTAL_S}s ease-in-out ${delayS + TARGET_GLOBE_DOT_FADE_IN_S}s forwards`;

        return (
          <g key={`${batch.batchId}-${dot.id}`} transform={`translate(${dot.x} ${dot.y})`}>
            <g className="target-globe-dot-wrap" style={{ animation: lifecycleAnimation }}>
              <circle
                className="target-globe-dot-halo"
                r={TARGET_GLOBE_DOT_HALO_R}
                fill={dot.haloFill}
                fillOpacity={dot.haloOpacity}
                style={{ animation: haloAnimation }}
              />
              <circle r={TARGET_GLOBE_DOT_CORE_R} fill="#121212" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
