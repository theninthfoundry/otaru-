'use client';

import React from 'react';

/**
 * SignatureUI — House of Otaru Living Image Archive
 * Exact pixel-identical standalone digital maison archive.
 * Embedded directly from the verbatim preview.html prototype.
 */
export function SignatureUI() {
  return (
    <iframe
      src="/preview.html"
      title="House of Otaru"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 99999,
        background: '#0b1420',
      }}
    />
  );
}

export default SignatureUI;
