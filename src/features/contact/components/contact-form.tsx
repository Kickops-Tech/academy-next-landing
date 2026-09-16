"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import type { ContactSourceId } from "@features/contact/constants/contact-form";
import {
  CONTACT_EMPLOYEE_COUNT_OPTIONS,
  CONTACT_FORM_COPY,
} from "@features/contact/constants/contact-form";
import {
  targetContactFormSchema,
  type TargetContactFormValues,
} from "@features/contact/dto/target-contact-form.dto";
import { Button } from "@shadcn/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn/ui/field";
import { Input } from "@shadcn/ui/input";
import { cn } from "@shadcn/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/ui/select";
import { Textarea } from "@shadcn/ui/textarea";

type ContactFormProps = {
  audienceId: ContactSourceId;
  className?: string;
  /** When false, title/subtitle are omitted (e.g. already in drawer header). */
  showHeading?: boolean;
  /** Tighter vertical rhythm for short desktop drawers. */
  density?: "default" | "compact";
};

const fieldLabelClassName =
  "text-xs font-semibold uppercase tracking-wide text-kickops-gray";

const controlClassName =
  "h-10 w-full rounded-lg border-kickops-gray/20 bg-white text-kickops-gray";

export function ContactForm({
  audienceId,
  className,
  showHeading = true,
  density = "default",
}: ContactFormProps) {
  const compact = density === "compact";
  const form = useForm<TargetContactFormValues>({
    resolver: zodResolver(targetContactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      employeeCount: "",
      message: "",
      audienceId,
    },
  });

  function onSubmit(_values: TargetContactFormValues) {
    // No-op until contact API exists; audienceId stays in form values.
  }

  return (
    <article className={cn("bg-transparent", className)}>
      {showHeading ? (
        <div className={cn("space-y-1", compact ? "mb-3" : "mb-5")}>
          <h4 className="font-league-gothic text-xl font-black text-kickops-gray md:text-2xl">
            {CONTACT_FORM_COPY.title}
          </h4>
          <p className="text-sm text-kickops-lightgray">
            {CONTACT_FORM_COPY.subtitle}
          </p>
        </div>
      ) : null}

      <form
        className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup
          className={cn(
            "grid sm:grid-cols-2",
            compact ? "gap-3" : "gap-4",
          )}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-1"
              >
                <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                  {CONTACT_FORM_COPY.labels.name}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  className={controlClassName}
                  placeholder={CONTACT_FORM_COPY.placeholders.name}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-1"
              >
                <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                  {CONTACT_FORM_COPY.labels.phone}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={fieldState.invalid}
                  className={controlClassName}
                  placeholder={CONTACT_FORM_COPY.placeholders.phone}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-2"
              >
                <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                  {CONTACT_FORM_COPY.labels.email}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className={controlClassName}
                  placeholder={CONTACT_FORM_COPY.placeholders.email}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="company"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-1"
              >
                <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                  {CONTACT_FORM_COPY.labels.company}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="organization"
                  aria-invalid={fieldState.invalid}
                  className={controlClassName}
                  placeholder={CONTACT_FORM_COPY.placeholders.company}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="employeeCount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-1"
              >
                <FieldLabel
                  htmlFor="contact-employee-count"
                  className={fieldLabelClassName}
                >
                  {CONTACT_FORM_COPY.labels.employeeCount}
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="contact-employee-count"
                    aria-invalid={fieldState.invalid}
                    className={controlClassName}
                  >
                    <SelectValue
                      placeholder={
                        CONTACT_FORM_COPY.placeholders.employeeCount
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CONTACT_EMPLOYEE_COUNT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="sm:col-span-2"
              >
                <FieldLabel htmlFor={field.name} className={fieldLabelClassName}>
                  {CONTACT_FORM_COPY.labels.message}
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "w-full rounded-lg border-kickops-gray/20 bg-white text-kickops-gray",
                    compact ? "min-h-20" : "min-h-24",
                  )}
                  placeholder={CONTACT_FORM_COPY.placeholders.message}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <input type="hidden" {...form.register("audienceId")} />

        <Button
          type="submit"
          className={cn(
            "group h-11 w-full rounded-lg border-0",
            "inline-flex items-center justify-center",
            "bg-kickops-yellow font-bold text-kickops-gray",
            "transition-colors duration-300 ease-out",
            "hover:bg-white focus-visible:bg-white active:bg-white",
          )}
        >
          {CONTACT_FORM_COPY.submit}
          <span
            aria-hidden
            className={cn(
              "inline-flex h-6 shrink-0 overflow-hidden text-kickops-gray",
              "w-0 opacity-0",
              "transition-[width,opacity,margin] duration-300 ease-out",
              "group-hover:ml-2 group-hover:w-6 group-hover:opacity-100",
              "group-focus-visible:ml-2 group-focus-visible:w-6 group-focus-visible:opacity-100",
              "motion-reduce:transition-none",
            )}
          >
            <ArrowRight
              className={cn(
                "size-6 shrink-0",
                "-translate-x-2 transition-transform duration-300 ease-out",
                "group-hover:translate-x-0 group-focus-visible:translate-x-0",
                "motion-reduce:translate-x-0",
              )}
              strokeWidth={2.25}
            />
          </span>
        </Button>
      </form>
    </article>
  );
}
