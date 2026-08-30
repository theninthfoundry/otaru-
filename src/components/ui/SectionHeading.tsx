import React from 'react';
import clsx from 'clsx';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  lede?: string | React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={clsx(
        isCenter && 'text-center flex flex-col items-center',
        className
      )}
    >
      {eyebrow && (
        <span
          className={clsx('eyebrow', isCenter && 'justify-center')}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={clsx(
          'section-title',
          isCenter && 'mx-auto'
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={clsx(
            'section-lede',
            isCenter && 'mx-auto text-center'
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
