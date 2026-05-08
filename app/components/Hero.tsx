'use client';

import { useState } from 'react';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';
const JUPITER_URL = 'https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';
const DEXSCREENER_URL = 'https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf';

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
        <img
          src="/logo-trim.png"
          alt="DOOD"
          className="animate-float"
          style={{
            maxHeight: '140px',
            width: '90%',
            objectFit: 'contain',
          }}
        />

        <h1 className="text-4xl font-bold animate-pulse-soft" style={{
          fontFamily: 'var(--font-bangers), cursive',
          color: 'var(--text)',
          letterSpacing: '3px',
          textShadow: '2px 2px 0 var(--secondary)',
        }}>
          Dood
        </h1>

        <p className="text-base animate-fade-in" style={{
          color: 'var(--text-light)',
          fontFamily: 'var(--font-nunito), sans-serif',
          maxWidth: '300px',
        }}>
          Just a dood being a dood 🦕
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <a
            href={JUPITER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--btn-primary)',
              color: 'white',
              boxShadow: '0 4px 0 var(--btn-primary-shadow)',
              minWidth: '140px',
              fontFamily: 'var(--font-bangers), cursive',
              fontSize: '1.1rem',
              letterSpacing: '1px',
            }}
          >
            Buy $DOOD
          </a>
          <a
            href={DEXSCREENER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              boxShadow: '0 4px 0 var(--card-border)',
              minWidth: '140px',
              fontFamily: 'var(--font-bangers), cursive',
              fontSize: '1.1rem',
              letterSpacing: '1px',
            }}
          >
            📊 Chart
          </a>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 cursor-pointer transition-all hover:scale-105 animate-fade-in"
          style={{
            border: '2px solid var(--card-border)',
            minWidth: '320px',
          }}
        >
          {copied ? (
            <span style={{
              color: '#16A34A',
              fontFamily: 'var(--font-bangers), cursive',
              letterSpacing: '1px',
              fontSize: '14px',
            }}>
              Copied! ✓
            </span>
          ) : (
            <>
              <span style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-bangers), cursive',
                letterSpacing: '1px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginRight: '8px',
              }}>
                CA
              </span>
              <code style={{color: 'var(--text)', fontSize: '11px', fontFamily: 'monospace'}}>
                {CA}
              </code>
            </>
          )}
        </button>
      </div>
    </section>
  );
}