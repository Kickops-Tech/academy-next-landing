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
  /**
   * `fade` — legacy opacity intro; `instant` — ready behind Lottie curtain.
   * @default "fade"
   */
  introMode?: "fade" | "instant";
  /** Fires after the intro fade-in completes (or immediately if instant). */
  onIntroReady?: () => void;
}

/**
 * Layered classical bust for the Landing Hero.
 *
 * Delegates to {@link HeroBustGlitch}: glitch on the bust using the shared pipeline.
 */
export function HeroBust({
  className,
  introMode = "fade",
  onIntroReady,
}: HeroBustProps) {
  return (
    <HeroBustGlitch
      className={className}
      enableHoverPixelate={true}
      introMode={introMode}
      onIntroReady={onIntroReady}
    />
  );
}
