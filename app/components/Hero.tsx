'use client';

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-4 min-h-[50vh]">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">

        <div className="inline-block px-6 py-4 rounded-xl" style={{background: 'var(--secondary)', boxShadow: '6px 6px 0 var(--primary)'}}>
          <span style={{fontFamily: 'var(--font-bangers), cursive', fontSize: 'clamp(4rem, 16vw, 8rem)', lineHeight: 0.9, letterSpacing: '4px', color: '#1A1A2E', textShadow: '3px 3px 0 var(--primary)', display: 'inline-block'}}>
            DOOD
          </span>
        </div>

        <p className="text-lg font-bold" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px', color: '#1A1A2E'}}>
          Just a Dood Being a Dood.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{background: 'var(--primary)', color: 'white', boxShadow: '0 5px 0 #b84a1e', minWidth: '160px'}}>
            🚀 Buy DOOD
          </a>
          <a href="https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{background: 'white', color: '#1A1A2E', boxShadow: '0 5px 0 #ccc', border: '2px solid #1A1A2E', minWidth: '160px'}}>
            📊 Chart
          </a>
        </div>

      </div>
    </section>
  );
}