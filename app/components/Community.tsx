'use client';

export default function Community() {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full px-4">
      <a href="https://x.com/doodpfp" target="_blank" rel="noopener noreferrer"
        className="rounded-2xl py-4 px-6 text-center no-underline transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--secondary) 100%)',
          border: '3px solid var(--card-border)',
          boxShadow: '0 5px 0 var(--card-border)',
        }}>
        <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text)', letterSpacing: '2px'}}>
          𝕏 Twitter
        </div>
      </a>
      <a href="https://x.com/i/communities/1832939399241502938" target="_blank" rel="noopener noreferrer"
        className="rounded-2xl py-4 px-6 text-center no-underline transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--secondary) 100%)',
          border: '3px solid var(--card-border)',
          boxShadow: '0 5px 0 var(--card-border)',
        }}>
        <div className="font-bold text-base" style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text)', letterSpacing: '2px'}}>
          👥 Community
        </div>
      </a>
    </div>
  );
}