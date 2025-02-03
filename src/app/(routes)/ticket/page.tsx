"use client";
import { BackgroundTicket } from "@/app/components/BackgroundTicket";
import { Button } from "@/app/components/Button";
import { Container3D } from "@/app/components/Container3D";
import { DownloadIcon } from "@/app/components/icons/download";
import { LogoutIcon } from "@/app/components/icons/logout";
import Ticket from "@/app/components/Ticket";
import TicketPlatinum from "@/app/components/TicketPlatinum";
import { Tooltip } from "@/app/components/Tooltip";
import { FLAVORS } from "@/app/flavors/data";
import { cn } from "@/app/lib/utils";
import { toJpeg } from "html-to-image";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

const MATERIALS_LIST = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
}

interface Material {
  buttonStatus: string,
  isMaterialChange: string,
  flavorKey: string
}


export default function Page({
  selectedFlavor = "twentyonepilots",
  material: defaultMaterial = MATERIALS_LIST.STANDARD,
}) {
  const [buttonText, setButtonText] = useState(STEPS_LOADING.ready)
  const { data: session, status } = useSession()
  const [selectedMaterial, setSelectedMaterial] = useState(defaultMaterial)



  const [flavorKey, setFlavoyKey] = useState(() => {
    if (Object.keys(FLAVORS).includes(selectedFlavor)) {
      return selectedFlavor
    }
    return "twentyonepilots"
  })

  const flavor = FLAVORS[flavorKey as keyof typeof FLAVORS]

  const useTicketSave = ({ buttonStatus, isMaterialChange, flavorKey }: Material) => {
    const [generatedImage, setGeneratedImage] = useState(null)

    const saveButtonText = useMemo(() => {
      if (buttonStatus === STEPS_LOADING.generate) return 'Creando...'
      return 'Guardar'
    }, [buttonStatus])

    useEffect(() => {
      toJpeg(document.getElementById('ticket'), {
        quality: 0.95,
      }).then(handleSaveImage)
    }, [isMaterialChange, flavorKey])

    const handleSaveImage = (dataURL) => {
      setGeneratedImage(dataURL)
    }

    return { generatedImage, handleSaveImage, saveButtonText }
  }

  const { generatedImage, handleSaveImage, saveButtonText } = useTicketSave({
    buttonStatus: buttonText,
    isMaterialChange: selectedMaterial,
    flavorKey: flavorKey
  })

  return (
    <BackgroundTicket>
      <div aria-disabled className="w-[800px] -mb-[366px] relative -left-[200vw]">
        <div id='ticket' className="border-[16px] border-transparent">
          {selectedMaterial === MATERIALS_LIST.STANDARD && (

            <Ticket

              isSizeFixed
              transition={false}
              flavor={flavor}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || "Clancy",
              }}

            />
          )}
          {selectedMaterial === MATERIALS_LIST.PREMIUM && (
            <TicketPlatinum
              isSizeFixed

              transition={false}
              flavor={flavor}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.name || "Clancy",
              }}

            />
          )}

        </div>
      </div>
      <main className="max-w-screen-xl mx-auto mt-28 pb-20 gap-8 px-4 flex flex-col lg:grid grid-cols-[auto_1fr] items-center">
        <div>
          <div className="w-auto">
            <div className="max-w-[400px] md:max-w-[700px] md:w-[700px] mx-auto">
              <Container3D>
                {selectedMaterial === MATERIALS_LIST.STANDARD && (
                  <Ticket
                    flavor={flavor}
                    user={{
                      avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                      username: session?.user?.name || "Clancy",
                    }}
                  />
                )}
                {selectedMaterial === MATERIALS_LIST.PREMIUM && (

                  <TicketPlatinum

                    flavor={flavor}
                    user={{
                      avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                      username: session?.user?.name || "Clancy",
                    }}

                  />
                )}
              </Container3D>
            </div>
            <div className={cn(
              'w-2/3 mx-auto h-6 rounded-[50%] mt-6 transition-colors duration-300 blur-lg',
              flavor.colorPalette?.bg,
              selectedMaterial === MATERIALS_LIST.STANDARD && 'bg-[#FFD800]',
              selectedMaterial === MATERIALS_LIST.PREMIUM && 'bg-[#E23D2E]'
            )}
            ></div>
          </div>
          <div className="flex flex-col items-center w-full px-8 mt-16 mb-16 gap-x-10 gap-y-4 lg:mb-0 lg:mt-4 md:flex-row">
            <Button
              as="a"
              href={generatedImage}
              download="ticket.png"
              variant="secondary"
              type="button"
              disabled={buttonText !== STEPS_LOADING.ready}
            >
              <DownloadIcon />
              {saveButtonText}
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="ml-0 lg:ml-auto"
              onClick={() => {
                signOut(
                  { callbackUrl: '/' }
                )
              }}
            >
              <LogoutIcon />
              Cerrar sesión
            </Button>
          </div>
        </div>
        <div className="w-full md:order-none">
          <div>
            <h2 className="text-3xl font-bold text-[#FFD800] lg:pl-8">Twenty one Pilots</h2>
            <div className="flex flex-wrap items-center px-8 py-3 gap-x-2 gap-y-2">
              <Button
                onClick={async () => await setSelectedMaterial(MATERIALS_LIST.STANDARD)}
                className={cn(
                  'py-3 transition-all',
                  MATERIALS_LIST.STANDARD !== selectedMaterial &&
                  'bg-transparent border-transparent'
                )}
                variant="secondary"
              >
                Top canciones
              </Button>
              <Button
                onClick={async () => await setSelectedMaterial(MATERIALS_LIST.PREMIUM)}
                className={cn(
                  'py-3 transition-all',
                  MATERIALS_LIST.PREMIUM !== selectedMaterial &&
                  'bg-transparent border-transparent'
                )}
                variant="secondary">
                Álbumes
              </Button>
            </div>
          </div>
          <div className="w-full z-[99999] opacity-[.99] mt-10 md:mt-2">
            <h2 className="text-2xl font-bold lg:pl-8">Track</h2>
            <div className="flex flex-row w-full p-8 max-h-[24rem] overflow-x-auto text-center flex-nowrap md:flex-wrap gap-x-8 gap-y-12 lg:pb-20 hidden-scroll lg:flavors-gradient-list">
              {Object.entries(FLAVORS).map(([key, img]) => {
                return (
                  <Tooltip key={key} text={key} offsetNumber={16}>

                    <button
                      key={key}
                      className={`relative flex w-12 h-12 transition cursor:pointer group ${key === flavorKey
                        ? 'scale-125 pointer-events-none contrast-125 before:absolute before:rounded-full before:w-2 before:h-2 before:left-0 before:right-0 before:-top-4 before:mx-auto before:bg-yellow-200'
                        : ''
                        }`}
                      onClick={() => setFlavoyKey(key)}
                    >
                      <div className="flex items-center justify-center w-14 h-14 transition group-hover:scale-110">

                        <img
                          src={img.img}
                          alt={key}
                          className="h-auto"
                        />
                      </div>
                    </button>
                  </Tooltip>
                )
              })}

            </div>

          </div>

        </div>

      </main>

    </BackgroundTicket>
  );
}



const STEPS_LOADING = {
  ready: 'Compartir',
  generate: 'Generando...',
  sharing: 'Compartiendo...'
}
