/** 青海波 (seigaiha) — the Japanese "blue ocean waves" pattern, drawn as a quiet SVG band. */
export function SeigaihaBand({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={className} width="100%" height="30" preserveAspectRatio="none">
      <defs>
        <pattern id="otaru-seigaiha" width="44" height="22" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            {[0, 44, 22].map((cx) => {
              const cy = cx === 22 ? 11 : 22;
              return [20, 14, 8, 2.5].map((r) => <circle key={`${cx}-${r}`} cx={cx} cy={cy} r={r} />);
            })}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#otaru-seigaiha)" />
    </svg>
  );
}
