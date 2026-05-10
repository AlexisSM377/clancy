"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { Wordmark } from "./components/vinyl/Wordmark";
import { ShelfSVG } from "./components/vinyl/ShelfSVG";
import { VinylCloseSVG } from "./components/vinyl/VinylCloseSVG";
import { TurntableSVG } from "./components/vinyl/TurntableSVG";
import { VinylSVG } from "./components/vinyl/VinylSVG";
import { WaveBars } from "./components/vinyl/WaveBars";

const INK = "#1a1612";
const PAPER = "#f5f0e8";
const PAPER2 = "#ede6d6";
const PAPER3 = "#e4dcc8";
const TEAL = "#4a8a90";

export default function LandingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [vis, setVis] = useState(false);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = () => {
      setAngle(a => a + 0.22);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleCTA = async () => {
    if (session) {
      router.push("/select-artist");
    } else {
      await signIn.social({ provider: "spotify", callbackURL: "/select-artist" });
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: PAPER,
        color: INK,
        fontFamily: "var(--font-body)",
        display: "grid",
        gridTemplate: `
          "nav   nav   nav  " 52px
          "left  main  side " 1fr
          "foot  foot  foot " 44px
          / 38%  1fr   280px
        `,
        opacity: vis ? 1 : 0,
        transition: "opacity 0.5s ease",
        overflow: "hidden",
      }}
    >
      {/* NAV */}
      <nav style={{
        gridArea: "nav",
        borderBottom: `2px solid ${INK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: PAPER,
      }}>
        <Wordmark size={17} dark />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {["Inicio", "Artistas", "Tickets"].map(l => (
            <span key={l} style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: "rgba(26,22,18,0.4)",
            }}>{l}</span>
          ))}
        </div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: 2,
          color: "rgba(26,22,18,0.35)",
          textTransform: "uppercase",
        }}>EST. 2024</span>
      </nav>

      {/* LEFT PHOTO GRID */}
      <div style={{
        gridArea: "left",
        borderRight: `2px solid ${INK}`,
        display: "grid",
        gridTemplate: "1fr 1fr / 1fr 1fr",
        overflow: "hidden",
      }}>
        <div style={{ borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, overflow: "hidden", position: "relative", background: PAPER3 }}>
          <ShelfSVG />
          <div style={{
            position: "absolute", bottom: 8, left: 8,
            background: INK, color: PAPER,
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: 2, padding: "2px 6px",
          }}>CRATE DIGGER</div>
        </div>

        <div style={{ borderBottom: `1px solid ${INK}`, overflow: "hidden", background: "#0d0b09" }}>
          <VinylCloseSVG />
        </div>

        <div style={{ borderRight: `1px solid ${INK}`, overflow: "hidden", background: PAPER2, position: "relative" }}>
          <TurntableSVG vinylAngle={angle} />
          <div style={{
            position: "absolute", top: 8, right: 8,
            width: 10, height: 10, borderRadius: "50%",
            background: TEAL, boxShadow: `0 0 6px ${TEAL}`,
          }} />
        </div>

        <div style={{
          overflow: "hidden", background: INK,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 8, padding: 16,
        }}>
          <VinylSVG size={80} labelColor="#d4824a" />
          <div style={{
            fontFamily: "var(--font-serif)", fontSize: 13, color: PAPER,
            textAlign: "center", lineHeight: 1.1,
          }}>
            FOREVER<br />
            <span style={{ color: "#d4824a", fontStyle: "italic" }}>YOUNG</span>
          </div>
        </div>
      </div>

      {/* MAIN HEADLINE */}
      <div style={{
        gridArea: "main",
        borderRight: `2px solid ${INK}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 48px",
        background: PAPER,
        gap: 20,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 3.5,
          textTransform: "uppercase", color: "rgba(26,22,18,0.4)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 24, height: 1, background: "rgba(26,22,18,0.3)" }} />
          Fan Ticket Generator
        </div>

        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(40px,4.5vw,78px)",
          lineHeight: 0.9,
          letterSpacing: -2,
          color: INK,
          margin: 0,
        }}>
          Tu música.<br />
          <span style={{ color: TEAL, fontStyle: "italic" }}>Tu ticket.</span>
        </h1>

        <p style={{
          fontSize: 14, lineHeight: 1.7, color: "rgba(26,22,18,0.55)",
          maxWidth: 340, marginTop: 4,
        }}>
          Conecta con Spotify, elige tu artista favorito
          y genera tu fan ticket personalizado con tus
          top canciones y álbumes.
        </p>

        <button
          onClick={handleCTA}
          disabled={isPending}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: INK, color: PAPER,
            border: "none", padding: "14px 28px",
            fontSize: 13, fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: "pointer", letterSpacing: 0.3,
            alignSelf: "flex-start",
            marginTop: 8,
            transition: "background 0.15s",
            opacity: isPending ? 0.7 : 1,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = TEAL; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = INK; }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#1db954" />
            <path d="M7 5l8 5-8 5V5z" fill="white" />
          </svg>
          {isPending
            ? "Cargando..."
            : session
              ? "Elegir artista"
              : "Iniciar con Spotify"}
        </button>

        <div style={{
          marginTop: 8,
          display: "flex", alignItems: "center", gap: 12,
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "rgba(26,22,18,0.3)", letterSpacing: 1,
        }}>
          {["10k+ FANS", "ARTISTAS", "GRATIS"].map((t, i) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 && <span>·</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT: TICKET PREVIEW */}
      <div style={{
        gridArea: "side",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
        background: PAPER2,
        gap: 24,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", color: "rgba(26,22,18,0.35)",
        }}>PREVIEW</div>

        {/* Mini ticket preview */}
        <div style={{
          width: 260, height: 150,
          borderRadius: 10,
          background: "linear-gradient(135deg, #1a1612 0%, #2e2820 60%, #241e18 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 0 rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.45)",
          position: "relative",
          overflow: "hidden",
          animation: vis ? "floatTicket 3.5s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 16,
            background: TEAL,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 5, fontWeight: 700,
              color: "#fff", letterSpacing: 2, writingMode: "vertical-rl",
              textTransform: "uppercase", transform: "rotate(180deg)",
            }}>musix</span>
          </div>
          <div style={{ position: "absolute", left: 24, right: 0, top: 0, bottom: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 9, color: "#fff" }}>{session?.user?.name || "Fan"}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 6, color: "rgba(255,255,255,0.4)" }}>May. 2026</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: TEAL, letterSpacing: 1.5 }}>SPOTIFY FAN TICKET</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>Elige tu artista →</div>
          </div>
        </div>

        <VinylSVG size={56} labelColor="#d4824a" spinning />

        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(26,22,18,0.3)",
          textAlign: "center", lineHeight: 1.6, letterSpacing: 0.5,
        }}>
          Personaliza tu ticket<br />con tu artista favorito
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        gridArea: "foot",
        borderTop: `2px solid ${INK}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px",
        background: PAPER,
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 2, color: "rgba(26,22,18,0.35)", textTransform: "uppercase" }}>
          MUSIX RECORDS — FAN TICKET GENERATOR
        </span>
        <WaveBars color={INK} count={16} height={20} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(26,22,18,0.3)", letterSpacing: 1 }}>MAY 2026</span>
      </footer>
    </div>
  );
}
