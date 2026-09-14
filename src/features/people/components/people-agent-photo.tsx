"use client";

import { cn } from "@shadcn/lib/utils";
import Atropos from "atropos/react";
import Image from "next/image";

type PeopleAgentPhotoProps = {
  src: string;
  alt: string;
  isDesktop: boolean;
  className?: string;
};

/**
 * Agent portrait with Atropos 3D hover parallax.
 * `rotateTouch={false}` keeps the People carousel swipe free on touch.
 */
export function PeopleAgentPhoto({
  src,
  alt,
  isDesktop,
  className,
}: PeopleAgentPhotoProps) {
  return (
    <Atropos
      className={cn("people-agent-atropos size-full", className)}
      activeOffset={26}
      rotateXMax={9}
      rotateYMax={11}
      duration={280}
      shadow={false}
      highlight
      rotateTouch={false}
      innerClassName="overflow-hidden bg-white"
    >
      <div className="relative size-full" data-atropos-offset="-2.5">
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
      </div>

      <div
        aria-hidden
        data-atropos-offset="5"
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
    </Atropos>
  );
}
