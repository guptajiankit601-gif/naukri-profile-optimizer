'use client';

import React, { useState } from 'react';
import { useReport } from '@/lib/context/ReportContext';
import { ProfileVersion } from '@/types';
import { 
  GitCompare, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Layers
} from 'lucide-react';

export const VersionComparisonView: React.FC = () => {
  const { versions, originalProfile, profile, restoreVersion, scoreReport } = useReport();
  const [selectedVerId, setSelectedVerId] = useState<string>(
    versions.length > 1 ? versions[versions.length - 1].id : (versions[0]?.id || '')
  );

  const baseline = originalProfile || versions[0]?.profile;
  const selectedVersion = versions.find(v => v.id === selectedVerId) || versions[versions.length - 1];
  const comparedProfile = selectedVersion?.profile || profile;

  if (!baseline || !comparedProfile) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800">
        No revisions available for comparison. Optimize your headline or bullets to generate version snapshots.
      </div>
    );
  }

  // Derive diffs
  const baselineSkills = new Set(baseline.skills || []);
  const currentSkills = new Set(comparedProfile.skills || []);

  const addedSkills = comparedProfile.skills?.filter(s => !baselineSkills.has(s)) || [];
  const removedSkills = baseline.skills?.filter(s => !currentSkills.has(s)) || [];
  const commonSkills = comparedProfile.skills?.filter(s => baselineSkills.has(s)) || [];

  const headlineChanged = baseline.headline !== comparedProfile.headline;
  const summaryChanged = baseline.summary !== comparedProfile.summary;

  const baselineScore = versions[0]?.score || (scoreReport?.overallScore ?? 50);
  const currentScore = selectedVersion ? selectedVersion.score : (scoreReport?.overallScore ?? 50);
  const scoreDelta = currentScore - baselineScore;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Resume Version Comparison & Diff
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side comparison between your original uploaded resume and current revision.
              </p>
            </div>
          </div>
        </div>

        {/* Snapshot selector */}
        {versions.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Compare:</span>
            <select
              value={selectedVerId}
              onChange={(e) => setSelectedVerId(e.target.value)}
              aria-label="Select resume snapshot version to compare"
              className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {versions.map((ver, idx) => (
                <option key={ver.id} value={ver.id}>
                  {ver.label} ({idx === 0 ? 'Original' : `#${idx + 1}`} · {ver.score} pts)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Score Delta Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Original Baseline Score</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-1">
            {baselineScore}/100
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Initial resume upload</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Comparison Version Score</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
            {currentScore}/100
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{selectedVersion.label}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Quality Delta</span>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${
              scoreDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} Pts
            </div>
          </div>
          {selectedVersion.id !== versions[0]?.id && (
            <button
              onClick={() => restoreVersion(selectedVersion.id)}
              className="mt-2 w-full py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore This Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side Diffs */}
      <div className="space-y-4">
        {/* 1. Headline Diff */}
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Professional Headline
            </span>
            {headlineChanged ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                Updated
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                Unchanged
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Original Baseline:</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                {baseline.headline || 'No headline specified'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-1 ${
              headlineChanged 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800'
            }`}>
              <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {selectedVersion.label}:
              </span>
              <p className="text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed font-semibold">
                {comparedProfile.headline || 'No headline specified'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Professional Summary Diff */}
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Executive Summary
            </span>
            {summaryChanged ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                Updated
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                Unchanged
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Original Baseline:</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {baseline.summary || 'No summary present in original file.'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-1 ${
              summaryChanged 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800'
            }`}>
              <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {selectedVersion.label}:
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {comparedProfile.summary || 'No summary present.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Skills Delta */}
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Skills Catalog ({comparedProfile.skills?.length || 0} Total)
            </span>
            <div className="flex items-center gap-2 text-xs">
              {addedSkills.length > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px]">
                  +{addedSkills.length} added
                </span>
              )}
              {removedSkills.length > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono text-[11px]">
                  -{removedSkills.length} removed
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {addedSkills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-1">
                <span>+ {s}</span>
              </span>
            ))}
            {commonSkills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                {s}
              </span>
            ))}
            {removedSkills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 line-through text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Experience Bullets Sample Diff */}
        {comparedProfile.experiences && comparedProfile.experiences.length > 0 && (
          <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Experience Bullets Comparison
            </span>

            <div className="space-y-4">
              {comparedProfile.experiences.slice(0, 2).map((exp, eIdx) => {
                const baseExp = baseline.experiences?.[eIdx];
                return (
                  <div key={exp.id || eIdx} className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {exp.title} — {exp.company}
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((b, bIdx) => {
                        const baseBullet = baseExp?.bullets?.[bIdx];
                        const isModified = baseBullet && baseBullet !== b;

                        return (
                          <div key={bIdx} className="text-xs space-y-1">
                            {isModified ? (
                              <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                                <div className="text-rose-600 dark:text-rose-400 line-through text-[11px] font-mono leading-relaxed">
                                  - {baseBullet}
                                </div>
                                <div className="text-emerald-700 dark:text-emerald-300 font-mono leading-relaxed font-semibold">
                                  + {b}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                • {b}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
