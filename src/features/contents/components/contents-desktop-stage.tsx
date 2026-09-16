import type { ReactNode } from "react";

type ContentsDesktopStageProps = {
  children: ReactNode;
};

/**
 * xl stage locked to one fold. Figma 1512×982 is the aspect reference —
 * h-fold caps height so wide screens don’t invent a tall empty stage.
 */
export function ContentsDesktopStage({ children }: ContentsDesktopStageProps) {
  return (
    <div className="@container relative h-fold w-full overflow-clip">
      {children}
    </div>
  );
}
