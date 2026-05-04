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

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="relative w-full max-w-[75%] md:max-w-[90%]"
        style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '16px', border: '4px solid var(--primary)', boxShadow: '4px 4px 0 var(--primary)' }}
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