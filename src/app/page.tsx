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
import Ticket from "./components/Ticket";
import { Container3D } from "./components/Container3D";
import { getTopArtists, getTopTracks } from "./lib/service";

const FALLBACK_TRACK = {
  id: "fallback-track",
  track: "Top Track",
  album: "Top Album",
  albumId: "fallback-album",
  icon: "/1.png",
  colorPalette: {
    bg: "bg-[#007acc]/50",
    borders: { outside: "border-blue-300/20", inside: "border-blue-400/10" },
    shadowColor: "shadow-blue-400/25",
  },
};

const FALLBACK_ARTIST = {
  name: "Tu Artista Favorito",
  hashtag: "#tuartista",
  url: "https://open.spotify.com",
  eventName: "Spotify Fan Ticket",
};

const PALETTES = [
  { bg: "bg-[#D62420]/65", borders: { outside: "border-red-300/20", inside: "border-red-400/10" }, shadowColor: "shadow-red-200/15" },
  { bg: "bg-[#007acc]/50", borders: { inside: "border-blue-300/20", outside: "border-blue-400/10" }, shadowColor: "shadow-blue-400/25" },
  { bg: "bg-[#00ADD8]/50", borders: { inside: "border-cyan-300/20", outside: "border-cyan-400/10" }, shadowColor: "shadow-cyan-400/20" },
  { bg: "bg-[#FFD800]/50", borders: { outside: "border-yellow-300/20", inside: "border-yellow-400/10" }, shadowColor: "shadow-yellow-200/15" },
  { bg: "bg-[#1f2937]/65", borders: { outside: "border-slate-300/20", inside: "border-slate-400/10" }, shadowColor: "shadow-slate-400/25" },
  { bg: "bg-[#4f46e5]/55", borders: { outside: "border-indigo-300/20", inside: "border-indigo-400/10" }, shadowColor: "shadow-indigo-300/20" },
];

const getPaletteFromSeed = (seed: string) => {
  const total = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTES[total % PALETTES.length];
};

const toHashtag = (value: string) => {
  const normalized = value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
  return `#${normalized || "spotifyartist"}`;
};

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
  const [previewTrack, setPreviewTrack] = useState(FALLBACK_TRACK);
  const [previewArtist, setPreviewArtist] = useState(FALLBACK_ARTIST);

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

  useEffect(() => {
    if (!session) return;
    Promise.all([
      getTopTracks(1, "short_term"),
      getTopArtists(1, "medium_term"),
    ]).then(([tracksRes, artistsRes]) => {
      const track = tracksRes.items[0];
      const artist = artistsRes.items[0];
      if (track) {
        setPreviewTrack({
          id: track.id,
          track: track.name,
          album: track.album.name,
          albumId: track.album.id,
          icon: track.album.images?.[0]?.url || "/1.png",
          colorPalette: getPaletteFromSeed(track.album.id || track.id),
        });
      }
      if (artist) {
        setPreviewArtist({
          name: artist.name,
          hashtag: toHashtag(artist.name),
          url: artist.external_urls?.spotify || "https://open.spotify.com",
          eventName: "Spotify Fan Ticket",
        });
      }
    }).catch(() => {});
  }, [session]);

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
          / 38%  1fr   380px
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

      {/* MAIN: TICKET PREVIEW */}
      <div style={{
        gridArea: "main",
        borderRight: `2px solid ${INK}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 40px",
        background: PAPER,
        gap: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", color: "rgba(26,22,18,0.35)",
          alignSelf: "flex-start",
        }}>PREVIEW</div>

        <div style={{ width: "100%", maxWidth: 620 }}>
          <Container3D>
            <Ticket
              isSizeFixed
              transition={false}
              track={previewTrack}
              user={{
                username: session?.user?.name || "Fan",
                avatar: session?.user?.image ?? undefined,
              }}
              artist={previewArtist}
            />
          </Container3D>
        </div>

        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(26,22,18,0.3)",
          letterSpacing: 1.5, textTransform: "uppercase", alignSelf: "flex-start",
        }}>
          Mueve el mouse sobre el ticket
        </div>
      </div>

      {/* SIDE: HEADLINE + CTA */}
      <div style={{
        gridArea: "side",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 32px",
        background: PAPER2,
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
          fontSize: "clamp(32px,3vw,54px)",
          lineHeight: 0.9,
          letterSpacing: -2,
          color: INK,
          margin: 0,
        }}>
          Tu música.<br />
          <span style={{ color: TEAL, fontStyle: "italic" }}>Tu ticket.</span>
        </h1>

        <p style={{
          fontSize: 13, lineHeight: 1.7, color: "rgba(26,22,18,0.55)", marginTop: 4,
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
