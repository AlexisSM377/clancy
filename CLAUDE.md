# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

No test suite configured.

## Environment Variables

Required in `.env.local`:
```
AUTH_SPOTIFY_ID=
AUTH_SPOTIFY_SECRET=
AUTH_SECRET=
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=   # defaults to http://localhost:3000
```

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + NextAuth 5 (beta)

This is a Spotify-integrated ticket generator. Users sign in with Spotify OAuth, search for an artist, and get a personalized ticket showing their top tracks and artist data.

### Data Flow

```
NextAuth SessionProvider (JWT with accessToken)
  → ArtistContext (localStorage persistence, hydration-safe)
    → Spotify API calls in src/app/lib/service.ts
      → Ticket rendering in src/app/(routes)/ticket/
```

### Key directories

- `src/app/(routes)/` — pages: `select-artist` (Step 1), `ticket` (Step 2), `blog`
- `src/app/api/auth/[...nextauth]/` — NextAuth route handler
- `src/app/artist/` — Server Components: `albums.tsx`, `tracks.tsx`
- `src/app/components/` — UI components (icons/, streaming/, logos/, utilities/)
- `src/app/context/ArtistContext.tsx` — client-side selected artist state
- `src/app/lib/service.ts` — all Spotify API calls (typed, uses session accessToken)
- `src/app/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/auth.js` — NextAuth config (Spotify provider, scopes, JWT callback)
- `src/middleware.ts` — auth-based route protection

### Auth

NextAuth 5 beta with Spotify OAuth. Scopes: `user-read-email`, `user-top-read`, `user-read-private`. The `accessToken` is stored in the JWT and passed into `session.accessToken` for use in Spotify API calls.

### Spotify API (`src/app/lib/service.ts`)

All functions accept `accessToken: string` and return typed data. Key functions: `getTopArtists`, `getTopTracks`, `getArtistDetails`, `getArtistTracks`, `getArtistAlbums`, `searchArtist`.

### Styling conventions

- Path alias: `@/*` → `./src/*`
- Custom Tailwind colors: `top.primary` (#0099FF), `top.secondary` (#DEF2FF)
- Custom breakpoint: `base: 1000px`
- Custom plugins: `tailwindcss-textshadow`, `@midudev/tailwind-animations`
- Use `cn()` from `@/lib/utils` for conditional class merging

### Remote images

`next.config.ts` allows images from `i.scdn.co` (Spotify CDN) and `ishopmx.vtexassets.com`.

### Ticket export

`html-to-image` (`toJpeg`) is used to generate downloadable ticket images from the DOM.
