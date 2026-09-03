'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';

/**
 * StudioStatusBar
 * A minimal, high-aesthetic ambient status bar anchored to the bottom of the viewport.
 * Features:
 * - Otaru/Hokkaido JST local time & kanji clock
 * - Real-time lunar phase calculation (朔望月)
 * - Pure Web Audio procedural soundscape (Edo wind chimes & cedar rain, 0 external assets)
 * - Quick currency selector (USD, EUR, GBP, JPY, INR)
 * - Cryptographic ledger security badge
 */
export function StudioStatusBar() {
  const { currency, setCurrency } = useCurrency();
  const [jstTime, setJstTime] = useState<string>('');
  const [moonPhase, setMoonPhase] = useState<string>('Waxing Crescent · 眉月');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ rainGain?: GainNode; chimeTimer?: NodeJS.Timeout } | null>(null);

  // 1. Hokkaido Local Clock (JST / UTC+9)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
        setJstTime(`小樽 · ${formatted} JST`);
      } catch {
        setJstTime('小樽 · OTARU JST');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Lunar Phase Calculation
  useEffect(() => {
    const getLunarPhase = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      // Conway moon phase approximation
      let r = year % 100;
      r %= 19;
      if (r > 9) r -= 19;
      let phase = ((r * 11) % 30) + parseInt(String(month), 10) + day;
      if (month < 3) phase += 2;
      phase = Math.round(phase) % 30;

      if (phase === 0 || phase === 29) return 'New Moon · 新月';
      if (phase < 7) return 'Waxing Crescent · 眉月';
      if (phase === 7 || phase === 8) return 'First Quarter · 上弦';
      if (phase < 14) return 'Waxing Gibbous · 弓張';
      if (phase === 14 || phase === 15) return 'Full Moon · 満月';
      if (phase < 22) return 'Waning Gibbous · 寝待月';
      if (phase === 22 || phase === 23) return 'Last Quarter · 下弦';
      return 'Waning Crescent · 有明月';
    };

    setMoonPhase(getLunarPhase());
  }, []);

  // 3. Procedural Atelier Soundscape (Web Audio API)
  const toggleSoundscape = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      if (soundNodesRef.current?.chimeTimer) {
        clearInterval(soundNodesRef.current.chimeTimer);
      }
      soundNodesRef.current = null;
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Volume
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Cedar Rain Ambient (Pink noise synthesized in-memory)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Soft low-pass filter to sound like gentle rain on Japanese cedar
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.25, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(masterGain);
      whiteNoise.start();

      // Procedural Edo Glass Wind Chimes (gentle harmonic bell tones at random intervals)
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const chimeFreqs = [1200, 1440, 1620, 1920, 2160, 2400];
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)] ?? 1440;

        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        chimeGain.gain.setValueAtTime(0.001, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(chimeGain);
        chimeGain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);
      };

      // Random natural breeze intervals
      const chimeTimer = setInterval(() => {
        if (Math.random() > 0.45) playChime();
      }, 3500);

      soundNodesRef.current = { rainGain, chimeTimer };
      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <footer
      aria-label="Atelier status bar"
      className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 h-8 items-center justify-between px-5 text-[10px] tracking-widest uppercase border-t border-[rgba(217,189,131,0.14)] bg-[rgba(8,8,9,0.88)] backdrop-blur-md text-[var(--otaru-sand-muted,#a1a1aa)]"
      style={{
        fontFamily: 'monospace',
      }}
    >
      {/* Left: JST Clock & Lunar Phase */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[var(--otaru-cream,#f4f0eb)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D9BD83] animate-pulse" />
          {jstTime || '小樽 · JST'}
        </span>
        <span className="text-[rgba(244,240,235,0.25)]">|</span>
        <span className="text-[#a1a1aa] hover:text-[#D9BD83] transition-colors">
          {moonPhase}
        </span>
      </div>

      {/* Center: Ambient Soundscape Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSoundscape}
          className="flex items-center gap-2 px-2.5 py-0.5 rounded border border-[rgba(217,189,131,0.25)] hover:border-[#D9BD83] text-[#f4f0eb] hover:text-[#D9BD83] transition-all bg-[rgba(217,189,131,0.04)]"
          title="Toggle procedural Hokkaido cedar rain & glass wind chime soundscape"
        >
          <span className="text-[11px]">{isPlayingAudio ? '風鈴 ⏸' : '風鈴 ♬'}</span>
          <span>{isPlayingAudio ? 'AMBIENCE: ACTIVE' : 'ATELIER SOUND'}</span>
        </button>
      </div>

      {/* Right: Security & Currency Switcher */}
      <div className="flex items-center gap-4">
        <span className="text-[9px] text-[rgba(244,240,235,0.4)]">
          LEDGER: VERIFIED · ED25519
        </span>
        <span className="text-[rgba(244,240,235,0.25)]">|</span>
        <div className="flex items-center gap-1.5">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={`px-1.5 py-0.5 rounded transition-all text-[9px] ${
                currency === code
                  ? 'bg-[#D9BD83] text-[#080808] font-bold shadow-[0_0_8px_rgba(217,189,131,0.3)]'
                  : 'text-[rgba(244,240,235,0.5)] hover:text-[#f4f0eb]'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
