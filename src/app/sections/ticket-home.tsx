'use client'
import { useEffect, useState } from "react"
import { Container3D } from "../components/Container3D"
import Ticket from "../components/Ticket"
import { FLAVORS } from "../flavors/data"
import { useRouter } from "next/navigation"

interface TicketHomeProps {
    initialFlavor?: string
}

export const TicketHome = ({ initialFlavor }: TicketHomeProps) => {
    const router = useRouter()
    const [flavor, setFlavor] = useState(FLAVORS[initialFlavor] ?? FLAVORS.clancy)

    useEffect(() => {
        if (initialFlavor) return
        const keys = Object.keys(FLAVORS)
        const length = keys.length

        const intervalID = setInterval(() => {
            const randomKey = keys[Math.floor(Math.random() * length)]
            setFlavor(FLAVORS[randomKey])
        }, 2500)

        return () => {
            clearInterval(intervalID)
        }
    }, [initialFlavor])

    return (
        <div>
            <div className="block w-full h-full">
                <div className="flex items-center justify-center max-w-[700px] mx-auto mt-16 flex-0">
                    <Container3D>
                        <Ticket
                            transition={true}
                            flavor={flavor}
                            user={{
                                avatar: 'https://unavatar.io/github/AlexisSM377', username: 'Aleckcrank'
                            }}
                        />
                    </Container3D>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 mx-auto mt-16 scale-90 md:flex-row sm:scale-100">
                    <button onClick={() => router.push('/ticket')}>
                        Personalizar Ticket
                    </button>
                </div>
            </div>
        </div>
    )
}