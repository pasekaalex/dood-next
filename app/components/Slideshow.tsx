'use client';

import { useState, useEffect } from 'react';

const SLIDES = [
  '/pfp-refs/angry.jpg',
  '/pfp-refs/beach.jpg',
  '/pfp-refs/car.jpg',
  '/pfp-refs/depressed.jpg',
  '/pfp-refs/determined.jpg',
  '/pfp-refs/frontyard.jpg',
  '/pfp-refs/frontyard-blank.jpg',
  '/pfp-refs/frontyard-blonde.jpg',
  '/pfp-refs/garage.jpg',
  '/pfp-refs/garage-beer.jpg',
  '/pfp-refs/grill.jpg',
  '/pfp-refs/happy.jpg',
  '/pfp-refs/inside-beer.jpg',
  '/pfp-refs/sad.jpg',
  '/pfp-refs/store.jpg',
  '/pfp-refs/yard.jpg',
  '/pfp-refs/yard-grill.jpg',
  '/pfp-refs/yard-smoke.jpg',
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