'use client';

import { useState, useEffect } from 'react';

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
    <>
      <div style={{height: '10px', background: 'transparent'}} />
    <section className="flex flex-col items-center justify-center text-center px-4 pt-4 pb-2">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">

        <img src="/banner-doods.jpg" alt="Dood's" className="w-full max-w-xs rounded-xl" style={{borderRadius: '12px', border: '4px solid var(--primary)', boxShadow: '4px 4px 0 var(--primary)'}} />

        <div className="flex justify-center w-full">
          <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold"
            style={{background: 'var(--primary)', color: 'white', boxShadow: '0 5px 0 #b84a1e', minWidth: '180px', fontFamily: 'var(--font-bangers), cursive', fontSize: '1.2rem', letterSpacing: '1px'}}>
            Buy DOOD
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 cursor-pointer transition-all hover:scale-105"
            style={{border: '2px solid var(--primary)', width: '61%', maxWidth: '73%'}}
          >
            {copied ? (
              <span className="font-bold text-sm" style={{color: '#16A34A', fontFamily: 'var(--font-bangers), cursive', letterSpacing: '1px'}}>✓ Copied!</span>
            ) : (
              <>
                <span className="font-bold text-xs uppercase tracking-wider shrink-0 mr-2" style={{color: 'var(--primary)', fontFamily: 'var(--font-bangers), cursive', letterSpacing: '1px'}}>CA</span>
                <code className="font-mono text-xs font-bold" style={{color: '#1A1A2A'}}>{CA}</code>
              </>
            )}
          </button>
        </div>
      </div>

    </section>
    </>
  );
}