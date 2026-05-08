'use client';

import { useState, useRef } from 'react';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';
const JUPITER_URL = 'https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogoClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-6">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5">
        
        {/* Interactive Logo */}
        <div className="relative">
          <img
            ref={logoRef}
            src="/logo-trim.png"
            alt="Dood"
            className="cursor-pointer"
            onClick={handleLogoClick}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              maxHeight: '200px',
              width: '90%',
              objectFit: 'contain',
              transform: hovering ? 'scale(1.1) rotate(3deg)' : clicked ? 'scale(0.95) rotate(-5deg)' : 'scale(1)',
              transition: 'transform 0.2s ease',
              filter: hovering ? 'drop-shadow(0 0 20px rgba(212, 165, 116, 0.8))' : 'none',
            }}
          />
          {/* Sparkle effects on hover */}
          {hovering && (
            <>
              <span style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                fontSize: '24px',
                animation: 'float 1s ease-in-out infinite',
              }}>✨</span>
              <span style={{
                position: 'absolute',
                top: '20%',
                right: '15%',
                fontSize: '20px',
                animation: 'float 1.2s ease-in-out infinite 0.2s',
              }}>⭐</span>
              <span style={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                fontSize: '18px',
                animation: 'float 0.9s ease-in-out infinite 0.4s',
              }}>💫</span>
            </>
          )}
        </div>

        {/* Buy Button - Larger */}
        <a
          href={JUPITER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-bold transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--btn-primary) 0%, #C49A6C 100%)',
            color: 'white',
            boxShadow: '0 8px 0 var(--btn-primary-shadow)',
            minWidth: '200px',
            fontFamily: 'var(--font-bangers), cursive',
            fontSize: '1.4rem',
            letterSpacing: '2px',
          }}
        >
          Buy Dood
        </a>

        {/* CA Copy Button - Larger */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{
            border: '3px solid var(--card-border)',
            minWidth: '380px',
            boxShadow: '0 4px 0 var(--card-border)',
          }}
        >
          {copied ? (
            <span style={{
              color: '#16A34A',
              fontFamily: 'var(--font-bangers), cursive',
              letterSpacing: '2px',
              fontSize: '16px',
            }}>
              Copied! ✓
            </span>
          ) : (
            <>
              <span style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-bangers), cursive',
                letterSpacing: '2px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginRight: '10px',
              }}>
                CA
              </span>
              <code style={{color: 'var(--text)', fontSize: '14px', fontFamily: 'monospace'}}>
                {CA}
              </code>
            </>
          )}
        </button>
      </div>
    </section>
  );
}