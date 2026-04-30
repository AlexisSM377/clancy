import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

type AccountRow = { accessToken: string | null };

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ accessToken: null }, { status: 401 });
  }

  const account = db
    .prepare(
      "SELECT accessToken FROM account WHERE userId = ? AND providerId = 'spotify' LIMIT 1"
    )
    .get(session.user.id) as AccountRow | undefined;

  return Response.json({ accessToken: account?.accessToken ?? null });
}
