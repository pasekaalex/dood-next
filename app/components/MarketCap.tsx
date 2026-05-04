'use client';

import { useState, useEffect } from 'react';

const API = 'https://api.dexscreener.com/latest/dex/tokens/4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

function formatMC(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

export default function MarketCap() {
  const [marketCap, setMarketCap] = useState<string | null>(null);

  useEffect(() => {
    const fetchMC = () => {
      fetch(API).then(r => r.json()).then(data => {
        const p = data?.pairs?.[0];
        if (!p) return;
        const mcRaw = parseFloat(p.marketCap || p.info?.marketCap || '0');
        const liquidity = parseFloat(p.liquidity?.usd || '0');
        const mc = mcRaw > 0 ? mcRaw : liquidity * 5;
        setMarketCap(formatMC(mc));
      }).catch(() => {});
    };
    fetchMC();
    const interval = setInterval(fetchMC, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center py-2">
      {marketCap && (
        <div className="rounded-xl px-6 py-3" style={{background: 'var(--secondary)', border: '3px solid var(--primary)', minWidth: '180px', display: 'flex', justifyContent: 'center'}}>
          <span className="font-bold text-sm" style={{fontFamily: 'var(--font-bangers), cursive', color: '#1A1A2E', letterSpacing: '1px', textAlign: 'center'}}>Market Cap: {marketCap}</span>
        </div>
      )}
    </div>
  );
}