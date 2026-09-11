import type { PeopleAgent } from "@features/people/constants/people-agents";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type PeopleAgentSlideProps = {
  agent: PeopleAgent;
  layout: "desktop" | "mobile";
  className?: string;
};

export function PeopleAgentSlide({
  agent,
  layout,
  className,
}: PeopleAgentSlideProps) {
  const isDesktop = layout === "desktop";

  return (
    <div
      className={cn(
        isDesktop
          ? "flex w-full items-start gap-[1.32cqw]"
          : cn(
              // Phone: stacked column. Tablet (md–xl): side-by-side like desktop,
              // with rem type so mid widths stay readable without cqw crush.
              "mx-auto flex w-full max-w-[20rem] flex-col gap-5",
              "sm:max-w-[22rem]",
              "md:mx-0 md:max-w-none md:flex-row md:items-start md:gap-8",
            ),
        className,
      )}
    >
      <div
        className={cn(
          "relative isolate shrink-0 overflow-hidden bg-white",
          isDesktop
            ? "size-[29.89cqw]"
            : "aspect-square w-full md:w-[min(42%,17.5rem)]",
        )}
      >
        <Image
          src={agent.imageSrc}
          alt={agent.imageAlt}
          fill
          className="object-cover object-[center_20%]"
          sizes={
            isDesktop
              ? "30vw"
              : "(max-width: 767px) 20rem, (max-width: 1279px) 17.5rem, 24rem"
          }
        />
        {/* Stamp inset 16px from photo edges on every breakpoint. */}
        <div
          aria-hidden
          className={cn(
            "absolute bottom-4 left-4 z-10 flex items-center justify-center bg-kickops-gray",
            isDesktop ? "size-[3.97cqw]" : "size-15",
          )}
        >
          <Image
            src="/img/people/arrow-up-right.svg"
            alt=""
            width={40}
            height={40}
            className={cn(
              "max-w-none",
              isDesktop ? "size-[2.65cqw]" : "size-10",
            )}
            unoptimized
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 leading-[1.4]",
          isDesktop ? "w-[29.7cqw] pt-[3.64cqw]" : "w-full md:min-w-0 md:flex-1 md:pt-1",
        )}
      >
        <div className="flex flex-col gap-px font-bold">
          <p
            className={cn(
              "text-kickops-yellow",
              isDesktop ? "text-[1.32cqw]" : "text-[16px]",
            )}
          >
            AGENTE #{agent.agentNumber}
          </p>
          <h3
            className={cn(
              "text-white",
              isDesktop ? "text-[2.12cqw]" : "text-[24px]",
            )}
          >
            {agent.name}
          </h3>
        </div>
        <div
          className={cn(
            "flex flex-col gap-4 text-white",
            isDesktop ? "text-[0.93cqw]" : "text-[14px]",
          )}
        >
          {agent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
