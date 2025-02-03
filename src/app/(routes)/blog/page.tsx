import { HeroLogo } from "@/app/components/icons/herologo";
import Gallery from "@/app/components/LightGallery ";


export default function Page() {

    return (
        <div className="pt-32 gap-9 max-w-screen-base mx-auto p-4 ">
            <HeroLogo className="w-full h-auto py-16 animate-slide-out-bottom " />

            <Gallery />
        </div>
    );
}
