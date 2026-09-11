import { KickopsLogo } from "@core/components/kickops-logo";
import { cn } from "@shadcn/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

function FooterSocials({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <Link
        href="https://www.linkedin.com/company/kickops/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn da Kickops"
        className="text-white transition-opacity hover:opacity-80"
      >
        <FontAwesomeIcon icon={faLinkedinIn} className="size-7" />
      </Link>
      <Link
        href="https://www.instagram.com/kickops.tech/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da Kickops"
        className="text-white transition-opacity hover:opacity-80"
      >
        <FontAwesomeIcon icon={faInstagram} className="size-7" />
      </Link>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      className={cn(
        "relative w-full bg-kickops-lightgray text-white",
        "overflow-hidden",
      )}
    >
      <div aria-hidden className="footer-rainbow absolute inset-x-0 top-0 h-1" />

      {/* Desktop — Figma-wide row; below xl the absolute-centered copy collides. */}
      <div className="relative mx-auto hidden h-[108px] w-full max-w-[1512px] items-center px-[200px] xl:flex">
        <KickopsLogo className="shrink-0" />
        <p className="absolute left-1/2 -translate-x-1/2 text-center text-[14px] tracking-[-0.4px] whitespace-nowrap">
          <span>2026 Kickops. Todos os direitos reservados. </span>
          <span>Segurança e privacidade</span>
        </p>
        <FooterSocials className="ml-auto" />
      </div>

      {/* Mobile / tablet / small laptop */}
      <div className="relative flex flex-col items-center px-4 pt-8 pb-10 xl:hidden">
        <KickopsLogo />
        <FooterSocials className="mt-6" />
        <p className="mt-8 text-center text-[12px] tracking-[-0.4px] leading-normal">
          2026 Kickops. Todos os direitos reservados.
        </p>
        <p className="mt-1 text-center text-[12px] tracking-[-0.4px] leading-normal">
          Segurança e privacidade
        </p>
      </div>
    </footer>
  );
}
