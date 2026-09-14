import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "../lib/motion";

export function CTA() {
  const reduce = useReducedMotion();

  return (
    <section id="cta" aria-labelledby="cta-title" className="relative py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_85%,transparent)] px-6 py-16 sm:px-12 sm:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div
                className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-70 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(59,130,246,0.40) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute -bottom-32 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-[80px]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(245,158,11,0.20) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-0 bg-grid-fine opacity-30" />
            </div>

            <div className="relative mx-auto max-w-[760px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-soft)_70%,transparent)] px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                v0.9 · public preview
              </span>
              <h2
                id="cta-title"
                className="mt-6 text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--fg)] sm:text-[52px] md:text-[60px]"
              >
                Ship a loan you can{" "}
                <span className="font-serif-display">defend in audit.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[540px] text-[15.5px] leading-relaxed text-[var(--fg-mute)] sm:text-[16.5px]">
                Install in a single command. Wire only the services you need. Keep an audit
                ledger your regulator, your customer, and your future on-call engineer will all
                thank you for.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="./docs/start/install/"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-[14px] font-medium text-[var(--bg)] shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_18px_42px_-12px_rgba(59,130,246,0.45)] transition-all hover:scale-[1.015] active:scale-100"
                >
                  Install Underwrite
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--bg-elev)_50%,transparent)] px-6 py-3 text-[14px] font-medium text-[var(--fg)] backdrop-blur-md hover:border-[var(--fg-faint)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] text-left sm:grid-cols-4">
                {[
                  ["34", "services"],
                  ["132", "event types"],
                  ["1276", "tests"],
                  ["80%+", "coverage"],
                ].map(([n, l]) => (
                  <div
                    key={l as string}
                    className="flex flex-col gap-0.5 bg-[color-mix(in_srgb,var(--bg-elev)_80%,transparent)] px-4 py-3"
                  >
                    <span className="font-mono text-[18px] tracking-[-0.02em] text-[var(--fg)]">
                      {n as string}
                    </span>
                    <span className="text-[11.5px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
                      {l as string}
                    </span>
                  </div>
                ))}
              </div>

              {!reduce && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--signal-500)] to-transparent opacity-60"
                />
              )}
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}