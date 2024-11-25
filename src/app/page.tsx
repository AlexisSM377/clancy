import { Background } from "./components/Background";
import { Hero } from "./sections/hero";
import { TicketHome } from "./sections/ticket-home";

export default function Home() {
  return (
    <main>
      <Background>
        <div className="max-w-5xl mx-auto">
          <h2 className='animate-fade-in-up text-3xl sm:text-5xl md:text-[60px] mx-auto text-center max-w-[20ch] text-[#FFD800] font-bold pt-40 text-balance uppercase tracking-[17px]'>
            The clancy world tour
          </h2>

        </div>

        <TicketHome />
      </Background>
      <section className="max-w-[85rem] min-h-[40rem] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Hero />
      </section>
    </main>
  );
}
