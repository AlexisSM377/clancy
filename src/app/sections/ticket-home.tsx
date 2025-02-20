"use client";
import { useState } from "react";
import { Container3D } from "../components/Container3D";
import Ticket from "../components/Ticket";
import { TRACKS as initialTracks } from "@/app/artist/tracks";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const TicketHome = () => {
  const { data: session, status } = useSession();
  const route = useRouter()
  const [tracks] = useState(initialTracks);

  const trackSelected = tracks[0];


  return (
    <div>
      <div className="block w-full h-full px-4">
        <div className="flex items-center justify-center max-w-[700px] mx-auto mt-16 flex-0">
          <Container3D>
            <Ticket
              transition={true}
              flavor={trackSelected}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || 'Clancy',
              }}
            />
          </Container3D>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mx-auto scale-90 md:flex-row sm:scale-100 py-[80px]">
          {status === "authenticated" && (
            <button
              className="group relative h-12 w-72 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
              onClick={() => route.push("/ticket")}
            >
              Ver Ticket

            </button>
          )}
          {status === "unauthenticated" && (
            <button
              className="group relative h-12 w-72 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
              onClick={async () => {
                await signIn("spotify", {
                  callbackUrl: "/ticket",
                  redirect: false,
                });
              }}
            >
              Login
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
