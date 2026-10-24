'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlanceTimerProps {
  onTimerComplete?: () => void;
  onActiveIndexChange?: (stepIndex: number) => void;
}

export const GlanceTimer: React.FC<GlanceTimerProps> = ({ onTimerComplete, onActiveIndexChange }) => {
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setTimeout(() => {
        const next = secondsLeft - 1;
        setSecondsLeft(next);
        // Map 6s to gaze index 0..3
        const gazeIndex = Math.min(3, Math.floor((6 - next) / 1.5));
        onActiveIndexChange?.(gazeIndex);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      onTimerComplete?.();
    }
    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft, onTimerComplete, onActiveIndexChange]);

  const handleStart = () => {
    setSecondsLeft(6);
    setIsRunning(true);
    onActiveIndexChange?.(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(6);
    onActiveIndexChange?.(0);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#FF7582] animate-pulse" />
        <span className="text-xs font-mono font-bold text-white">
          {secondsLeft.toFixed(1)}s
        </span>
      </div>

      <div className="h-4 w-24 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF7582] to-[#C56C86] transition-all duration-1000 rounded-full"
          style={{ width: `${((6 - secondsLeft) / 6) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {!isRunning ? (
          <Button
            size="sm"
            onClick={handleStart}
            className="h-7 px-2.5 text-xs font-bold bg-[#FF7582] text-slate-950 hover:bg-[#FF7582]/90"
          >
            <Play className="w-3 h-3 mr-1 fill-current" />
            Simulate 6s
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-7 px-2 text-xs border-white/10 text-slate-300"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
