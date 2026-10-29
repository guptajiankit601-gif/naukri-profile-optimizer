'use client';

import React from 'react';
import { BRAND_CONFIG } from '@/config/brand';

interface CareerUpLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'mark' | 'tile' | 'full';
  showTagline?: boolean;
  monochrome?: boolean;
}

/**
 * CareerUp Official Monogram Logo Component
 * Combines 'C' and 'U' with an integrated ascending career progression arrow.
 */
export const CareerUpLogo: React.FC<CareerUpLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'tile',
  showTagline = false,
  monochrome = false,
}) => {
  // Dimension mapping
  const sizeMap: Record<string, { px: number; textClass: string; descClass: string }> = {
    xs: { px: 20, textClass: 'text-xs', descClass: 'text-[9px]' },
    sm: { px: 28, textClass: 'text-sm', descClass: 'text-[10px]' },
    md: { px: 32, textClass: 'text-base', descClass: 'text-[11px]' },
    lg: { px: 40, textClass: 'text-lg', descClass: 'text-xs' },
    xl: { px: 48, textClass: 'text-xl', descClass: 'text-xs' },
  };

  const dim = typeof size === 'number' 
    ? { px: size, textClass: 'text-base', descClass: 'text-[11px]' } 
    : sizeMap[size] || sizeMap.md;

  // Distinctive SVG Vector Monogram (C + U + Ascending Arrow Motif)
  const MonogramVector = (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cu-accent-arrow" x1="16" y1="11.5" x2="23" y2="7.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* Outer 'C' contour */}
      <path
        d="M19.5 7.5H12C8.41 7.5 5.5 10.41 5.5 14V18C5.5 21.59 8.41 24.5 12 24.5H18"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Inner 'U' looping under and shooting straight up */}
      <path
        d="M12.5 13V17.5C12.5 19.43 14.07 21 16 21C17.93 21 19.5 19.43 19.5 17.5V8.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Ascending Arrowhead on the U's right pillar with restrained luminous cyan accent */}
      <path
        d="M16 11.5L19.5 7.5L23 11.5"
        stroke={monochrome ? 'currentColor' : 'url(#cu-accent-arrow)'}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'mark') {
    return (
      <div 
        style={{ width: dim.px, height: dim.px }} 
        className={`inline-flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 ${className}`}
        aria-label="CareerUp Monogram"
      >
        {MonogramVector}
      </div>
    );
  }

  const tileElement = (
    <div
      style={{ width: dim.px, height: dim.px }}
      className={`inline-flex items-center justify-center rounded-xl shrink-0 p-1.5 shadow-xs transition-all duration-200 ${
        monochrome
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
          : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white ring-1 ring-blue-500/20 shadow-blue-500/10'
      } ${className}`}
      aria-label="CareerUp Logo"
    >
      {MonogramVector}
    </div>
  );

  if (variant === 'tile') {
    return tileElement;
  }

  // Variant === 'full' (Tile + Wordmark + Optional Tagline)
  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      {tileElement}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-baseline gap-2">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-slate-100 ${dim.textClass}`}>
            {BRAND_CONFIG.name}
          </span>
          {!showTagline && (
            <span className={`font-medium text-slate-500 dark:text-slate-400 hidden sm:inline pl-2 border-l border-slate-200 dark:border-slate-800 ${dim.descClass}`}>
              {BRAND_CONFIG.descriptor}
            </span>
          )}
        </div>
        {showTagline && (
          <span className={`font-medium text-slate-500 dark:text-slate-400 ${dim.descClass}`}>
            {BRAND_CONFIG.tagline}
          </span>
        )}
      </div>
    </div>
  );
};

export interface CareerUpBrandProps {
  className?: string;
  onClick?: () => void;
  isDemo?: boolean;
}

/**
 * CareerUp Standard Brand Header Unit
 * Enforces deliberate desktop specifications:
 * [CareerUp logo: ~38px] [13px gap] [CareerUp: 18px bold] [11px gap] [Divider: 22px] [11px gap] [Tagline: 12px muted]
 */
export const CareerUpBrand: React.FC<CareerUpBrandProps> = ({
  className = '',
  onClick,
  isDemo = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center cursor-pointer select-none group shrink-0 ${className}`}
      title="Return to CareerUp Home"
    >
      {/* 1. Logo mark: 38px */}
      <CareerUpLogo size={38} variant="tile" />

      {/* 2. Gap: 13px + Brand name: 18px bold */}
      <span className="ml-[13px] text-[18px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {BRAND_CONFIG.name}
      </span>

      {/* 3. Gap: 11px + Vertical divider: 22px high, subtle & thin immediately after wordmark */}
      <span
        className="hidden md:inline-block h-[22px] w-[1px] bg-slate-300 dark:bg-slate-700 mx-[11px] shrink-0"
        aria-hidden="true"
      />

      {/* 4. Gap: 11px + Tagline: 12px, smaller, muted */}
      <span className="hidden lg:inline-block text-[12px] font-medium text-slate-500 dark:text-slate-400 tracking-normal leading-none">
        {BRAND_CONFIG.tagline}
      </span>

      {/* Responsive shorter descriptor for compact tablet screens */}
      <span className="hidden sm:inline-block lg:hidden text-[12px] font-medium text-slate-500 dark:text-slate-400 tracking-normal leading-none">
        {BRAND_CONFIG.descriptor}
      </span>

      {/* Optional Demo / Sample Report Badge */}
      {isDemo && (
        <span className="ml-2.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold leading-normal">
          Sample Report
        </span>
      )}
    </div>
  );
};
