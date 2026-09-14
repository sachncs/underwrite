import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#architecture", label: "Architecture" },
  { href: "#compliance", label: "Compliance" },
  { href: "#developers", label: "Developers" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:px-6 sm:pt-4"
      id="top"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-full max-w-[1180px] items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 sm:py-2.5 ${
          scrolled
            ? "border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] shadow-[0_1px_0_0_var(--line),0_24px_48px_-24px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center gap-8 pl-1">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-[13.5px] font-medium text-[var(--fg-mute)] transition-colors hover:text-[var(--fg)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 pr-1">
          <a
            href="https://github.com/sachncs/underwrite"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] font-medium text-[var(--fg-mute)] transition-colors hover:text-[var(--fg)] sm:inline-flex"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            Star
          </a>
          <ThemeToggle />
          <a
            href="#cta"
            className="hidden items-center gap-1.5 rounded-full bg-[var(--fg)] px-4 py-1.5 text-[13.5px] font-medium text-[var(--bg)] transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Get started
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--fg-mute)] md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-4 right-4 top-[68px] rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] p-2 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--fg-soft)] hover:bg-[var(--bg-soft)]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="https://github.com/sachncs/underwrite"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--fg-soft)] hover:bg-[var(--bg-soft)]"
              >
                GitHub
              </a>
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--fg)] px-3 py-2.5 text-sm font-medium text-[var(--bg)]"
              >
                Get started
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}