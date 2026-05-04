'use client';

export default function Community() {
  const handleCopy = () => {
    navigator.clipboard.writeText('4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump');
  };

  return (
    <section className="w-full flex flex-col items-center px-4 pb-8">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">

        <h2 className="text-center text-2xl font-black" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px', color: '#1A1A2E'}}>
          COMMUNITY
        </h2>

        <div className="grid grid-cols-3 gap-2 w-full">
          {[
            { href: 'https://x.com/doodpfp', label: '𝕏', color: '#1DA1F2', shadow: '#0D8BD9' },
            { href: 'https://x.com/i/communities/1832939399241502938', label: 'Community', color: '#8B5CF6', shadow: '#7C3AED' },
            { href: 'https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf', label: 'Chart', color: 'var(--primary)', shadow: '#b84a1e' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="block rounded-xl px-3 py-3 text-center no-underline transition-transform hover:scale-105"
              style={{background: 'white', border: '2px solid ' + l.color, boxShadow: '3px 3px 0 ' + l.shadow, color: '#1A1A2E'}}>
              <div className="font-bold text-sm" style={{fontFamily: 'var(--font-bangers), cursive', color: l.color}}>{l.label}</div>
            </a>
          ))}
        </div>

        <div className="rounded-xl p-3 flex flex-col sm:flex-row items-center gap-2 bg-white w-full" style={{border: '2px solid var(--secondary)', boxShadow: '3px 3px 0 #E6B800'}}>
          <span className="text-xs font-bold uppercase opacity-40 whitespace-nowrap">CA</span>
          <code className="font-mono text-xs flex-1 break-all opacity-60">4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump</code>
          <button onClick={handleCopy}
            className="px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-105"
            style={{background: 'var(--primary)', color: 'white', boxShadow: '0 3px 0 #b84a1e'}}>
            Copy
          </button>
        </div>

      </div>
    </section>
  );
}