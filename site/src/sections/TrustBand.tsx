import { motion } from "framer-motion";

const PARTNERS = [
  "Razorpay",
  "CIBIL",
  "CKYC",
  "Aadhaar",
  "NPCI",
  "UIDAI",
  "Setu",
  "Sarvam",
  "HyperVerge",
  "IDfy",
  "Onfido",
  "Perfios",
];

export function TrustBand() {
  return (
    <section
      aria-label="Trusted integrations"
      className="relative border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elev)_30%,transparent)] py-10"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div className="mb-7 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[12.5px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            Built to plug into the Indian lending stack
          </p>
          <p className="text-[12.5px] text-[var(--fg-mute)]">
            4 KYC providers · 1 payment gateway · 3 credit bureaus
          </p>
        </div>

        <div className="relative mask-fade-r overflow-hidden">
          <motion.div
            className="flex w-max gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex h-9 items-center font-serif-display text-[26px] tracking-[-0.01em] text-[var(--fg-faint)] transition-colors hover:text-[var(--fg-mute)]"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}