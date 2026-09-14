import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#architecture", label: "Architecture" },
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
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6"
      id="top"
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-full max-w-[1240px] items-center justify-between rounded-full border px-2 py-2 transition-all duration-500 sm:px-3 ${
          scrolled
            ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_78%,transparent)] shadow-[0_1px_0_0_var(--line),0_20px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center gap-10 pl-1.5">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-[13.5px] font-normal text-[var(--cream-mute)] transition-colors hover:text-[var(--cream)]"
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
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[var(--cream-mute)] transition-colors hover:text-[var(--cream)] sm:inline-flex"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <ThemeToggle />
          <a
            href="#cta"
            className="hidden items-center gap-1.5 rounded-full bg-[var(--cream)] px-4 py-2 text-[13.5px] font-medium tracking-[-0.01em] text-[var(--ink)] transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Install
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--cream-mute)] md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 17h16" />}
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
            className="absolute left-4 right-4 top-[68px] rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_90%,transparent)] p-2 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-normal text-[var(--cream-soft)] hover:bg-[var(--ink-2)]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--cream)] px-3 py-2.5 text-sm font-medium text-[var(--ink)]"
              >
                Install Underwrite
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}