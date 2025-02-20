"use client";
import Ticket from "@/app/components/Ticket";
import TicketPlatinum from "@/app/components/TicketPlatinum";
import { BackgroundTicket } from "@/app/components/BackgroundTicket";
import { Button } from "@/app/components/Button";
import { Container3D } from "@/app/components/Container3D";
import { DownloadIcon } from "@/app/components/icons/download";
import { LogoutIcon } from "@/app/components/icons/logout";
import { Tooltip } from "@/app/components/Tooltip";
import { getTopTracks } from "@/app/lib/service";
import { TRACKS as initialTracks } from "@/app/artist/tracks";
import { ALBUMS as initialAlbums } from "@/app/artist/albums";
import { cn } from "@/app/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toJpeg } from "html-to-image";

const MATERIALS_LIST = {
  STANDARD: "standard",
  PLATINUM: "platinum",
};

const TOP_ID = "3YQKmKGau1PzlVlkL1iodx"; // ID de Twenty One Pilots

const STEPS_LOADING = {
  ready: 'Compartir',
  generate: 'Generando...',
  sharing: 'Compartiendo...'
};

export default function Page({
  defaultTrackIndex = 0,
  defaultAlbumIndex = 0,
  material: defaultMaterial = MATERIALS_LIST.STANDARD,
}) {
  const { data: session } = useSession(); // Obtener la sesión y el estado de autenticación
  const [selectedMaterial, setSelectTrack] = useState(defaultMaterial);
  const [trackIndex, setTrackIndex] = useState(defaultTrackIndex); // Usamos índice en lugar de ID
  const [albumIndex, setAlbumIndex] = useState(defaultAlbumIndex);
  const [tracks, setTracks] = useState(initialTracks);
  const [buttonText, setButtonText] = useState(STEPS_LOADING.ready);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [albums] = useState(initialAlbums);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const topTracks = await getTopTracks();

        const filteredTracks = topTracks.items.filter((track) =>
          track.artists.some((artist) => artist.id === TOP_ID)
        );

        if (filteredTracks.length > 0) {
          // Si deseas actualizar dinámicamente los tracks, puedes mapear los resultados filtrados
          const updatedTracks = filteredTracks.map((track) => {
            const album = albums.find((album) => album.id === track.album.id);

            return {
              id: track.id,
              track: track.name,
              album: track.album.name,
              albumId: track.album.id,
              icon: track.album.images[0]?.url,
              colorPalette: album
                ? album.colorPalette
                : {
                  bg: "bg-[#007acc]/50",
                  borders: {
                    inside: "border-blue-300/20",
                    outside: "border-blue-400/10",
                  },
                  shadowColor: "shadow-blue-400/25"
                },
            };
          });

          setTracks(updatedTracks);
        }

      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (buttonText === STEPS_LOADING.generate) {
      toJpeg(document.getElementById('ticket'), {
        quality: 0.95,
      }).then((dataURL) => {
        setGeneratedImage(dataURL);
        setButtonText(STEPS_LOADING.ready);
      });
    }
  }, [buttonText]);

  const trackSelected = tracks[trackIndex];
  const albumSelected = albums[albumIndex];

  return (
    <BackgroundTicket>
      <div aria-disabled className="w-[800px] -mb-[366px] relative -left-[200vw]">
        <div id="ticket" className="border-[16px] border-transparent">
          {selectedMaterial === MATERIALS_LIST.STANDARD && (
            <Ticket
              isSizeFixed
              transition={false}
              track={trackSelected}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || 'Clancy',
              }}
            />
          )}
          {selectedMaterial === MATERIALS_LIST.PLATINUM && (
            <TicketPlatinum
              isSizeFixed
              transition={false}
              album={albumSelected}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || 'Clancy',
              }}
              handleRemoveTrack={() => { }}
            />
          )}
        </div>
      </div>
      <main className="max-w-screen-xl mx-auto mt-40 pb-20 gap-8 px-4 flex flex-col lg:grid grid-cols-[auto_1fr] items-center">
        <div>
          <div className="w-auto">
            <div className="max-w-[400px] md:max-w-[700px] md:w-[700px] mx-auto">
              <Container3D>
                {selectedMaterial === MATERIALS_LIST.STANDARD && (
                  <Ticket
                    track={trackSelected}
                    user={{
                      avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                      username: session?.user?.name || 'Clancy',
                    }}
                  />
                )}
                {selectedMaterial === MATERIALS_LIST.PLATINUM && (
                  <TicketPlatinum
                    album={albumSelected}
                    user={{
                      avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                      username: session?.user?.name || 'Clancy',
                    }}
                    handleRemoveTrack={() => { }}
                  />
                )}
              </Container3D>
            </div>
            <div
              className={cn(
                "w-2/3 mx-auto h-6 rounded-[50%] mt-6 transition-colors duration-300 blur-lg",
                trackSelected?.colorPalette?.bg,
                selectedMaterial === MATERIALS_LIST.PLATINUM && "bg-[#E23D2E]"
              )}
            ></div>
          </div>
          <div className="flex flex-col items-center w-full px-8 mt-16 mb-16 gap-x-10 gap-y-4 lg:mb-0 lg:mt-4 md:flex-row"></div>
        </div>
        <div className="w-full md:order-none">
          <div>
            <h2 className={`text-3xl font-bold text-[#FFD800] lg:pl-8`}>
              Twenty one Pilots
            </h2>
            <div className="flex flex-wrap items-center px-8 py-3 gap-x-2 gap-y-2">
              <Button
                onClick={async () =>
                  await setSelectTrack(MATERIALS_LIST.STANDARD)
                }
                className={cn(
                  "py-3 transition-all",
                  MATERIALS_LIST.STANDARD !== selectedMaterial &&
                  "bg-transparent border-transparent"
                )}
                variant="secondary"
              >
                Top canciones
              </Button>
              <Button
                onClick={async () =>
                  await setSelectTrack(MATERIALS_LIST.PLATINUM)
                }
                className={cn(
                  "py-3 transition-all",
                  MATERIALS_LIST.PLATINUM !== selectedMaterial &&
                  "bg-transparent border-transparent"
                )}
                variant="secondary"
              >
                Álbumes
              </Button>
            </div>
          </div>
          <div className="w-full z-[99999] opacity-[.99] mt-10 md:mt-2">
            {selectedMaterial === MATERIALS_LIST.STANDARD && (
              <div className="flex flex-row w-full p-8 max-h-[24rem] overflow-x-auto text-center flex-nowrap md:flex-wrap gap-x-8 gap-y-12 lg:pb-20 hidden-scroll lg:flavors-gradient-list">
                {tracks.map((track, index) => (
                  <Tooltip key={track.id} text={track.track} offsetNumber={16}>
                    <button
                      className={`relative flex w-12 h-12 transition cursor:pointer group ${index === trackIndex
                        ? "scale-125 pointer-events-none contrast-125 before:absolute before:rounded-full before:w-2 before:h-2 before:left-0 before:right-0 before:-top-4 before:mx-auto before:bg-yellow-200"
                        : ""
                        }`}
                      onClick={() => setTrackIndex(index)}
                    >
                      <div className="flex items-center justify-center w-14 h-14 transition group-hover:scale-110">
                        <img
                          src={track.icon} // Usamos la URL de la imagen
                          alt={track.id} // Texto alternativo
                          className="h-auto rounded-sm" // Clases CSS
                        />
                      </div>
                    </button>
                  </Tooltip>
                ))}
              </div>
            )}
            {selectedMaterial === MATERIALS_LIST.PLATINUM && (
              <div className="flex flex-row w-full p-8 max-h-[24rem] overflow-x-auto text-center flex-nowrap md:flex-wrap gap-x-8 gap-y-12 lg:pb-20 hidden-scroll lg:flavors-gradient-list">
                {albums.map((album, index) => (
                  <Tooltip key={album.id} text={album.name} offsetNumber={16}>
                    <button
                      className={`relative flex w-12 h-12 transition cursor:pointer group ${index === trackIndex
                          ? "scale-125 pointer-events-none contrast-125 before:absolute before:rounded-full before:w-2 before:h-2 before:left-0 before:right-0 before:-top-4 before:mx-auto before:bg-yellow-200"
                          : ""
                        }`}
                      onClick={() => setAlbumIndex(index)}
                    >
                      <div className="flex items-center justify-center w-14 h-14 transition group-hover:scale-110">
                        <img
                          src={album.images[0].url} // Usamos la URL de la imagen
                          alt={album.name} // Texto alternativo
                          className="h-auto rounded-sm" // Clases CSS
                        />
                      </div>
                    </button>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center w-full px-8 mt-16 mb-16 gap-x-10 gap-y-4 lg:mb:0 lg:mt-4 md:flex-row">
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
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogoutIcon />
            Cerrar sesión
          </Button>
        </div>
      </main>
    </BackgroundTicket>
  );
}