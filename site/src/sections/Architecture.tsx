import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "../lib/motion";

const NODES = [
  { id: "loan.application.received", x: 6, y: 52, kind: "cmd" },
  { id: "kyc.check.requested", x: 22, y: 22, kind: "cmd" },
  { id: "kyc.verified", x: 42, y: 14, kind: "evt" },
  { id: "risk.scored", x: 42, y: 34, kind: "evt" },
  { id: "fraud.alert", x: 42, y: 54, kind: "evt" },
  { id: "pricing.compute", x: 42, y: 72, kind: "cmd" },
  { id: "consent.record", x: 42, y: 88, kind: "cmd" },
  { id: "consent.recorded", x: 62, y: 72, kind: "evt" },
  { id: "pricing.computed", x: 62, y: 52, kind: "evt" },
  { id: "kfs.generate", x: 62, y: 86, kind: "cmd" },
  { id: "kfs.generated", x: 80, y: 78, kind: "evt" },
  { id: "loan.originated", x: 94, y: 58, kind: "evt" },
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
      className="relative overflow-hidden py-24 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine mask-radial opacity-50"
      />

      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-8 bg-[var(--amber)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">
                  Architecture
                </span>
              </div>
              <h2
                id="architecture-title"
                className="mt-6 text-balance font-display text-[40px] font-normal leading-[1.02] tracking-[-0.04em] text-[var(--cream)] sm:text-[56px] lg:text-[64px]"
              >
                One event bus.
                <br />
                <span className="text-[var(--cream-mute)]">Every concern, isolated.</span>
              </h2>
              <p className="mt-6 max-w-[420px] text-[15px] leading-[1.65] text-[var(--cream-mute)]">
                Authz, tracing, metrics, idempotency, sagas, DLQ, and circuit breaking
                are injected by the runtime. Each service is a small{" "}
                <span className="font-mono text-[var(--cream-soft)]">Core</span> that emits
                and consumes typed, Ed25519-signed messages on an in-process bus.
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line)] pt-8">
                <Stat n="34" label="Nano-services" sub="+ 4 KYC provider clients" />
                <Stat n="132" label="Typed event kinds" sub="Strict envelopes" />
                <Stat n="<1ms" label="Median dispatch" sub="In-process, async" />
                <Stat n="100%" label="Signed events" sub="Ed25519, pre-dispatch" />
              </dl>
            </div>

            <FadeIn delay={0.15}>
              <EventFlow />
            </FadeIn>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Stat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div>
      <div className="font-display text-[34px] font-normal leading-none tracking-[-0.04em] text-[var(--cream)] sm:text-[40px]">
        {n}
      </div>
      <div className="mt-2 text-[13.5px] text-[var(--cream-soft)]">{label}</div>
      <div className="mt-0.5 font-mono text-[11px] tracking-[-0.005em] text-[var(--cream-faint)]">{sub}</div>
    </div>
  );
}

function EventFlow() {
  const reduce = useReducedMotion();
  const W = 1100;
  const H = 480;
  const nodePos = (id: string) => NODES.find((n) => n.id === id)!;
  const xToPx = (x: number) => (x / 100) * W;
  const yToPx = (y: number) => (y / 100) * H;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[32px] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(227,168,87,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="ring-inset-soft overflow-hidden rounded-[20px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_88%,transparent)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid-fine opacity-50"
        />
        <div className="relative aspect-[11/4.8] w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Underwriting event flow"
          >
            <defs>
              <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(227,168,87,0)" />
                <stop offset="25%" stopColor="rgba(227,168,87,0.6)" />
                <stop offset="75%" stopColor="rgba(246,242,233,0.45)" />
                <stop offset="100%" stopColor="rgba(246,242,233,0)" />
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
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(246,242,233,0.7)" />
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
                    strokeWidth="1.1"
                    fill="none"
                    markerEnd="url(#arrow)"
                  />
                  {!reduce && (
                    <circle r="2.5" fill="#e3a857">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${i * 0.25}s`}
                        path={path}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="3s"
                        begin={`${i * 0.25}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((n, i) => {
              const cx = xToPx(n.x);
              const cy = yToPx(n.y);
              const isCommand = n.kind === "cmd";
              return (
                <motion.g
                  key={n.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                >
                  <circle cx={cx} cy={cy} r="7" fill={isCommand ? "#e3a857" : "#f6f2e9"} opacity="0.1" />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill={isCommand ? "#e3a857" : "#f6f2e9"}
                    stroke={isCommand ? "#e3a857" : "#f6f2e9"}
                    strokeOpacity={isCommand ? "1" : "0.5"}
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy + 16}
                    textAnchor="middle"
                    fontSize="10.5"
                    fill="rgba(168, 160, 148, 0.95)"
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

        {/* Bottom legend strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--line)] px-5 py-3 font-mono text-[11px] text-[var(--cream-faint)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)]" /> write
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cream)]" /> event
          </span>
          <span className="ml-auto tracking-[-0.005em]">132 kinds · async · attested pre-dispatch</span>
        </div>
      </div>
    </div>
  );
}