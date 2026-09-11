import { cn } from "@shadcn/lib/utils";

/**
 * Public paths for the classical bust, split so each layer can be animated or
 * masked independently later without swapping the composite.
 *
 * Order is paint order (first = back). Exact pixel roles may evolve; keep all
 * four stacked in the same box until the interaction pass.
 */
const HERO_BUST_LAYERS = [
  "/img/home/bust-1.png",
  "/img/home/bust-2.png",
  "/img/home/bust-3.png",
  "/img/home/bust-4.png",
] as const;

/**
 * Props for {@link HeroBustStatic}.
 */
export interface HeroBustStaticProps {
  /**
   * Extra classes on the outer frame. Width/height sizing is owned by the parent
   * Hero stage so the bust can fill the full viewport on desktop.
   */
  className?: string;
}

/**
 * Layered classical bust for the Landing Hero.
 *
 * Renders four absolute `background-image` layers inside a box that inherits
 * size from the parent (Figma Busto aspect 614×1030). Does not impose its own
 * max-width — the Hero stage decides how much of the viewport the bust occupies.
 * Wireframe/globe decoration is intentionally omitted for now.
 */
export function HeroBustStatic({ className }: HeroBustStaticProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "aspect-614/1030",
        className,
      )}
    >
      {HERO_BUST_LAYERS.map((src, index) => (
        <div
          key={src}
          aria-hidden={true}
          className={cn(
            "absolute inset-0",
            "bg-contain bg-center bg-no-repeat",
            "bg-transparent",
          )}
          style={{
            backgroundImage: `url('${src}')`,
            zIndex: index + 1,
          }}
        />
      ))}
    </div>
  );
}
