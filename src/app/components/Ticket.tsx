/* eslint-disable @next/next/no-img-element */
import 'atropos/css'
import { cn } from '../lib/utils'
import { TopLogo } from './logos/top'
import { StreamingIcons } from './icons/streaming'

interface Props {
    transition?: boolean
    className?: string
    track: {
        id: string,
        track: string,
        album: string,
        albumId: string,
        icon: string
        colorPalette: {
            bg: string
            borders: {
                outside: string
                inside: string
            }
            shadowColor: string
        }
    }
    user: {
        username: string
        avatar: string
    }
    isSizeFixed?: boolean
    id?: string
    handleRemoveTrack?: (index: number) => void
    selectedTrack?: {
        list: (string | number)[]
        limit: number
    }
}
export default function Ticket({
    transition = true,
    className,
    track: { track, album, icon, colorPalette },
    user,
    isSizeFixed = false,
    id,
    handleRemoveTrack,
    selectedTrack
}: Props) {
    const { username, avatar } = user ?? {}


    const currentTicketStyles = {
        background: colorPalette?.bg ?? 'bg-[#101E5B]/65',
        borders: {
            outside: colorPalette?.borders.outside ?? 'border-top-primary/10',
            inside: colorPalette?.borders.inside ?? 'border-top-secondary/20',
        },
        shadowColor: colorPalette?.shadowColor ?? 'shadow-top-primary/25',
    }

    return (
        <div
            id={id}
            className={cn(
                'block h-full overflow-hidden opacity-100 rounded-[60px] shadow-[inset_0_4px_30px] bg-transparent border p-5',
                isSizeFixed ? 'aspect-[2/1] w-full' : 'aspect-none w-full md:aspect-[2/1]',
                currentTicketStyles.borders.outside,
                currentTicketStyles.shadowColor,
                transition ? 'transition duration-500 ease-in-out' : '',
                className
            )}
        >
            <div
                className={cn(
                    'relative h-full overflow-hidden border rounded-[40px]',
                    isSizeFixed ? 'flex' : 'grid md:flex',
                    currentTicketStyles.background,
                    currentTicketStyles.borders.inside,
                    transition ? 'transition duration-500 ease-in-out' : ''
                )}
            >
                <div className='absolute w-1/2 rotate-45 h-[300%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#41b3ff00] via-[#b0a9ff13] to-[#41b3ff00]'></div>
                <span
                    className={cn(
                        'h-full text-center text-[#FFD800] font-bold uppercase',
                        album === 'Trench' ? 'text-[#000]' : 'text-[#FFD800]',
                        isSizeFixed
                            ? 'ticket-dash-border px-4 text-2xl py-0 leading-none [writing-mode:vertical-lr]'
                            : 'ticket-dash-border-top row-[3/4] px-4 py-4 md:py-0 text-2xl md:px-4 md:text-xl md:[writing-mode:vertical-lr] md:ticket-dash-border'
                    )}
                >
                    Twenty one Pilots
                </span>
                {
                    <div
                        key={username}
                        className={cn(
                            '-rotate-12 xl:pl-28 mx-auto md:mx-0 md:pl-0 md:pr-5 md:pt-5 md:pb-0 md:row-[1/2] md:col-[1/3] md:absolute',
                            isSizeFixed
                                ? 'absolute bottom-[20%] left-[25%] mb-0 h-[40%] w-auto block'
                                : 'md:w-auto row-[2/3] mb-8 md:mb-0 left-0 mx-auto md:mx-0 h-32 md:h-[40%] relative flex justify-center w-full md:block bottom-0 md:left-[25%] md:bottom-[20%] md:absolute'
                        )}
                    >
                        <img className='absolute w-auto h-full' src={icon} />
                        <img className='absolute w-auto h-full scale-150 blur-xl -z-10 opacity-90' key={`${username}-shadow`} src={icon} />
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
                        <div className='h-max'>
                            {avatar ? (
                                <div
                                    className={cn(
                                        'flex items-end justify-start gap-4 text-white gap-y-2',
                                        isSizeFixed
                                            ? 'items-start flex-row p-6 text-left'
                                            : 'p-5 flex-col md:items-start md:flex-row md:p-6 items-center text-center md:text-left'
                                    )}
                                >
                                    <img
                                        src={avatar}
                                        crossOrigin='anonymous'
                                        alt={`Avatar de ${username}`}
                                        className={cn('block rounded-full', isSizeFixed ? 'w-[78px] h-[78px]' : 'w-20 h-20 md:w-[78px] md:h-[78px]')}
                                        width='78'
                                        height='78'
                                    />
                                    <div>
                                        <p className='text-lg  font-bold '>{username}</p>
                                        <span className='block px-3 py-1 mt-1 text-xs font-semibold rounded-full w-max text-white/80 bg-black/10 uppercase'>
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
                                    : `${avatar ? 'hidden' : 'flex'} md:block flex-col-reverse md:flex-row`
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
                                        'block text-sm font-normal text-white/60 mt-3',
                                        !isSizeFixed && 'animate-blurred-fade-in'
                                    )}
                                >
                                    9 p. m. CDMX
                                </span>

                            </time>

                        </div>
                    </div>
                    <div
                        className={cn(
                            'flex flex-row-reverse items-center w-auto h-auto gap-2 mx-auto md:ml-0',
                            isSizeFixed ? 'justify-self-end mr-4' : 'justify-center md:justify-self-end md:mr-4'
                        )}
                    >
                        {
                            selectedTrack?.list &&
                            selectedTrack?.list.map((track, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'relative h-auto group justify-center flex text-white items-center opacity-80'
                                    )}
                                >
                                    {index < selectedTrack.limit &&
                                        track != null &&
                                        handleRemoveTrack != null && (
                                            <button
                                                onClick={() => handleRemoveTrack(index)}
                                                title='Borrar canción'
                                                aria-label='Borrar canción'
                                                className='absolute top-0 right-0 items-center justify-center hidden w-4 h-4 text-sm transition-transform border rounded-full group-hover:flex hover:scale-125 bg-red-400/60 justify-items-center border-white/60'
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='24'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    className='w-3 h-3'
                                                >
                                                    <line x1='18' y1='6' x2='6' y2='18'></line>
                                                    <line x1='6' y1='6' x2='18' y2='18'></line>
                                                </svg>

                                            </button>
                                        )
                                    }
                                    {selectedTrack.limit > index ? (
                                        <div
                                            className={cn(
                                                'p-2',
                                                track == null &&
                                                !isSizeFixed &&
                                                handleRemoveTrack != null &&
                                                'bg-white/10 border w-12 h-12 border-dashed rounded-lg'
                                            )}
                                        >
                                            {track}
                                        </div>
                                    ) : (
                                        <>
                                            {handleRemoveTrack != null && (
                                                <div
                                                    className={cn(
                                                        'flex items-center justify-center w-12 h-12 p-2 border border-dashed rounded-lg opacity-20',
                                                        isSizeFixed && 'hidden'
                                                    )}
                                                >
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        width='24'
                                                        height='24'
                                                        viewBox='0 0 24 24'
                                                        fill='none'
                                                        stroke='currentColor'
                                                        strokeWidth='2'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        className='w-6 h-6'
                                                    >
                                                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                                        <path d='M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z' />
                                                        <path d='M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                                                        <path d='M8 11v-4a4 4 0 1 1 8 0v4' />
                                                    </svg>


                                                </div>
                                            )}
                                        </>
                                    )}

                                </div>
                            ))
                        }
                    </div>
                    <div
                        className={cn(
                            'grid self-end gap-4',
                            isSizeFixed
                                ? 'grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-0'
                                : ' grid-cols-1 md:grid-cols-[1fr_auto] md:grid-rows-[auto_auto] md:gap-0'
                        )}
                    >
                        <div
                            className={cn(
                                'flex flex-col justify-end',
                                isSizeFixed
                                    ? 'mx-0 px-0 pb-5 pl-5 items-start w-auto row-[2/3]'
                                    : 'px-2 md:px-0 items-center w-full md:w-auto md:items-start pb-0 md:pl-5 md:pb-5 mx-auto md:mx-0 md:row-[2/3]'
                            )}
                        >
                            <span className='pb-1 pl-2 text-sm text-white/80'>Escuchar en:</span>
                            <div
                                className={cn(
                                    'flex items-center flex-wrap justify-center grid-cols-3 gap-4 px-4 py-2 bg-white/10 w-auto',
                                    isSizeFixed
                                        ? 'rounded-full justify-start flex-nowrap'
                                        : 'rounded md:rounded-full md:justify-start md:flex-nowrap'
                                )}
                            >
                                <LIST_OF_TICKETS__STREAMING.spotify className='w-auto h-auto max-h-5 md:max-h-6' />
                                <LIST_OF_TICKETS__STREAMING.youtube className='w-auto h-auto max-h-5 md:max-h-6' />
                                <LIST_OF_TICKETS__STREAMING.applemusic className='w-auto h-auto max-h-5 md:max-h-6' />
                            </div>
                        </div>

                        <a
                            href='https://www.twentyonepilots.com'
                            target='_blank'
                            rel='nofollow'
                            className={cn(
                                'flex flex-col items-center justify-self-end justify-end gap-2 p-5 font-bold text-white w-max hover:text-[#FFD800] transition-colors',
                                isSizeFixed
                                    ? 'text-base mx-0 pt-5 col-[1/3] row-[1/2] h-max py-0'
                                    : 'text-md md:text-base mx-auto md:mx-0 md:pt-5 md:py-0 md:h-max md:row-[1/2] md:col-[1/3]'
                            )}
                        >

                            #twentyonepilots
                        </a>
                        <p className='truncate mr-5 py-7 font-bold uppercase text-center '>{track}</p>
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

const LIST_OF_TICKETS__STREAMING = {
    spotify: StreamingIcons.spotify,
    youtube: StreamingIcons.youtube,
    applemusic: StreamingIcons.applemusic,
}