'use client';

import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Community from './components/Community';
import MarketCap from './components/MarketCap';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

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
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6" style={{paddingBottom: '40px'}}>
        <Hero />
        <MarketCap />
        <Community />
        <div className="text-center" style={{marginTop: '20px'}}>
          <p className="text-sm" style={{color: 'var(--text-light)', fontFamily: 'var(--font-nunito), sans-serif'}}>
            Just a dood being a dood 🦕
          </p>
        </div>
      </div>
    </main>
  );
}