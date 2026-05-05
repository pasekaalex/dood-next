'use client';

import { useState, useEffect } from 'react';

const SLIDES = [
  '/pfp-refs/angry.png',
  '/pfp-refs/beach.png',
  '/pfp-refs/car.png',
  '/pfp-refs/depressed.png',
  '/pfp-refs/determined.png',
  '/pfp-refs/frontyard.png',
  '/pfp-refs/frontyard-blank.png',
  '/pfp-refs/frontyard-blonde.png',
  '/pfp-refs/garage.png',
  '/pfp-refs/garage-beer.png',
  '/pfp-refs/grill.png',
  '/pfp-refs/happy.png',
  '/pfp-refs/inside-beer.png',
  '/pfp-refs/sad.png',
  '/pfp-refs/store.png',
  '/pfp-refs/yard.png',
  '/pfp-refs/yard-grill.png',
  '/pfp-refs/yard-smoke.png',
];

interface SlideshowProps {
  generatedImage: string | null;
  isLoading?: boolean;
}

export default function Slideshow({ generatedImage, isLoading }: SlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (generatedImage || isLoading) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [generatedImage, isLoading]);

  if (generatedImage) {
    return (
      <div className="w-full flex justify-center px-4 py-1">
        <div
          className="relative w-full max-w-[61%] md:max-w-[73%]"
          style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', border: '3px solid var(--primary)', boxShadow: '3px 3px 0 var(--primary)' }}
        >
          <img
            src={generatedImage}
            alt="Your DOOD"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center px-4 py-1">
        <div
          className="relative w-full max-w-[61%] md:max-w-[73%] flex flex-col items-center justify-center"
          style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', border: '3px solid var(--primary)', boxShadow: '3px 3px 0 var(--primary)', background: '#1A1A2E' }}
        >
          <div className="text-center" style={{ fontFamily: 'var(--font-bangers), cursive', letterSpacing: '3px' }}>
            <div className="text-5xl mb-3 animate-pulse">🎨</div>
            <p className="text-2xl md:text-3xl font-black text-white" style={{ textShadow: '2px 2px 0 var(--primary)' }}>CREATING DOOD...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 py-1">
      <div
        className="relative w-full max-w-[61%] md:max-w-[73%]"
        style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', border: '3px solid var(--primary)', boxShadow: '3px 3px 0 var(--primary)' }}
      >
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`DOOD ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1500"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}