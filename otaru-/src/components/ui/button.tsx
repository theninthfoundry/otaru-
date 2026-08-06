import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-otaru-ink text-otaru-chalk hover:bg-otaru-ink-muted active:bg-otaru-stone-dark',
  secondary:
    'bg-otaru-cream text-otaru-ink hover:bg-otaru-cream-deep active:bg-otaru-stone-light',
  ghost:
    'bg-transparent text-otaru-ink hover:bg-otaru-cream/60 active:bg-otaru-cream',
  outline:
    'bg-transparent text-otaru-ink border border-otaru-border hover:border-otaru-ink active:bg-otaru-cream/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-body-sm',
  md: 'px-8 py-3 text-body-sm',
  lg: 'px-10 py-4 text-body-md',
};

/**
 * Core button component — luxury aesthetic.
 * No rounded-full by default; uses subtle rounding for a premium feel.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wide',
          'rounded-[2px] transition-all duration-subtle ease-settle',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-otaru-ink',
          'disabled:opacity-40 disabled:pointer-events-none',
          'select-none whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
