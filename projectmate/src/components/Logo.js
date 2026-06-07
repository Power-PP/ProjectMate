import React from 'react';

function Logo({ size = 32, className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`pm-logo ${className}`}
      {...props}
    >
      <defs>
        <linearGradient id="logo-comp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary, #6366f1)" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="var(--accent-cyan, #06b6d4)" />
        </linearGradient>
        <filter id="logo-comp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Main Logo Shape: A futuristic rounded hexagon with gradient and glow */}
      <path d="M50 8 L85 28 L85 72 L50 92 L15 72 L15 28 Z" fill="url(#logo-comp-gradient)" opacity="0.15" />
      {/* Overlapping geometric lines representing P and M */}
      <path d="M35 32 L35 68 M35 44 C42 44 48 40 48 35 C48 30 42 26 35 26" stroke="url(#logo-comp-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#logo-comp-glow)" />
      <path d="M52 68 L52 44 L64 56 L76 44 L76 68" stroke="url(#logo-comp-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#logo-comp-glow)" />
    </svg>
  );
}

export default Logo;
