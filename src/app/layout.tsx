import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
// Supports weights 100-800
import '@fontsource-variable/martian-mono';
import "./globals.css";



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
