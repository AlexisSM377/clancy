/* eslint-disable @next/next/no-img-element */
interface Props {
    children: React.ReactNode
}
export const Background = ({ children }: Props) => {
    return (
        <div className="relative h-full">
            <img src="/background.jpg" alt="background" className="absolute w-full h-full object-cover" />
            <div className="relative z-50">{children}</div>
        </div>
    )
}