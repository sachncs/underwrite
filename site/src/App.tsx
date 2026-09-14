import { Suspense } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { TrustBand } from "./sections/TrustBand";
import { Platform } from "./sections/Platform";
import { Architecture } from "./sections/Architecture";
import { Compliance } from "./sections/Compliance";
import { Developers } from "./sections/Developers";
import { CTA } from "./sections/CTA";
import { useLenis } from "./lib/use-lenis";

export default function App() {
  useLenis();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--cream)] focus:px-4 focus:py-2 focus:text-[var(--ink)]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative">
        <Suspense fallback={null}>
          <Hero />
          <TrustBand />
          <Platform />
          <Architecture />
          <Compliance />
          <Developers />
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}