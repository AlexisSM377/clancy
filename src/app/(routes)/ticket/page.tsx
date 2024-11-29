"use client";
import { Background } from "@/app/components/Background";
import { Container3D } from "@/app/components/Container3D";
import Ticket from "@/app/components/Ticket";
import { FLAVORS } from "@/app/flavors/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  selectedFlavor?: string;
}


export default function Page({
  selectedFlavor = "twentyonepilots",
}: Props) {

  const [flavorKey, setFlavoyKey] = useState(() => {
    if (Object.keys(FLAVORS).includes(selectedFlavor)) {
      return selectedFlavor
    }
    return "twentyonepilots"
  })

  const flavor = FLAVORS[flavorKey]
  const router = useRouter()


  return (
    <Background>

      <div aria-disabled className="w-[800px] -mb-[366px] relative -left-[200vw]">
        <div className="border-[16px] border-transparent">

          <Ticket
            isSizeFixed
            transition={false}
            flavor={flavor}
            user={{
              avatar: "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
              username: "Clancy",
            }}

          />
        </div>
      </div>
      <main className="max-w-screen-xl mx-auto mt-40 pb-20 gap-8 px-4 flex flex-col lg:grid grid-cols-[auto_1fr] items-center">
        <div>
          <div className="w-auto">
            <div className="max-w-[400px] md:max-w-[700px] md:w-[700px] mx-auto">
              <Container3D>
                <Ticket

                  flavor={flavor}
                  user={{
                    avatar: "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                    username: "Clancy",
                  }}
                />
              </Container3D>
            </div>
          </div>
        </div>
        <div className="w-full md:order-none">
          <div>
            <h2 className="text-2xl font-bold text-white lg:pl-8">Material</h2>
            <div className="flex flex-wrap items-center px-8 py-3 gap-x-2 gap-y-2">
              <button>
                Canciones
              </button>
              <button>
                Albunes
              </button>
            </div>
          </div>

        </div>
        <button className="bg-slate-900 p-3 rounded-2xl text-2xl" onClick={() => router.push('/')}>
          Regresar
        </button>
      </main>
    </Background>
  );
}
