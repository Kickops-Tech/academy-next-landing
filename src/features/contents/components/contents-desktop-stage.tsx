"use client";

import { getContentsFoldCompress } from "@features/contents/constants/contents-layout";
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type ContentsDesktopStageProps = {
  children: ReactNode;
};

const INITIAL_STAGE_STYLE = {
  ["--contents-fold-compress"]: "1",
} as CSSProperties;

/**
 * xl stage locked to one fold. Figma 1512×982 is the compress reference only —
 * aspect must not grow the section past the viewport on wide screens.
 * Publishes `--contents-fold-compress` for column scale on tall folds.
 */
export function ContentsDesktopStage({ children }: ContentsDesktopStageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    function update() {
      const width = node.clientWidth;
      const height = node.clientHeight;
      const compress = getContentsFoldCompress(width, height);
      node.style.setProperty(
        "--contents-fold-compress",
        compress.toFixed(4),
      );
    }

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="@container relative h-fold w-full overflow-clip"
      style={INITIAL_STAGE_STYLE}
    >
      {children}
    </div>
  );
}
