"use client";
import { BackgroundTicket } from "@/app/components/BackgroundTicket";
import { Button } from "@/app/components/Button";
import { Container3D } from "@/app/components/Container3D";
import { Blurryface } from "@/app/components/icons/blurryface";
import { Clancy } from "@/app/components/icons/clancy";
import { DownloadIcon } from "@/app/components/icons/download";
import { InstagramIcon } from "@/app/components/icons/instagram";
import { LogoutIcon } from "@/app/components/icons/logout";
import Ticket from "@/app/components/Ticket";
import TicketPlatinum from "@/app/components/TicketPlatinum";
import { Tooltip } from "@/app/components/Tooltip";
import { FLAVORS } from "@/app/flavors/data";
import { cn } from "@/app/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const MATERIALS_LIST = {
  STANDARD: 'standard',
  PLATINUM: 'platinum',
}


export default function Page({
  selectedFlavor = "twentyonepilots",
  material: defaultMaterial = MATERIALS_LIST.STANDARD,
  // tracks = [],
}) {
  const { data: session, status } = useSession()
  const [selectedMaterial, setSelectedMaterial] = useState(defaultMaterial)

  // const [selectedTrack, setSelectedTrack] = useState(() => {
  //   const currentTrack = tracks.map((track) => (track === 'null' ? null : track))
  //   const currentList = tracks.map((track) => {
  //     if (track === 'null') return null
  //     const trackComponent = TRACKS_LIST.find(({name}) => name === track)
  //     return trackComponent?.TrackImage
  //   })
  //   return {
  //     namesList: currentTrack,
  //     list: currentList
  //   }
  // })

  // const handleSelectTrack = async (track, nameTrack) => {
  //   const newTracks = selectedTrack.list
  //   const newTracksNames = selectedTrack.namesList
  //   const limitTracks = 3
  //   const index = newTracks.findIndex((track, i) => track == null && i + 1 <= limitTracks)

  //   index === -1 ? (newTracks[limitTracks -1] = track) : (newTracks[index] = track)
  //   index === -1
  //       ? (newTracksNames[limitTracks -1] = nameTrack)
  //       : (newTracksNames[index] = nameTrack)

  //   setSelectedTrack({ list: newTracks, namesList: newTracksNames})

  //   const {dataURL} = await h
  // }

  const [flavorKey, setFlavoyKey] = useState(() => {
    if (Object.keys(FLAVORS).includes(selectedFlavor)) {
      return selectedFlavor
    }
    return "twentyonepilots"
  })

  const flavor = FLAVORS[flavorKey as keyof typeof FLAVORS]


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
          {selectedMaterial === MATERIALS_LIST.PLATINUM && (
            <TicketPlatinum
              isSizeFixed
              transition={false}
              flavor={flavor}
              user={{
                avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                username: session?.user?.image || "Clancy",
              }}
              handleRemoveTrack={() => { }}
            />
          )}

        </div>
      </div>
      <main className="max-w-screen-xl mx-auto mt-40 pb-20 gap-8 px-4 flex flex-col lg:grid grid-cols-[auto_1fr] items-center">
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
                {selectedMaterial === MATERIALS_LIST.PLATINUM && (

                  <TicketPlatinum

                    flavor={flavor}
                    user={{
                      avatar: session?.user?.image || "https://ishopmx.vtexassets.com/arquivos/ids/292869-800-auto?v=638508807931370000&width=800&height=auto&aspect=true",
                      username: session?.user?.name || "Clancy",
                    }}
                    handleRemoveTrack={() => { }}
                  />
                )}
              </Container3D>
            </div>
            <div className={cn(
              'w-2/3 mx-auto h-6 rounded-[50%] mt-6 transition-colors duration-300 blur-lg',
              flavor.colorPalette?.bg,
              selectedMaterial === MATERIALS_LIST.PLATINUM && 'bg-[#E23D2E]'
            )}
            ></div>
          </div>
          <div className="flex flex-col items-center w-full px-8 mt-16 mb-16 gap-x-10 gap-y-4 lg:mb-0 lg:mt-4 md:flex-row"></div>
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
                onClick={async () => await setSelectedMaterial(MATERIALS_LIST.PLATINUM)}
                className={cn(
                  'py-3 transition-all',
                  MATERIALS_LIST.PLATINUM !== selectedMaterial &&
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
              {Object.entries(FLAVORS).map(([key, { icon: Icon }]) => {
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

                        <Icon className="h-auto rounded-sm" />
                      </div>
                    </button>
                  </Tooltip>
                )
              })}

            </div>

          </div>

        </div>
        <div className="flex flex-col items-center w-full px-8 mt-16 mb-16 gap-x-10 gap-y-4 lg:mb:0 lg:mt-4 md:flex-row">
          <Button
            variant="secondary"
            type="button"
          >
            <InstagramIcon />
            Compartir
          </Button>
          <Button
            variant="secondary"
            type="button"
          >
            <DownloadIcon />
            Descargar
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
      </main>

    </BackgroundTicket>
  );
}


export const TRACKS_LIST = [
  {
    name: "The Hype",
    TrackImage: Clancy,
  },
  {
    name: "The Hype",
    TrackImage: Blurryface,
  }
]
