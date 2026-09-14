type Props = {
  size?: number;
  withWordmark?: boolean;
  variant?: "default" | "amber";
};

export function Logo({ size = 28, withWordmark = true, variant = "default" }: Props) {
  const strokeColor = variant === "amber" ? "var(--amber)" : "#f6f2e9";
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="relative inline-flex items-center justify-center overflow-hidden rounded-[7px]"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 512 512" width={size} height={size} role="img" aria-label="Underwrite mark">
          <rect width="512" height="512" rx="96" fill="#16171b" />
          <rect x="3" y="3" width="506" height="506" rx="94" fill="none" stroke="rgba(246,242,233,0.08)" strokeWidth="2" />
          <g
            transform="translate(256 268)"
            fill="none"
            stroke={strokeColor}
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M -110 -70 L 0 80 L 110 -70" />
          </g>
          <g
            transform="translate(256 268)"
            fill="none"
            stroke={strokeColor}
            strokeWidth="22"
            strokeLinecap="round"
          >
            <line x1="0" y1="80" x2="0" y2="120" />
          </g>
          <circle cx="392" cy="124" r="28" fill="#e3a857" />
          <circle cx="392" cy="124" r="12" fill="#16171b" />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-[15px] font-medium tracking-[-0.01em] text-[var(--cream)]">
          Underwrite
        </span>
      )}
    </a>
  );
}