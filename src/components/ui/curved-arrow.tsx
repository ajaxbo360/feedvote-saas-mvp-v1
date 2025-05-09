import React from 'react';

interface CurvedArrowProps {
  className?: string;
  color?: string;
}

export function CurvedArrow({ className = '', color = '#FFB800' }: CurvedArrowProps) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 90 Q 20 110, 90 110 Q 110 110, 110 90 L 110 30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M100 35 L 110 25 L 120 35" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
