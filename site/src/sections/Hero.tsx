import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ANNOUNCEMENT = "v0.9 · RBI Digital Lending aligned · DPDPA 2023 ready";

export function Hero() {
  const reduce = useReducedMotion();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 sm:pt-36"
      aria-label="Hero"
    >
      {/* Background — single refined radial, not layered clutter */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-60" />
        <div
          className="absolute left-1/2 top-[20%] h-[520px] w-[920px] -translate-x-1/2 opacity-70 blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(227,168,87,0.18) 0%, rgba(227,168,87,0.05) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--ink-1) 70%, transparent), transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <div className="flex flex-col items-center text-center">
          {/* Announcement */}
          <motion.a
            href="#architecture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_70%,transparent)] px-1.5 py-1 backdrop-blur-md transition-colors hover:border-[var(--line-amber)]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-2)] px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-[var(--amber)]">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--amber)] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
              </span>
              New
            </span>
            <span className="pr-1.5 text-[12.5px] text-[var(--cream-mute)]">{ANNOUNCEMENT}</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5 text-[var(--cream-faint)] transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* Headline — confident, restrained */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-[1000px] text-balance font-display text-[44px] font-normal leading-[1.02] tracking-[-0.045em] text-[var(--cream)] sm:text-[64px] md:text-[80px] lg:text-[96px]"
          >
            Underwriting{" "}
            <span className="font-serif-display text-[var(--amber)]">infrastructure</span>,
            <br className="hidden sm:block" />{" "}
            <span className="text-[var(--cream-mute)]">end to end.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[580px] text-balance text-[16px] leading-[1.6] text-[var(--cream-mute)] sm:text-[17.5px]"
          >
            A typed, event-driven platform for Indian retail lending.
            <br className="hidden sm:block" />
            <span className="text-[var(--cream-soft)]">34 services. Ed25519 provenance. RBI and DPDPA, baked in.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--cream)] px-6 py-3 text-[14px] font-medium tracking-[-0.005em] text-[var(--ink)] transition-all hover:bg-[#fff] hover:shadow-[0_20px_48px_-12px_rgba(246,242,233,0.25)] active:scale-[0.99]"
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
              href="#architecture"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-transparent px-6 py-3 text-[14px] font-normal tracking-[-0.005em] text-[var(--cream-soft)] transition-all hover:border-[var(--cream-faint)] hover:text-[var(--cream)]"
            >
              See it run
            </a>
          </motion.div>
        </div>

        {/* Hero visual — single refined operations panel */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-[1080px] sm:mt-24"
        >
          <OperationsPanel time={time} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-14 flex justify-center sm:mt-16"
        >
          <a
            href="#platform"
            className="group inline-flex flex-col items-center gap-2.5 text-[var(--cream-faint)] transition-colors hover:text-[var(--cream-mute)]"
            aria-label="Scroll to explore"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em]">Scroll</span>
            <span className="relative inline-flex h-7 w-[18px] items-start justify-center rounded-full border border-[var(--line-strong)]">
              <motion.span
                aria-hidden="true"
                animate={{ y: [2, 11, 2] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mt-1 inline-block h-1.5 w-[2px] rounded-full bg-[var(--cream-mute)]"
              />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function OperationsPanel({ time }: { time: string }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-x-20 -inset-y-10 -z-10 rounded-[40px] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(227,168,87,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="ring-inset-soft overflow-hidden rounded-[20px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_92%,transparent)] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(246,242,233,0.04)] backdrop-blur-xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[var(--ink-4)]" />
            <span className="font-mono text-[11.5px] tracking-[-0.005em] text-[var(--cream-mute)]">
              underwriting.ledger
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[var(--cream-faint)] sm:inline-block" />
            <span className="hidden font-mono text-[11px] text-[var(--cream-faint)] sm:inline">
                live · IST {time || "—"}
            </span>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--cream-faint)]">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#9bc985] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#9bc985]" />
              </span>
              attested
            </div>
            <span className="h-1 w-1 rounded-full bg-[var(--cream-faint)]" />
            <span className="font-mono text-[10.5px] text-[var(--cream-faint)]">Ed25519</span>
          </div>
        </div>

        {/* Body — single column, refined */}
        <div className="grid grid-cols-1 gap-px bg-[var(--line)] sm:grid-cols-[1.4fr_1fr]">
          {/* Stream column */}
          <div className="bg-[color-mix(in_srgb,var(--ink-1)_94%,transparent)] p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--cream-faint)]">
                Event stream
              </span>
              <span className="font-mono text-[10.5px] text-[var(--cream-faint)]">
                last 7 of 1,284
              </span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                ["12:48:02.104", "loan.application.received", "cmd"],
                ["12:48:02.318", "kyc.check.requested", "cmd"],
                ["12:48:03.061", "kyc.verified", "evt"],
                ["12:48:03.412", "risk.scored", "evt"],
                ["12:48:04.118", "pricing.computed", "evt"],
                ["12:48:04.502", "consent.recorded", "evt"],
                ["12:48:05.421", "loan.originated", "evt"],
              ].map(([t, ev, kind], i) => (
                <li
                  key={i}
                  className="grid grid-cols-[68px_1fr_42px] items-center gap-3 rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-2)_60%,transparent)] px-3 py-2 font-mono text-[11.5px]"
                >
                  <span className="text-[var(--cream-faint)]">{t as string}</span>
                  <span className="text-[var(--cream-soft)]">{ev as string}</span>
                  <span
                    className={`text-right text-[10px] uppercase tracking-[0.1em] ${
                      kind === "cmd" ? "text-[var(--amber)]" : "text-[#9bc985]"
                    }`}
                  >
                    {kind as string}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Signature column */}
          <div className="bg-[color-mix(in_srgb,var(--ink-1)_94%,transparent)] p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--cream-faint)]">
                Signed envelope
              </span>
              <span className="font-mono text-[10.5px] text-[var(--amber)]">verified</span>
            </div>
            <pre className="mt-5 overflow-x-auto whitespace-pre font-mono text-[11.5px] leading-[1.7] text-[var(--cream-mute)]">
{`{
  "id":  "evt_01HZX8R7KQ",
  "type": "loan.originated",
  "service": "mechanism",
  "ts":  "2026-09-14T07:18:05Z",
  "key": "ed25519:8c4f…b21a",
  "sig": "9e1f5a7d3b…7c2a"
}`}
            </pre>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Metric n="1,284" label="events / s" />
              <Metric n="312ms" label="median decision" />
              <Metric n="100%" label="signed" />
              <Metric n="0" label="DLQ depth" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-2)_50%,transparent)] px-3 py-2.5">
      <div className="font-mono text-[14.5px] tracking-[-0.02em] text-[var(--cream)]">{n}</div>
      <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
        {label}
      </div>
    </div>
  );
}