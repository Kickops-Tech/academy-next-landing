import { cn } from "@shadcn/lib/utils";
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
}

/**
 * Layered classical bust for the Landing Hero.
 *
 * Delegates to {@link HeroBustGlitch}: vaporwave / CRT glitch on the bust
 * (horizontal slices, chromatic aberration, scanlines) using all four assets.
 */
export function HeroBust({ className }: HeroBustProps) {
  return <HeroBustGlitch className={className} enableHoverPixelate={true} />;
}
