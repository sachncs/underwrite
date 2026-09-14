import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../lib/motion";

type Tab = "core" | "command" | "event" | "config";

const TABS: Array<{ id: Tab; label: string; filename: string; code: string }> = [
  {
    id: "core",
    label: "Define a service",
    filename: "underwrite/services/mechanism.py",
    code: `from underwrite import Core, Type

class Mechanism(Core):
    """Loan lifecycle state machine."""

    def handle(self, event):
        match event.type:
            case Type.LOAN_APPLICATION_RECEIVED:
                return [self.emit(Type.KYC_CHECK, payload=event.payload)]
            case Type.CONSENT_RECORDED if self.verified(event):
                return [self.emit(Type.LOAN_ORIGINATED, payload=event.payload)]
            case _:
                return []
`,
  },
  {
    id: "command",
    label: "Send a command",
    filename: "docs/examples/indian_lending.py",
    code: `import asyncio
from underwrite import bus, Type

async def originate_loan():
    await bus.publish(Type.LOAN_APPLICATION_RECEIVED, {
        "loan_id":     "LN-49812",
        "applicant":   {"pan": "ABCDE1234F", "aadhaar": "****1234"},
        "amount_inr":  250_000,
        "tenure_days": 730,
    })

asyncio.run(originate_loan())
`,
  },
  {
    id: "event",
    label: "Subscribe to events",
    filename: "app.py",
    code: `from underwrite import bus, Type

@bus.subscribe(Type.LOAN_ORIGINATED)
async def on_originated(event):
    print(f"originated {event.data['loan_id']}")
    print(f"signature   {event.signature[:24]}…")
    print(f"key         {event.public_key[:24]}…")
`,
  },
  {
    id: "config",
    label: "Configure",
    filename: "underwrite.json",
    code: `{
  "store":  { "backend": "sqlite", "path": "./store.db" },
  "pricing": {
    "personal_loan_rate_cap": 0.28,
    "penal_interest_cap":     0.24,
    "kfs_cooling_off_hours":  72
  },
  "consent": { "retention_days": 365, "auto_purge": true },
  "observability": { "otlp_endpoint": "http://collector:4317" }
}
`,
  },
];

export function Developers() {
  const [active, setActive] = useState<Tab>("core");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section
      id="developers"
      aria-labelledby="dev-title"
      className="relative py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                <span className="mr-2 inline-block h-px w-8 align-middle bg-[var(--line-strong)]" />
                Developer experience
              </p>
              <h2
                id="dev-title"
                className="mt-5 text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--fg)] sm:text-[44px] md:text-[52px]"
              >
                Small surface.{" "}
                <span className="font-serif-display">Deep reach.</span>
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--fg-mute)]">
                One base class. One event bus. One envelope. The whole platform is reachable
                through a typed, discoverable Python API — and observable end-to-end through
                OTLP and Prometheus.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Python ≥ 3.10, fully typed (mypy strict)",
                  "One CLI: init, run, list, identity, health, dlq, metrics, migrate, serve",
                  "FastAPI daemon at /v1/{publish,health,metrics}",
                  "OTLP tracing + Prometheus metrics out of the box",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[14.5px] text-[var(--fg-soft)]"
                  >
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal-500)]" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href="./docs/start/install/"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fg)] px-4 py-2 text-[13px] font-medium text-[var(--bg)]"
                >
                  Install guide
                </a>
                <a
                  href="./docs/start/quickstart/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-4 py-2 text-[13px] font-medium text-[var(--fg)] hover:border-[var(--fg-faint)]"
                >
                  Quickstart
                </a>
                <a
                  href="./docs/reference/api/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-4 py-2 text-[13px] font-medium text-[var(--fg)] hover:border-[var(--fg-faint)]"
                >
                  API reference
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.1}>
              <CodeCard tab={tab} setActive={setActive} />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeCard({
  tab,
  setActive,
}: {
  tab: (typeof TABS)[number];
  setActive: (t: Tab) => void;
}) {
  const active = tab.id;
  return (
    <div className="ring-inset-soft overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_60%,transparent)] px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="hidden font-mono text-[11px] text-[var(--fg-faint)] sm:inline">
          {tab.filename}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-[var(--fg-faint)]">
          <span className="hidden sm:inline">python · typed</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_50%,transparent)] px-2 py-2 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              active === t.id
                ? "text-[var(--fg)]"
                : "text-[var(--fg-faint)] hover:text-[var(--fg-mute)]"
            }`}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="dev-tab-bg"
                className="absolute inset-0 -z-10 rounded-md bg-[color-mix(in_srgb,var(--bg-soft)_85%,transparent)] ring-1 ring-[var(--line)]"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 p-4 font-mono text-[12.5px] leading-relaxed sm:p-6 sm:text-[13px]">
        <div className="select-none text-right text-[var(--fg-faint)]">
          {tab.code.split("\n").map((_, i) => (
            <div key={i}>{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.pre
            key={tab.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-x-auto whitespace-pre text-[var(--fg-soft)]"
          >
            {highlight(tab.code)}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}

function highlight(code: string): React.ReactNode {
  const lines = code.split("\n");
  return lines.map((line, idx) => {
    const tokens = tokenize(line);
    return (
      <div key={idx}>
        {tokens.map((t, i) => (
          <span key={i} className={t.cls}>
            {t.text}
          </span>
        ))}
        {idx < lines.length - 1 ? "\n" : ""}
      </div>
    );
  });
}

type Tok = { text: string; cls?: string };
function tokenize(line: string): Tok[] {
  const keywords = new Set([
    "from",
    "import",
    "async",
    "def",
    "return",
    "class",
    "match",
    "case",
    "if",
    "else",
    "in",
    "for",
    "while",
    "with",
    "as",
    "True",
    "False",
    "None",
    "await",
  ]);
  const types = new Set([
    "Mechanism",
    "Core",
    "Type",
    "bus",
    "asyncio",
  ]);
  const out: Tok[] = [];
  let i = 0;
  let buf = "";
  const flush = (cls?: string) => {
    if (!buf) return;
    out.push({ text: buf, cls });
    buf = "";
  };

  while (i < line.length) {
    const c = line[i];
    if (c === "#") {
      flush();
      out.push({ text: line.slice(i), cls: "text-[var(--fg-faint)] italic" });
      break;
    }
    if (c === '"' || c === "'") {
      flush();
      const quote = c;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) j++;
      out.push({ text: line.slice(i, j + 1), cls: "text-[#86efac]" });
      i = j + 1;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      flush();
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let cls: string | undefined;
      if (keywords.has(word)) cls = "text-[#c4b5fd]";
      else if (types.has(word)) cls = "text-[#fbbf24]";
      else if (/^[A-Z][A-Z0-9_]+$/.test(word)) cls = "text-[#fda4af]";
      else if (/^[A-Z]/.test(word)) cls = "text-[#93c5fd]";
      out.push({ text: word, cls });
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      flush();
      let j = i;
      while (j < line.length && /[0-9._]/.test(line[j])) j++;
      out.push({ text: line.slice(i, j), cls: "text-[#fcd34d]" });
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}