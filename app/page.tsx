'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import PFPSection from './components/PFPSection';
import Community from './components/Community';
import Slideshow from './components/Slideshow';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-3" style={{paddingBottom: '25px'}}>
        <Hero />
        <Slideshow generatedImage={generatedImage} />
        <PFPSection onGenerated={setGeneratedImage} />
        <Community />
      </div>
    </main>
  );
}