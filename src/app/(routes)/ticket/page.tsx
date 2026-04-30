"use client";

import { BackgroundTicket } from "@/app/components/BackgroundTicket";
import { Button } from "@/app/components/Button";
import { Container3D } from "@/app/components/Container3D";
import Ticket from "@/app/components/Ticket";
import TicketPlatinum from "@/app/components/TicketPlatinum";
import { Tooltip } from "@/app/components/Tooltip";
import { DownloadIcon } from "@/app/components/icons/download";
import { LogoutIcon } from "@/app/components/icons/logout";
import { useSelectedArtist } from "@/app/hooks/useSelectedArtist";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistTracks,
  getTopTracks,
  type SpotifyAlbum,
  type SpotifyTrack,
} from "@/app/lib/service";
import { cn } from "@/app/lib/utils";
import { toJpeg } from "html-to-image";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TicketColorPalette = {
  bg: string;
  borders: {
    inside: string;
    outside: string;
  };
  shadowColor: string;
};

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
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  colorPalette: TicketColorPalette;
};

const MATERIALS_LIST = {
  STANDARD: "standard",
  PLATINUM: "platinum",
} as const;

const STEPS_LOADING = {
  ready: 'Compartir' as const,
  generate: 'Generando...' as const,
};

const FALLBACK_AVATAR =
  "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true";

const FALLBACK_COVER = "/1.png";

const FALLBACK_TRACK: TicketTrack = {
  id: "fallback-track",
  track: "Top Track",
  album: "Top Album",
  albumId: "fallback-album",
  icon: FALLBACK_COVER,
  colorPalette: {
    bg: "bg-[#007acc]/50",
    borders: {
      outside: "border-blue-300/20",
      inside: "border-blue-400/10",
    },
    shadowColor: "shadow-blue-400/25",
  },
};

const FALLBACK_ALBUM: TicketAlbum = {
  total_tracks: 1,
  id: "fallback-album",
  images: [
    {
      url: FALLBACK_COVER,
      height: 640,
      width: 640,
    },
  ],
  name: "Top Album",
  colorPalette: {
    bg: "bg-[#007acc]/50",
    borders: {
      outside: "border-blue-300/20",
      inside: "border-blue-400/10",
    },
    shadowColor: "shadow-blue-400/25",
  },
};

const PALETTES: TicketColorPalette[] = [
  {
    bg: "bg-[#D62420]/65",
    borders: {
      outside: "border-red-300/20",
      inside: "border-red-400/10",
    },
    shadowColor: "shadow-red-200/15",
  },
  {
    bg: "bg-[#007acc]/50",
    borders: {
      inside: "border-blue-300/20",
      outside: "border-blue-400/10",
    },
    shadowColor: "shadow-blue-400/25",
  },
  {
    bg: "bg-[#00ADD8]/50",
    borders: {
      inside: "border-cyan-300/20",
      outside: "border-cyan-400/10",
    },
    shadowColor: "shadow-cyan-400/20",
  },
  {
    bg: "bg-[#FFD800]/50",
    borders: {
      outside: "border-yellow-300/20",
      inside: "border-yellow-400/10",
    },
    shadowColor: "shadow-yellow-200/15",
  },
  {
    bg: "bg-[#1f2937]/65",
    borders: {
      outside: "border-slate-300/20",
      inside: "border-slate-400/10",
    },
    shadowColor: "shadow-slate-400/25",
  },
  {
    bg: "bg-[#4f46e5]/55",
    borders: {
      outside: "border-indigo-300/20",
      inside: "border-indigo-400/10",
    },
    shadowColor: "shadow-indigo-300/20",
  },
];

const getPaletteFromSeed = (seed: string) => {
  const total = seed
    .split("")
    .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
  return PALETTES[total % PALETTES.length];
};

const toHashtag = (value: string) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();

  return `#${normalized || "spotifyartist"}`;
};

const mapTrackToTicketTrack = (track: SpotifyTrack): TicketTrack => {
  return {
    id: track.id,
    track: track.name,
    album: track.album.name,
    albumId: track.album.id,
    icon: track.album.images?.[0]?.url || FALLBACK_COVER,
    colorPalette: getPaletteFromSeed(track.album.id || track.id),
  };
};

const mapAlbumToTicketAlbum = (album: SpotifyAlbum): TicketAlbum => {
  return {
    id: album.id,
    name: album.name,
    total_tracks: album.total_tracks,
    images: [
      {
        url: album.images?.[0]?.url || FALLBACK_COVER,
        height: album.images?.[0]?.height ?? 640,
        width: album.images?.[0]?.width ?? 640,
      },
    ],
    colorPalette: getPaletteFromSeed(album.id),
  };
};

export default function Page() {
  const { data: session } = useSession();
  const { selectedArtist, isHydrated } = useSelectedArtist();
  const router = useRouter();

  const [selectedMaterial, setSelectedMaterial] = useState<
    (typeof MATERIALS_LIST)[keyof typeof MATERIALS_LIST]
  >(MATERIALS_LIST.STANDARD);
  const [trackIndex, setTrackIndex] = useState(0);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [buttonText, setButtonText] = useState<'Compartir' | 'Generando...'>(STEPS_LOADING.ready);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TicketTrack[]>([FALLBACK_TRACK]);
  const [albums, setAlbums] = useState<TicketAlbum[]>([FALLBACK_ALBUM]);
  const [artistName, setArtistName] = useState<string>(selectedArtist?.name || "");
  const [artistUrl, setArtistUrl] = useState<string>(
    selectedArtist?.externalUrl || "https://open.spotify.com"
  );
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !selectedArtist) {
      router.replace("/select-artist");
    }
  }, [isHydrated, router, selectedArtist]);

  useEffect(() => {
    if (!selectedArtist?.id) {
      return;
    }

    const fetchArtistData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const [artistDetails, topTracksResponse, artistAlbumsResponse] =
          await Promise.all([
            getArtistDetails(selectedArtist.id),
            getTopTracks(50, "short_term"),
            getArtistAlbums(selectedArtist.id, 24),
          ]);

        setArtistName(artistDetails?.name || selectedArtist.name);
        setArtistUrl(
          artistDetails?.external_urls?.spotify ||
            selectedArtist.externalUrl ||
            "https://open.spotify.com"
        );

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
          if (!uniqueAlbumsMap.has(album.id)) {
            uniqueAlbumsMap.set(album.id, album);
          }
        }

        const mappedAlbums = Array.from(uniqueAlbumsMap.values())
          .slice(0, 12)
          .map(mapAlbumToTicketAlbum);

        if (mappedAlbums.length > 0) {
          setAlbums(mappedAlbums);
          setAlbumIndex(0);
        }
      } catch (fetchError) {
        console.error("Error loading artist data", fetchError);
        setError(
          "No pudimos cargar tu artista. Mostramos los datos por defecto para que puedas continuar."
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchArtistData();
  }, [selectedArtist]);

  useEffect(() => {
    if (buttonText !== STEPS_LOADING.generate) {
      return;
    }

    const ticketElement = document.getElementById("ticket");

    if (!ticketElement) {
      setButtonText(STEPS_LOADING.ready);
      return;
    }

    toJpeg(ticketElement, {
      quality: 0.95,
    }).then((dataURL) => {
      setGeneratedImage(dataURL);
      setButtonText(STEPS_LOADING.ready);
    });
  }, [buttonText]);

  useEffect(() => {
    if (trackIndex > tracks.length - 1) {
      setTrackIndex(0);
    }
  }, [trackIndex, tracks]);

  useEffect(() => {
    if (albumIndex > albums.length - 1) {
      setAlbumIndex(0);
    }
  }, [albumIndex, albums]);

  if (!isHydrated || !selectedArtist) {
    return (
      <BackgroundTicket>
        <main className="mx-auto mt-40 flex min-h-[65vh] w-full max-w-5xl items-center justify-center px-4">
          <p className="text-sm text-white/80">Cargando ticket...</p>
        </main>
      </BackgroundTicket>
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
  };

  return (
    <BackgroundTicket>
      <div aria-disabled className="relative -left-[200vw] -mb-[366px] w-[800px]">
        <div id="ticket" className="border-[16px] border-transparent">
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

      <main className="mx-auto mt-40 flex max-w-screen-xl flex-col items-center gap-8 px-4 pb-20 lg:grid grid-cols-[auto_1fr]">
        <div>
          <div className="w-auto">
            <div className="mx-auto max-w-[400px] md:w-[700px] md:max-w-[700px]">
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
            </div>

            <div
              className={cn(
                "mx-auto mt-6 h-6 w-2/3 rounded-[50%] blur-lg transition-colors duration-300",
                trackSelected?.colorPalette?.bg,
                selectedMaterial === MATERIALS_LIST.PLATINUM && "bg-[#E23D2E]"
              )}
            />
          </div>
          <div className="mb-16 mt-16 flex w-full flex-col items-center gap-x-10 gap-y-4 px-8 md:flex-row lg:mb-0 lg:mt-4" />
        </div>

        <div className="w-full md:order-none">
          <div>
            <h2 className="text-3xl font-bold text-[#FFD800] lg:pl-8">{artistName}</h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-8 py-3">
              <Button
                onClick={() => setSelectedMaterial(MATERIALS_LIST.STANDARD)}
                className={cn(
                  "py-3 transition-all",
                  MATERIALS_LIST.STANDARD !== selectedMaterial &&
                    "border-transparent bg-transparent"
                )}
                variant="secondary"
              >
                Top canciones
              </Button>
              <Button
                onClick={() => setSelectedMaterial(MATERIALS_LIST.PLATINUM)}
                className={cn(
                  "py-3 transition-all",
                  MATERIALS_LIST.PLATINUM !== selectedMaterial &&
                    "border-transparent bg-transparent"
                )}
                variant="secondary"
              >
                Albumes
              </Button>
              <Button
                variant="secondary"
                className="ml-auto"
                onClick={() => router.push("/select-artist")}
              >
                Cambiar artista
              </Button>
            </div>
          </div>

          {isLoadingData && (
            <p className="px-8 pt-4 text-xs text-white/70">Cargando datos del artista...</p>
          )}
          {error && <p className="px-8 pt-4 text-xs text-red-200">{error}</p>}

          <div className="z-[99999] mt-10 opacity-[.99] md:mt-2 w-full">
            {selectedMaterial === MATERIALS_LIST.STANDARD && (
              <div className="hidden-scroll lg:flavors-gradient-list flex max-h-[24rem] w-full flex-row flex-nowrap gap-x-8 gap-y-12 overflow-x-auto p-8 text-center md:flex-wrap lg:pb-20">
                {tracks.map((track, index) => (
                  <Tooltip key={track.id} text={track.track} offsetNumber={16}>
                    <button
                      className={`group relative flex h-12 w-12 transition cursor:pointer ${
                        index === trackIndex
                          ? "scale-125 pointer-events-none contrast-125 before:absolute before:left-0 before:right-0 before:-top-4 before:mx-auto before:h-2 before:w-2 before:rounded-full before:bg-yellow-200"
                          : ""
                      }`}
                      onClick={() => setTrackIndex(index)}
                    >
                      <div className="flex h-14 w-14 items-center justify-center transition group-hover:scale-110">
                        <Image
                          src={track.icon || FALLBACK_COVER}
                          alt={track.track}
                          width={56}
                          height={56}
                          className="h-auto rounded-sm"
                        />
                      </div>
                    </button>
                  </Tooltip>
                ))}
              </div>
            )}

            {selectedMaterial === MATERIALS_LIST.PLATINUM && (
              <div className="hidden-scroll lg:flavors-gradient-list flex max-h-[24rem] w-full flex-row flex-nowrap gap-x-8 gap-y-12 overflow-x-auto p-8 text-center md:flex-wrap lg:pb-20">
                {albums.map((album, index) => (
                  <Tooltip key={album.id} text={album.name} offsetNumber={16}>
                    <button
                      className={`group relative flex h-12 w-12 transition cursor:pointer ${
                        index === albumIndex
                          ? "scale-125 pointer-events-none contrast-125 before:absolute before:left-0 before:right-0 before:-top-4 before:mx-auto before:h-2 before:w-2 before:rounded-full before:bg-yellow-200"
                          : ""
                      }`}
                      onClick={() => setAlbumIndex(index)}
                    >
                      <div className="flex h-14 w-14 items-center justify-center transition group-hover:scale-110">
                        <Image
                          src={album.images[0].url || FALLBACK_COVER}
                          alt={album.name}
                          width={56}
                          height={56}
                          className="h-auto rounded-sm"
                        />
                      </div>
                    </button>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-16 mt-16 flex w-full flex-col items-center gap-x-10 gap-y-4 px-8 md:flex-row lg:mb:0 lg:mt-4">
          {generatedImage ? (
            <Button
              as="a"
              href={generatedImage}
              download="ticket.png"
              variant="secondary"
              type="button"
            >
              <DownloadIcon />
              Descargar
            </Button>
          ) : (
            <Button
              variant="secondary"
              type="button"
              onClick={() => setButtonText(STEPS_LOADING.generate)}
            >
              <DownloadIcon />
              {buttonText}
            </Button>
          )}

          <Button
            variant="secondary"
            type="button"
            className="ml-0 lg:ml-auto"
            onClick={() => {
              signOut({
                fetchOptions: { onSuccess: () => router.push("/") },
              });
            }}
          >
            <LogoutIcon />
            Cerrar sesion
          </Button>
        </div>
      </main>
    </BackgroundTicket>
  );
}
