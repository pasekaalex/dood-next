import Hero from './components/Hero';
import Stats from './components/Stats';
import PFPSection from './components/PFPSection';
import Community from './components/Community';
import ContractAddress from './components/ContractAddress';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-3" style={{paddingBottom: '25px'}}>
        <Hero />
        {/* Slideshow placeholder - coming soon */}
        <PFPSection />
        <ContractAddress />
        <Community />
        <Stats />
      </div>
    </main>
  );
}