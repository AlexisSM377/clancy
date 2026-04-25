"use client";

import { useSelectedArtist } from "@/app/hooks/useSelectedArtist";
import { getTopArtists, search } from "@/app/lib/service";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type SpotifyArtist = {
  id: string;
  name: string;
  followers?: {
    total?: number;
  };
  genres?: string[];
  images?: Array<{ url: string }>;
  external_urls?: {
    spotify?: string;
  };
};

type SearchArtistsResponse = {
  artists?: {
    items?: SpotifyArtist[];
  };
};

type ArtistSelectorProps = {
  onArtistSelected?: () => void;
};

const formatFollowers = (followers: number | undefined) => {
  if (!followers) {
    return "Sin datos";
  }

  return new Intl.NumberFormat("es-MX").format(followers);
};

const mapArtist = (artist: SpotifyArtist) => ({
  id: artist.id,
  name: artist.name,
  image: artist.images?.[0]?.url,
  followers: artist.followers?.total,
  genres: artist.genres,
  externalUrl: artist.external_urls?.spotify,
});

export function ArtistSelector({ onArtistSelected }: ArtistSelectorProps) {
  const { selectedArtist, selectArtist } = useSelectedArtist();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopArtist, setIsLoadingTopArtist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = query.trim().length >= 2;

  const handleSelectArtist = useCallback(
    (artist: SpotifyArtist) => {
      selectArtist(mapArtist(artist));
      onArtistSelected?.();
    },
    [onArtistSelected, selectArtist]
  );

  const handleUseTopArtist = useCallback(async () => {
    try {
      setIsLoadingTopArtist(true);
      setError(null);

      const topArtists = await getTopArtists(1, "medium_term");
      const firstArtist = topArtists?.items?.[0] as SpotifyArtist | undefined;

      if (!firstArtist) {
        setError("No encontramos artistas en tu historial de Spotify.");
        return;
      }

      handleSelectArtist(firstArtist);
    } catch {
      setError("No pudimos cargar tu artista principal.");
    } finally {
      setIsLoadingTopArtist(false);
    }
  }, [handleSelectArtist]);

  useEffect(() => {
    if (!canSearch) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = (await search(
          query,
          "artist",
          12
        )) as SearchArtistsResponse;

        setResults(response?.artists?.items ?? []);
        setHasSearched(true);
      } catch {
        setError("No pudimos buscar artistas. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canSearch, query]);

  const emptyStateMessage = useMemo(() => {
    if (error) {
      return error;
    }

    if (!canSearch) {
      return "Escribe al menos 2 letras para buscar artistas.";
    }

    if (isLoading) {
      return "Buscando artistas...";
    }

    if (hasSearched && results.length === 0) {
      return "No encontramos resultados para esa busqueda.";
    }

    return null;
  }, [canSearch, error, hasSearched, isLoading, results.length]);

  return (
    <section className="w-full rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-5">
        <label htmlFor="artist-search" className="text-sm font-bold text-white/80">
          Buscar artista
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="artist-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: Taylor Swift, Bad Bunny, Arctic Monkeys"
            className="h-12 w-full rounded-xl border border-white/20 bg-black/50 px-4 text-sm text-white outline-none transition focus:border-[#FFD800]"
          />
          <button
            type="button"
            className="h-12 shrink-0 rounded-xl border border-[#62544a] bg-[#d5d0c3] px-4 text-sm font-bold text-black transition hover:bg-[#c5beac] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleUseTopArtist}
            disabled={isLoadingTopArtist}
          >
            {isLoadingTopArtist ? "Cargando..." : "Mi top artista"}
          </button>
        </div>

        {selectedArtist && (
          <div className="rounded-xl border border-[#FFD800]/60 bg-[#FFD800]/10 px-4 py-3 text-sm text-[#FFD800]">
            Artista seleccionado: <span className="font-bold">{selectedArtist.name}</span>
          </div>
        )}

        {emptyStateMessage && (
          <p className="text-sm text-white/70">{emptyStateMessage}</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((artist) => {
              const artistImage = artist.images?.[0]?.url;
              const isSelected = selectedArtist?.id === artist.id;

              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => handleSelectArtist(artist)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-[#FFD800] bg-[#FFD800]/10"
                      : "border-white/15 bg-black/45 hover:border-white/30"
                  }`}
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-white/10">
                    {artistImage ? (
                      <Image
                        src={artistImage}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">
                      {artist.name}
                    </p>
                    <p className="text-xs text-white/70">
                      Seguidores: {formatFollowers(artist.followers?.total)}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {artist.genres?.slice(0, 2).join(" - ") || "Genero no disponible"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
