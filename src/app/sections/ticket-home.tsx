"use client";
import { useEffect, useState } from "react";
import { Container3D } from "../components/Container3D";
import Ticket from "../components/Ticket";
import { FLAVORS } from "../flavors/data";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { DrumIcon } from "../components/icons/music";
import { TicketIcon } from "../components/icons/ticket";

interface TicketHomeProps {
  initialFlavor?: string;
}

export const TicketHome = ({ initialFlavor }: TicketHomeProps) => {
  const { data: session, status } = useSession();
  const route = useRouter()
  const [flavor, setFlavor] = useState(
    FLAVORS[initialFlavor] ?? FLAVORS.twentyonepilots
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
      <div className="block w-full h-full px-4">
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
        <div className="flex flex-col items-center justify-center gap-4 mx-auto scale-90 md:flex-row sm:scale-100 py-[80px]">
          {status === "authenticated" && (
            <Button variant="secondary" type="button"
              className="text-2xl py-5 px-5 gap-x-4 trasution duration-300 ease-in-out transform hover:scale-110"
              onClick={() => route.push("/ticket")}
            >
              <TicketIcon />
              Ver Ticket

            </Button>
          )}
          {status === "unauthenticated" && (
            <Button variant="secondary" type="button"

              onClick={async () => {
                await signIn("spotify", {
                  callbackUrl: "/ticket",
                  redirect: false,
                });
              }}
            >
              <DrumIcon />
              Iniciar sesión

            </Button>

          )}
        </div>
      </div>
    </div>
  );
};
