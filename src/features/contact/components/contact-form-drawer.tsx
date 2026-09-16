"use client";

import { ContactForm } from "@features/contact/components/contact-form";
import { CONTACT_FORM_COPY } from "@features/contact/constants/contact-form";
import type { ContactSourceId } from "@features/contact/constants/contact-form";
import { cn } from "@shadcn/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@shadcn/ui/drawer";
import { X } from "lucide-react";

type ContactFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audienceId?: ContactSourceId;
};

/**
 * Bottom drawer chrome shared with Target audience panels — form only.
 */
export function ContactFormDrawer({
  open,
  onOpenChange,
  audienceId = "general",
}: ContactFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "h-auto max-h-[94svh] overflow-hidden rounded-t-2xl border-kickops-gray/15 bg-white px-0 pb-8",
          "data-[vaul-drawer-direction=bottom]:!mt-6",
          "lg:max-h-[94svh] lg:data-[vaul-drawer-direction=bottom]:!mt-8",
          "lg:data-[vaul-drawer-direction=bottom]:!inset-x-[12.5vw] lg:data-[vaul-drawer-direction=bottom]:!w-auto",
        )}
      >
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

        <div className="flex max-h-[inherit] flex-col overflow-hidden">
          <div className="shrink-0 space-y-2 px-6 pb-6 pt-2 pr-16 md:px-10 md:pt-4">
            <DrawerTitle
              className={cn(
                "font-league-gothic text-2xl font-black leading-tight text-kickops-gray md:text-3xl",
              )}
            >
              {CONTACT_FORM_COPY.title}
            </DrawerTitle>
            <p className="max-w-2xl text-sm text-kickops-lightgray md:text-base">
              {CONTACT_FORM_COPY.subtitle}
            </p>
          </div>

          <div className="overflow-y-auto border-t border-kickops-gray/10 px-6 py-6 md:px-10">
            <ContactForm
              key={audienceId}
              audienceId={audienceId}
              showHeading={false}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
