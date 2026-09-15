import { HeroBustGlitch } from "@features/hero/components/hero-bust-glitch";

/**
 * Props for {@link HeroBust}.
 */
export interface HeroBustProps {
  /**
   * Extra classes on the outer frame. Width/height sizing is owned by the parent
   * Hero stage so the bust can fill the full viewport on desktop.
   */
  className?: string;
  /** Fires after the intro fade-in completes. */
  onIntroReady?: () => void;
}

/**
 * Layered classical bust for the Landing Hero.
 *
 * Delegates to {@link HeroBustGlitch}: glitch on the bust using the shared pipeline.
 */
export function HeroBust({ className, onIntroReady }: HeroBustProps) {
  return (
    <HeroBustGlitch
      className={className}
      enableHoverPixelate={true}
      onIntroReady={onIntroReady}
    />
  );
}
