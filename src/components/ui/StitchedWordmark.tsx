import { HouseOfOtaruWordmark } from './HouseOfOtaruWordmark';

/**
 * Embroidered signature: the wordmark is lifted into a raised satin-thread relief (SVG lighting),
 * framed by a running stitch with cross-stitch corners, and sealed with a vermilion hanko (小樽).
 * Purely decorative layers are aria-hidden; the wordmark keeps its own accessible name.
 */
export function StitchedWordmark({ className = '' }: { className?: string }) {
  return (
    <div className="relative inline-block max-w-full p-4 sm:p-6">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <filter id="otaru-embroidery" x="-4%" y="-10%" width="108%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.85 0.05" numOctaves="2" seed="7" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="frayed" />
            <feGaussianBlur in="frayed" stdDeviation="0.8" result="soft" />
            <feSpecularLighting in="soft" surfaceScale="3" specularConstant="0.85" specularExponent="22" lightingColor="#FFF4D6" result="spec">
              <feDistantLight azimuth="225" elevation="46" />
            </feSpecularLighting>
            <feComposite in="spec" in2="frayed" operator="in" result="sheen" />
            <feComposite in="frayed" in2="sheen" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: 'url(#otaru-embroidery)' }}>
        <HouseOfOtaruWordmark className={className} />
      </div>

      <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 h-full w-full text-[#D9BD83]">
        <rect x="0.5" y="0.5" width="99.7%" height="99.4%" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="7 5" strokeLinecap="round" />
      </svg>
      {['left-1.5 top-1.5', 'right-1.5 top-1.5', 'left-1.5 bottom-1.5', 'right-1.5 bottom-1.5'].map((pos) => (
        <svg key={pos} aria-hidden="true" focusable="false" viewBox="0 0 10 10" className={`pointer-events-none absolute h-2.5 w-2.5 text-[#D9BD83]/70 ${pos}`}>
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ))}

      <span
        aria-hidden="true"
        lang="ja"
        className="absolute -bottom-3 right-4 grid h-11 w-11 -rotate-6 place-items-center rounded-[3px] bg-[#B5483A] font-display text-[15px] leading-none text-[#F2E8D6] [writing-mode:vertical-rl] ring-1 ring-[#F2E8D6]/30"
        style={{ filter: 'url(#otaru-embroidery)' }}
      >
        小樽
      </span>
    </div>
  );
}
