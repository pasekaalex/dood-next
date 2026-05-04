'use client';

export default function Community() {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full">
      <a href="https://x.com/doodpfp" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-4 px-4 text-center no-underline transition-transform hover:scale-105"
        style={{background: 'var(--primary)', boxShadow: '0 5px 0 #b84a1e', minWidth: '100px'}}>
        <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'white', letterSpacing: '1px'}}>𝕏 Official</div>
      </a>
      <a href="https://x.com/i/communities/1832939399241502938" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-4 px-4 text-center no-underline transition-transform hover:scale-105"
        style={{background: '#8B5CF6', boxShadow: '0 5px 0 #7C3AED', minWidth: '100px'}}>
        <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'white', letterSpacing: '1px'}}>👥 Community</div>
      </a>
      <a href="https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf" target="_blank" rel="noopener noreferrer"
        className="rounded-xl py-4 px-4 text-center no-underline transition-transform hover:scale-105"
        style={{background: 'var(--secondary)', boxShadow: '0 5px 0 #E6B800', minWidth: '100px'}}>
        <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: '#1A1A2E', letterSpacing: '1px'}}>📊 Chart</div>
      </a>
    </div>
  );
}
