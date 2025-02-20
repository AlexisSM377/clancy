'use client';
import Link from "next/link";
import { TopLogo } from "./icons/top";
import { useId, useState } from "react";
import { cn } from "../lib/utils";

export function Header() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const navbarId = useId();

  return (
    <header className="header-animate backdrop-blur-[10px] md:backdrop-blur-0 w-full mb-10 overflow-hidden z-[99999] py-8">
      <div className="grid items-center justify-center md:justify-normal w-full grid-cols-[auto_1fr] mx-auto text-white gap-x-10 md:flex max-w-screen-base">
        <Link href='/' className="ml-4 transition-transform duration-300 hover:scale-125" title="Ir a la página principal">
          <TopLogo className='w-10 h-12' />
        </Link>

        <div className="flex items-center justify-end gap-4 mr-4 md:ml-auto">

          <button
            className="flex items-center justify-center py-2 md:hidden"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            aria-expanded='false'
            aria-controls={navbarId}
            title="Mostrar menú"
            aria-label="Mostrar menú"
          >
            <div className="flex items-center justify-center p-2 cursor-pointer group">
              <div className="space-y-2">
                <span className={cn('block h-1 w-8 origin-center rounded-full bg-white/60 transition-transform ease-in-out', { 'translate-y-1.5 rotate-45': isNavbarOpen })}></span>
                <span className={cn('block h-1 w-8 origin-center rounded-full bg-white/60 transition-transform ease-in-out', { 'w-8 -translate-y-1.5 -rotate-45': isNavbarOpen })}></span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
