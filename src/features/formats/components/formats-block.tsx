import type { FormatsBlock } from "@features/formats/constants/formats-blocks";
import { cn } from "@shadcn/lib/utils";
import type { CSSProperties } from "react";

type FormatsBlockCardProps = {
  block: FormatsBlock;
  className?: string;
  style?: CSSProperties;
};

export function FormatsBlockCard({
  block,
  className,
  style,
}: FormatsBlockCardProps) {
  return (
    <article
      className={cn("flex w-full flex-col gap-0 leading-[1.4]", className)}
      style={style}
    >
      <p className="text-[12px] font-bold text-kickops-yellow">{block.eyebrow}</p>
      <h3 className="mt-[12px] text-[18px] font-bold text-white">{block.title}</h3>
      <div className="mt-[16px] flex flex-col gap-4">
        {block.paragraphs.map((paragraph) => (
          <p
            key={paragraph.text}
            className={cn(
              "text-[14px]",
              paragraph.accent ? "text-kickops-yellow" : "text-white",
            )}
          >
            {paragraph.text}
          </p>
        ))}
      </div>
    </article>
  );
}
