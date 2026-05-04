'use client';

import { useState } from 'react';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  return (
    <section className="flex flex-col items-center justify-center text-center px-4 pt-3 pb-2 min-h-[20vh]">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-1">

        <div className="inline-block px-4 py-3 rounded-xl" style={{background: 'var(--secondary)', boxShadow: '4px 4px 0 var(--primary)'}}>
          <span style={{fontFamily: 'var(--font-bangers), cursive', fontSize: 'clamp(4rem, 16vw, 8rem)', lineHeight: 0.9, letterSpacing: '4px', color: '#1A1A2E', textShadow: '3px 3px 0 var(--primary)', display: 'inline-block'}}>
            DOOD
          </span>
        </div>

        <p className="text-base font-bold" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px', color: '#1A1A2E'}}>
          Just a Dood Being a Dood.
        </p>

        <div className="flex justify-center w-full">
          <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold"
            style={{background: 'var(--primary)', color: 'white', boxShadow: '0 5px 0 #b84a1e', minWidth: '180px', fontFamily: 'var(--font-bangers), cursive', fontSize: '1.2rem', letterSpacing: '1px'}}>
            🚀 Buy DOOD
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
          <div className="inline-flex rounded-xl bg-white px-3 py-2" style={{border: '2px solid var(--primary)'}}>
            <span className="font-bold text-xs uppercase tracking-wider shrink-0" style={{color: 'var(--primary)', fontFamily: 'var(--font-bangers), cursive', letterSpacing: '1px'}}>CA</span>
            <code className="font-mono text-xs font-bold" style={{color: '#1A1A2E'}}>{CA}</code>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all hover:scale-105"
            style={{
              background: copied ? '#16A34A' : 'var(--primary)',
              color: 'white',
              boxShadow: copied ? '0 3px 0 #15803D' : '0 3px 0 #b84a1e',
            }}
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>

      </div>
    </section>
  );
}