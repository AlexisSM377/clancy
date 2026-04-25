"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SELECTED_ARTIST_STORAGE_KEY = "clancy:selected-artist";

export type SelectedArtist = {
  id: string;
  name: string;
  image?: string;
  followers?: number;
  genres?: string[];
  externalUrl?: string;
};

type ArtistContextValue = {
  selectedArtist: SelectedArtist | null;
  isHydrated: boolean;
  selectArtist: (artist: SelectedArtist) => void;
  clearArtist: () => void;
};

const ArtistContext = createContext<ArtistContextValue | undefined>(undefined);

const isValidArtist = (value: unknown): value is SelectedArtist => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeArtist = value as Partial<SelectedArtist>;
  return (
    typeof maybeArtist.id === "string" && typeof maybeArtist.name === "string"
  );
};

const readStoredArtist = (): SelectedArtist | null => {
  try {
    const rawValue = window.localStorage.getItem(SELECTED_ARTIST_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!isValidArtist(parsedValue)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
};

export function ArtistProvider({ children }: { children: React.ReactNode }) {
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedArtist = readStoredArtist();

    if (storedArtist) {
      setSelectedArtist(storedArtist);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!selectedArtist) {
      window.localStorage.removeItem(SELECTED_ARTIST_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      SELECTED_ARTIST_STORAGE_KEY,
      JSON.stringify(selectedArtist)
    );
  }, [isHydrated, selectedArtist]);

  const selectArtist = useCallback((artist: SelectedArtist) => {
    setSelectedArtist(artist);
  }, []);

  const clearArtist = useCallback(() => {
    setSelectedArtist(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedArtist,
      isHydrated,
      selectArtist,
      clearArtist,
    }),
    [selectedArtist, isHydrated, selectArtist, clearArtist]
  );

  return <ArtistContext.Provider value={value}>{children}</ArtistContext.Provider>;
}

export function useArtistContext() {
  const context = useContext(ArtistContext);

  if (!context) {
    throw new Error("useArtistContext must be used within ArtistProvider");
  }

  return context;
}
