'use client';

import { useState } from 'react';

const RATE_LIMIT_MS = 3 * 60 * 1000;
const STORAGE_KEY = 'dood_last_gen';

const REF_IMAGES = [
  '/pfp-refs/dood-grill-master.jpg',
  '/pfp-refs/chad-mccool-5.jpg',
];

type State = 'idle' | 'loading' | 'done' | 'error';

export default function PFPSection() {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<State>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

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
        body: JSON.stringify({ prompt: prompt.trim(), images: REF_IMAGES }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setImageUrl(data.imageUrl);
      setState('done');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong. Try again.');
      setState('error');
    } finally {
      clearInterval(tick);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const canGenerate = state !== 'loading' && prompt.trim().length > 0 && timeLeft === 0;

  return (
    <section className="w-full flex flex-col items-center px-4 md:px-8 pb-4">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">

        <h2 className="text-center text-3xl md:text-4xl font-black mb-1 w-full" style={{fontFamily: 'var(--font-bangers), cursive', letterSpacing: '3px', color: '#ffffff', textShadow: '3px 3px 0 var(--primary), -1px -1px 0 var(--primary), 1px -1px 0 var(--primary), -1px 1px 0 var(--primary)'}}>
          DOOD PFP GENERATOR
        </h2>
        <p className="text-center text-sm opacity-80 mb-4 font-bold w-full" style={{color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>Describe your DOOD. AI generates it in seconds.</p>

        <div className="rounded-2xl overflow-hidden w-full" style={{border: '6px solid var(--primary)'}}>

          <div className="p-8 md:p-10 space-y-4 flex flex-col items-center" style={{background: 'white'}}>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="a dude grilling at a backyard BBQ with cowboy hat and beer..."
              rows={4}
              className="w-full max-w-sm rounded-xl p-5 text-base resize-none outline-none font-semibold transition-colors leading-relaxed"
              style={{border: '2px solid var(--surface)', color: '#1A1A2E', background: '#f5f5f5', fontSize: '1rem', lineHeight: '1.6'}}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && canGenerate) { e.preventDefault(); handleGenerate(); } }}
            />

            <div className="flex gap-2 w-full max-w-sm mx-auto">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all"
                style={{
                  background: canGenerate ? 'var(--primary)' : '#ccc',
                  color: 'white',
                  fontSize: '1.1rem',
                  padding: '16px 24px',
                  boxShadow: canGenerate ? '0 5px 0 #b84a1e' : 'none',
                  opacity: state === 'loading' ? 0.7 : 1,
                }}>
                {state === 'loading' ? '⏳ Generating...' : '🎨 Generate DOOD'}
              </button>
              {state === 'done' && imageUrl && (
                <a href={imageUrl} download="dood-pfp.png"
                  className="px-5 py-3 rounded-xl font-bold text-sm"
                  style={{background: 'var(--secondary)', color: '#1A1A2E', boxShadow: '0 5px 0 #E6B800'}}>
                  ⬇️ Save
                </a>
              )}
            </div>

            {timeLeft > 0 && state !== 'done' && (
              <p className="text-xs text-center font-bold w-full" style={{color: 'var(--danger)'}}>
                ⏳ Rate limited — try again in {formatTime(timeLeft)}
              </p>
            )}

            {errorMsg && (
              <p className="text-xs text-center font-bold w-full" style={{color: 'var(--danger)'}}>⚠️ {errorMsg}</p>
            )}
          </div>

          {(state === 'done' || state === 'loading') && (
            <div className="p-4 md:p-6 flex justify-center" style={{background: 'var(--surface)'}}>
              {state === 'loading' ? (
                <div className="flex items-center justify-center h-64 rounded-xl w-full max-w-md" style={{background: 'rgba(255,255,255,0.5)'}}>
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-pulse">🎨</div>
                    <p className="text-sm font-bold opacity-60">Creating your DOOD...</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Generated DOOD" className="rounded-xl" style={{aspectRatio: '1/1', maxWidth: '256px', width: '100%', objectFit: 'cover'}} />
              ) : null}
            </div>
          )}

          <div className="px-4 py-2 text-center" style={{background: 'var(--secondary)'}}>
            <p className="text-xs font-bold opacity-70">🟣 Solana-native • AI-powered • 1 generation every 3 minutes</p>
          </div>
        </div>

      </div>
    </section>
  );
}