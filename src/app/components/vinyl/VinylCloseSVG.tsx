export function VinylCloseSVG() {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="320" height="200" fill="#0d0b09" />
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse
          key={i}
          cx="160" cy="260"
          rx={180 + i * 14} ry={80 + i * 6}
          fill="none"
          stroke={i % 3 === 0 ? "#4a8a90" : "#c8924a"}
          strokeWidth="0.4"
          opacity={0.08 + i * 0.012}
        />
      ))}
      <ellipse cx="160" cy="180" rx="60" ry="30" fill="#d4824a" opacity="0.25" />
      <ellipse cx="160" cy="200" rx="40" ry="20" fill="#c8924a" opacity="0.2" />
      <path d="M40,60 Q160,40 280,80" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
      <path d="M60,80 Q160,55 260,90" stroke="#4a8a90" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  );
}
