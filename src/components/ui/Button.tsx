import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-otaru-ink disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-full';

    const variants = {
      primary: 'bg-otaru-ink text-otaru-chalk hover:bg-otaru-ink-muted',
      secondary: 'bg-otaru-chalk-warm text-otaru-ink hover:bg-otaru-cream',
      outline: 'bg-transparent border border-otaru-border text-otaru-ink hover:border-otaru-ink',
      ghost: 'bg-transparent text-otaru-ink hover:bg-otaru-cream/50',
      destructive: 'bg-otaru-error text-otaru-chalk hover:opacity-90',
    };

    const sizes = {
      sm: 'text-caption text-xs px-4 py-1.5',
      md: 'text-body-sm px-6 py-2.5',
      lg: 'text-body-md px-8 py-3.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
