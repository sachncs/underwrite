import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "../lib/motion";

const STATS: Array<[string, string]> = [
  ["34", "services"],
  ["132", "event kinds"],
  ["1,276", "tests"],
  ["MIT", "licensed"],
];

export function CTA() {
  const reduce = useReducedMotion();

  return (
    <section id="cta" aria-labelledby="cta-title" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_85%,transparent)] px-6 py-20 sm:px-16 sm:py-28">
            {/* Atmospheric glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div
                className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 opacity-60 blur-[120px]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(227,168,87,0.22) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-0 bg-grid-fine opacity-30" />
            </div>

            <div className="relative mx-auto max-w-[760px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-2)_70%,transparent)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--cream-mute)]">
                <span className="h-1 w-1 rounded-full bg-[var(--amber)]" />
                v0.9 · public preview
              </span>
              <h2
                id="cta-title"
                className="mt-7 text-balance font-display text-[44px] font-normal leading-[1.02] tracking-[-0.04em] text-[var(--cream)] sm:text-[64px] lg:text-[76px]"
              >
                Ship a loan you can{" "}
                <span className="font-serif-display text-[var(--amber)]">defend in audit.</span>
              </h2>
              <p className="mx-auto mt-7 max-w-[520px] text-[15.5px] leading-[1.65] text-[var(--cream-mute)] sm:text-[16.5px]">
                Install in a single command. Wire only the services you need. Keep an audit
                ledger your regulator, your customer, and your future on-call engineer will
                all thank you for.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="./docs/start/install/"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cream)] px-6 py-3 text-[14px] font-medium tracking-[-0.005em] text-[var(--ink)] transition-all hover:bg-[#fff] active:scale-[0.99]"
                >
                  Install Underwrite
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="https://github.com/sachncs/underwrite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-transparent px-6 py-3 text-[14px] font-normal tracking-[-0.005em] text-[var(--cream-soft)] transition-colors hover:border-[var(--cream-faint)] hover:text-[var(--cream)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>

              <div className="mx-auto mt-14 grid max-w-[640px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] text-left sm:grid-cols-4">
                {STATS.map(([n, l]) => (
                  <div
                    key={l}
                    className="flex flex-col gap-0.5 bg-[color-mix(in_srgb,var(--ink-1)_85%,transparent)] px-4 py-4"
                  >
                    <span className="font-display text-[22px] font-normal tracking-[-0.04em] text-[var(--cream)]">
                      {n}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-12 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--amber)] to-transparent opacity-50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}