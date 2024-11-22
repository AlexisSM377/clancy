"use client";
import { useEffect, useState } from "react";
import { Container3D } from "../components/Container3D";
import Ticket from "../components/Ticket";
import { FLAVORS } from "../flavors/data";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

interface TicketHomeProps {
  initialFlavor?: string;
}

export const TicketHome = ({ initialFlavor }: TicketHomeProps) => {
  const { data: session, status } = useSession();
  const [flavor, setFlavor] = useState(
    FLAVORS[initialFlavor] ?? FLAVORS.clancy
  );

  useEffect(() => {
    if (initialFlavor) return;
    const keys = Object.keys(FLAVORS);
    const length = keys.length;

    const intervalID = setInterval(() => {
      const randomKey = keys[Math.floor(Math.random() * length)];
      setFlavor(FLAVORS[randomKey]);
    }, 2500);

    return () => {
      clearInterval(intervalID);
    };
  }, [initialFlavor]);

  return (
    <div>
      <div className="block w-full h-full">
        <div className="flex items-center justify-center max-w-[700px] mx-auto mt-16 flex-0">
          <Container3D>
            <Ticket
              transition={true}
              flavor={flavor}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || 'Clancy',
              }}
            />
          </Container3D>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mx-auto mt-16 scale-90 md:flex-row sm:scale-100">
          {status === "authenticated" && (
            <button
              className="group relative h-12 w-72 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
              onClick={() => {
                signOut();
              }}
            >
              Logout
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
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
