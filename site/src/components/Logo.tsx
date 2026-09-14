export function Logo({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="relative inline-flex items-center justify-center overflow-hidden rounded-[7px]"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 512 512" width={size} height={size} role="img" aria-label="Underwrite mark">
          <defs>
            <linearGradient id="uwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F2A47" />
              <stop offset="55%" stopColor="#1E5A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="uwAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="96" fill="url(#uwGrad)" />
          <g
            transform="translate(256 268)"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M -110 -70 L 0 80 L 110 -70" />
          </g>
          <g
            transform="translate(256 268)"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="22"
            strokeLinecap="round"
          >
            <line x1="0" y1="80" x2="0" y2="120" />
          </g>
          <circle cx="392" cy="124" r="28" fill="url(#uwAccent)" />
          <circle cx="392" cy="124" r="12" fill="#0F2A47" />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-[15px] font-medium tracking-[-0.01em] text-[var(--fg)]">
          Underwrite
        </span>
      )}
    </a>
  );
}