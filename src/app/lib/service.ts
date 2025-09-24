import { getSession } from "next-auth/react";

// Extend the session type to include accessToken
interface ExtendedSession {
  accessToken?: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

// URL base de la API de Spotify
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

// Función genérica para realizar solicitudes a la API de Spotify
const fetchSpotifyAPI = async (endpoint: string, method: string = "GET", body?: unknown) => {
  const session = await getSession() as ExtendedSession;

  if (!session?.accessToken) {
    throw new Error("No hay una sesión activa o el token de acceso no está disponible.");
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SPOTIFY_API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Error al realizar la solicitud a la API de Spotify");
  }

  return response.json();
};

// Obtener información del perfil del usuario
export const getCurrentUserProfile = async () => {
  return fetchSpotifyAPI("/me");
};

// Obtener las canciones más escuchadas del usuario
export const getTopTracks = async (limit: number = 50, timeRange: string = "short_term") => {
  return fetchSpotifyAPI(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
};

// Obtener los artistas más escuchados del usuario
export const getTopArtists = async (limit: number = 10, timeRange: string = "medium_term") => {
  return fetchSpotifyAPI(`/me/top/artists?limit=${limit}&time_range=${timeRange}`);
};

// Obtener información de una canción específica
export const getTrack = async (trackId: string) => {
  return fetchSpotifyAPI(`/tracks/${trackId}`);
};

// Obtener información de un álbum específico
export const getAlbum = async (albumId: string) => {
  return fetchSpotifyAPI(`/albums/${albumId}`);
};

// Obtener información de un artista específico
export const getArtist = async (artistId: string) => {
  return fetchSpotifyAPI(`/artists/${artistId}`);
};

// Obtener las canciones de un álbum específico
export const getAlbumTracks = async (albumId: string, limit: number = 10) => {
  return fetchSpotifyAPI(`/albums/${albumId}/tracks?limit=${limit}`);
};

// Obtener las canciones más populares de un artista
export const getArtistTopTracks = async (artistId: string, country: string = "US") => {
  return fetchSpotifyAPI(`/artists/${artistId}/top-tracks?market=${country}`);
};

// Buscar elementos (canciones, artistas, álbumes, etc.)
export const search = async (query: string, type: string = "track", limit: number = 10) => {
  return fetchSpotifyAPI(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
};