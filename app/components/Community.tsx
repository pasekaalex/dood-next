'use client';

import { useState } from 'react';

export default function Community() {
  const [copied, setCopied] = useState(false);
  const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="w-full flex flex-col items-center px-4 pb-8">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">

        <h2 className="text-center text-2xl font-black" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px', color: 'var(--primary)', textShadow: '2px 2px 0 var(--secondary)'}}>
          COMMUNITY
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {/* X Official - taller but narrower */}
          <a href="https://x.com/doodpfp" target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-xl py-4 text-center no-underline transition-transform hover:scale-105"
            style={{background: 'var(--primary)', boxShadow: '0 5px 0 #b84a1e', minWidth: '80px'}}>
            <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'white', letterSpacing: '1px'}}>𝕏 Official</div>
          </a>

          {/* X Community - taller but narrower */}
          <a href="https://x.com/i/communities/1832939399241502938" target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-xl py-4 text-center no-underline transition-transform hover:scale-105"
            style={{background: '#8B5CF6', boxShadow: '0 5px 0 #7C3AED', minWidth: '80px'}}>
            <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'white', letterSpacing: '1px'}}>👥 Community</div>
          </a>

          {/* Chart - taller but narrower */}
          <a href="https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf" target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-xl py-4 text-center no-underline transition-transform hover:scale-105"
            style={{background: 'var(--secondary)', boxShadow: '0 5px 0 #E6B800', minWidth: '80px'}}>
            <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: '#1A1A2E', letterSpacing: '1px'}}>📊 Chart</div>
          </a>
        </div>

        {/* Contract Address */}
        <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 bg-white w-full" style={{border: '4px solid var(--primary)', boxShadow: '6px 6px 0 var(--secondary)'}}>
          <span className="font-bold text-sm uppercase tracking-wider" style={{color: 'var(--primary)', fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px'}}>CA</span>
          <code className="font-mono text-sm sm:text-base flex-1 break-all font-bold" style={{color: '#1A1A2E'}}>{CA}</code>
          <button
            onClick={handleCopy}
            className="px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-105"
            style={{
              background: copied ? '#16A34A' : 'var(--primary)',
              color: 'white',
              boxShadow: copied ? '0 4px 0 #15803D' : '0 4px 0 #b84a1e',
              minWidth: '80px',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

      </div>
    </section>
  );
}