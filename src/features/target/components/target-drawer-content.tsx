"use client";

import { cn } from "@shadcn/lib/utils";
import type { TargetAudience } from "@features/target/constants/target-audiences";
import {
  TARGET_CARD_BODY,
  TARGET_CARD_LABEL,
  TARGET_CARD_TITLE,
} from "@features/target/constants/target-typography";

type TargetDrawerContentProps = {
  audience: TargetAudience;
};

export function TargetDrawerContent({ audience }: TargetDrawerContentProps) {
  return (
    <div className="flex min-h-0 max-h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 px-6 pb-6 pt-2 md:px-10 md:pt-4">
        <p className={cn(TARGET_CARD_LABEL, audience.labelClassName)}>
          {audience.label}
        </p>
        <h3
          className={cn(
            "font-league-gothic text-2xl font-black leading-tight text-kickops-gray md:text-3xl",
          )}
        >
          {audience.drawerTitle}
        </h3>
        <p className={cn(TARGET_CARD_BODY, "max-w-2xl text-kickops-lightgray")}>
          {audience.drawerDescription}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-kickops-gray/10 px-6 py-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {audience.drawerStubBlocks.map((block) => (
            <article
              key={block.heading}
              className="rounded-lg border border-kickops-gray/10 bg-kickops-yellow/15 p-5"
            >
              <h4 className="text-base font-bold text-kickops-gray">
                {block.heading}
              </h4>
              <p className={cn(TARGET_CARD_BODY, "mt-2 text-kickops-lightgray")}>
                {block.body}
              </p>
            </article>
          ))}

          <article
            aria-hidden
            className="flex min-h-[12rem] items-center justify-center rounded-lg bg-kickops-green/30 p-5 md:col-span-2"
          >
            <p className="text-sm font-medium text-kickops-gray/60">
              Conteúdo visual em breve
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
