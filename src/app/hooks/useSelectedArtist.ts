"use client";

import { useArtistContext } from "@/app/context/ArtistContext";

export function useSelectedArtist() {
  const { selectedArtist, isHydrated, selectArtist, clearArtist } =
    useArtistContext();

  return {
    selectedArtist,
    isHydrated,
    selectArtist,
    clearArtist,
  };
}
