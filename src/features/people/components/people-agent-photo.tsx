import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type PeopleAgentPhotoProps = {
  src: string;
  alt: string;
  isDesktop: boolean;
  className?: string;
};

/**
 * Agent portrait — static frame (no Atropos). Arrow badge stays bottom-left.
 */
export function PeopleAgentPhoto({
  src,
  alt,
  isDesktop,
  className,
}: PeopleAgentPhotoProps) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden bg-white",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        className="pointer-events-none object-cover object-[center_20%]"
        sizes={
          isDesktop
            ? "30vw"
            : "(max-width: 767px) 20rem, (max-width: 1279px) 17.5rem, 24rem"
        }
      />

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
  );
}
