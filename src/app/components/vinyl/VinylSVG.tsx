"use client";
import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  labelColor?: string;
  spinning?: boolean;
  style?: React.CSSProperties;
}

export function VinylSVG({ size = 120, labelColor = "#d4824a", spinning = false, style = {} }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ang = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!spinning) return;
    const tick = () => {
      ang.current += 0.25;
      if (ref.current) ref.current.style.transform = `rotate(${ang.current}deg)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [spinning]);

  return (
    <div ref={ref} style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, ...style }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="59" fill="#1a1612" />
        {[52, 44, 36, 28, 20].map(r => (
          <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="#2e2820" strokeWidth="0.6" />
        ))}
        <circle cx="60" cy="60" r="16" fill={labelColor} />
        <circle cx="60" cy="60" r="13" fill={labelColor} opacity="0.85" />
        <text x="60" y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="4" fontFamily="serif">MUSIX</text>
        <text x="60" y="64" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="3" fontFamily="serif">RECORDS</text>
        <circle cx="60" cy="60" r="2.5" fill="#1a1612" />
        <path d="M20,60 A40,40 0 0,1 100,60" stroke={labelColor} strokeWidth="0.3" fill="none" opacity="0.15" />
      </svg>
    </div>
  );
}
