import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ANNOUNCEMENT_TEXT = "Now shipping v0.9 · RBI Digital Lending Guidelines aligned · DPDPA 2023 ready";

export function Hero() {
  const reduce = useReducedMotion();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    };
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20 sm:pt-40"
      aria-label="Hero"
    >
      {/* Background layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-60" />
        <div className="absolute inset-x-0 top-0 h-[640px] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-elev)_50%,transparent)] to-transparent" />
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute left-1/2 top-[18%] -translate-x-1/2"
        >
          <div
            className="h-[420px] w-[420px] rounded-full opacity-60 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0.18) 35%, transparent 65%)",
            }}
          />
        </motion.div>
        <div
          className="absolute -bottom-32 left-1/2 h-[400px] w-[820px] -translate-x-1/2 opacity-40 blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245,158,11,0.25) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Announcement pill */}
          <motion.a
            href="./docs/start/quickstart/"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] px-1.5 py-1 backdrop-blur-md transition-colors hover:border-[var(--line-strong)]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-mute)]">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#34d399] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              </span>
              v0.9
            </span>
            <span className="pr-1.5 text-[12.5px] text-[var(--fg-mute)]">
              {ANNOUNCEMENT_TEXT}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5 text-[var(--fg-faint)] transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* Headline */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[920px] text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--fg)] sm:text-[56px] md:text-[68px] lg:text-[78px]"
          >
            Programmable underwriting,{" "}
            <span className="font-serif-display text-[1.05em]">without compromise.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[640px] text-pretty text-[16.5px] leading-relaxed text-[var(--fg-mute)] sm:text-[18px]"
          >
            An event-driven nano-service platform for Indian retail lending. Thirty-four typed
            services. Ed25519 cryptographic provenance on every event. RBI and DPDPA, baked in —
            not bolted on.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-3"
          >
            <a
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-[14px] font-medium text-[var(--bg)] shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_18px_42px_-12px_rgba(59,130,246,0.45)] transition-all hover:scale-[1.015] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_22px_48px_-12px_rgba(59,130,246,0.55)] active:scale-100"
            >
              Start in 60 seconds
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
              href="./docs/"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--bg-elev)_60%,transparent)] px-6 py-3 text-[14px] font-medium text-[var(--fg)] backdrop-blur-md transition-colors hover:border-[var(--fg-faint)]"
            >
              Read the docs
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--fg-mute)] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Install snippet */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center gap-3 sm:mt-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_70%,transparent)] px-4 py-1 text-[11.5px] uppercase tracking-[0.1em] text-[var(--fg-faint)] backdrop-blur-md">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              One command to run
            </div>
            <div className="group relative inline-flex max-w-full items-center gap-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_85%,transparent)] px-4 py-3 shadow-[inset_0_1px_0_0_var(--line)] backdrop-blur-md">
              <span className="font-mono text-[12.5px] text-[var(--fg-mute)] sm:text-[13px]">
                <span className="select-none text-[var(--fg-faint)]">$</span>{" "}
                <span className="text-[var(--fg)]">underwrite</span>{" "}
                <span className="text-[var(--fg-mute)]">run mechanism compliance pricing kfs</span>
              </span>
              <span aria-hidden="true" className="ml-1 inline-block h-4 w-2 animate-pulse bg-[var(--fg)]" />
            </div>
          </motion.div>
        </div>

        {/* Telemetry console / dashboard preview */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-[1080px] sm:mt-24"
        >
          <DashboardPreview time={time} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-14 flex justify-center sm:mt-16"
        >
          <a
            href="#live"
            className="group inline-flex flex-col items-center gap-2 text-[var(--fg-faint)] transition-colors hover:text-[var(--fg-mute)]"
            aria-label="Scroll to explore"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]">Scroll to explore</span>
            <span className="relative inline-flex h-7 w-[18px] items-start justify-center rounded-full border border-[var(--line-strong)]">
              <motion.span
                aria-hidden="true"
                animate={{ y: [2, 12, 2] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mt-1 inline-block h-1.5 w-[2px] rounded-full bg-[var(--fg-mute)]"
              />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview({ time }: { time: string }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-x-12 -inset-y-8 -z-10 rounded-[36px] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-elev)_60%,transparent)] via-transparent to-transparent opacity-80 blur-2xl"
      />
      <div className="ring-inset-soft overflow-hidden rounded-[24px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_92%,transparent)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_50%,transparent)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 font-mono text-[11px] text-[var(--fg-faint)] sm:flex">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            underwrite.local · /v1/health
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--fg-faint)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            <span>IST {time || "—"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[var(--line)] sm:grid-cols-12">
          {/* Sidebar */}
          <aside className="hidden border-r border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] p-4 sm:col-span-3 sm:block">
            <div className="mb-3 flex items-center gap-2 px-2 text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
              <span className="h-1 w-1 rounded-full bg-[var(--fg-faint)]" /> Services
            </div>
            <ul className="space-y-0.5 text-[12.5px]">
              {[
                ["mechanism", true],
                ["compliance", true],
                ["pricing", true],
                ["risk", true],
                ["fraud", true],
                ["kfs", true],
                ["consent", true],
                ["dsr", true],
                ["audit", true],
                ["razorpay", false],
                ["credit_bureau", false],
              ].map(([name, on]) => (
                <li
                  key={name as string}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-[var(--fg-mute)] hover:bg-[var(--bg-soft)]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${on ? "bg-[#10b981]" : "bg-[var(--fg-faint)]"}`}
                    />
                    <span className="font-mono">{name as string}</span>
                  </span>
                  <span className="font-mono text-[10.5px] text-[var(--fg-faint)]">
                    {(on ? "live" : "idle") as string}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main */}
          <main className="col-span-12 bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] p-5 sm:col-span-9 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Events / s" value="1,284" delta="+12.4%" />
              <Stat label="Loan lifecycle" value="312 ms" delta="p95" />
              <Stat label="Attested" value="100%" delta="Ed25519" />
              <Stat label="DLQ depth" value="0" delta="healthy" tone="ok" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="col-span-2 rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-4">
                <div className="flex items-center justify-between text-[11.5px] text-[var(--fg-faint)]">
                  <span>Event throughput</span>
                  <span className="font-mono">last 60s</span>
                </div>
                <ThroughputChart />
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-4">
                <div className="flex items-center justify-between text-[11.5px] text-[var(--fg-faint)]">
                  <span>Recent events</span>
                  <span className="font-mono">live</span>
                </div>
                <ul className="mt-3 space-y-1.5 font-mono text-[11.5px]">
                  {[
                    ["12:48:02", "loan.application.received"],
                    ["12:48:02", "kyc.check.requested"],
                    ["12:48:03", "risk.scored"],
                    ["12:48:03", "pricing.computed"],
                    ["12:48:04", "consent.recorded"],
                    ["12:48:04", "kfs.generated"],
                    ["12:48:05", "loan.originated"],
                  ].map(([t, ev], i) => (
                    <li key={i as number} className="flex items-center gap-3 whitespace-nowrap">
                      <span className="text-[var(--fg-faint)]">{t}</span>
                      <span className="text-[var(--fg-mute)]">{ev}</span>
                      <span className="ml-auto text-[#10b981]">✓</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-4 font-mono text-[12px]">
              <div className="flex items-center justify-between text-[11.5px] text-[var(--fg-faint)]">
                <span>Audit ledger · last entry</span>
                <span className="hidden sm:inline">SHA-256: 7f3a…b4e2</span>
              </div>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11.5px] leading-relaxed text-[var(--fg-mute)]">
{`{
  "id": "evt_01HZX8R7KQ8V4NQ2T",
  "type": "loan.originated",
  "service": "mechanism",
  "ts":   "2026-09-14T07:18:05.421Z",
  "key":  "ed25519:8c4f…b21a",
  "sig":  "9e1f5a7d3b…",
  "data": { "loan_id": "LN-49812", "apr": 0.179, "kfs": "kfs_8c2…" }
}`}
              </pre>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "ok";
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-3.5">
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--fg-faint)]">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[20px] tracking-[-0.01em] text-[var(--fg)]">{value}</span>
        <span
          className={`font-mono text-[10.5px] ${
            tone === "ok" ? "text-[#10b981]" : "text-[var(--fg-mute)]"
          }`}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}

function ThroughputChart() {
  // Deterministic sparkline
  const points = [22, 30, 28, 36, 42, 38, 50, 58, 54, 62, 70, 66, 78, 72, 84, 80, 88, 92, 86, 94, 98, 90, 96, 88, 92, 100];
  const max = Math.max(...points);
  const w = 480;
  const h = 92;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h * 0.9}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[92px] w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tpStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="tpFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tpFill)" />
        <path d={path} fill="none" stroke="url(#tpStroke)" strokeWidth="1.5" />
        <circle cx={(points.length - 1) * step} cy={h - (points[points.length - 1] / max) * h * 0.9} r="3" fill="#3b82f6" />
      </svg>
    </div>
  );
}