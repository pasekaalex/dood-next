'use client';

import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Community from './components/Community';
import MarketCap from './components/MarketCap';

export default function Home() {
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const audio = document.getElementById('jazz-bg') as HTMLAudioElement;
    if (audio && !audioStarted) {
      audio.volume = 0.15;
      audio.play().catch(() => {});
      setAudioStarted(true);
    }
  }, [audioStarted]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-8" style={{paddingBottom: '60px'}}>
        <Hero />
        <MarketCap />
        <Community />
      </div>
    </main>
  );
}