"use client";

import { ContactForm } from "@features/contact/components/contact-form";
import type { TargetAudience } from "@features/target/constants/target-audiences";
import { TARGET_CARD_BODY } from "@features/target/constants/target-typography";
import { cn } from "@shadcn/lib/utils";

/**
 * Stub highlight cards above the contact form (cream tiles).
 * Off until copy/layout is validated — flip to true to restore.
 */
const TARGET_DRAWER_SHOW_STUB_BLOCKS = false;

type TargetDrawerContentProps = {
  audience: TargetAudience;
};

export function TargetDrawerContent({ audience }: TargetDrawerContentProps) {
  return (
    <div className="flex max-h-[inherit] flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 px-6 pb-4 pt-1 pr-16 md:px-10 md:pb-3 md:pt-2">
        <h3
          className={cn(
            "font-league-gothic text-2xl font-black leading-tight text-kickops-gray md:text-[1.75rem]",
          )}
        >
          {audience.drawerTitle}
        </h3>
        <p
          className={cn(
            TARGET_CARD_BODY,
            "max-w-2xl text-kickops-lightgray md:text-[13px]",
          )}
        >
          {audience.drawerDescription}
        </p>
      </div>

      <div className="overflow-y-auto border-t border-kickops-gray/10 px-6 py-4 md:px-10 md:py-3">
        <div className="grid gap-3 md:grid-cols-2 md:gap-3">
          {TARGET_DRAWER_SHOW_STUB_BLOCKS
            ? audience.drawerStubBlocks.map((block) => (
                <article
                  key={block.heading}
                  className="rounded-lg border border-kickops-gray/10 bg-kickops-yellow/15 p-5"
                >
                  <h4 className="text-base font-bold text-kickops-gray">
                    {block.heading}
                  </h4>
                  <p
                    className={cn(
                      TARGET_CARD_BODY,
                      "mt-2 text-kickops-lightgray",
                    )}
                  >
                    {block.body}
                  </p>
                </article>
              ))
            : null}

          <ContactForm
            key={audience.id}
            audienceId={audience.id}
            showHeading={false}
            density="compact"
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
