import type { Metadata } from "next";
import { ArtistProvider } from "./context/ArtistContext";
import { Space_Grotesk, Space_Mono, DM_Serif_Display } from "next/font/google";
import "@fontsource-variable/martian-mono";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Musix — Fan Ticket",
  description: "Tu música, tu ticket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${spaceMono.variable} ${dmSerif.variable}`}>
      <body className="h-screen overflow-hidden">
        <ArtistProvider>{children}</ArtistProvider>
      </body>
    </html>
  );
}
