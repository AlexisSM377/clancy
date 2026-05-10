"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, useSession } from "@/lib/auth-client";
import { useSelectedArtist } from "@/app/hooks/useSelectedArtist";
import { getTopArtists, search } from "@/app/lib/service";
import { Wordmark } from "@/app/components/vinyl/Wordmark";
import { VinylSVG } from "@/app/components/vinyl/VinylSVG";

const INK = "#1a1612";
const PAPER = "#f5f0e8";
const PAPER2 = "#ede6d6";
const PAPER3 = "#e4dcc8";
const TEAL = "#4a8a90";

type SpotifyArtist = {
  id: string;
  name: string;
  followers?: { total?: number };
  genres?: string[];
  images?: Array<{ url: string }>;
  external_urls?: { spotify?: string };
};

const mapArtist = (a: SpotifyArtist) => ({
  id: a.id,
  name: a.name,
  image: a.images?.[0]?.url,
  followers: a.followers?.total,
  genres: a.genres,
  externalUrl: a.external_urls?.spotify,
});

export default function SelectArtistPage() {
  const { data: session, isPending } = useSession();
  const { selectedArtist, selectArtist, isHydrated } = useSelectedArtist();
  const router = useRouter();

  const [search_q, setSearchQ] = useState("");
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Spinning vinyl
  useEffect(() => {
    const tick = () => {
      setAngle(a => a + 0.2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Search debounce
  useEffect(() => {
    if (search_q.trim().length < 2) { setResults([]); return; }
    const id = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await search(search_q, "artist", 10) as { artists?: { items?: SpotifyArtist[] } };
        setResults(res?.artists?.items ?? []);
      } catch {
        setError("No pudimos buscar artistas.");
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => window.clearTimeout(id);
  }, [search_q]);

  const handleSelect = useCallback((artist: SpotifyArtist) => {
    selectArtist(mapArtist(artist));
    router.push("/ticket");
  }, [selectArtist, router]);

  const handleTopArtist = useCallback(async () => {
    try {
      setIsLoadingTop(true);
      setError(null);
      const top = await getTopArtists(1, "medium_term");
      const first = top?.items?.[0] as SpotifyArtist | undefined;
      if (!first) { setError("No encontramos artistas en tu historial."); return; }
      handleSelect(first);
    } catch {
      setError("No pudimos cargar tu artista principal.");
    } finally {
      setIsLoadingTop(false);
    }
  }, [handleSelect]);

  if (isPending || !isHydrated) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(26,22,18,0.4)", letterSpacing: 2 }}>CARGANDO...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: PAPER,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 40, color: INK, margin: 0 }}>
          Conecta <span style={{ color: TEAL, fontStyle: "italic" }}>Spotify</span>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(26,22,18,0.55)", maxWidth: 320, textAlign: "center", lineHeight: 1.7 }}>
          Para elegir artistas y personalizar tu ticket necesitas iniciar sesión.
        </p>
        <button
          onClick={() => signIn.social({ provider: "spotify", callbackURL: "/select-artist" })}
          style={{
            background: INK, color: PAPER, border: "none",
            padding: "14px 28px", fontSize: 13, fontWeight: 700,
            fontFamily: "var(--font-body)", cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = TEAL; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = INK; }}
        >
          Iniciar con Spotify
        </button>
      </div>
    );
  }

  const displayList = results.length > 0 ? results : [];

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: PAPER,
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-body)",
      color: INK,
      overflow: "hidden",
    }}>
      {/* NAV */}
      <nav style={{
        height: 52, borderBottom: `2px solid ${INK}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", flexShrink: 0, background: PAPER,
      }}>
        <Wordmark size={17} dark />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: INK, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: PAPER,
          }}>{(session.user?.name || "F")[0].toUpperCase()}</div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, color: "rgba(26,22,18,0.4)" }}>
            {session.user?.name}
          </span>
        </div>
      </nav>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{
          width: 260, flexShrink: 0,
          borderRight: `2px solid ${INK}`,
          display: "flex", flexDirection: "column",
          background: PAPER2,
        }}>
          <div style={{ borderBottom: `2px solid ${INK}`, padding: "28px 24px" }}>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 34, lineHeight: 1, letterSpacing: -1, color: INK, margin: 0,
            }}>
              Elige tu<br />
              <span style={{ color: TEAL, fontStyle: "italic" }}>artista.</span>
            </h2>
            <p style={{
              marginTop: 10, fontFamily: "var(--font-mono)",
              fontSize: 9, letterSpacing: 2.5,
              color: "rgba(26,22,18,0.4)", textTransform: "uppercase", lineHeight: 1.6,
            }}>
              ELIGE UN ARTISTA PARA<br />CREAR TU FAN TICKET
            </p>
          </div>

          {/* Search */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid rgba(26,22,18,0.15)` }}>
            <div style={{ position: "relative" }}>
              <input
                value={search_q}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Buscar artista..."
                style={{
                  width: "100%",
                  background: PAPER,
                  border: `2px solid ${INK}`,
                  borderRadius: 0,
                  padding: "9px 12px 9px 34px",
                  color: INK, fontSize: 13,
                  fontFamily: "var(--font-body)", outline: "none",
                  transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = TEAL; }}
                onBlur={e => { e.target.style.borderColor = INK; }}
              />
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(26,22,18,0.4)" }}>♪</span>
            </div>
            <button
              onClick={handleTopArtist}
              disabled={isLoadingTop}
              style={{
                marginTop: 8, width: "100%",
                background: INK, color: PAPER,
                border: "none", padding: "8px",
                fontSize: 11, fontWeight: 700,
                fontFamily: "var(--font-mono)", cursor: "pointer",
                letterSpacing: 1.5, textTransform: "uppercase",
                opacity: isLoadingTop ? 0.6 : 1,
                transition: "background 0.15s",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => { if (!isLoadingTop) (e.currentTarget as HTMLButtonElement).style.background = TEAL; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = INK; }}
            >
              {isLoadingTop ? "Cargando..." : "Mi top artista"}
            </button>
          </div>

          {/* Vinyl */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <VinylSVG size={130} labelColor="#d4824a" style={{ transform: `rotate(${angle}deg)` }} />
          </div>

          {error && (
            <div style={{ padding: "8px 20px", fontFamily: "var(--font-mono)", fontSize: 9, color: "#b83a20", letterSpacing: 1 }}>
              {error}
            </div>
          )}

          <div style={{
            borderTop: `2px solid ${INK}`, padding: "12px 20px",
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 2.5,
            color: "rgba(26,22,18,0.35)", textTransform: "uppercase",
          }}>
            {isLoading ? "Buscando..." : search_q.trim().length >= 2 ? `${displayList.length} resultado${displayList.length !== 1 ? "s" : ""}` : "Escribe para buscar"}
          </div>
        </div>

        {/* TABLE */}
        <div style={{ flex: 1, background: PAPER, overflowY: "auto", overflowX: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 120px 44px",
            height: 40, alignItems: "center",
            padding: "0 32px",
            borderBottom: `2px solid ${INK}`,
            background: PAPER3,
            position: "sticky", top: 0, zIndex: 2,
          }}>
            {["ARTISTA", "SEGUIDORES", ""].map((h, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 3,
                textTransform: "uppercase", color: "rgba(26,22,18,0.4)",
                textAlign: i > 0 ? "center" : "left",
              }}>{h}</span>
            ))}
          </div>

          {/* Selected indicator */}
          {selectedArtist && (
            <div style={{
              padding: "10px 32px",
              background: `${TEAL}15`,
              borderBottom: `1px solid ${TEAL}44`,
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 2,
              color: TEAL, textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>Seleccionado: <strong>{selectedArtist.name}</strong></span>
              <button
                onClick={() => router.push("/ticket")}
                style={{
                  background: TEAL, color: "#fff", border: "none",
                  padding: "4px 12px", fontSize: 9, fontWeight: 700,
                  fontFamily: "var(--font-mono)", cursor: "pointer", letterSpacing: 1,
                }}
              >
                VER TICKET →
              </button>
            </div>
          )}

          {/* Artist rows */}
          {displayList.map((artist) => (
            <div
              key={artist.id}
              onClick={() => handleSelect(artist)}
              onMouseEnter={() => setHov(artist.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 120px 44px",
                height: 76, alignItems: "center",
                padding: "0 32px",
                borderBottom: `1px solid rgba(26,22,18,0.1)`,
                cursor: "pointer",
                background: hov === artist.id ? PAPER2 : "transparent",
                transition: "background 0.12s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  borderRadius: 4, overflow: "hidden",
                  background: "rgba(26,22,18,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {artist.images?.[0]?.url ? (
                    <Image src={artist.images[0].url} alt={artist.name} fill className="object-cover" sizes="44px" />
                  ) : (
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 900, color: "rgba(26,22,18,0.4)" }}>
                      {artist.name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3, color: INK }}>{artist.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(26,22,18,0.4)", marginTop: 2 }}>
                    {artist.genres?.slice(0, 2).join(" · ") || "Sin géneros"}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: INK }}>
                {artist.followers?.total
                  ? new Intl.NumberFormat("es-MX", { notation: "compact" }).format(artist.followers.total)
                  : "—"}
              </div>

              <div style={{
                textAlign: "center", fontSize: 20, fontWeight: 700,
                color: hov === artist.id ? TEAL : "rgba(26,22,18,0.2)",
                transition: "color 0.15s, transform 0.15s",
                transform: hov === artist.id ? "translateX(4px)" : "none",
              }}>→</div>
            </div>
          ))}

          {search_q.trim().length >= 2 && !isLoading && displayList.length === 0 && (
            <div style={{
              padding: "80px 32px", textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "rgba(26,22,18,0.3)", letterSpacing: 2, textTransform: "uppercase",
            }}>
              No se encontró &quot;{search_q}&quot;
            </div>
          )}

          {search_q.trim().length < 2 && (
            <div style={{
              padding: "80px 32px", textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "rgba(26,22,18,0.3)", letterSpacing: 2, textTransform: "uppercase",
            }}>
              Busca tu artista favorito o usa &quot;Mi top artista&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
