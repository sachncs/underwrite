import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Metric = {
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  formatter?: (n: number) => string;
  delta?: string;
  trend?: "up" | "down" | "flat";
};

const METRICS: Metric[] = [
  {
    label: "Events signed today",
    value: 1_842_391,
    formatter: (n) => n.toLocaleString("en-IN"),
    delta: "+12.4%",
    trend: "up",
  },
  {
    label: "Median loan decision",
    value: 312,
    unit: "ms",
    delta: "p95 stable",
    trend: "flat",
  },
  {
    label: "Loans originated",
    value: 48_127,
    formatter: (n) => n.toLocaleString("en-IN"),
    delta: "+8.2%",
    trend: "up",
  },
  {
    label: "Compliance attestations",
    value: 100,
    unit: "%",
    delta: "Ed25519",
    trend: "flat",
  },
];

function format(m: Metric) {
  const formatted = m.formatter ? m.formatter(m.value) : m.value.toLocaleString("en-IN");
  return `${m.prefix ?? ""}${formatted}${m.unit ?? ""}`;
}

export function LiveMetrics() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1_000_000), 1800);
    return () => clearInterval(id);
  }, []);

  const live = METRICS.map((m, i) => {
    if (m.unit === "%" || m.unit === "ms") return m;
    const variance = Math.sin((tick + i * 7) / 3) * Math.max(2, m.value * 0.0008);
    return { ...m, value: Math.max(0, Math.round(m.value + variance)) };
  });

  return (
    <section
      aria-label="Live platform metrics"
      className="relative border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_45%,transparent)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 mask-radial"
      />
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-2 divide-x divide-[var(--line)] md:grid-cols-4">
          {live.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2 py-7 sm:py-9 first:pl-0 px-5 first:pl-0 last:pr-0"
            >
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#34d399] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                  {m.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[28px] font-light tracking-[-0.035em] text-[var(--fg)] sm:text-[34px]">
                  {format(m)}
                </span>
                {m.delta && (
                  <span
                    className={`font-mono text-[11.5px] tracking-[-0.01em] ${
                      m.trend === "up"
                        ? "text-[#34d399]"
                        : m.trend === "down"
                          ? "text-[#fbbf24]"
                          : "text-[var(--fg-faint)]"
                    }`}
                  >
                    {m.delta}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}