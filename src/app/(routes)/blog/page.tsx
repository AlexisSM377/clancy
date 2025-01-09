import Gallery from "@/app/components/LightGallery ";



/* eslint-disable @next/next/no-img-element */
export default function Page() {
    return (
        <div className="pt-32 gap-9 max-w-screen-base mx-auto p-4 ">
            <h1 className="text-5xl text-red-500 font-bold text-center py-10">Twenty one Pilots</h1>

            <Gallery />
        </div>
    );
}
