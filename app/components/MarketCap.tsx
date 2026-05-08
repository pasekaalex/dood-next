'use client';

import { useState, useEffect, useRef } from 'react';

const API = 'https://api.dexscreener.com/latest/dex/tokens/4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

function formatMC(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

export default function MarketCap() {
  const [marketCap, setMarketCap] = useState<string | null>(null);
  const [prevMC, setPrevMC] = useState<string | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [bounce, setBounce] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMC = () => {
      fetch(API).then(r => r.json()).then(data => {
        const p = data?.pairs?.[0];
        if (!p) return;
        const mcRaw = parseFloat(p.marketCap || p.info?.marketCap || '0');
        const liquidity = parseFloat(p.liquidity?.usd || '0');
        const mc = mcRaw > 0 ? mcRaw : liquidity * 5;
        const formatted = formatMC(mc);
        
        setPrevMC(marketCap);
        if (marketCap && formatted !== marketCap) {
          const prev = parseFloat(marketCap.replace(/[$MBK]/g, ''));
          const curr = parseFloat(formatted.replace(/[$MBK]/g, ''));
          if (!isNaN(prev) && !isNaN(curr)) {
            setDirection(curr > prev ? 'up' : 'down');
            setBounce(true);
            setTimeout(() => {
              setDirection(null);
              setBounce(false);
            }, 600);
          }
        }
        setMarketCap(formatted);
      }).catch(() => {});
    };
    fetchMC();
    intervalRef.current = setInterval(fetchMC, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [marketCap]);

  return (
    <div className="flex justify-center py-3">
      {marketCap && (
        <div 
          className={`rounded-2xl px-8 py-4 ${bounce ? 'animate-bounce-in' : ''}`}
          style={{
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--primary) 100%)',
            border: '3px solid var(--accent)',
            minWidth: '220px',
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0 6px 0 var(--btn-primary-shadow)',
            transform: bounce ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span 
              className="text-xs font-bold uppercase tracking-wider" 
              style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text-light)', letterSpacing: '2px'}}
            >
              Market Cap
            </span>
            <div className="flex items-center gap-2">
              {direction === 'up' && <span className="text-lg">🚀</span>}
              {direction === 'down' && <span className="text-lg">📉</span>}
              <span 
                className="text-2xl font-bold" 
                style={{
                  fontFamily: 'var(--font-bangers), cursive', 
                  color: 'var(--text)', 
                  letterSpacing: '1px',
                  textShadow: direction === 'up' ? '0 0 10px rgba(22, 163, 74, 0.5)' : direction === 'down' ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'none',
                }}
              >
                {marketCap}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}