'use client';

import { useState } from 'react';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div style={{height: '10px', background: 'transparent'}} />
      <section className="flex flex-col items-center justify-center text-center px-4 pt-2 pb-1">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="Dood's"
            style={{
              maxHeight: '140px',
              width: '90%',
              objectFit: 'contain',
            }}
          />

          <div className="flex justify-center w-full">
            <a
              href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold"
              style={{
                background: 'var(--primary)',
                color: 'white',
                boxShadow: '0 5px 0 #b84a1e',
                minWidth: '160px',
                fontFamily: 'var(--font-bangers), cursive',
                fontSize: '1rem',
                letterSpacing: '1px',
                padding: '12px 32px',
              }}
            >
              Buy
              <img src="/logo.png" alt="" style={{height: '24px', objectFit: 'contain'}} />
            </a>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 cursor-pointer transition-all hover:scale-105"
              style={{
                border: '2px solid var(--primary)',
                minWidth: '375px',
                width: '375px',
              }}
            >
              {copied ? (
                <span
                  style={{
                    color: '#16A34A',
                    fontFamily: 'var(--font-bangers), cursive',
                    letterSpacing: '1px',
                    display: 'inline-block',
                    minWidth: '200px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  Copied!
                </span>
              ) : (
                <>
                  <span
                    style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-bangers), cursive',
                      letterSpacing: '1px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginRight: '8px',
                    }}
                  >
                    CA
                  </span>
                  <code style={{color: '#1A1A2A', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace'}}>
                    {CA}
                  </code>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}