'use client';

import { useState, useEffect } from 'react';

const SLIDES = [
  '/slideshow/slide-1.jpg',
  '/slideshow/slide-2.jpg',
  '/slideshow/slide-3.jpg',
  '/slideshow/slide-4.jpg',
  '/slideshow/slide-5.jpg',
  '/slideshow/slide-6.jpg',
  '/slideshow/slide-7.jpg',
  '/slideshow/slide-8.jpg',
  '/slideshow/slide-9.jpg',
];

interface SlideshowProps {
  generatedImage: string | null;
}

export default function Slideshow({ generatedImage }: SlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (generatedImage) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [generatedImage]);

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
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}