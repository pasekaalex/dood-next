'use client';

import { useState } from 'react';

const CA = '4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump';

export default function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
      <div className="inline-flex rounded-xl bg-white px-5 py-3" style={{border: '3px solid var(--primary)'}}>
        <span className="font-bold text-sm uppercase tracking-wider shrink-0" style={{color: 'var(--primary)', fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px'}}>CA</span>
        <code className="font-mono text-sm font-bold" style={{color: '#1A1A2E'}}>{CA}</code>
      </div>
      <button
        onClick={handleCopy}
        className="px-8 py-4 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-105"
        style={{
          background: copied ? '#16A34A' : 'var(--primary)',
          color: 'white',
          boxShadow: copied ? '0 4px 0 #15803D' : '0 4px 0 #b84a1e',
          minWidth: '120px',
        }}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}
