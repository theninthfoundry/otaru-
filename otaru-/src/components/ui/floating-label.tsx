'use client';

import { useState, useRef, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  error?: string;
}

/**
 * Form input with floating label animation.
 * Label starts as placeholder, floats up on focus/fill.
 */
export function FloatingLabel({
  label,
  error,
  className,
  id,
  ...props
}: FloatingLabelProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = inputRef.current?.value !== '' && inputRef.current?.value !== undefined;
  const isFloating = isFocused || hasValue;

  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        id={inputId}
        className={cn(
          'peer w-full bg-transparent',
          'border-b border-otaru-border pb-2 pt-5',
          'text-body-md text-otaru-ink',
          'outline-none transition-colors duration-subtle',
          'focus:border-otaru-ink',
          error && 'border-otaru-error focus:border-otaru-error',
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        {...props}
      />
      <motion.label
        htmlFor={inputId}
        className={cn(
          'absolute left-0 cursor-text select-none',
          'text-otaru-ink-muted transition-colors',
          'pointer-events-none',
        )}
        initial={false}
        animate={{
          top: isFloating ? 0 : 20,
          fontSize: isFloating ? '11px' : '16px',
          color: isFocused
            ? 'var(--color-ink)'
            : error
              ? 'var(--color-error)'
              : 'var(--color-ink-muted)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {label}
      </motion.label>

      {error && (
        <p className="mt-1.5 text-caption text-otaru-error">{error}</p>
      )}
    </div>
  );
}
