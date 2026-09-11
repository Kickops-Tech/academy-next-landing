import { SiteFooter } from "@core/components/site-footer";
import { ContentsMain } from "@features/contents/components/contents-main";
import { FormatsMain } from "@features/formats/components/formats-main";
import { HeroMain } from "@features/hero/components/hero-main";
import { PeopleMain } from "@features/people/components/people-main";
import { TargetMain } from "@features/target/components/target-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kickops Academy | Introspecção: Inteligência Artificial",
  description:
    "Chegou a hora de capacitar seu time de liderança para, de uma vez por todas, entender como a IA funciona, enxergar os horizontes possíveis e transformar conhecimento em uso da tecnologia como amplificação estratégica de negócio.",
};

export default function HomePage() {
  return (
    <>
      <HeroMain />
      <TargetMain />
      <ContentsMain />
      {/*
        Formats + People share one gray band. Desktop brain lives in People
        (Figma stage, bleeds up into Formats) with scroll parallax — not sticky.
        overflow-clip: tall art must not extend document scroll past the footer.
        data-brain-hover-root: hover pixelate trail when glitch is on.
      */}
      <div
        data-brain-hover-root=""
        className="relative flex min-h-[100svh] flex-col overflow-clip bg-kickops-gray"
      >
        <FormatsMain />
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
          <PeopleMain />
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
