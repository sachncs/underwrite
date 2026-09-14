export function Footer() {
  const year = new Date().getFullYear();

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
      title: "Resources",
      links: [
        { label: "Full docs", href: "./docs/" },
        { label: "Quickstart", href: "./docs/start/quickstart/" },
        { label: "API reference", href: "./docs/reference/api/" },
        { label: "Architecture decisions", href: "./docs/ADR/" },
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

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-10 pt-20 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-5 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 512 512" width={26} height={26} aria-hidden="true">
                <defs>
                  <linearGradient id="ft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F2A47" />
                    <stop offset="55%" stopColor="#1E5A8A" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <rect width="512" height="512" rx="96" fill="url(#ft)" />
                <g transform="translate(256 268)" fill="none" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M -110 -70 L 0 80 L 110 -70" />
                </g>
                <g transform="translate(256 268)" fill="none" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round">
                  <line x1="0" y1="80" x2="0" y2="120" />
                </g>
                <circle cx="392" cy="124" r="28" fill="#FBBF24" />
                <circle cx="392" cy="124" r="12" fill="#0F2A47" />
              </svg>
              <span className="text-[15px] font-medium tracking-[-0.01em]">Underwrite</span>
            </div>
            <p className="mt-4 max-w-[260px] text-[13.5px] leading-relaxed text-[var(--fg-mute)]">
              Programmable underwriting infrastructure for Indian retail lending. RBI and DPDPA aligned.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--fg-faint)]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-[var(--fg-mute)] transition-colors hover:text-[var(--fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-6 text-[12.5px] text-[var(--fg-faint)] sm:flex-row sm:items-center">
          <p>
            © {year} Underwrite · MIT License · Made in India. Not legal advice — consult a qualified
            attorney before deploying in a regulated environment.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sachncs/underwrite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--fg-mute)]"
            >
              GitHub
            </a>
            <a
              href="https://pypi.org/project/underwrite/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--fg-mute)]"
            >
              PyPI
            </a>
            <a
              href="./docs/"
              className="hover:text-[var(--fg-mute)]"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}