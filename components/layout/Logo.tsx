import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showWordmark = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-md',
    md: 'w-8 h-8 text-sm rounded-lg',
    lg: 'w-10 h-10 text-base rounded-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sunset Glyph */}
      <div
        className={`${sizeClasses[size]} bg-gradient-to-tr from-[#355C7D] via-[#725A7A] to-[#FF7582] flex items-center justify-center shadow-md shadow-[#FF7582]/20 flex-shrink-0 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-50" />
        <span className="text-white font-extrabold font-display tracking-tighter relative z-10">N</span>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[#F2F5F8]">
              Naukri
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30">
              Optimizer
            </span>
          </div>
          <span className="text-[10px] text-[#6E8397] tracking-wider uppercase hidden sm:block font-medium">
            Recruiter Diagnostic
          </span>
        </div>
      )}
    </div>
  );
}
