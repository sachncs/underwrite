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
    label: "Subscribe",
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
      className="relative py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-8 bg-[var(--amber)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">
                  Developer experience
                </span>
              </div>
              <h2
                id="dev-title"
                className="mt-6 text-balance font-display text-[40px] font-normal leading-[1.04] tracking-[-0.04em] text-[var(--cream)] sm:text-[56px] lg:text-[60px]"
              >
                Small surface.
                <br />
                <span className="text-[var(--cream-mute)]">Deep reach.</span>
              </h2>
              <p className="mt-6 text-[15px] leading-[1.65] text-[var(--cream-mute)]">
                One base class. One event bus. One envelope. The whole platform is reachable
                through a typed, discoverable Python API — and observable end-to-end through
                OTLP and Prometheus.
              </p>
              <ul className="mt-8 flex flex-col gap-3.5">
                {[
                  "Python ≥ 3.10, fully typed (mypy strict)",
                  "One CLI: init, run, list, identity, health, dlq, metrics, migrate, serve",
                  "FastAPI daemon at /v1/{publish, health, metrics}",
                  "OTLP tracing + Prometheus metrics out of the box",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[13.5px] text-[var(--cream-soft)]"
                  >
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-2">
                <a
                  href="./docs/start/install/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-transparent px-4 py-2 text-[13px] font-normal tracking-[-0.005em] text-[var(--cream-soft)] transition-colors hover:border-[var(--cream-faint)] hover:text-[var(--cream)]"
                >
                  Install guide
                </a>
                <a
                  href="./docs/start/quickstart/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-transparent px-4 py-2 text-[13px] font-normal tracking-[-0.005em] text-[var(--cream-soft)] transition-colors hover:border-[var(--cream-faint)] hover:text-[var(--cream)]"
                >
                  Quickstart
                </a>
                <a
                  href="./docs/reference/api/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-transparent px-4 py-2 text-[13px] font-normal tracking-[-0.005em] text-[var(--cream-soft)] transition-colors hover:border-[var(--cream-faint)] hover:text-[var(--cream)]"
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
    <div className="ring-inset-soft overflow-hidden rounded-[18px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_92%,transparent)] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[11.5px] tracking-[-0.005em] text-[var(--cream-mute)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink-4)]" />
          {tab.filename}
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--cream-faint)]">
          python · typed
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[var(--line)] px-2 py-2 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-[12.5px] font-normal tracking-[-0.005em] transition-colors ${
              active === t.id
                ? "text-[var(--cream)]"
                : "text-[var(--cream-faint)] hover:text-[var(--cream-mute)]"
            }`}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="dev-tab-bg"
                className="absolute inset-0 -z-10 rounded-md bg-[color-mix(in_srgb,var(--ink-3)_90%,transparent)]"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 p-5 font-mono text-[12.5px] leading-[1.7] sm:p-7 sm:text-[13px]">
        <div className="select-none text-right text-[var(--cream-faint)]">
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
            className="overflow-x-auto whitespace-pre text-[var(--cream-soft)]"
          >
            {highlight(tab.code)}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}

type Tok = { text: string; cls?: string };
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
  const types = new Set(["Mechanism", "Core", "Type", "bus", "asyncio"]);
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
      out.push({ text: line.slice(i), cls: "text-[var(--cream-faint)] italic" });
      break;
    }
    if (c === '"' || c === "'") {
      flush();
      const quote = c;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) j++;
      out.push({ text: line.slice(i, j + 1), cls: "text-[#9bc985]" });
      i = j + 1;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      flush();
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let cls: string | undefined;
      if (keywords.has(word)) cls = "text-[#c5b9e8]";
      else if (types.has(word)) cls = "text-[var(--amber)]";
      else if (/^[A-Z][A-Z0-9_]+$/.test(word)) cls = "text-[#e6a89a]";
      else if (/^[A-Z]/.test(word)) cls = "text-[var(--cream-soft)]";
      out.push({ text: word, cls });
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      flush();
      let j = i;
      while (j < line.length && /[0-9._]/.test(line[j])) j++;
      out.push({ text: line.slice(i, j), cls: "text-[#dcd2b8]" });
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}