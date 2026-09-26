import React from 'react';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f4f4f0',
        margin: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(6rem, 28vw, 14rem)',
          lineHeight: 1,
          color: '#1a1a1a',
          fontWeight: 400,
          userSelect: 'none',
        }}
        aria-label="?"
      >
        ?
      </span>
    </div>
  );
}
