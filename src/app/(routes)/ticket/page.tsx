"use client";

import { Container3D } from "@/app/components/Container3D";
import Ticket from "@/app/components/Ticket";
import type { TicketColorPalette } from "@/app/components/Ticket";
import TicketPlatinum from "@/app/components/TicketPlatinum";
import { Wordmark } from "@/app/components/vinyl/Wordmark";
import { useSelectedArtist } from "@/app/hooks/useSelectedArtist";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistTracks,
  getTopTracks,
  type SpotifyAlbum,
  type SpotifyTrack,
} from "@/app/lib/service";
import { toJpeg } from "html-to-image";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const INK = "#1a1612";
const PAPER = "#f5f0e8";
const PAPER2 = "#ede6d6";
const PAPER3 = "#e4dcc8";
const TEAL = "#4a8a90";
const MUTED = "rgba(26,22,18,0.38)";

type TicketTrack = {
  id: string;
  track: string;
  album: string;
  albumId: string;
  icon: string;
  colorPalette: TicketColorPalette;
};

type TicketAlbum = {
  total_tracks: number;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  colorPalette: TicketColorPalette;
};

const MATERIALS_LIST = {
  STANDARD: "standard",
  PLATINUM: "platinum",
} as const;

const STEPS_LOADING = {
  ready: "Generar imagen" as const,
  generate: "Generando..." as const,
};

const FALLBACK_AVATAR =
  "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true";

const FALLBACK_COVER = "/1.png";

const PALETTES: TicketColorPalette[] = [
  { bg: "#3d1012", bgOverlay: "rgba(61,16,18,0.62)", accent: "#b34444", dim: "rgba(179,68,68,0.22)" },
  { bg: "#0c1d32", bgOverlay: "rgba(12,29,50,0.62)", accent: "#3872a8", dim: "rgba(56,114,168,0.22)" },
  { bg: "#0c2c2d", bgOverlay: "rgba(12,44,45,0.62)", accent: "#38989e", dim: "rgba(56,152,158,0.22)" },
  { bg: "#2d2010", bgOverlay: "rgba(45,32,16,0.62)", accent: "#c49a3c", dim: "rgba(196,154,60,0.22)" },
  { bg: "#181a1e", bgOverlay: "rgba(24,26,30,0.62)", accent: "#5e6e7c", dim: "rgba(94,110,124,0.22)" },
  { bg: "#190e32", bgOverlay: "rgba(25,14,50,0.62)", accent: "#7e4ec4", dim: "rgba(126,78,196,0.22)" },
];

const getPaletteFromSeed = (seed: string): TicketColorPalette => {
  const total = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTES[total % PALETTES.length];
};

const toHashtag = (value: string) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
  return `#${normalized || "spotifyartist"}`;
};

const FALLBACK_PALETTE = PALETTES[1];

const FALLBACK_TRACK: TicketTrack = {
  id: "fallback-track",
  track: "Top Track",
  album: "Top Album",
  albumId: "fallback-album",
  icon: FALLBACK_COVER,
  colorPalette: FALLBACK_PALETTE,
};

const FALLBACK_ALBUM: TicketAlbum = {
  total_tracks: 1,
  id: "fallback-album",
  images: [{ url: FALLBACK_COVER, height: 640, width: 640 }],
  name: "Top Album",
  colorPalette: FALLBACK_PALETTE,
};

const mapTrackToTicketTrack = (track: SpotifyTrack): TicketTrack => ({
  id: track.id,
  track: track.name,
  album: track.album.name,
  albumId: track.album.id,
  icon: track.album.images?.[0]?.url || FALLBACK_COVER,
  colorPalette: getPaletteFromSeed(track.album.id || track.id),
});

const mapAlbumToTicketAlbum = (album: SpotifyAlbum): TicketAlbum => ({
  id: album.id,
  name: album.name,
  total_tracks: album.total_tracks,
  images: [{ url: album.images?.[0]?.url || FALLBACK_COVER, height: album.images?.[0]?.height ?? 640, width: album.images?.[0]?.width ?? 640 }],
  colorPalette: getPaletteFromSeed(album.id),
});

export default function Page() {
  const { data: session } = useSession();
  const { selectedArtist, isHydrated } = useSelectedArtist();
  const router = useRouter();

  const [selectedMaterial, setSelectedMaterial] = useState<
    (typeof MATERIALS_LIST)[keyof typeof MATERIALS_LIST]
  >(MATERIALS_LIST.STANDARD);
  const [trackIndex, setTrackIndex] = useState(0);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [buttonText, setButtonText] = useState<"Generar imagen" | "Generando...">(STEPS_LOADING.ready);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TicketTrack[]>([FALLBACK_TRACK]);
  const [albums, setAlbums] = useState<TicketAlbum[]>([FALLBACK_ALBUM]);
  const [artistName, setArtistName] = useState<string>(selectedArtist?.name || "");
  const [artistUrl, setArtistUrl] = useState<string>(selectedArtist?.externalUrl || "https://open.spotify.com");
  const [artistFollowers, setArtistFollowers] = useState<number | null>(null);
  const [artistGenre, setArtistGenre] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !selectedArtist) {
      router.replace("/select-artist");
    }
  }, [isHydrated, router, selectedArtist]);

  useEffect(() => {
    if (!selectedArtist?.id) return;

    const fetchArtistData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const [artistDetails, topTracksResponse, artistAlbumsResponse] = await Promise.all([
          getArtistDetails(selectedArtist.id),
          getTopTracks(50, "short_term"),
          getArtistAlbums(selectedArtist.id, 24),
        ]);

        setArtistName(artistDetails?.name || selectedArtist.name);
        setArtistUrl(artistDetails?.external_urls?.spotify || selectedArtist.externalUrl || "https://open.spotify.com");
        setArtistFollowers(artistDetails?.followers?.total ?? null);
        setArtistGenre(artistDetails?.genres?.[0] ?? null);

        const userTracksByArtist = topTracksResponse.items.filter((track) =>
          track.artists.some((artist) => artist.id === selectedArtist.id)
        );

        let tracksSource = userTracksByArtist;
        if (tracksSource.length === 0) {
          tracksSource = await getArtistTracks(selectedArtist.id, 20);
        }

        const mappedTracks = tracksSource.map(mapTrackToTicketTrack);
        if (mappedTracks.length > 0) {
          setTracks(mappedTracks);
          setTrackIndex(0);
        }

        const uniqueAlbumsMap = new Map<string, SpotifyAlbum>();
        for (const album of artistAlbumsResponse.items) {
          if (!uniqueAlbumsMap.has(album.id)) uniqueAlbumsMap.set(album.id, album);
        }

        const mappedAlbums = Array.from(uniqueAlbumsMap.values()).slice(0, 12).map(mapAlbumToTicketAlbum);
        if (mappedAlbums.length > 0) {
          setAlbums(mappedAlbums);
          setAlbumIndex(0);
        }
      } catch (fetchError) {
        console.error("Error loading artist data", fetchError);
        setError("No pudimos cargar tu artista. Mostramos los datos por defecto.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchArtistData();
  }, [selectedArtist]);

  useEffect(() => {
    if (buttonText !== STEPS_LOADING.generate) return;
    const ticketElement = document.getElementById("ticket");
    if (!ticketElement) {
      setButtonText(STEPS_LOADING.ready);
      return;
    }
    toJpeg(ticketElement, { quality: 0.95 }).then((dataURL) => {
      setGeneratedImage(dataURL);
      setButtonText(STEPS_LOADING.ready);
    });
  }, [buttonText]);

  useEffect(() => {
    if (trackIndex > tracks.length - 1) setTrackIndex(0);
  }, [trackIndex, tracks]);

  useEffect(() => {
    if (albumIndex > albums.length - 1) setAlbumIndex(0);
  }, [albumIndex, albums]);

  if (!isHydrated || !selectedArtist) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0d0b09", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,240,232,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>
          CARGANDO...
        </span>
      </div>
    );
  }

  const trackSelected = tracks[trackIndex] || FALLBACK_TRACK;
  const albumSelected = albums[albumIndex] || FALLBACK_ALBUM;
  const artistHashtag = toHashtag(artistName);
  const artistMeta = {
    name: artistName,
    hashtag: artistHashtag,
    url: artistUrl,
    eventName: "Spotify Fan Ticket",
    followers: artistFollowers,
    genre: artistGenre,
    image: selectedArtist.image,
  };

  const shadowColor = selectedMaterial === MATERIALS_LIST.PLATINUM
    ? albumSelected.colorPalette.accent
    : trackSelected.colorPalette.accent;

  return (
    <>
      {/* Off-screen render for download */}
      <div
        aria-hidden
        style={{ position: "absolute", left: -2000, top: 0, width: 800, pointerEvents: "none" }}
      >
        <div id="ticket" style={{ border: "16px solid transparent" }}>
          {selectedMaterial === MATERIALS_LIST.STANDARD && (
            <Ticket
              isSizeFixed
              transition={false}
              track={trackSelected}
              artist={artistMeta}
              user={{
                avatar: session?.user?.image || FALLBACK_AVATAR,
                username: session?.user?.name || "Clancy",
              }}
            />
          )}
          {selectedMaterial === MATERIALS_LIST.PLATINUM && (
            <TicketPlatinum
              isSizeFixed
              transition={false}
              album={albumSelected}
              artist={artistMeta}
              user={{
                avatar: session?.user?.image || FALLBACK_AVATAR,
                username: session?.user?.name || "Clancy",
              }}
            />
          )}
        </div>
      </div>

      {/* Page layout */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          color: INK,
          fontFamily: "var(--font-body)",
          display: "grid",
          gridTemplate: `"nav nav" 52px "main ctrl" 1fr / 1fr 320px`,
          overflow: "hidden",
        }}
      >
        {/* Blurred artist background */}
        {selectedArtist.image && (
          <img
            src={selectedArtist.image}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(18px) brightness(0.55)",
              transform: "scale(1.12)",
              zIndex: 0,
              display: "block",
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4))",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* NAV */}
        <nav
          style={{
            gridArea: "nav",
            position: "relative",
            zIndex: 1,
            borderBottom: `2px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(245,240,232,0.92)",
            backdropFilter: "blur(12px)",
            flexShrink: 0,
          }}
        >
          <Wordmark size={17} dark />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: 3,
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            {artistName || "Fan Ticket"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: PAPER,
                  flexShrink: 0,
                }}
              >
                {(session?.user?.name || "F")[0].toUpperCase()}
              </div>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, color: MUTED }}>
              {session?.user?.name}
            </span>
          </div>
        </nav>

        {/* TICKET PREVIEW */}
        <main
          style={{
            gridArea: "main",
            position: "relative",
            zIndex: 1,
            borderRight: `2px solid ${INK}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            background: "transparent",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", maxWidth: 600 }}>
            <Container3D>
              {selectedMaterial === MATERIALS_LIST.STANDARD && (
                <Ticket
                  track={trackSelected}
                  artist={artistMeta}
                  user={{
                    avatar: session?.user?.image || FALLBACK_AVATAR,
                    username: session?.user?.name || "Clancy",
                  }}
                />
              )}
              {selectedMaterial === MATERIALS_LIST.PLATINUM && (
                <TicketPlatinum
                  album={albumSelected}
                  artist={artistMeta}
                  user={{
                    avatar: session?.user?.image || FALLBACK_AVATAR,
                    username: session?.user?.name || "Clancy",
                  }}
                />
              )}
            </Container3D>

            <div
              style={{
                marginTop: 20,
                height: 20,
                width: "55%",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "50%",
                filter: "blur(14px)",
                transition: "background 0.4s ease",
                background: shadowColor,
                opacity: 0.55,
              }}
            />
          </div>
        </main>

        {/* CONTROLS PANEL */}
        <aside
          style={{
            gridArea: "ctrl",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            background: PAPER2,
            overflow: "hidden",
          }}
        >
          {/* Artist header */}
          <div
            style={{
              borderBottom: `2px solid ${INK}`,
              padding: "20px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              flexShrink: 0,
            }}
          >
            {selectedArtist.image ? (
              <img
                src={selectedArtist.image}
                alt={artistName}
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  color: PAPER,
                  flexShrink: 0,
                }}
              >
                {artistName[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  lineHeight: 1.1,
                  letterSpacing: -0.3,
                  color: INK,
                  margin: 0,
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {artistName || "Artista"}
              </h1>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: MUTED,
                  textTransform: "uppercase",
                }}
              >
                {[
                  artistGenre,
                  artistFollowers
                    ? new Intl.NumberFormat("es-MX", { notation: "compact" }).format(artistFollowers) + " fans"
                    : null,
                ]
                  .filter(Boolean)
                  .join("  ·  ") || "—"}
              </div>
            </div>
          </div>

          {/* Material toggle */}
          <div
            style={{
              height: 44,
              borderBottom: `2px solid ${INK}`,
              display: "flex",
              alignItems: "stretch",
              flexShrink: 0,
            }}
          >
            {[
              { key: MATERIALS_LIST.STANDARD, label: "Canciones" },
              { key: MATERIALS_LIST.PLATINUM, label: "Álbumes" },
            ].map(({ key, label }, i) => {
              const active = selectedMaterial === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMaterial(key)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    borderRight: i === 0 ? `1px solid rgba(26,22,18,0.15)` : "none",
                    borderBottom: active ? `2px solid ${INK}` : "none",
                    marginBottom: active ? -2 : 0,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: active ? INK : MUTED,
                    fontWeight: active ? 700 : 400,
                    transition: "color 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Status messages */}
          {isLoadingData && (
            <div
              style={{
                padding: "12px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: 2,
                color: MUTED,
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Cargando...
            </div>
          )}
          {error && (
            <div
              style={{
                padding: "10px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#b83a20",
                letterSpacing: 1,
                flexShrink: 0,
              }}
            >
              {error}
            </div>
          )}

          {/* Track / Album list */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {selectedMaterial === MATERIALS_LIST.STANDARD &&
              tracks.map((track, index) => {
                const active = index === trackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => setTrackIndex(index)}
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "24px 32px 1fr",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      padding: "0 24px",
                      background: active ? PAPER3 : "transparent",
                      border: "none",
                      borderBottom: `1px solid rgba(26,22,18,0.07)`,
                      cursor: active ? "default" : "pointer",
                      textAlign: "left",
                      transition: "background 0.12s",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(26,22,18,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: MUTED,
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={track.icon || FALLBACK_COVER}
                      alt={track.track}
                      style={{ width: 32, height: 32, borderRadius: 2, objectFit: "cover", display: "block", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 700 : 400,
                        color: INK,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {track.track}
                    </span>
                  </button>
                );
              })}

            {selectedMaterial === MATERIALS_LIST.PLATINUM &&
              albums.map((album, index) => {
                const active = index === albumIndex;
                return (
                  <button
                    key={album.id}
                    onClick={() => setAlbumIndex(index)}
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "24px 32px 1fr",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      padding: "0 24px",
                      background: active ? PAPER3 : "transparent",
                      border: "none",
                      borderBottom: `1px solid rgba(26,22,18,0.07)`,
                      cursor: active ? "default" : "pointer",
                      textAlign: "left",
                      transition: "background 0.12s",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(26,22,18,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: MUTED,
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={album.images[0].url || FALLBACK_COVER}
                      alt={album.name}
                      style={{ width: 32, height: 32, borderRadius: 2, objectFit: "cover", display: "block", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 700 : 400,
                        color: INK,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {album.name}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Actions footer */}
          <div
            style={{
              borderTop: `2px solid ${INK}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              background: PAPER3,
            }}
          >
            {generatedImage ? (
              <a
                href={generatedImage}
                download="ticket.jpg"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: INK,
                  color: PAPER,
                  padding: "9px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  letterSpacing: 0.3,
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = TEAL; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = INK; }}
              >
                Descargar
              </a>
            ) : (
              <button
                onClick={() => setButtonText(STEPS_LOADING.generate)}
                disabled={buttonText === STEPS_LOADING.generate}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: INK,
                  color: PAPER,
                  border: "none",
                  padding: "9px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: buttonText === STEPS_LOADING.generate ? "default" : "pointer",
                  letterSpacing: 0.3,
                  transition: "background 0.15s",
                  opacity: buttonText === STEPS_LOADING.generate ? 0.65 : 1,
                }}
                onMouseEnter={(e) => {
                  if (buttonText !== STEPS_LOADING.generate)
                    (e.currentTarget as HTMLButtonElement).style.background = TEAL;
                }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = INK; }}
              >
                {buttonText}
              </button>
            )}

            <button
              onClick={() => router.push("/select-artist")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                color: INK,
                border: `2px solid ${INK}`,
                padding: "7px 14px",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = INK;
                e.currentTarget.style.color = PAPER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = INK;
              }}
            >
              Cambiar
            </button>

            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                color: MUTED,
                border: "none",
                padding: "7px 10px",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "color 0.15s",
                marginLeft: "auto",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = INK; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
            >
              Salir
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
