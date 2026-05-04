import Hero from './components/Hero';
import Stats from './components/Stats';
import PFPSection from './components/PFPSection';
import Community from './components/Community';

function Footer() {
  return (
    <footer className="py-2 text-center text-xs px-4">
      
    </footer>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col flex-1">
        <Hero />
        <PFPSection />
      </div>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-3 pb-4">
        <Community />
        <Stats />
      </div>
    </main>
  );
}