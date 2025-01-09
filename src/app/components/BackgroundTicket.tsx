/* eslint-disable @next/next/no-img-element */
interface Props {
    children: React.ReactNode
}
export const BackgroundTicket = ({ children }: Props) => {
    return (
        <div className="relative h-full">
            <img src="/bg-ticket.jpg" alt="background" className="absolute w-full h-full object-cover backgradient" />
            <div className="relative z-50">{children}</div>
        </div>
    )
}