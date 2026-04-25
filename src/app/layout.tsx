import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SessionProvider } from "next-auth/react";
import { ArtistProvider } from "./context/ArtistContext";
// Supports weights 100-800
import "@fontsource-variable/martian-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clancy",
  description: "The Clancy World Tour",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-full">
        <Header />
        <main id="content" className="shrink-0">
          <div>
            <SessionProvider>
              <ArtistProvider>{children}</ArtistProvider>
            </SessionProvider>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
