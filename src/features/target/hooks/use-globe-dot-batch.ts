"use client";

import { getGlobeBatchDurationMs } from "@features/target/constants/target-globe-config";
import {
  buildGlobeDotBatch,
  buildInitialGlobeDotBatch,
  type GlobeDotBatch,
} from "@features/target/utils/build-wireframe-globe";
import { useEffect, useState } from "react";

function useGlobeDotBatch() {
  const [batch, setBatch] = useState<GlobeDotBatch>(() => buildInitialGlobeDotBatch());

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const durationMs = getGlobeBatchDurationMs(batch.dots.length);
    const id = window.setTimeout(() => {
      setBatch((current) => buildGlobeDotBatch(current.batchId + 1));
    }, durationMs);

    return () => window.clearTimeout(id);
  }, [batch]);

  return batch;
}

export { useGlobeDotBatch };
