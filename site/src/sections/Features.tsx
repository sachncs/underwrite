import { motion } from "framer-motion";
import { FadeIn, staggerChild, staggerParent } from "../lib/motion";

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  visual: "events" | "dlq" | "rate" | "kyc" | "audit" | "saga";
  span?: "wide" | "tall";
};

const FEATURES: Feature[] = [
  {
    eyebrow: "Type system",
    title: "132 events. Strict envelopes. No surprises.",
    body:
      "Every message flows through a typed envelope. Pydantic-validated, Ed25519-signed, idempotency-keyed. If it doesn't type-check, it doesn't ship.",
    visual: "events",
    span: "wide",
  },
  {
    eyebrow: "Resilience",
    title: "Dead-letter queue with bounded memory.",
    body:
      "Per-subscriber circuit breakers, per-handler timeouts, and replayable DLQ. Optional store-backed DLQ for durability across restarts.",
    visual: "dlq",
  },
  {
    eyebrow: "Pricing",
    title: "All-in-cost APR. No rounding tricks.",
    body:
      "Per-product rate caps, penal-interest ceilings, and KFS cooling-off — computed in the platform, surfaced verbatim to your customer.",
    visual: "rate",
  },
  {
    eyebrow: "KYC",
    title: "Four providers. One adapter.",
    body:
      "CIBIL, CKYC, Aadhaar Verhoeff, plus pluggable provider clients. Switch vendors without rewriting service code.",
    visual: "kyc",
  },
  {
    eyebrow: "Audit",
    title: "PII-redacted ledger, replayable for 5 minutes.",
    body:
      "Every event mirrored, every PII field masked, every signature verified. Forward to your SIEM or replay from a snapshot.",
    visual: "audit",
    span: "wide",
  },
  {
    eyebrow: "Orchestration",
    title: "Sagas for multi-service workflows.",
    body:
      "Compensating actions are first-class. Originate, disburse, service, collect — with deterministic rollbacks when reality disagrees with the plan.",
    visual: "saga",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <FadeIn>
          <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            <span className="mr-2 inline-block h-px w-8 align-middle bg-[var(--line-strong)]" />
            Capabilities
          </p>
          <h2
            id="features-title"
            className="mt-5 max-w-[820px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--fg)] sm:text-[44px] md:text-[52px]"
          >
            Built for the{" "}
            <span className="font-serif-display">messy reality</span> of lending.
          </h2>
          <p className="mt-5 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--fg-mute)]">
            Every feature exists because a regulator, a customer, or an on-call engineer
            demanded it. Nothing decorative. Nothing accidental.
          </p>
        </FadeIn>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-6 md:auto-rows-[minmax(220px,auto)]"
        >
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              variants={staggerChild}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] p-6 transition-all hover:border-[var(--line-strong)] hover:bg-[var(--bg-elev)] sm:p-8 ${
                f.span === "wide" ? "md:col-span-6" : "md:col-span-3"
              }`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div>
                <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                  {f.eyebrow}
                </span>
                <h3
                  className={`mt-3 font-medium tracking-[-0.01em] text-[var(--fg)] ${
                    f.span === "wide" ? "text-[22px] sm:text-[26px]" : "text-[18px] sm:text-[20px]"
                  }`}
                >
                  {f.title}
                </h3>
                <p
                  className={`mt-3 text-[14px] leading-relaxed text-[var(--fg-mute)] ${
                    f.span === "wide" ? "max-w-[560px]" : ""
                  }`}
                >
                  {f.body}
                </p>
              </div>
              <FeatureVisual kind={f.visual} compact={f.span !== "wide"} index={i} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureVisual({
  kind,
  compact,
  index,
}: {
  kind: Feature["visual"];
  compact?: boolean;
  index: number;
}) {
  return (
    <div
      className={`relative mt-${compact ? 5 : 7} overflow-hidden rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] ${
        compact ? "h-[160px]" : "h-[260px] sm:h-[300px]"
      }`}
    >
      {kind === "events" && <EventsVisual />}
      {kind === "dlq" && <DLQVisual />}
      {kind === "rate" && <RateVisual />}
      {kind === "kyc" && <KYCVisual />}
      {kind === "audit" && <AuditVisual />}
      {kind === "saga" && <SagaVisual index={index} />}
    </div>
  );
}

function EventsVisual() {
  const events = [
    "loan.application.received",
    "kyc.verified",
    "risk.scored",
    "pricing.computed",
    "consent.recorded",
    "kfs.generated",
    "loan.originated",
  ];
  return (
    <div className="flex h-full flex-col gap-1.5 p-4 font-mono text-[11px] sm:text-[12px]">
      {events.map((e, i) => (
        <motion.div
          key={e}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * i, duration: 0.4 }}
          className="flex items-center gap-3 rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_80%,transparent)] px-3 py-1.5"
        >
          <span className="text-[var(--fg-faint)]">{(i + 1).toString().padStart(2, "0")}</span>
          <span className="text-[var(--fg-soft)]">{e}</span>
          <span className="ml-auto text-[#34d399]">✓ signed</span>
        </motion.div>
      ))}
    </div>
  );
}

function DLQVisual() {
  const items = [
    { name: "fraud.alert", reason: "timeout", retries: 3 },
    { name: "kyc.verified", reason: "rate-limited", retries: 1 },
    { name: "consent.recorded", reason: "downstream down", retries: 2 },
  ];
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
        <span>DLQ</span>
        <span className="text-[#fbbf24]">3 pending · replay ready</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {items.map((it) => (
          <div
            key={it.name}
            className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_80%,transparent)] px-3 py-2 font-mono text-[11.5px]"
          >
            <div className="flex flex-col">
              <span className="text-[var(--fg-soft)]">{it.name}</span>
              <span className="text-[var(--fg-faint)]">{it.reason}</span>
            </div>
            <span className="text-[#fbbf24]">× {it.retries}</span>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-[#10b98133] bg-[#10b98110] px-3 py-1.5 text-center font-mono text-[11px] text-[#34d399]">
        $ underwrite dlq --replay
      </div>
    </div>
  );
}

function RateVisual() {
  const rows = [
    ["Personal", "0.28", "0.179"],
    ["Consumer", "0.32", "0.211"],
    ["MSME", "0.245", "0.164"],
    ["Edu.", "0.18", "0.118"],
  ];
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
        <span>Rate caps</span>
        <span>RBI · all-in APR</span>
      </div>
      <div className="mt-2 flex-1 space-y-1.5 font-mono text-[11.5px]">
        {rows.map(([prod, cap, used]) => {
          const pct = Math.min(100, Math.round((parseFloat(used) / parseFloat(cap)) * 100));
          return (
            <div key={prod} className="rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[var(--fg-soft)]">{prod}</span>
                <span className="text-[var(--fg-faint)]">
                  {used} / <span className="text-[var(--fg-mute)]">{cap}</span>
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg,#60a5fa,#3b82f6)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KYCVisual() {
  const providers = ["CIBIL", "CKYC", "Aadhaar", "Experian"];
  return (
    <div className="flex h-full items-center gap-3 p-4">
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-3 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
          compliance
        </div>
        <div className="mt-1 text-[12px] text-[var(--fg)]">KYC adapter</div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-1">
        {providers.map((p) => (
          <div
            key={p}
            className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_85%,transparent)] px-2 py-1 font-mono text-[10.5px] text-[var(--fg-soft)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
            {p}
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-3 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
          result
        </div>
        <div className="mt-1 text-[12px] text-[#34d399]">verified</div>
      </div>
    </div>
  );
}

function AuditVisual() {
  const entries = Array.from({ length: 14 }).map((_, i) => i);
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
        <span>Audit ledger</span>
        <span>PII-redacted</span>
      </div>
      <div className="flex-1 overflow-hidden rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] p-2 font-mono text-[10.5px]">
        <div className="grid grid-cols-[40px_1fr_60px] gap-1.5 text-[var(--fg-faint)]">
          {entries.map((i) => {
            const verified = i % 5 !== 2;
            const isPii = i % 4 === 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="col-span-3 grid grid-cols-[40px_1fr_60px] gap-1.5"
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[var(--fg-mute)]">
                  {isPii ? "aadhaar: ████-████-1234" : `evt_${Math.random().toString(36).slice(2, 8)}`}
                </span>
                <span className={verified ? "text-[#34d399]" : "text-[#fbbf24]"}>
                  {verified ? "✓" : "··"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SagaVisual(_: { index: number }) {
  const steps = ["originate", "disburse", "service", "collect"];
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
        <span>Saga</span>
        <span>compensating actions ready</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-2.5 text-center"
          >
            <div className="h-2 w-2 rounded-full bg-[#60a5fa]" />
            <span className="font-mono text-[10.5px] text-[var(--fg-soft)]">{s}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] p-3 font-mono text-[10.5px] text-[var(--fg-mute)]">
        <div className="text-[var(--fg-faint)]">step 03 · service</div>
        <div className="mt-1">↳ on failure → refund.disburse</div>
        <div className="text-[#fbbf24]">↳ compensating → ok</div>
      </div>
    </div>
  );
}