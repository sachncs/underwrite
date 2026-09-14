import { motion } from "framer-motion";

const PARTNERS = [
  "Razorpay",
  "CIBIL",
  "CKYC",
  "Aadhaar",
  "NPCI",
  "UIDAI",
  "Setu",
  "HyperVerge",
  "IDfy",
  "Perfios",
  "Experian",
  "Equifax",
];

export function TrustBand() {
  return (
    <section
      aria-label="Integrations"
      className="relative border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--ink-1)_40%,transparent)] py-10"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
        <div className="mb-7 flex flex-col items-center gap-2 text-center sm:grid sm:grid-cols-[1fr_auto] sm:text-left">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--cream-faint)]">
            Plugs into the Indian lending stack
          </p>
          <p className="font-mono text-[11px] tracking-[-0.005em] text-[var(--cream-mute)]">
            4 KYC providers · 3 credit bureaus · 1 payments rail
          </p>
        </div>

        <div className="relative mask-fade-r overflow-hidden">
          <motion.div
            className="flex w-max items-center gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 50, ease: "linear", repeat: Infinity }}
          >
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-[24px] font-normal tracking-[-0.02em] text-[var(--cream-faint)] transition-colors hover:text-[var(--cream-mute)]"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}