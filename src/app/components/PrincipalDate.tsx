'use client'
import { useEffect } from "react"


export function PrincipalDate() {

    useEffect(() => {
        const END_DATE = 1740063600000;
        const d = new Date(END_DATE);
        const date = d.toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
        });

        // get current timezone
        const tzOffset = d.getTimezoneOffset() / 60;
        const diff = tzOffset * -1;
        const gmt = diff > 0 ? `GMT+${diff}` : `GMT-${Math.abs(diff)}`;

        const TZ_DICTIONARY: { [key: string]: string } = {
            "GMT-6": "CDMX",
            "GMT-5": "NYC",
            "GMT+1": "Londres",
            "GMT+2": "Berlin",
            "GMT+9": "Tokio",
        };

        const tz = TZ_DICTIONARY[gmt] ?? gmt;

        const selfScript = document.getElementById('date-time');
        if (selfScript) {
            selfScript.innerHTML = `${date} H ${tz}`;
        }
    }, [])
    return (
        <section className="mt-14 mx-auto flex flex-col justify-center items-center text-center">
            <h2 className="uppercase text-2xl sm:text-3xl font-semibold">
                20 de febrero de 2025 <span aria-hidden className="hidden md:inline mx-3">·</span>
                <br aria-hidden className="block md:hidden" />
                <span id="date-time"></span>
            </h2>
            <h3 className="uppercase text-2xl font-medium flex max-w-2xl mt-6 flex-col gap-y-2">
                <span className="text-[#FFD800]">Twenty One Pilots</span>
                <span className="text-[#E23D2E]">The clancy Word Tour</span>
                <span>Cdmx, DF Estadio GNP Seguros</span>
            </h3>
        </section>
    )
}