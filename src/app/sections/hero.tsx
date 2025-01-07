import { HeroLogo } from "../components/icons/herologo"
import { PrincipalDate } from "../components/PrincipalDate"

export const Hero = () => {
    return (
        <section className="flex flex-col justify-center items-center pt-40 gap-9">
            <HeroLogo className="w-full h-auto animate-blurred-fade-in" />
            <PrincipalDate />
        </section>
    )
}