"use client";

import { FOLD_STAGE_SHELL_CLASS } from "@core/constants/fold-stage";
import { TargetCard } from "@features/target/components/target-card";
import { TargetCorporateCardContent } from "@features/target/components/target-corporate-card-content";
import { TargetDrawerContent } from "@features/target/components/target-drawer-content";
import { TargetHeading } from "@features/target/components/target-heading";
import { TargetImprovementCardContent } from "@features/target/components/target-improvement-card-content";
import { TargetTechCardContent } from "@features/target/components/target-tech-card-content";
import {
  getTargetAudienceById,
  TARGET_AUDIENCES,
  type TargetAudience,
  type TargetAudienceId,
} from "@features/target/constants/target-audiences";
import {
  getStageCardStyle,
  type TargetLayoutVariant,
} from "@features/target/constants/target-layout";
import { cn } from "@shadcn/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@shadcn/ui/drawer";
import { X } from "lucide-react";
import { useState } from "react";

function TargetAudienceCardContent({
  audience,
  variant,
}: {
  audience: TargetAudience;
  variant: TargetLayoutVariant;
}) {
  if (audience.id === "corporate") {
    return <TargetCorporateCardContent audience={audience} variant={variant} />;
  }

  if (audience.id === "tech") {
    return <TargetTechCardContent audience={audience} variant={variant} />;
  }

  return <TargetImprovementCardContent audience={audience} variant={variant} />;
}

function TargetAudienceCard({
  audience,
  onSelect,
  variant,
  placement,
  className,
}: {
  audience: TargetAudience;
  onSelect: () => void;
  variant: TargetLayoutVariant;
  placement: "absolute" | "flow";
  className?: string;
}) {
  return (
    <TargetCard
      ariaLabel={audience.title}
      onClick={onSelect}
      className={cn(
        "overflow-hidden",
        placement === "absolute" && "absolute",
        placement === "flow" && "relative w-full",
        audience.shellClassName,
        className,
      )}
      style={
        placement === "absolute"
          ? getStageCardStyle(audience.id, variant)
          : undefined
      }
    >
      <TargetAudienceCardContent audience={audience} variant={variant} />
    </TargetCard>
  );
}

/**
 * Tablet flow cards reuse desktop absolute/% layout — keep Figma aspect
 * ratios so label/title/body are not clipped by a flatter stage.
 * Desktop: corporate 640×511, tech/improvement 452×246.
 */
const TABLET_CARD_CLASS: Record<TargetAudienceId, string> = {
  corporate: "col-span-2 aspect-[640/511]",
  tech: "aspect-[452/246]",
  improvement: "aspect-[452/246]",
};

export function TargetAudienceSection() {
  const [selectedAudienceId, setSelectedAudienceId] =
    useState<TargetAudienceId | null>(null);

  const selectedAudience = getTargetAudienceById(selectedAudienceId);
  const isDrawerOpen = selectedAudience !== undefined;

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedAudienceId(null);
    }
  }

  return (
    <>
      <div
        className={cn(
          FOLD_STAGE_SHELL_CLASS,
          "py-10 md:py-12",
        )}
      >
        {/* Desktop Figma stage — only when width can hold absolute layout. */}
        <div className="relative hidden w-full xl:block">
          <div className="@container relative aspect-[1512/982] w-full">
            <TargetHeading variant="desktop" />
            {TARGET_AUDIENCES.map((audience) => (
              <TargetAudienceCard
                key={`desktop-${audience.id}`}
                audience={audience}
                variant="desktop"
                placement="absolute"
                onSelect={() => setSelectedAudienceId(audience.id)}
              />
            ))}
          </div>
        </div>

        {/*
          Tablet: B1 full row, B2 | B3 — avoids scaled Figma stage crushing type.
        */}
        <div className="relative hidden w-full md:block xl:hidden">
          <div className="@container relative w-full px-4">
            <TargetHeading
              variant="mobile"
              placement="flow"
            />
            <div className="grid grid-cols-2 gap-4 pb-2">
              {TARGET_AUDIENCES.map((audience) => (
                <TargetAudienceCard
                  key={`tablet-${audience.id}`}
                  audience={audience}
                  variant="desktop"
                  placement="flow"
                  className={TABLET_CARD_CLASS[audience.id]}
                  onSelect={() => setSelectedAudienceId(audience.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phone — stacked Figma mobile stage. */}
        <div className="relative w-full px-4 md:hidden">
          <div className="@container relative aspect-[393/1471] w-full">
            <TargetHeading variant="mobile" />
            {TARGET_AUDIENCES.map((audience) => (
              <TargetAudienceCard
                key={`mobile-${audience.id}`}
                audience={audience}
                variant="mobile"
                placement="absolute"
                onSelect={() => setSelectedAudienceId(audience.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={handleOpenChange}>
        <DrawerContent
          className={cn(
            "max-h-[85vh] overflow-hidden rounded-t-2xl border-kickops-gray/15 bg-white px-0 pb-8",
            "lg:h-[85vh] lg:data-[vaul-drawer-direction=bottom]:!mt-10",
            "lg:data-[vaul-drawer-direction=bottom]:!inset-x-[12.5vw] lg:data-[vaul-drawer-direction=bottom]:!w-auto",
          )}
        >
          <DrawerTitle className="sr-only">
            {selectedAudience?.drawerTitle ?? "Detalhes do público"}
          </DrawerTitle>

          <DrawerClose
            className={cn(
              "absolute right-4 top-4 z-10 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md p-0",
              "bg-kickops-yellow/40 text-kickops-gray transition-colors",
              "hover:bg-kickops-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kickops-gray",
            )}
            aria-label="Fechar"
          >
            <X aria-hidden className="size-5 stroke-[2.5]" />
          </DrawerClose>

          {selectedAudience !== undefined ? (
            <TargetDrawerContent audience={selectedAudience} />
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  );
}
