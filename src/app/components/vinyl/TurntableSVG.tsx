interface Props {
  vinylAngle?: number;
}

export function TurntableSVG({ vinylAngle = 0 }: Props) {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="320" height="200" fill="#e8e0cc" />
      <rect x="20" y="30" width="280" height="150" rx="6" fill="#c8924a" opacity="0.6" />
      <rect x="25" y="35" width="270" height="140" rx="4" fill="#d4a870" opacity="0.4" />
      <g transform={`rotate(${vinylAngle},100,110)`}>
        <circle cx="100" cy="110" r="68" fill="#1a1612" />
        {[58, 48, 38, 28, 18].map(r => (
          <circle key={r} cx="100" cy="110" r={r} fill="none" stroke="#2e2820" strokeWidth="0.7" />
        ))}
        <circle cx="100" cy="110" r="18" fill="#d4824a" />
        <circle cx="100" cy="110" r="3" fill="#1a1612" />
      </g>
      <circle cx="240" cy="55" r="10" fill="#888" />
      <line x1="240" y1="55" x2="115" y2="105" stroke="#777" strokeWidth="3" strokeLinecap="round" />
      <circle cx="113" cy="106" r="5" fill="#555" />
      <circle cx="220" cy="150" r="10" fill="#4a8a90" opacity="0.9" />
      <circle cx="248" cy="150" r="7" fill="#888" />
      <circle cx="270" cy="150" r="7" fill="#aaa" />
      <rect x="200" y="40" width="90" height="20" rx="2" fill="#4a8a90" opacity="0.8" />
      <text x="245" y="54" textAnchor="middle" fill="white" fontSize="8" fontFamily="serif" fontWeight="bold">MUSIX</text>
    </svg>
  );
}
