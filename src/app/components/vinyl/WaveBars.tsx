interface Props {
  color?: string;
  count?: number;
  height?: number;
}

export function WaveBars({ color = "#1a1612", count = 20, height = 32 }: Props) {
  const anims = ["bar1", "bar2", "bar3", "bar4", "bar5"];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 1,
            background: color,
            opacity: 0.3 + (i % 3) * 0.2,
            animation: `${anims[i % 5]} ${0.7 + (i % 4) * 0.18}s ease-in-out infinite`,
            animationDelay: `${(i * 0.06) % 0.7}s`,
            height: 6 + (i % 5) * 5,
          }}
        />
      ))}
    </div>
  );
}
