import { Logo } from "./Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "#platform" },
      { label: "Architecture", href: "#architecture" },
      { label: "Compliance", href: "#compliance" },
      { label: "Developers", href: "#developers" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Quickstart", href: "./docs/start/quickstart/" },
      { label: "Install", href: "./docs/start/install/" },
      { label: "API reference", href: "./docs/reference/api/" },
      { label: "ADR", href: "./docs/ADR/" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/sachncs/underwrite" },
      { label: "Changelog", href: "https://github.com/sachncs/underwrite/blob/master/CHANGELOG.md" },
      { label: "Roadmap", href: "./docs/project/roadmap/" },
      { label: "Security", href: "https://github.com/sachncs/underwrite/blob/master/SECURITY.md" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Contributing", href: "https://github.com/sachncs/underwrite/blob/master/CONTRIBUTING.md" },
      { label: "Code of conduct", href: "https://github.com/sachncs/underwrite/blob/master/CODE_OF_CONDUCT.md" },
      { label: "Issues", href: "https://github.com/sachncs/underwrite/issues" },
      { label: "Discussions", href: "https://github.com/sachncs/underwrite/discussions" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--ink)]">
      <div className="mx-auto w-full max-w-[1240px] px-6 pb-10 pt-24 sm:px-10">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-5 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-5 max-w-[260px] text-[13.5px] leading-[1.65] text-[var(--cream-mute)]">
              Programmable underwriting infrastructure for Indian retail lending. RBI and DPDPA aligned.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--cream-faint)]">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-[var(--cream-mute)] transition-colors hover:text-[var(--cream)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-6 font-mono text-[11px] tracking-[-0.005em] text-[var(--cream-faint)] sm:flex-row sm:items-center">
          <p>
            © {year} Underwrite · MIT License · Made in India
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/sachncs/underwrite"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--cream-mute)]"
            >
              GitHub
            </a>
            <a
              href="./docs/"
              className="transition-colors hover:text-[var(--cream-mute)]"
            >
              Docs
            </a>
            <a
              href="#cta"
              className="transition-colors hover:text-[var(--cream-mute)]"
            >
              Install →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}