'use client';

import { useEffect, useState, useRef } from 'react';

const API = 'https://api.dexscreener.com/latest/dex/tokens/4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-orange-400 rounded-full animate-spin" />;
}

function formatNum(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

export default function Stats() {
  const [stats, setStats] = useState<{price: string; marketCap: string; volume: string} | null>(null);
  const [flash, setFlash] = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevPrice = useRef<string | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch(API).then(r => r.json()).then(data => {
        const p = data?.pairs?.[0];
        if (!p) return;
        const price = parseFloat(p.priceUsd);
        const mc = price * parseFloat(p.info?.marketCap || '0') / price || 0;
        const volume = parseFloat(p.volume?.h24 || '0');
        const liquidity = parseFloat(p.liquidity?.usd || '0');

        // Estimate market cap from liquidity if needed (rough proxy for low-cap memcoins)
        const marketCap = liquidity > 0 && mc === 0 ? liquidity * 10 : mc;

        const newPrice = price < 0.0001 ? '$' + price.toExponential(2) : '$' + price.toFixed(6);

        setStats({
          price: newPrice,
          marketCap: formatNum(marketCap),
          volume: formatNum(volume),
        });

        // Flash animation on price change
        if (prevPrice.current && prevPrice.current !== newPrice) {
          setFlash(true);
          setPulse(true);
          setTimeout(() => { setFlash(false); setPulse(false); }, 500);
        }
        prevPrice.current = newPrice;
      }).catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col items-center px-4 pb-6">
      <div className="w-full max-w-xl">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: 'Price',
              value: stats?.price ?? <Spinner />,
              key: 'price',
              flash,
              pulse,
              color: 'var(--primary)',
            },
            {
              label: 'Market Cap',
              value: stats?.marketCap ?? <Spinner />,
              key: 'mc',
              flash: false,
              pulse: false,
              color: 'var(--primary)',
            },
            {
              label: 'Volume',
              value: stats?.volume ?? <Spinner />,
              key: 'vol',
              flash: false,
              pulse: false,
              color: 'var(--primary)',
            },
          ].map((s) => (
            <div
              key={s.key}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: `3px solid ${s.color}`,
                boxShadow: `4px 4px 0 ${s.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                transform: s.pulse ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div
                className="font-black text-lg md:text-xl mb-0.5"
                style={{
                  fontFamily: "'Bangers', cursive",
                  color: '#ffffff',
                  textShadow: `2px 2px 0 ${s.color}`,
                  letterSpacing: '1px',
                  transition: 'transform 0.2s',
                  transform: s.flash ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {s.value}
              </div>
              <div
                className="text-xs font-bold uppercase"
                style={{ color: s.color, letterSpacing: '2px' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
