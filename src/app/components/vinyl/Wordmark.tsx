interface Props {
  size?: number;
  dark?: boolean;
}

export function Wordmark({ size = 18, dark = true }: Props) {
  const c = dark ? "#1a1612" : "#f5f0e8";
  const inner = dark ? "#f5f0e8" : "#1a1612";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size + 4} height={size + 4} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={c} strokeWidth="1.5" />
        <path d="M11 8.5L11 19.5L21 14Z" fill={c} />
        <circle cx="14" cy="14" r="3" fill={inner} />
      </svg>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -0.5,
        color: c,
      }}>
        Musix
      </span>
    </div>
  );
}
