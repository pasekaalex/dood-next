import Hero from './components/Hero';
import PFPSection from './components/PFPSection';
import Community from './components/Community';
import Slideshow from './components/Slideshow';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-3" style={{paddingBottom: '25px'}}>
        <Hero />
        <Slideshow />
        <PFPSection />
        <Community />
      </div>
    </main>
  );
}