import { motion } from "framer-motion";
import { FadeIn, staggerChild, staggerParent } from "../lib/motion";

const PILLARS = [
  {
    eyebrow: "01 / Domain",
    title: "Thirty-four nano-services, one event spine.",
    body: "Every credit, compliance, and operational concern is its own typed service. No monolithic risk engine. No lock-in. Compose what you need.",
    points: ["KYC · AML · CIBIL · CKYC", "RBI pricing · KFS · DPDPA consent · DSR", "Razorpay · risk · fraud · NPA · recovery"],
    visual: <DomainVisual />,
  },
  {
    eyebrow: "02 / Compliance",
    title: "RBI and DPDPA, encoded into the runtime.",
    body: "Per-product rate caps, all-in-cost APR, penal-interest ceilings, KFS cooling-off, consent lifecycle, DSR fulfillment — enforced by the platform.",
    points: ["RBI Digital Lending Guidelines", "DPDPA 2023 consent + erasure", "PII redaction · auto-purge"],
    visual: <ComplianceVisual />,
  },
  {
    eyebrow: "03 / Provenance",
    title: "Ed25519-signed events you can prove.",
    body: "Every event carries a cryptographic signature. Bounded replay window, PII-redacted ledger, dead-letter queue with replay — observable, defensible.",
    points: ["Ed25519 signature per event", "DLQ + replay · circuit breaker", "PII-redacted audit · OTLP tracing"],
    visual: <ProvenanceVisual />,
  },
];

export function Platform() {
  return (
    <section
      id="platform"
      aria-labelledby="platform-title"
      className="relative py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <FadeIn>
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-[var(--amber)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">
              The platform
            </span>
          </div>
          <h2
            id="platform-title"
            className="mt-6 max-w-[860px] text-balance font-display text-[40px] font-normal leading-[1.04] tracking-[-0.04em] text-[var(--cream)] sm:text-[56px] lg:text-[68px]"
          >
            Underwriting infrastructure,
            <br />
            <span className="text-[var(--cream-mute)]">typed from the ground up.</span>
          </h2>
        </FadeIn>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <motion.article
              key={p.title}
              variants={staggerChild}
              className="group relative flex flex-col overflow-hidden rounded-[18px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_85%,transparent)] transition-all hover:border-[var(--line-amber)] hover:bg-[color-mix(in_srgb,var(--ink-1)_95%,transparent)]"
            >
              <div className="flex flex-col gap-5 p-7 sm:p-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--amber)]">
                  {p.eyebrow}
                </span>
                <h3 className="font-display text-[26px] font-normal leading-[1.1] tracking-[-0.025em] text-[var(--cream)] sm:text-[28px]">
                  {p.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-[var(--cream-mute)]">{p.body}</p>
              </div>

              <div className="px-7 sm:px-8">{p.visual}</div>

              <ul className="mt-6 flex flex-col gap-2 border-t border-[var(--line)] p-7 sm:p-8">
                {p.points.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[13.5px] text-[var(--cream-soft)]"
                  >
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Visuals ──────────────── */

function DomainVisual() {
  const groups = [
    { label: "KYC", items: ["CIBIL", "CKYC", "Aadhaar", "Experian"] },
    { label: "Risk", items: ["scoring", "fraud", "NPA", "recovery"] },
    { label: "Ops", items: ["KFS", "DSR", "consent", "audit"] },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_80%,transparent)] p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
        <span>services</span>
        <span>34</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md bg-[var(--line)]">
        {groups.map((g) => (
          <div key={g.label} className="bg-[var(--ink)] px-3 py-3">
            <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--cream-faint)]">
              {g.label}
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {g.items.map((i) => (
                <div
                  key={i}
                  className="font-mono text-[10.5px] tracking-[-0.005em] text-[var(--cream-mute)]"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_80%,transparent)] p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
        <span>rate caps · APR</span>
        <span className="text-[var(--amber)]">enforced</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {[
          { label: "Personal", used: 17.9, cap: 28 },
          { label: "Consumer", used: 21.1, cap: 32 },
          { label: "Edu.", used: 11.8, cap: 18 },
        ].map((row) => {
          const pct = Math.min(100, Math.round((row.used / row.cap) * 100));
          return (
            <div key={row.label}>
              <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[-0.005em]">
                <span className="text-[var(--cream-soft)]">{row.label}</span>
                <span className="text-[var(--cream-faint)]">
                  <span className="text-[var(--cream)]">{row.used.toFixed(1)}</span>% / {row.cap}%
                </span>
              </div>
              <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-[var(--ink-3)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #e3a857, #c98c34)" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProvenanceVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_80%,transparent)] p-5 font-mono text-[11px]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
        <span>signed envelope</span>
        <span className="inline-flex items-center gap-1.5 text-[var(--amber)]">
          <span className="h-1 w-1 rounded-full bg-[var(--amber)]" />
          verified
        </span>
      </div>
      <pre className="mt-4 whitespace-pre leading-[1.7] text-[var(--cream-mute)]">
{`{
  "id":   "evt_01HZX8R7",
  "type": "loan.originated",
  "key":  "ed25519:8c4f…b21a",
  "sig":  "9e1f5a7d3b…7c2a",
  "ts":   "2026-09-14T07:18:05Z"
}`}
      </pre>
    </div>
  );
}