export function ShelfSVG() {
  const spines = [
    { c: "#b83a20", t: "VESSEL" },
    { c: "#1a1612", t: "BLUR" },
    { c: "#c8924a", t: "TRENCH" },
    { c: "#4a8a90", t: "S&I" },
    { c: "#7a5a8a", t: "CLANCY" },
    { c: "#3a6a5a", t: "AM" },
    { c: "#8a5a3a", t: "CURRENTS" },
    { c: "#b06040", t: "TRANQ" },
  ];
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="320" height="200" fill="#c8924a" opacity="0.3" />
      <rect x="0" y="160" width="320" height="40" fill="#8a5020" opacity="0.5" />
      <rect x="0" y="155" width="320" height="5" fill="#5a3010" opacity="0.4" />
      {spines.map((s, i) => (
        <g key={i} transform={`translate(${8 + i * 38},20)`}>
          <rect width="32" height="135" rx="1" fill={s.c} opacity="0.9" />
          <rect x="3" y="3" width="26" height="129" rx="1" fill={s.c} opacity="0.6" />
          <rect x="6" y="12" width="20" height="2" fill="rgba(255,255,255,0.25)" />
          <text x="16" y="80" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="serif" transform="rotate(-90,16,80)">{s.t}</text>
        </g>
      ))}
    </svg>
  );
}
