import { Suspense } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { LiveMetrics } from "./sections/LiveMetrics";
import { TrustBand } from "./sections/TrustBand";
import { Platform } from "./sections/Platform";
import { Architecture } from "./sections/Architecture";
import { Features } from "./sections/Features";
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative">
        <Suspense fallback={null}>
          <Hero />
          <div id="live" />
          <LiveMetrics />
          <TrustBand />
          <Platform />
          <Architecture />
          <Features />
          <Compliance />
          <Developers />
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}