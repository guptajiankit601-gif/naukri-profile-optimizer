'use client';

import React from 'react';
import { ActionPlanItem } from '@/types';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  item: ActionPlanItem;
  onToggle: (id: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ item, onToggle, onNavigateToTab }) => {
  return (
    <div
      onClick={() => onToggle(item.id)}
      className={cn(
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3',
        item.completed
          ? 'bg-emerald-950/20 border-emerald-500/20 opacity-75'
          : 'bg-[rgba(26,49,69,0.35)] border-white/10 hover:border-white/20'
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
          className="mt-0.5 text-slate-400 hover:text-white shrink-0"
        >
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500" />
          )}
        </button>

        <div className="space-y-1 min-w-0">
          <p
            className={cn(
              'text-xs font-bold text-slate-200',
              item.completed && 'line-through text-slate-400'
            )}
          >
            {item.title}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#FF7582]" />
              ~{item.estimatedMinutes} mins
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              +{item.expectedPoints} pts yield
            </span>
          </div>
        </div>
      </div>

      {onNavigateToTab && item.targetTab && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onNavigateToTab(item.targetTab);
          }}
          className="h-7 px-2 text-[11px] text-[#FF7582] hover:bg-[#FF7582]/10 shrink-0"
        >
          Do It
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  );
};
