import { Blurryface } from "../components/icons/blurryface";
import { Clancy } from "../components/icons/clancy";
import { TwentyOnePilots } from "../components/icons/twentyonepilots";

export const FLAVORS = {
    twentyonepilots: {
        icon: TwentyOnePilots,
        colorPalette: {
            bg: 'bg-[#89c23e]/80',
            borders: {
                inside: 'border-green-300/20',
                outside: 'border-green-400/10'
            },
            shadowColor: 'shadow-green-400/25'
        },
    },

    blurryface: {
        icon: Blurryface,
        colorPalette: {
            bg: "bg-[#000000]/80",
            borders: {
                outside: "border-black-300/30",
                inside: "border-black-400/20",
            },
            shadowColor: "shadow-black-400/25",
        },
    },
    clancy: {
        icon: Clancy,
        colorPalette: {
            bg: "bg-[#D62420]/80",
            borders: {
                outside: "border-red-300/20",
                inside: "border-red-400/10",
            },
            shadowColor: "shadow-red-400/25",
        },
    }
}