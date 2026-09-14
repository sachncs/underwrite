import { motion } from "framer-motion";
import { FadeIn, staggerChild, staggerParent } from "../lib/motion";

const GUARANTEES = [
  {
    title: "RBI Digital Lending Guidelines",
    body:
      "Per-product rate caps, all-in-cost APR, penal-interest ceilings, KFS cooling-off, and disbursal-time controls.",
    items: ["Rate caps", "APR transparency", "KFS cooling-off", "Disbursal audit"],
  },
  {
    title: "DPDPA 2023",
    body:
      "Consent lifecycle, data subject rights fulfillment, breach notification, automatic retention expiry.",
    items: ["Consent lifecycle", "DSR fulfillment", "Breach notify", "Auto-purge"],
  },
  {
    title: "Cryptographic provenance",
    body:
      "Every event is Ed25519-signed at the source. Tampering is detectable; replay is bounded; audits are reproducible.",
    items: ["Ed25519 per event", "5-min replay window", "PII-redacted ledger", "DLQ + replay"],
  },
];

export function Compliance() {
  return (
    <section
      id="compliance"
      aria-labelledby="compliance-title"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.10), transparent 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <FadeIn>
          <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            <span className="mr-2 inline-block h-px w-8 align-middle bg-[var(--line-strong)]" />
            Compliance
          </p>
          <h2
            id="compliance-title"
            className="mt-5 max-w-[820px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--fg)] sm:text-[44px] md:text-[52px]"
          >
            Compliance isn't a feature.{" "}
            <span className="font-serif-display">It's the floor.</span>
          </h2>
          <p className="mt-5 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--fg-mute)]">
            Indian lending is one of the most regulated product surfaces on earth. Underwrite's
            defaults assume a regulator is in the room — because eventually, one is.
          </p>
        </FadeIn>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-3"
        >
          {GUARANTEES.map((g, idx) => (
            <motion.div
              key={g.title}
              variants={staggerChild}
              className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_85%,transparent)] p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]"
              >
                0{idx + 1}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)]">
                <ShieldIcon index={idx} />
              </div>
              <h3 className="text-[19px] font-medium tracking-[-0.01em] text-[var(--fg)]">
                {g.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-[var(--fg-mute)]">{g.body}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--fg-mute)]"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote / disclaimer band */}
        <FadeIn delay={0.1}>
          <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-5 text-[13px] text-[var(--fg-mute)] sm:flex-row sm:items-center sm:gap-5">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-soft)] font-mono text-[11px] text-[var(--fg-faint)]"
            >
              i
            </span>
            <p className="leading-relaxed">
              Underwrite is infrastructure, not legal advice. The platform encodes regulatory
              defaults; your team remains responsible for review by qualified counsel and ongoing
              compliance operations.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ShieldIcon({ index }: { index: number }) {
  const paths = [
    // Lock
    <path
      key="lock"
      d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    // Signature
    <path
      key="sig"
      d="M3 17c2-3 4-3 5-1s3 3 5 0 4-7 6-7 2 6 2 6"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    // Eye
    <g key="eye">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </g>,
  ];
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-[var(--signal-400)]"
      aria-hidden="true"
    >
      {paths[index % paths.length]}
    </svg>
  );
}