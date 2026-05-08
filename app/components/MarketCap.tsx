'use client';

import { useState, useEffect, useRef } from 'react';

const API = 'https://api.dexscreener.com/latest/dex/tokens/4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';
const DEXSCREENER_URL = 'https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf';

function formatMC(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

export default function MarketCap() {
  const [marketCap, setMarketCap] = useState<string | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);
  const prevRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef(0);

  useEffect(() => {
    const fetchMC = () => {
      fetch(API).then(r => r.json()).then(data => {
        const p = data?.pairs?.[0];
        if (!p) return;
        const mcRaw = parseFloat(p.marketCap || p.info?.marketCap || '0');
        const liquidity = parseFloat(p.liquidity?.usd || '0');
        const mc = mcRaw > 0 ? mcRaw : liquidity * 5;
        
        if (prevRef.current > 0 && mc !== prevRef.current) {
          const isUp = mc > prevRef.current;
          setDirection(isUp ? 'up' : 'down');
          setPulse(true);
          setShake(true);
          countRef.current++;
          
          if (countRef.current % 5 === 0) {
            setTimeout(() => setShake(true), 100);
          }
          
          setTimeout(() => {
            setDirection(null);
            setPulse(false);
            setShake(false);
          }, 800);
        }
        prevRef.current = mc;
        setMarketCap(formatMC(mc));
      }).catch(() => {});
    };
    fetchMC();
    intervalRef.current = setInterval(fetchMC, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center py-4">
      {marketCap && (
        <a 
          href={DEXSCREENER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative no-underline transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            transform: shake ? 'translateX(-3px)' : pulse ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.15s ease',
          }}
        >
          {direction && (
            <div 
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background: direction === 'up' 
                  ? 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)' 
                  : 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
          )}
          
          <div 
            className={`rounded-3xl px-10 py-5 ${pulse ? 'animate-bounce-in' : ''}`}
            style={{
              background: 'linear-gradient(145deg, var(--surface) 0%, var(--primary) 100%)',
              border: `4px solid ${direction === 'up' ? '#22c55e' : direction === 'down' ? '#ef4444' : 'var(--accent)'}`,
              minWidth: '240px',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: `0 8px 0 var(--btn-primary-shadow), ${direction === 'up' ? '0 0 30px rgba(34, 197, 94, 0.3)' : direction === 'down' ? '0 0 30px rgba(239, 68, 68, 0.3)' : 'none'}`,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <span 
                  className="text-sm font-bold uppercase tracking-widest" 
                  style={{fontFamily: 'var(--font-bangers), cursive', color: 'var(--text-light)', letterSpacing: '3px'}}
                >
                  Market Cap
                </span>
                {direction && (
                  <span 
                    className="absolute -right-8 top-1/2 -translate-y-1/2 text-lg animate-pulse"
                  >
                    {direction === 'up' ? '📈' : '📉'}
                  </span>
                )}
              </div>
              
              <div 
                className="flex items-center gap-3"
                style={{
                  transform: pulse ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <span 
                  className="text-4xl font-black" 
                  style={{
                    fontFamily: 'var(--font-bangers), cursive', 
                    color: direction === 'up' ? '#22c55e' : direction === 'down' ? '#ef4444' : 'var(--text)', 
                    letterSpacing: '2px',
                    textShadow: '2px 2px 0 var(--secondary)',
                  }}
                >
                  {marketCap}
                </span>
              </div>
              
              {direction && (
                <div 
                  className="h-1.5 rounded-full w-full mt-1 animate-pulse"
                  style={{
                    background: direction === 'up' 
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                    minWidth: '120px',
                  }}
                />
              )}
            </div>
          </div>
        </a>
      )}
    </div>
  );
}