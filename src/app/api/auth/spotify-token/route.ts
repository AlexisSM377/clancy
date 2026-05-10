import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

type AccountRow = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
};

async function refreshSpotifyToken(account: AccountRow): Promise<string | null> {
  if (!account.refreshToken) return null;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const newAccessToken: string = data.access_token;
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
  const newRefreshToken: string = data.refresh_token ?? account.refreshToken;

  db.prepare(
    "UPDATE account SET accessToken = ?, refreshToken = ?, accessTokenExpiresAt = ? WHERE id = ?"
  ).run(newAccessToken, newRefreshToken, expiresAt, account.id);

  return newAccessToken;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ accessToken: null }, { status: 401 });
  }

  const account = db
    .prepare(
      "SELECT id, accessToken, refreshToken, accessTokenExpiresAt FROM account WHERE userId = ? AND providerId = 'spotify' LIMIT 1"
    )
    .get(session.user.id) as AccountRow | undefined;

  if (!account) {
    return Response.json({ accessToken: null });
  }

  const isExpired =
    !account.accessTokenExpiresAt ||
    new Date(account.accessTokenExpiresAt) <= new Date(Date.now() + 60_000);

  if (isExpired) {
    const refreshed = await refreshSpotifyToken(account);
    return Response.json({ accessToken: refreshed });
  }

  return Response.json({ accessToken: account.accessToken });
}
