'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingControls() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [pos, setPos] = useState({ x: 20, y: 100 });
  const [drag, setDrag] = useState({ active: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = document.getElementById('jazz-bg') as HTMLAudioElement;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (drag.active) {
        setPos({
          x: drag.startPosX + (e.clientX - drag.startX),
          y: drag.startPosY + (e.clientY - drag.startY),
        });
      }
    };
    const handleMouseUp = () => setDrag(d => ({ ...d, active: false }));
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drag]);

  const toggleMute = () => {
    const audio = document.getElementById('jazz-bg') as HTMLAudioElement;
    if (audio) {
      if (muted) {
        audio.muted = false;
        audio.volume = volume;
        setMuted(false);
      } else {
        audio.muted = true;
        setMuted(true);
      }
    }
  };

  return (
    <>
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-110"
          style={{ background: 'var(--btn-primary)', color: 'white' }}
        >
          ⚙️
        </button>
      )}

      {visible && (
        <div
          ref={panelRef}
          className="fixed z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            left: pos.x,
            top: pos.y,
            width: 260,
            background: 'white',
            border: '3px solid var(--card-border)',
            boxShadow: '0 8px 0 var(--card-border)',
          }}
        >
          {/* Drag Handle */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
            style={{ background: 'var(--primary)', borderBottom: '2px solid var(--card-border)' }}
            onMouseDown={(e) => {
              setDrag({
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                startPosX: pos.x,
                startPosY: pos.y,
              });
            }}
          >
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-bangers), cursive', letterSpacing: '2px', color: 'var(--text)' }}>
              CONTROLS
            </span>
            <div className="flex gap-2">
              <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 rounded-lg bg-white/60 text-sm font-bold cursor-pointer">─</button>
              <button onClick={() => setVisible(false)} className="w-7 h-7 rounded-lg bg-white/60 text-sm font-bold cursor-pointer">✕</button>
            </div>
          </div>

          {expanded && (
            <div className="p-4 flex flex-col gap-4">
              {/* Music Controls */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  🎵 Music
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-transform active:scale-95"
                    style={{ background: muted ? 'var(--danger)' : 'var(--btn-primary)', color: 'white', boxShadow: '0 3px 0 var(--btn-primary-shadow)' }}
                  >
                    {muted ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      setMuted(v === 0);
                      const audio = document.getElementById('jazz-bg') as HTMLAudioElement;
                      if (audio) audio.volume = v;
                    }}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: 'var(--secondary)', accentColor: 'var(--btn-primary)' }}
                  />
                </div>
              </div>

              {/* About */}
              <div className="text-xs" style={{ color: 'var(--text-light)' }}>
                <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Dood v1.0</span> · drag to move
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}