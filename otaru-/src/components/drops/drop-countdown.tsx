'use client';

import React, { useEffect, useState } from 'react';

interface DropCountdownProps {
  targetDate: string; // ISO date string
  dropTitle: string;
  onUnlock?: (password: string) => boolean;
}

export function DropCountdown({
  targetDate,
  dropTitle,
  onUnlock,
}: DropCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isReleased: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReleased: false,
  });

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    function calculateTime() {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isReleased: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlock && onUnlock(password)) {
      setUnlocked(true);
      setPasswordError(false);
    } else if (password.toLowerCase() === 'otaru' || password.toLowerCase() === 'origins') {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="bg-otaru-chalk border border-otaru-border/60 p-8 md:p-12 rounded-sm space-y-8 text-center max-w-3xl mx-auto shadow-sm">
      <div className="space-y-2">
        <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[10px] font-semibold">
          {timeLeft.isReleased ? 'Drop Live Now' : 'Limited Drop Countdown'}
        </span>
        <h2 className="text-display-sm font-semibold tracking-tight text-otaru-ink">
          {dropTitle}
        </h2>
      </div>

      {/* Countdown Digits */}
      {!timeLeft.isReleased && !unlocked && (
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto text-otaru-ink">
          <div className="bg-otaru-cream/60 p-4 rounded-sm border border-otaru-border/40">
            <span className="text-display-md font-bold block leading-none font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-caption text-[10px] uppercase tracking-wider text-otaru-ink-subtle">Days</span>
          </div>
          <div className="bg-otaru-cream/60 p-4 rounded-sm border border-otaru-border/40">
            <span className="text-display-md font-bold block leading-none font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-caption text-[10px] uppercase tracking-wider text-otaru-ink-subtle">Hours</span>
          </div>
          <div className="bg-otaru-cream/60 p-4 rounded-sm border border-otaru-border/40">
            <span className="text-display-md font-bold block leading-none font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-caption text-[10px] uppercase tracking-wider text-otaru-ink-subtle">Mins</span>
          </div>
          <div className="bg-otaru-cream/60 p-4 rounded-sm border border-otaru-border/40">
            <span className="text-display-md font-bold block leading-none font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-caption text-[10px] uppercase tracking-wider text-otaru-ink-subtle">Secs</span>
          </div>
        </div>
      )}

      {/* Password Protected Early Access Form */}
      {!timeLeft.isReleased && !unlocked && (
        <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-3 pt-4 border-t border-otaru-border/40">
          <span className="text-caption text-xs font-medium text-otaru-ink block">
            Have an Early Access Pass Code?
          </span>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Passcode (e.g. OTARU)"
              className="flex-1 bg-otaru-cream/50 border border-otaru-border rounded-full px-4 py-2.5 text-body-sm outline-none focus:border-otaru-ink"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
            >
              Unlock Drop
            </button>
          </div>
          {passwordError && (
            <p className="text-caption text-otaru-error text-xs">Invalid passcode. Check your registry invite.</p>
          )}
        </form>
      )}

      {unlocked && (
        <div className="p-6 bg-otaru-cream/80 border border-otaru-border rounded-sm text-otaru-ink space-y-2 animate-fadeIn">
          <span className="text-overline uppercase tracking-widest text-otaru-ink text-[10px] font-bold">
            Passcode Verified
          </span>
          <h3 className="text-body-md font-semibold">Early Access Granted</h3>
          <p className="text-body-sm text-otaru-ink-muted">
            You now have private access to preview and order garments from this release before public launch.
          </p>
        </div>
      )}
    </div>
  );
}
