import { ReactNode } from "react";
import {
  Abril_Fatface,
  Inter,
  Mrs_Saint_Delafield,
  DM_Mono,
  Orbitron,
  Alfa_Slab_One,
  League_Gothic,
} from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@shadcn/lib/utils";
import "@assets/styles/main.css";

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
  weight: ["400"],
});

const eudoxus = localFont({
  src: [
    {
      path: "../assets/fonts/EudoxusSans-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/EudoxusSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/EudoxusSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/EudoxusSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/EudoxusSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/EudoxusSans-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400"],
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ["latin"],
  variable: "--font-alfa-slab-one",
  weight: ["400"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400"],
});

const mrsSaintDelafield = Mrs_Saint_Delafield({
  subsets: ["latin"],
  variable: "--font-mrs-saint-delafield",
  weight: ["400"],
});

/**
 * Display serif for Hero titles such as “Introspecção” (Figma: Abril Fatface).
 */
const abrilFatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-abril-fatface",
});

/** Optional Inter — use `font-inter` when a component needs it explicitly. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * Props for the Kickops Academy root layout.
 */
interface RootLayoutProps {
  /** Page content composed under the shared document shell. */
  children?: ReactNode;
}

/**
 * Root App Router layout: fonts, global styles, and `pt-BR` document shell
 * for Kickops Academy landings.
 */
export default function RootLayout({ children = null }: RootLayoutProps) {
  return (
    <html
      lang={"pt-BR"}
      className={cn(
        "font-sans",
        abrilFatface.variable,
        inter.variable,
        dmMono.variable,
        mrsSaintDelafield.variable,
        orbitron.variable,
        alfaSlabOne.variable,
        eudoxus.variable,
        leagueGothic.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
