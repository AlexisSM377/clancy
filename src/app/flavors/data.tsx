import { Blurryface } from "../components/icons/blurryface";
import { Clancy } from "../components/icons/clancy";
import { TwentyOnePilots } from "../components/icons/twentyonepilots";
import { Vessel } from "../components/icons/vessel";

export const FLAVORS = {
    twentyonepilots: {
        title: 'Twenty One Pilots',
        img: 'https://i.scdn.co/image/ab67616d0000b2739cf15c7323fb85b7112197d5',
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
        title: 'Blurryface',
        img: 'https://i.scdn.co/image/ab67616d0000b2739cf15c7323fb85b7112197d5',
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
        title: "Clancy",
        img: 'https://i.scdn.co/image/ab67616d0000b2739cf15c7323fb85b7112197d5',
        colorPalette: {
            bg: "bg-[#D62420]/80",
            borders: {
                outside: "border-red-300/20",
                inside: "border-red-400/10",
            },
            shadowColor: "shadow-red-400/25",
        },
    },
    vessel: {
        title: "Vessel",
        img: 'https://i.scdn.co/image/ab67616d0000b2739cf15c7323fb85b7112197d5',
        colorPalette: {
            bg: "bg-[#989898]/90",
            borders: {
                outside: "border-white-300/20",
                inside: "border-white-400/10",
            },
            shadowColor: "shadow-white-400/25",
        },
    }
}