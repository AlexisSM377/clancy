/* eslint-disable @next/next/no-img-element */
import { cn } from "../lib/utils"
import { TopLogo } from "./logos/top"
import { formatEventTimeWithTimeZoneName } from "./utilities/timezone"

interface Props {
    transition?: boolean
    className?: string
    album: {
        total_tracks: number;
        id: string;
        images: { // Cambiar aquí
            url: string;
            height: number;
            width: number;
        }[];
        name: string;
        colorPalette: {
            bg: string;
            borders: {
                outside: string;
                inside: string;
            };
            shadowColor: string;
        };
    };
    user: {
        username: string
        avatar: string
    }
    isSizeFixed?: boolean
    idPrimary?: string
    handleRemoveTrack?: (index: number) => void
    selectedTrack?: {
        list: (string | number)[]
        limit: number
    }
}
export default function TicketPlatinum({
    transition = true,
    album: { id, images },
    user,
    isSizeFixed = false
}: Props) {
    const timeZone = 'America/Mexico_City'
    const { username, avatar } = user

    return (
        <div
            id={id}
            className={cn(
                'block h-full overflow-hidden rounded-[35px] border-2 border-transparent p-5',
                isSizeFixed ? 'aspect-[2/1] w-full' : 'aspect-none w-full md:aspect-[2/1]',
                transition ? 'transition duration-500 ease-in-out' : '',
            )}
        >
            <div
                className={cn(
                    'relative h-full overflow-hidden rounded-[35px] ticket-premium-bg',
                    isSizeFixed ? 'flex' : 'grid md:flex',
                    transition ? 'transition duration-500 ease-in-out' : '',
                )}
            >
                <div className='absolute w-1/2 rotate-45 h-[300%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#41b3ff00] via-[#b0a9ff13] to-[#41b3ff00]'></div>
                <span
                    className={cn(
                        'h-full font-bold text-center text-[#FFD800] uppercase',
                        isSizeFixed
                            ? 'ticket-dash-border px-4 text-3xl py-0 leading-none [writing-mode:vertical-lr]'
                            : 'ticket-dash-border-top row-[3/4] px-4 py-4 md:py-0 text-2xl md:px-4 md:text-xl md:[writing-mode:vertical-lr] md:ticket-dash-border'
                    )}
                >
                    Twenty one Pilots
                </span>
                {
                    <div
                        key={username}
                        className={cn(
                            '-rotate-12 sm:pl-28 sm:pt-4',
                            isSizeFixed
                                ? 'absolute bottom-[20%] left-[25%] mb-0 h-[40%] w-auto block'
                                : 'md:w-auto row-[2/3] mb-8 md:mb-0 left-0 mx-auto md:mx-0 h-32 md:h-[40%] relative flex justify-center w-full md:block bottom-0 md:left-[25%] md:bottom-[20%] md:absolute'
                        )}
                    >
                        <img
                            src={images[0].url}
                            alt="Descripción de la imagen"
                            className="absolute z-40 w-auto h-full"
                            />
                            <img
                            src={images[0].url}
                            alt="Descripción de la imagen"
                            className="absolute w-auto h-full scale-105 blur-xl -z-10 opacity-40"
                            />
                    </div>
                }
                <div
                    className={cn(
                        'z-10 grid w-full grid-rows-2',
                        isSizeFixed
                            ? 'h-full pd-0 grid-rows-2'
                            : 'h-auto md:h-full pt-5 md:pt-0 grid-rows-[1fr_auto] md:grid-rows-2'
                    )}
                >
                    <div className={cn('grid', isSizeFixed ? 'grid-cols-2' : 'md:grid-cols-2')}>
                        <div className="h-max">
                            {avatar ? (
                                <div
                                    className={cn(
                                        'flex items-end justify-start font-bold gap-4 gap-y-2',
                                        isSizeFixed
                                            ? 'items-start flex-row p-6 text-left'
                                            : 'p-5 flex-col md:items-start md:flex-row md:p-6 items-center text-center md:text-left'
                                    )}
                                >
                                    <img
                                        src={avatar}
                                        crossOrigin="anonymous"
                                        className={cn(
                                            'block rounded-full',
                                            isSizeFixed ? 'w-[78px] h-[78px]' : 'w-20 h-20 md:w-[78px] md:h-[78px]'
                                        )}
                                        alt={`Avatar de ${username}`}
                                        width='78'
                                        height='78'
                                    />
                                    <div>
                                        <p className='text-lg  font-bold '>{username}</p>
                                        <span className='block px-3 py-1 mt-1 text-xs font-medium rounded-tl rounded-br rounded-bl-xl rounded-tr-xl w-max text-white/80 bg-white/10'>
                                            The Clancy World Tour
                                        </span>
                                    </div>

                                </div>
                            ) : (
                                <NotAvatarUser isSizeFixed={isSizeFixed} />
                            )}
                        </div>
                        <div
                            className={cn(
                                'items-center gap-4 p-5 flex-row',
                                isSizeFixed && avatar
                                    ? 'block'
                                    : `${avatar ? 'hidden' : 'flex'} md:block flex-col-reverse md:flex-row`,
                                avatar == null ?? 'hidden'
                            )}
                        >

                            <TopLogo className={cn('order-1 h-auto', isSizeFixed ? 'ml-auto' : 'ml-0 md:ml-auto')} />
                            <time
                                dateTime='2025-02-20T9:00:00'
                                className={cn(
                                    'block mt-2 ml-auto font-bold text-right text-white md:ml-0',
                                    isSizeFixed ? 'text-right mr-0' : 'text-center mr-auto md:mr-0 md:text-right'
                                )}
                            >
                                Feb. 20 2025
                                <span
                                    className={cn(
                                        'block text-sm font-normal text-white/60',
                                        !isSizeFixed && 'animate-blurred-fade-in'
                                    )}
                                >
                                    {timeZone == null ? '' : formatEventTimeWithTimeZoneName(1740063600000, timeZone)}
                                </span>
                            </time>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

const NotAvatarUser = ({ isSizeFixed }: { isSizeFixed: boolean }) => {
    return (
        <div
            className={cn(
                'flex items-end justify-start gap-4 text-white gap-y-2',
                isSizeFixed
                    ? 'items-start flex-row p-6 text-left'
                    : 'p-5 flex-col md:items-start md:flex-row md:p-6 items-center text-center md:text-left'
            )}
        >
            <div>
                <p className='text-xl font-bold'>
                    <span className='opacity-75 text-top-primary'>#</span>theclancyworldtour
                </p>
                <span className='block text-sm font-normal w-max text-white/60'>
                    Twenty one Pilots
                </span>
            </div>
        </div>
    )
}
