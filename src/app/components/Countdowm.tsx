'use client';
import { useEffect, useState } from "react";

export function Countdowm() {
    const TIMESTAMP = 1740063600000;
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    })

    useEffect(() => {
        const date = new Date(TIMESTAMP).getTime()

        const formatTime = (time: number) => {
            return Math.floor(time).toString().padStart(2, '0')
        }

        const updateCountdown = () => {
            const now = Date.now()
            const diff = date - now

            setTimeLeft({
                days: formatTime(diff / DAY),
                hours: formatTime((diff % DAY) / HOUR),
                minutes: formatTime((diff % HOUR) / MINUTE),
                seconds: formatTime((diff % MINUTE) / SECOND)
            })
        }

        const intervalId = setInterval(updateCountdown, SECOND)
        return () => clearTimeout(intervalId)
    })
    return (
        <section className="my-24 flex flex-col gap-y-10 justify-center items-center">
            <div className="flex flex-row gap-x-2 uppercase font-semibold">
                <div className="flex flex-col justify-center items-center gap-y-2 w-16">
                    <span className="text-8xl tabular-nums text-[#E23D2E]">{timeLeft.days}</span>
                    <span className="text-xs text-center">Días</span>
                </div>

                <span aria-hidden="true" className="mt-8 px-8 text-xl">:</span>

                <div className="flex flex-col justify-center items-center gap-y-2 w-16">
                    <span className="text-8xl tabular-nums text-[#FFD800]">{timeLeft.hours}</span>
                    <span className="text-xs text-center">Horas</span>
                </div>

                <span aria-hidden="true" className="mt-8 px-8 text-xl">:</span>

                <div className="flex flex-col justify-center items-center gap-y-2 w-16">
                    <span className="text-8xl tabular-nums text-[#E23D2E]">{timeLeft.minutes}</span>
                    <span className="text-xs text-center">Minutos</span>
                </div>

                <span aria-hidden="true" className="mt-8 px-8 text-xl">:</span>

                <div className="flex flex-col justify-center items-center gap-y-2 w-16">
                    <span className="text-8xl tabular-nums text-[#FFD800]">{timeLeft.seconds}</span>
                    <span className="text-xs text-center">Segundos</span>
                </div>
            </div>
        </section>
    )
}