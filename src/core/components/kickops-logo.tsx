import { ComponentProps } from "react";

interface KickopsLogoProps extends Omit<
  ComponentProps<"svg">,
  "viewBox" | "fill"
> {
  fill?: string;
}

export function KickopsLogo({
  width = 40,
  height = 28,
  fill = "white",
  ...props
}: KickopsLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 28"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M37.3114 16.6247C38.7962 16.6247 39.9999 15.4166 39.9999 13.9263C39.9999 12.4361 38.7962 11.228 37.3114 11.228C35.8265 11.228 34.6228 12.4361 34.6228 13.9263C34.6228 15.4166 35.8265 16.6247 37.3114 16.6247Z"
        fill={fill}
      />
      <path
        d="M9.43986 0H0L10.0821 13.9263L2.52427 24.3748H11.9492L19.522 13.9263L9.43986 0Z"
        fill={fill}
      />
      <path
        d="M22.6437 27.8528H13.2039L23.286 13.9265L15.7281 3.47803H25.168L32.7258 13.9265L22.6437 27.8528Z"
        fill={fill}
      />
    </svg>
  );
}
