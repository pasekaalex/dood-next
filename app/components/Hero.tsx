'use client';

export default function Hero() {
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

      </div>
    </section>
  );
}