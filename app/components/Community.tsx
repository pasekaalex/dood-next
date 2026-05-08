'use client';

export default function Community() {
  return (
    <div className="flex flex-wrap justify-center gap-3 w-full px-4">
      <a href="https://x.com/doodpfp" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-3 px-5 text-center no-underline transition-all hover:scale-105"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--card-border)',
          boxShadow: '0 3px 0 var(--card-border)',
        }}>
        <div className="font-bold text-sm" style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text)', letterSpacing: '1px'}}>
          𝕏 Twitter
        </div>
      </a>
      <a href="https://x.com/i/communities/1832939399241502938" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-3 px-5 text-center no-underline transition-all hover:scale-105"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--card-border)',
          boxShadow: '0 3px 0 var(--card-border)',
        }}>
        <div className="font-bold text-sm" style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text)', letterSpacing: '1px'}}>
          👥 Community
        </div>
      </a>
      <a href="https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-3 px-5 text-center no-underline transition-all hover:scale-105"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--card-border)',
          boxShadow: '0 3px 0 var(--card-border)',
        }}>
        <div className="font-bold text-sm" style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text)', letterSpacing: '1px'}}>
          📊 DexScreener
        </div>
      </a>
    </div>
  );
}