import { SiteFooter } from "@core/components/site-footer";
import { WireframeGlobeBand } from "@core/components/wireframe-globe-band";
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
      <WireframeGlobeBand>
        <TargetMain />
        <ContentsMain />
        {/*
          Formats + People share one gray band. Desktop brain lives in People
          (Figma stage, bleeds up into Formats) with scroll parallax — not sticky.
          overflow-clip: tall art must not extend document scroll past the footer.
          data-brain-hover-root: hover pixelate trail when glitch is on.
          Fill comes from WireframeGlobeBand (watermark sits above fill).
        */}
        <div
          data-brain-hover-root=""
          data-globe-section="formats"
          className="relative flex flex-col overflow-clip"
        >
          <FormatsMain />
          <div className="relative z-[1] flex flex-col">
            <PeopleMain />
          </div>
        </div>
      </WireframeGlobeBand>
      <SiteFooter />
    </>
  );
}
