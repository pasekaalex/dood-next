'use client';

import { useState } from 'react';

const RATE_LIMIT_MS = 10 * 1000;
const STORAGE_KEY = 'dood_last_gen';

type State = 'idle' | 'loading' | 'done' | 'error';

interface Props {
  onGenerated: (url: string) => void;
  onGeneratingChange?: (generating: boolean) => void;
}

export default function PFPSection({ onGenerated, onGeneratingChange }: Props) {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<State>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const MAINTENANCE_MODE = false;

  const checkRateLimit = () => {
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) return true;
    const elapsed = Date.now() - parseInt(last);
    if (elapsed < RATE_LIMIT_MS) {
      setTimeLeft(Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!checkRateLimit()) return;

    setState('loading');
    setErrorMsg('');
    onGeneratingChange?.(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

    const tick = setInterval(() => {
      const remaining = Math.ceil((RATE_LIMIT_MS - (Date.now() - parseInt(localStorage.getItem(STORAGE_KEY) || '0'))) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(tick);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setImageUrl(data.imageUrl);
      setState('done');
      onGenerated(data.imageUrl);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong. Try again.');
      setState('error');
    } finally {
      clearInterval(tick);
      onGeneratingChange?.(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const canGenerate = state !== 'loading' && prompt.trim().length > 0 && timeLeft === 0;

  return (
    <section className="w-full flex flex-col items-center px-4 md:px-8 pb-2 flex-1 justify-end">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2">

        <h2 className="text-center text-2xl md:text-3xl font-black mb-0 w-full" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '3px', color: '#ffffff', textShadow: '3px 3px 0 var(--primary), -1px -1px 0 var(--primary), 1px -1px 0 var(--primary), -1px 1px 0 var(--primary)'}}>
          {MAINTENANCE_MODE ? '⛔ MAINTENANCE' : 'CREATE UR DOOD'}
        </h2>

        {MAINTENANCE_MODE ? (
          <div className="w-full text-center py-8 px-4 rounded-xl" style={{background: '#1A1A2E', border: '3px solid var(--primary)'}}>
            <p className="text-white font-bold text-lg mb-2">🚧 Image generation is paused</p>
            <p className="text-gray-400 text-sm">Check back soon! We're making improvements.</p>
          </div>
        ) : (
          <>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your DOOD... a dude grilling, a chill dude with shades, a cowboy at a cookout..."
              rows={2}
              className="w-full rounded-xl resize-none outline-none font-semibold transition-colors leading-relaxed text-center"
              style={{border: '3px solid var(--primary)', color: '#1A1A2E', background: '#ffffff', fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'center', padding: '12px', boxShadow: '4px 4px 0 var(--primary)'}}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && canGenerate) { e.preventDefault(); handleGenerate(); } }}
            />

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="rounded-xl font-bold cursor-pointer transition-all hover:brightness-105"
              style={{
                background: canGenerate ? 'var(--primary)' : '#999',
                color: 'white',
                fontSize: '1.2rem',
                padding: '10px 40px',
                boxShadow: 'none',
                opacity: state === 'loading' ? 0.7 : 1,
                letterSpacing: '0.5px',
              }}>
              {state === 'loading' ? '⏳ Generating...' : 'Generate DOOD'}
            </button>

            {state === 'done' && imageUrl && (
              <div className="flex gap-3">
                <a href={imageUrl} download="dood-pfp.png"
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{background: 'var(--secondary)', color: '#1A1A2E', boxShadow: '0 5px 0 #E6B800', minWidth: '120px', textAlign: 'center'}}>
                  ⬇️ Save
                </a>
                <button onClick={() => { setState('idle'); setImageUrl(null); setPrompt(''); }}
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{background: '#666', color: 'white', boxShadow: '0 5px 0 #333', minWidth: '120px', textAlign: 'center'}}>
                  🔄 Reset
                </button>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-center font-bold w-full" style={{color: 'var(--danger)'}}>⚠️ {errorMsg}</p>
            )}
          </>
        )}

      </div>
    </section>
  );
}