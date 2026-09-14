import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "../lib/motion";

const EVENT_NODES = [
  { id: "loan.application.received", x: 8, y: 50, kind: "command" },
  { id: "kyc.check.requested", x: 24, y: 22, kind: "command" },
  { id: "kyc.verified", x: 42, y: 14, kind: "event" },
  { id: "risk.scored", x: 42, y: 32, kind: "event" },
  { id: "fraud.alert", x: 42, y: 50, kind: "event" },
  { id: "pricing.compute", x: 42, y: 68, kind: "command" },
  { id: "consent.record", x: 42, y: 82, kind: "command" },
  { id: "consent.recorded", x: 62, y: 68, kind: "event" },
  { id: "pricing.computed", x: 62, y: 50, kind: "event" },
  { id: "kfs.generate", x: 62, y: 82, kind: "command" },
  { id: "kfs.generated", x: 80, y: 76, kind: "event" },
  { id: "loan.originated", x: 94, y: 60, kind: "event" },
] as const;

const EDGES: Array<[string, string]> = [
  ["loan.application.received", "kyc.check.requested"],
  ["loan.application.received", "risk.scored"],
  ["loan.application.received", "fraud.alert"],
  ["kyc.check.requested", "kyc.verified"],
  ["risk.scored", "pricing.compute"],
  ["kyc.verified", "pricing.compute"],
  ["fraud.alert", "pricing.compute"],
  ["pricing.compute", "consent.record"],
  ["consent.record", "consent.recorded"],
  ["consent.recorded", "kfs.generate"],
  ["pricing.computed", "loan.originated"],
  ["kfs.generated", "loan.originated"],
];

export function Architecture() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine mask-radial opacity-50"
      />

      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <FadeIn>
          <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            <span className="mr-2 inline-block h-px w-8 align-middle bg-[var(--line-strong)]" />
            Architecture
          </p>
          <h2
            id="architecture-title"
            className="mt-5 max-w-[820px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--fg)] sm:text-[44px] md:text-[52px]"
          >
            One event bus.{" "}
            <span className="font-serif-display">Every concern, isolated.</span>
          </h2>
          <p className="mt-5 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--fg-mute)]">
            Cross-cutting concerns — authz, tracing, metrics, idempotency, sagas, DLQ, circuit
            breaking — are injected by the runtime. Each service is a small{" "}
            <span className="font-mono text-[var(--fg-soft)]">Core</span> subclass that emits and
            consumes typed, Ed25519-signed events on an in-process bus.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <EventFlow />
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          <ArchStat n="34" label="Nano-services wired" sub="+ 4 KYC provider clients" />
          <ArchStat n="132" label="Typed event kinds" sub="Strict message envelope" />
          <ArchStat n="<1ms" label="Median dispatch" sub="In-process, async" />
          <ArchStat n="100%" label="Signed events" sub="Ed25519 · verified pre-dispatch" />
        </div>
      </div>
    </section>
  );
}

function ArchStat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col gap-1 bg-[color-mix(in_srgb,var(--bg-elev)_95%,transparent)] p-7">
      <span className="font-mono text-[40px] font-light tracking-[-0.04em] text-[var(--fg)]">
        {n}
      </span>
      <span className="text-[14px] font-medium text-[var(--fg-soft)]">{label}</span>
      <span className="text-[12.5px] text-[var(--fg-faint)]">{sub}</span>
    </div>
  );
}

function EventFlow() {
  const reduce = useReducedMotion();
  const W = 1100;
  const H = 500;
  const nodePos = (id: string) => EVENT_NODES.find((n) => n.id === id)!;
  const xToPx = (x: number) => (x / 100) * W;
  const yToPx = (y: number) => (y / 100) * H;

  return (
    <div className="ring-inset-soft relative mt-14 overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_80%,transparent)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-fine opacity-60"
        style={{ maskImage: "linear-gradient(to bottom, black, transparent 90%)" }}
      />

      {/* Top status bar */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            event flow
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--fg-faint)]" />
          <span className="font-mono text-[11px] text-[var(--fg-mute)]">
            132 kinds · async · verified
          </span>
        </div>
        <div className="hidden items-center gap-3 font-mono text-[11px] text-[var(--fg-faint)] sm:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#60a5fa]" /> command
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#34d399]" /> event
          </span>
        </div>
      </div>

      <div className="relative aspect-[11/5] w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Event flow diagram"
        >
          <defs>
            <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.0)" />
              <stop offset="20%" stopColor="rgba(96,165,250,0.55)" />
              <stop offset="80%" stopColor="rgba(52,211,153,0.55)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.0)" />
            </linearGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(167, 243, 208, 0.85)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map(([from, to], i) => {
            const a = nodePos(from);
            const b = nodePos(to);
            const x1 = xToPx(a.x);
            const y1 = yToPx(a.y);
            const x2 = xToPx(b.x);
            const y2 = yToPx(b.y);
            const cx = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
            return (
              <g key={`${from}-${to}`}>
                <path
                  d={path}
                  stroke="url(#edge)"
                  strokeWidth="1.2"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
                {!reduce && (
                  <motion.circle
                    r="3"
                    fill="#a7f3d0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.95, 0] }}
                    transition={{
                      duration: 2.4,
                      delay: i * 0.18,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeInOut",
                    }}
                  >
                    <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.18}s`} path={path} />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {EVENT_NODES.map((n, i) => {
            const cx = xToPx(n.x);
            const cy = yToPx(n.y);
            const isCommand = n.kind === "command";
            return (
              <motion.g
                key={n.id}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="6.5"
                  fill={isCommand ? "#60a5fa" : "#34d399"}
                  opacity="0.16"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill={isCommand ? "#60a5fa" : "#34d399"}
                  stroke={isCommand ? "#93c5fd" : "#6ee7b7"}
                  strokeWidth="1.2"
                />
                <text
                  x={cx}
                  y={cy + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="rgba(214, 211, 209, 0.95)"
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {n.id}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
        {[
          ["34", "services"],
          ["132", "events"],
          ["5min", "replay window"],
          ["Ed25519", "provenance"],
        ].map(([n, l]) => (
          <div
            key={l as string}
            className="flex items-baseline gap-2 bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] px-4 py-3"
          >
            <span className="font-mono text-[16px] tracking-[-0.02em] text-[var(--fg)]">
              {n as string}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
              {l as string}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}