'use client';

import { useState } from 'react';

const links = [
  { href: 'https://x.com/doodpfp', label: '𝕏 Official', color: '#1DA1F2' },
  { href: 'https://x.com/i/communities/1832939399241502938', label: '👥 Community', color: '#8B5CF6' },
  { href: 'https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf', label: '📊 Chart', color: 'var(--primary)' },
  { href: 'https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump', label: '🚀 Buy $DOOD', color: 'var(--secondary)' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3" style={{background: 'rgba(255,245,230,0.95)', backdropFilter: 'blur(8px)', borderBottom: '2px solid rgba(255,107,53,0.15)'}}>
      <div className="max-w-xl mx-auto flex items-center justify-between">

        <span style={{fontFamily: 'var(--font-bangers), cursive', fontSize: '1.6rem', letterSpacing: '2px', color: 'var(--primary)', textShadow: '2px 2px 0 var(--secondary)'}}>
          $DOOD
        </span>

        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 rounded-lg font-bold text-sm cursor-pointer" style={{background: 'var(--primary)', color: 'white', boxShadow: '0 3px 0 #b84a1e'}}>
          {open ? '✕' : '☰ Menu'}
        </button>
      </div>

      {open && (
        <div className="max-w-xl mx-auto mt-2 rounded-xl overflow-hidden" style={{border: '3px solid var(--primary)', boxShadow: '4px 4px 0 var(--primary)'}}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold no-underline transition-colors"
              style={{background: 'white', color: 'var(--text)', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
              <span style={{fontFamily: 'var(--font-bangers), cursive', color: l.color}}>{l.label}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}