'use client';

import { useEffect, useState } from 'react';

const API = 'https://api.dexscreener.com/latest/dex/tokens/4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-orange-500 rounded-full animate-spin" />;
}

export default function Stats() {
  const [d, setD] = useState<{price: string; change: string; volume: string; liquidity: string} | null>(null);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => {
      const p = data?.pairs?.[0];
      if (!p) return;
      const fmt = (n: number) => n >= 1e6 ? (n/1e6).toFixed(2)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : n.toFixed(2);
      const price = parseFloat(p.priceUsd);
      setD({
        price: price < 0.0001 ? '$'+price.toExponential(2) : '$'+price.toFixed(6),
        change: (parseFloat(p.priceChange?.h24) >= 0 ? '+' : '') + parseFloat(p.priceChange?.h24).toFixed(0) + '%',
        volume: '$' + fmt(parseFloat(p.volume?.h24)),
        liquidity: '$' + fmt(parseFloat(p.liquidity?.usd)),
      });
    }).catch(() => {});
  }, []);

  return (
    <section className="w-full flex flex-col items-center px-4 pb-6">
      <div className="w-full max-w-xl">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Price', value: d?.price ?? <Spinner /> },
            { label: '24h', value: d?.change ?? <Spinner />, green: d?.change?.startsWith('+') },
            { label: 'Volume', value: d?.volume ?? <Spinner /> },
            { label: 'Liq', value: d?.liquidity ?? <Spinner /> },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center bg-white" style={{border: '2px solid var(--primary)', boxShadow: '3px 3px 0 var(--primary)'}}>
              <div className="font-bold text-sm mb-0.5" style={{fontFamily: 'var(--font-bangers), cursive', color: s.green === false ? '#DC2626' : s.green === true ? '#16A34A' : 'var(--primary)'}}>{s.value}</div>
              <div className="text-xs font-bold uppercase opacity-40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}