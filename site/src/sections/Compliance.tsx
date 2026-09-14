import { FadeIn } from "../lib/motion";

const GUARANTEES = [
  {
    id: "RBI",
    title: "RBI Digital Lending Guidelines",
    body: "Per-product rate caps, all-in-cost APR, penal-interest ceilings, KFS cooling-off, and disbursal-time controls. Encoded in the runtime, not in policy docs.",
    tags: ["Rate caps", "APR transparency", "KFS cooling-off", "Disbursal audit"],
  },
  {
    id: "DPDPA",
    title: "DPDPA 2023",
    body: "Consent lifecycle, data subject rights fulfillment, breach notification, automatic retention expiry. PII is masked before the audit ledger ever sees it.",
    tags: ["Consent lifecycle", "DSR fulfillment", "Breach notify", "Auto-purge"],
  },
  {
    id: "Ed25519",
    title: "Cryptographic provenance",
    body: "Every event is Ed25519-signed at the source and verified pre-handler. Tampering is detectable, replay is bounded, audits are reproducible.",
    tags: ["Ed25519 per event", "5-min replay window", "PII-redacted ledger", "DLQ + replay"],
  },
];

export function Compliance() {
  return (
    <section
      id="compliance"
      aria-labelledby="compliance-title"
      className="relative overflow-hidden py-24 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(227,168,87,0.06), transparent 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <FadeIn>
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-[var(--amber)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">
              Compliance
            </span>
          </div>
          <h2
            id="compliance-title"
            className="mt-6 max-w-[860px] text-balance font-display text-[40px] font-normal leading-[1.04] tracking-[-0.04em] text-[var(--cream)] sm:text-[56px] lg:text-[64px]"
          >
            Compliance isn't a feature.
            <br />
            <span className="text-[var(--cream-mute)]">It's the floor.</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.65] text-[var(--cream-mute)]">
            Indian lending is one of the most regulated product surfaces on earth.
            Underwrite's defaults assume a regulator is in the room — because eventually, one is.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
            {GUARANTEES.map((g) => (
              <article
                key={g.id}
                className="group relative flex flex-col gap-5 bg-[color-mix(in_srgb,var(--ink-1)_94%,transparent)] p-7 transition-colors hover:bg-[color-mix(in_srgb,var(--ink-1)_100%,transparent)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--amber)]">
                    {g.id}
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[-0.005em] text-[var(--cream-faint)]">
                    encoded
                  </span>
                </div>
                <h3 className="font-display text-[22px] font-normal leading-[1.15] tracking-[-0.025em] text-[var(--cream)]">
                  {g.title}
                </h3>
                <p className="text-[14px] leading-[1.65] text-[var(--cream-mute)]">{g.body}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {g.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-2)_70%,transparent)] px-2.5 py-1 font-mono text-[10.5px] tracking-[-0.005em] text-[var(--cream-mute)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-10 max-w-[760px] text-[13px] leading-[1.65] text-[var(--cream-faint)]">
            Underwrite is infrastructure, not legal advice. The platform encodes regulatory
            defaults; your team remains responsible for review by qualified counsel and
            ongoing compliance operations.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}