'use client';

import { useState } from 'react';

const links = [
  { href: 'https://x.com/doodpfp', label: '𝕏 Official' },
  { href: 'https://x.com/i/communities/1832939399241502938', label: '👥 Community' },
  { href: 'https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf', label: '📊 Chart' },
  { href: 'https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump', label: '🚀 Buy DOOD' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3" style={{background: 'rgba(255,245,230,0.97)', backdropFilter: 'blur(8px)', borderBottom: '2px solid rgba(255,107,53,0.15)'}}>
      <div className="w-full max-w-xl mx-auto flex items-center justify-between">

        <span style={{fontFamily: 'var(--font-bangers), cursive', fontSize: '1.8rem', letterSpacing: '3px', color: 'var(--primary)', textShadow: '2px 2px 0 var(--secondary)'}}>
          DOOD
        </span>

        {/* Desktop: inline links */}
        <div className="hidden sm:flex gap-2 items-center">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-bold no-underline"
              style={{background: 'var(--primary)', color: 'white', boxShadow: '0 4px 0 #b84a1e'}}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile: hamburger */}
        <button onClick={() => setOpen(!open)}
          className="sm:hidden px-5 py-3 rounded-xl font-bold text-base cursor-pointer"
          style={{background: 'var(--primary)', color: 'white', boxShadow: '0 4px 0 #b84a1e'}}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="w-full max-w-xl mx-auto mt-3 rounded-xl overflow-hidden sm:hidden" style={{border: '3px solid var(--primary)', boxShadow: '4px 4px 0 var(--primary)'}}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3.5 text-sm font-bold no-underline"
              style={{background: 'white', color: 'var(--text)', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
              <span style={{fontFamily: 'var(--font-bangers), cursive', fontSize: '1.1rem', color: 'var(--primary)'}}>{l.label}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}