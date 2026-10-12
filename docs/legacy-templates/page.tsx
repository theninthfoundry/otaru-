import { Masthead, Hero, Audit } from "@/components/refined/signature";
import { Services, Work, Contact } from "@/components/refined/sections";

export default function Home() {
  return (
    <>
      <Masthead />
      <main id="main-content" className="bg-paper font-sans text-ink selection:bg-ink selection:text-paper">
        <Hero />
        <Services />
        <Audit />
        <Work />
        <Contact />
      </main>
    </>
  );
}
