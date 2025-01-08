import { TopLogo } from "./icons/top";

export function Footer() {
  return (
    <footer className="relative  flex w-full flex-col place-items-center pb-20 pt-14 md:flex-row md:justify-between md:pt-16 max-w-screen-base mx-auto">
      <hr className="absolute top-0 h-[2px] w-full min-w-[18rem] border-t-0 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent bg-center md:my-9" />
      <div className="flex flex-col gap-4 text-center md:flex-row lg:gap-2 text-sm ml-4">
        © 2024 Alekzcrank and Anton
        <span aria-hidden className="hidden md:inline">|</span>
        <br aria-hidden className="block md:hidden" />Todos los derechos reservados
      </div>
      <hr
        aria-hidden="true"
        className="my-12 h-[2px] w-full min-w-[18rem] border-t-0 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent bg-center md:hidden"
      />
      <ul className="flex flex-row gap-x-6 items-center ">
        <li>
          <TopLogo className="w-10 h-12 mr-4" />

        </li>
      </ul>
    </footer>
  );
}
