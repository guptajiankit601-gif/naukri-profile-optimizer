'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 120 | 160 | 220 | 280;
  label?: string;
  animate?: boolean;
  showBand?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 220,
  label,
  animate = true,
  showBand = true
}) => {
  const strokeWidth = size / 8;
  const radius = size / 2 - strokeWidth - 4;
  const center = size / 2;

  // 240 degree arc: start angle 150deg, end angle 390deg (240deg total sweep)
  const arcSweepDeg = 240;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (arcSweepDeg / 360) * circumference;
  const progressRatio = Math.min(100, Math.max(0, score)) / 100;
  const strokeDashoffset = arcLength * (1 - progressRatio);

  // Band classification
  const isStrong = score >= 71;
  const isOkay = score >= 41 && score < 71;
  const bandLabel = label || (isStrong ? 'Recruiter-Ready' : isOkay ? 'Getting There' : 'Needs Work');

  const gradientId = `gauge-grad-${size}-${score}`;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Profile Strength Score: ${score}/100, ${bandLabel}`}
      >
        <defs>
          {/* Gradient stops shifting by band as specified */}
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            {isStrong ? (
              <>
                <stop offset="0%" stopColor="#355C7D" />
                <stop offset="50%" stopColor="#C56C86" />
                <stop offset="100%" stopColor="#3FBF8F" />
              </>
            ) : isOkay ? (
              <>
                <stop offset="0%" stopColor="#725A7A" />
                <stop offset="50%" stopColor="#C56C86" />
                <stop offset="100%" stopColor="#F5A524" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#725A7A" />
                <stop offset="60%" stopColor="#FF7582" />
                <stop offset="100%" stopColor="#E55260" />
              </>
            )}
          </linearGradient>

          {/* Glow filter for score >= 71 */}
          {isStrong && (
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        {/* Background Track Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--navy-700)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(150 ${center} ${center})`}
        />

        {/* Dynamic Foreground Value Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(150 ${center} ${center})`}
          filter={isStrong ? 'url(#gauge-glow)' : undefined}
          style={{
            transition: animate ? 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
          }}
        />
      </svg>

      {/* Center Score & Label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ paddingTop: size * 0.04 }}
      >
        <span
          className="font-extrabold tracking-tight tabular-nums"
          style={{
            fontSize: `${Math.round(size * 0.28)}px`,
            color: isStrong ? 'var(--success)' : isOkay ? 'var(--warning)' : 'var(--coral-500)',
            lineHeight: 1
          }}
        >
          {score}
        </span>
        <span
          className="font-bold text-[#A8B8C8] uppercase tracking-wider mt-1"
          style={{ fontSize: `${Math.max(10, Math.round(size * 0.055))}px` }}
        >
          out of 100
        </span>
        {showBand && (
          <span
            className="font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5"
            style={{
              fontSize: `${Math.max(9, Math.round(size * 0.05))}px`,
              background: isStrong ? 'rgba(63,191,143,.12)' : isOkay ? 'rgba(245,165,36,.12)' : 'rgba(255,117,130,.12)',
              color: isStrong ? 'var(--success)' : isOkay ? 'var(--warning)' : 'var(--coral-400)',
              border: `1px solid ${isStrong ? 'rgba(63,191,143,.35)' : isOkay ? 'rgba(245,165,36,.35)' : 'rgba(255,117,130,.35)'}`
            }}
          >
            {bandLabel}
          </span>
        )}
      </div>
    </div>
  );
};
