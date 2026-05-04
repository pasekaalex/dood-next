import Hero from './components/Hero';
import Stats from './components/Stats';
import PFPSection from './components/PFPSection';
import Community from './components/Community';

function Footer() {
  return (
    <footer className="py-4 text-center text-xs px-4" style={{borderTop: '2px solid rgba(255,107,53,0.1)', color: 'rgba(26,26,46,0.3)'}}>
      DOOD is a memecoin. Not financial advice. DYOR.
    </footer>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-3 flex-1">
        <Hero />
        <PFPSection />
        <Community />
        <Stats />
        <Footer />
      </div>
    </main>
  );
}