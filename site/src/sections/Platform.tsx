import { motion } from "framer-motion";
import { FadeIn, staggerChild, staggerParent } from "../lib/motion";

const PILLARS = [
  {
    eyebrow: "Domain",
    title: "Thirty-four nano-services, one event spine.",
    body:
      "Every credit, compliance, and operational concern is its own typed service. No monolithic risk engine. No lock-in. Compose what you need; ignore what you don't.",
    bullets: [
      "KYC · AML · CIBIL · CKYC",
      "RBI pricing · KFS · DPDPA consent · DSR",
      "Razorpay · risk · fraud · NPA · recovery",
    ],
  },
  {
    eyebrow: "Compliance",
    title: "RBI and DPDPA, encoded into the runtime.",
    body:
      "Per-product rate caps, all-in-cost APR, penal-interest ceilings, KFS cooling-off, consent lifecycle, DSR fulfillment, and breach notification — enforced by the platform, not by review.",
    bullets: [
      "RBI Digital Lending Guidelines",
      "DPDPA 2023 consent + erasure",
      "PII redaction · auto-purge",
    ],
  },
  {
    eyebrow: "Provenance",
    title: "Ed25519-signed events you can prove.",
    body:
      "Every event carries a cryptographic signature. Five-minute replay window, PII-redacted audit ledger, dead-letter queue with bounded memory — observable, replayable, defensible.",
    bullets: [
      "Ed25519 signature per event",
      "DLQ + replay · circuit breaker",
      "PII-redacted audit · OTLP tracing",
    ],
  },
];

export function Platform() {
  return (
    <section
      id="platform"
      aria-labelledby="platform-title"
      className="relative py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <FadeIn>
          <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            <span className="mr-2 inline-block h-px w-8 align-middle bg-[var(--line-strong)]" />
            The platform
          </p>
          <h2
            id="platform-title"
            className="mt-5 max-w-[820px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--fg)] sm:text-[44px] md:text-[52px]"
          >
            Underwriting infrastructure,{" "}
            <span className="font-serif-display">typed from the bottom up.</span>
          </h2>
        </FadeIn>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:mt-20 md:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <motion.article
              key={p.title}
              variants={staggerChild}
              className="group relative flex flex-col gap-5 bg-[color-mix(in_srgb,var(--bg-elev)_96%,transparent)] p-7 transition-colors hover:bg-[var(--bg-elev)] sm:p-9"
            >
              <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                {p.eyebrow}
              </span>
              <h3 className="text-[20px] font-medium leading-[1.25] tracking-[-0.01em] text-[var(--fg)] sm:text-[22px]">
                {p.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[var(--fg-mute)]">{p.body}</p>
              <ul className="mt-2 space-y-1.5">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[13.5px] text-[var(--fg-mute)]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 shrink-0 text-[var(--signal-400)]"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <div
                aria-hidden="true"
                className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--signal-500)] to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}