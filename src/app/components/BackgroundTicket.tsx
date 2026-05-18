/* eslint-disable @next/next/no-img-element */
interface Props {
  children: React.ReactNode;
  artistImage?: string;
}
export const BackgroundTicket = ({ children, artistImage }: Props) => {
  const src = artistImage || "/bg-ticket.jpg";
  return (
    <div className="relative h-full overflow-hidden">
      <img
        src={src}
        alt="background"
        className="absolute w-full h-full object-cover transition-all duration-700"
        style={{
          filter: artistImage ? "blur(10px) brightness(0.82)" : "none",
          transform: artistImage ? "scale(1.12)" : "none",
        }}
      />
      {artistImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      )}
      <div className="relative z-50">{children}</div>
    </div>
  );
};
