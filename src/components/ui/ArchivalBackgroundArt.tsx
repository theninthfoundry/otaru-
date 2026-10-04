'use client';

import React from 'react';

/**
 * ArchivalBackgroundArt
 * Refined foundation: Removed decorative ASCII noise and excessive kanji watermarks.
 * Preserves clean no-op exports to avoid breaking references, plus ONE tasteful kanji stamp (印).
 */

export function SashikoGrid(_props: {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}) {
  return null;
}

export function VerticalKanjiStamp(_props: {
  text: string;
  subtext?: string;
  top?: string;
  right?: string;
  left?: string;
  opacity?: number;
}) {
  return null;
}

export function AsciiWaveArt(_props?: {
  style?: React.CSSProperties;
  opacity?: number;
}) {
  return null;
}

export function AsciiLoomBlueprint(_props?: {
  style?: React.CSSProperties;
  opacity?: number;
}) {
  return null;
}

export function JapaneseCornerBorder({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Single tasteful kanji stamp (印) as a signature hallmark
 */
export function KanjiStamp({
  text = '印',
  className = '',
  style,
}: {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`stamp-seal ${className}`}
      aria-label="Atelier seal"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.4rem',
        height: '1.4rem',
        border: '1px solid var(--hairline)',
        fontFamily: 'var(--font-display)',
        fontSize: '0.72rem',
        color: 'var(--ink-muted)',
        userSelect: 'none',
        ...style,
      }}
    >
      {text}
    </span>
  );
}
