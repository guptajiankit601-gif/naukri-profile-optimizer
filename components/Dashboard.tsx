'use client';

import React, { useState } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem } from '@/types';
import { useReport } from '@/lib/context/ReportContext';
import { RecruiterSimulation } from './RecruiterSimulation';
import { KeywordGapChecker } from './KeywordGapChecker';
import { BulletRewriterView } from './BulletRewriterView';
import { HeadlineFixerView } from './HeadlineFixerView';
import { JobDescriptionMatcherView } from './JobDescriptionMatcherView';
import { RejectionPredictorView } from './RejectionPredictorView';
import { PeerBenchmarkView } from './PeerBenchmarkView';
import { ProgressTrackerView } from './ProgressTrackerView';
import { ActionPlanView } from './ActionPlanView';
import { ExportView } from './ExportView';
import { CompleteProfileAuditView } from './audit/CompleteProfileAuditView';
import { DemoProfileBanner } from './shared/DemoProfileBanner';
import confetti from 'canvas-confetti';
import { 
  Award,
  ClipboardCheck,
  HelpCircle,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
  History,
  TrendingUp,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { ScoreRing } from '@/components/dashboard/ScoreRing';

interface DashboardProps {
  profile: ParsedProfile;
  scoreReport: ScoreReport;
  scoreHistory: ScoreHistoryPoint[];
  actionPlan: ActionPlanItem[];
  onUpdateProfile: (updatedProfile: ParsedProfile, changeReason?: string) => void;
  onOpenShareCard: () => void;
  activeTab?: string;
  onNavigateTab?: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  scoreReport,
  scoreHistory,
  actionPlan,
  onUpdateProfile,
  onOpenShareCard,
  activeTab: controlledActiveTab,
  onNavigateTab
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>('recruiter-sim');
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = (tabId: string) => {
    setInternalActiveTab(tabId);
    onNavigateTab?.(tabId);
  };

  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Consume version history and undo capability from ReportContext
  const { versions, scoreDelta, canUndo, undoLastEdit, restoreVersion } = useReport();

  const handleProfileChangeWithCelebration = (updated: ParsedProfile, reason: string = 'Updated Profile') => {
    onUpdateProfile(updated, reason);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF7582', '#C56C86', '#725A7A', '#10B981']
    });
  };

  const score = scoreReport.overallScore;
  const totalHeadroom = scoreReport.headroomTotal ?? (100 - score);
  const topYield = scoreReport.topFixes.reduce((sum, f) => sum + f.points, 0);

  return (
    <div className="w-full space-y-4">
      {/* Illustrative Demo Profile Alert Banner (if in demo mode) */}
      <DemoProfileBanner />

      {/* 1. TOP HERO ROW (COMPACT SUMMARY — VISIBILITY + CANDIDATE INFO + PRIORITY FIXES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Col 1 (4 cols): Profile Optimization Score Gauge */}
        <div className="lg:col-span-4 bg-[#14273A] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Profile Optimization Score
            </span>
            <button
              onClick={() => setIsComponentModalOpen(true)}
              className="text-[11px] text-[#FF7582] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>10 Criteria (100 Pts)</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ScoreRing score={score} size={90} strokeWidth={8} />
            <div className="space-y-0.5 min-w-0">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                scoreReport.verdict === 'Strong'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : scoreReport.verdict === 'Okay'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30'
              }`}>
                {scoreReport.verdict} Readiness
              </span>
              <p className="text-xs font-bold text-white leading-tight">
                Recruiter Screening Assessment
              </p>
              <p className="text-xs text-slate-300">
                Potential score gain: <strong className="text-blue-400 font-mono font-bold">+{totalHeadroom} pts</strong>
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px]">Evaluation Model:</span>
            <span className="font-semibold text-white text-[11px]">
              {scoreReport.isFresher ? (
                <span className="text-emerald-400">Fresher Model (Projects Reweighted)</span>
              ) : (
                <span className="text-slate-200">Standard 10-Criteria Model</span>
              )}
            </span>
          </div>
        </div>

        {/* Col 2 (4 cols): Candidate Overview & Version History Controls */}
        <div className="lg:col-span-4 bg-[#14273A] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Candidate Target
            </span>
            <div className="flex items-center gap-1.5">
              {scoreDelta !== 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                  scoreDelta > 0 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts vs start
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5 font-semibold">
                {profile.experienceBand}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {profile.name}
              </h2>
              {canUndo && (
                <button
                  onClick={undoLastEdit}
                  title="Undo last accepted edit"
                  className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo Edit</span>
                </button>
              )}
            </div>
            <p className="text-xs font-semibold text-[#FF7582] leading-snug line-clamp-1">
              {profile.headline}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF7582]" />
                <span>{profile.targetCities.slice(0, 2).join(', ') || profile.location}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-slate-300">{profile.skills.length} skills listed</span>
              {profile.expectedSalaryLakhs && (
                <>
                  <span>•</span>
                  <span className="text-slate-300">₹{profile.expectedSalaryLakhs} LPA</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenShareCard}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Share Card</span>
              </button>
              {versions.length > 0 && (
                <button
                  onClick={() => setIsVersionModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-[#FF7582]" />
                  <span>Revisions ({versions.length})</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/40 border border-white/5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>In-Browser</span>
            </div>
          </div>
        </div>

        {/* Col 3 (4 cols): Priority Fixes (Simulated Yield Capped at Headroom) */}
        <div className="lg:col-span-4 bg-[#14273A] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8FA3B8] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF7582]" />
              Priority Fixes (Simulated)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
              +{topYield} pts yield
            </span>
          </div>

          <div className="space-y-1.5">
            {scoreReport.topFixes.slice(0, 3).map((fix, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(fix.actionTab)}
                className="p-2 rounded-xl bg-slate-950/50 border border-white/5 hover:border-[#FF7582]/40 transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                    {fix.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {fix.description || 'Estimated score gain for this improvement'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    +{fix.points}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF7582] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 text-right">
            <button
              onClick={() => setActiveTab('action-plan')}
              className="text-xs text-[#FF7582] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View 7-Day Action Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE WORKSPACE VIEW (Selected via Left Sidebar) */}
      <div className="bg-[#14273A] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-2xl">
        {activeTab === 'audit' && (
          <CompleteProfileAuditView
            profile={profile}
            scoreReport={scoreReport}
            onUpdateProfile={(updated, reason) => handleProfileChangeWithCelebration(updated, reason || 'Updated Profile Audit Item')}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'recruiter-sim' && (
          <RecruiterSimulation
            profile={profile}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'keywords' && (
          <KeywordGapChecker
            profile={profile}
            onUpdateProfile={(updated) => handleProfileChangeWithCelebration(updated, 'Updated Keywords Inventory')}
          />
        )}

        {activeTab === 'rewriter' && (
          <BulletRewriterView
            profile={profile}
            onUpdateProfile={(updated) => handleProfileChangeWithCelebration(updated, 'Accepted Rewritten Bullet')}
          />
        )}

        {activeTab === 'headlines' && (
          <HeadlineFixerView
            profile={profile}
            onUpdateProfile={(updated) => handleProfileChangeWithCelebration(updated, 'Updated Recruiter Headline')}
          />
        )}

        {activeTab === 'job-fit' && (
          <JobDescriptionMatcherView
            profile={profile}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'rejection' && (
          <RejectionPredictorView
            profile={profile}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'benchmarks' && (
          <PeerBenchmarkView profile={profile} />
        )}

        {activeTab === 'action-plan' && (
          <ActionPlanView
            initialPlan={actionPlan}
            scoreReport={scoreReport}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTrackerView
            scoreHistory={scoreHistory}
            currentScore={score}
          />
        )}

        {activeTab === 'export' && (
          <ExportView profile={profile} />
        )}
      </div>

      {/* 10 Component Scoring Breakdown Modal */}
      {isComponentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14273A] border border-white/10 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsComponentModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/50 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7582]" />
              <span>10-Component Transparent Scoring Formula (Total: 100 Pts)</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Deterministic, explainable evaluation of how your {score}/100 score is computed across all 10 criteria.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {scoreReport.components.map((comp) => (
                <div key={comp.name} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{comp.name}</span>
                    <span className="text-xs font-bold text-[#FF7582] font-mono">
                      {comp.score} / {comp.max} pts
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FF7582] to-[#C56C86] h-full rounded-full"
                      style={{ width: `${comp.max > 0 ? (comp.score / comp.max) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{comp.issue}</p>
                  <p className="text-[11px] text-emerald-400">💡 <strong>Action:</strong> {comp.fix}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Mathematical Guarantee: Sum of component maxima = 100 · Sum of component points = {score}</span>
              <button
                onClick={() => setIsComponentModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History & Reversible Revisions Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14273A] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsVersionModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/50 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <History className="w-5 h-5 text-[#FF7582]" />
              <span>Resume Version History & Reversible Snapshots</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              All profile edits are recorded as independent snapshots. You can inspect changes and restore any previous version at any time.
            </p>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {versions.map((ver, idx) => (
                <div key={ver.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ver.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                        {idx === 0 ? 'Original Baseline' : `Revision #${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Target: {ver.role} · Score: <strong className="text-[#FF7582] font-mono">{ver.score}/100</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      restoreVersion(ver.id);
                      setIsVersionModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 text-[#FF7582]" />
                    <span>Restore</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
