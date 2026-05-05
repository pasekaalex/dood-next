'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import PFPSection from './components/PFPSection';
import Community from './components/Community';
import Slideshow from './components/Slideshow';
import MarketCap from './components/MarketCap';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-1" style={{paddingBottom: '15px'}}>
        <Hero />
        <Slideshow generatedImage={generatedImage} isLoading={isGenerating} />
        <PFPSection onGenerated={setGeneratedImage} onGeneratingChange={setIsGenerating} />
        <MarketCap />
        <Community />
      </div>
    </main>
  );
}