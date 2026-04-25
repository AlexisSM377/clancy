"use client";

import { ArtistSelector } from "@/app/components/ArtistSelector";
import { BackgroundTicket } from "@/app/components/BackgroundTicket";
import { Button } from "@/app/components/Button";
import { useSelectedArtist } from "@/app/hooks/useSelectedArtist";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SelectArtistPage() {
  const { status } = useSession();
  const { selectedArtist, clearArtist, isHydrated } = useSelectedArtist();
  const router = useRouter();

  if (status === "loading" || !isHydrated) {
    return (
      <BackgroundTicket>
        <main className="mx-auto mt-40 flex min-h-[65vh] w-full max-w-5xl items-center justify-center px-4">
          <p className="text-sm text-white/80">Cargando seleccion de artista...</p>
        </main>
      </BackgroundTicket>
    );
  }

  if (status === "unauthenticated") {
    return (
      <BackgroundTicket>
        <main className="mx-auto mt-40 flex min-h-[65vh] w-full max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center">
          <h1 className="text-3xl font-black uppercase tracking-[6px] text-[#FFD800]">
            Conecta Spotify
          </h1>
          <p className="max-w-xl text-sm text-white/80">
            Para elegir artistas y personalizar tu tarjeta necesitas iniciar sesion con
            Spotify.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              await signIn("spotify", {
                callbackUrl: "/select-artist",
                redirect: true,
              });
            }}
          >
            Iniciar sesion con Spotify
          </Button>
        </main>
      </BackgroundTicket>
    );
  }

  return (
    <BackgroundTicket>
      <main className="mx-auto mt-32 flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 md:mt-36">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[4px] text-white/70">
            Paso 1 de 2
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[4px] text-[#FFD800] md:text-5xl">
            Selecciona tu artista
          </h1>
          <p className="max-w-2xl text-sm text-white/80">
            Busca cualquier artista en Spotify o usa tu top artista para generar una
            tarjeta personalizada.
          </p>
        </header>

        <ArtistSelector onArtistSelected={() => router.push("/ticket")} />

        {selectedArtist && (
          <section className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-xl md:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white/10">
                {selectedArtist.image ? (
                  <Image
                    src={selectedArtist.image}
                    alt={selectedArtist.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[3px] text-white/60">
                  Artista seleccionado
                </p>
                <p className="truncate text-xl font-extrabold text-white">
                  {selectedArtist.name}
                </p>
                <p className="truncate text-xs text-white/70">
                  {(selectedArtist.genres && selectedArtist.genres.length > 0
                    ? selectedArtist.genres.slice(0, 3).join(" - ")
                    : "Sin generos disponibles") +
                    (selectedArtist.followers
                      ? ` - ${new Intl.NumberFormat("es-MX").format(
                          selectedArtist.followers
                        )} seguidores`
                      : "")}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button type="button" variant="secondary" onClick={clearArtist}>
                  Limpiar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/ticket")}
                >
                  Continuar al ticket
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
    </BackgroundTicket>
  );
}
