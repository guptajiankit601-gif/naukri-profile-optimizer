import React, { useState } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem } from '../types';
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
import confetti from 'canvas-confetti';
import { 
  Eye, 
  Sparkles, 
  FileEdit, 
  Type, 
  Crosshair, 
  AlertOctagon, 
  Users, 
  TrendingUp, 
  CheckSquare, 
  Download, 
  ChevronRight, 
  Award,
  HelpCircle,
  X
} from 'lucide-react';

interface DashboardProps {
  profile: ParsedProfile;
  scoreReport: ScoreReport;
  scoreHistory: ScoreHistoryPoint[];
  actionPlan: ActionPlanItem[];
  onUpdateProfile: (updatedProfile: ParsedProfile, changeReason?: string) => void;
  onOpenShareCard: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  scoreReport,
  scoreHistory,
  actionPlan,
  onUpdateProfile,
  onOpenShareCard
}) => {
  const [activeTab, setActiveTab] = useState<string>('recruiter-sim');
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);

  const tabs = [
    { id: 'recruiter-sim', label: '6s Recruiter View', icon: <Eye className="w-4 h-4" />, badge: 'Signature' },
    { id: 'keywords', label: 'Keyword Gap Checker', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'rewriter', label: 'Smart Bullet Rewriter', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'headlines', label: 'Headline Fixer', icon: <Type className="w-4 h-4" /> },
    { id: 'job-fit', label: 'Job Fit & Apply List', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'rejection', label: 'Rejection Predictor', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'benchmarks', label: 'Peer Benchmark', icon: <Users className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress Tracker', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'action-plan', label: '7-Day Action Plan', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'export', label: 'Export & Copy Blocks', icon: <Download className="w-4 h-4" /> }
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Score Gauge, Component Summary & Top 3 Fixes */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Score Gauge: 4 Cols */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-[#234566] pb-6 lg:pb-0 lg:pr-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#234566] border-t-[#FF7582] border-r-[#C56C86] flex flex-col items-center justify-center bg-[#0F2233] shadow-inner flex-shrink-0">
              <span className={`text-3xl sm:text-4xl font-black ${
                score >= 71 ? 'text-emerald-400' : score >= 41 ? 'text-amber-400' : 'text-[#FF7582]'
              }`}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Out of 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  scoreReport.verdict === 'Strong'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : scoreReport.verdict === 'Okay'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {scoreReport.verdict} Visibility
                </span>
                <button
                  onClick={() => setIsComponentModalOpen(true)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="View 10 Scoring Components"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                {profile.name}
              </h2>
              <p className="text-xs text-slate-400 leading-tight">
                {profile.targetRole} · {profile.experienceBand} yrs
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={onOpenShareCard}
                  className="px-3 py-1 rounded-lg bg-[#FF7582] hover:bg-[#ff5c6d] text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Get Score Card</span>
                </button>
                <button
                  onClick={() => setIsComponentModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  10 Factors
                </button>
              </div>
            </div>
          </div>

          {/* Top 3 Prioritized Fixes: 8 Cols */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Top 3 Highest-ROI Actions (Points Yield × Ease)
              </span>
              <span className="text-[11px] text-[#FF7582] font-semibold">Immediate Impact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {scoreReport.topFixes.map((fix, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(fix.actionTab)}
                  className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] hover:border-[#FF7582]/60 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-extrabold mb-1">
                      <span className="text-slate-400">Fix #{idx + 1}</span>
                      <span className="text-emerald-400">+{fix.points} pts</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                      {fix.title}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#FF7582] pt-1">
                    <span>Resolve Now</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar (Fully Responsive) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#234566]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 shadow-lg shadow-[#FF7582]/20'
                  : 'bg-[#13273A] text-slate-400 hover:text-white hover:bg-[#18314A] border border-[#234566]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${isActive ? 'bg-slate-900 text-white' : 'bg-[#FF7582]/20 text-[#FF7582]'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
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

        {activeTab === 'progress' && (
          <ProgressTrackerView
            scoreHistory={scoreHistory}
            currentScore={score}
          />
        )}

        {activeTab === 'action-plan' && (
          <ActionPlanView
            initialPlan={actionPlan}
            scoreReport={scoreReport}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'export' && (
          <ExportView profile={profile} />
        )}
      </div>

      {/* 10 Component Scoring Breakdown Modal (F2) */}
      {isComponentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#13273A] border border-[#234566] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsComponentModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#0F2233] hover:bg-[#18314A] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7582]" />
              <span>10-Component Weighted Recruiter Scoring Formula</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Deterministic, explainable breakdown of how your {score}/100 score is computed. No black box.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {scoreReport.components.map((comp) => (
                <div key={comp.name} className="p-4 rounded-xl bg-[#0F2233] border border-[#234566] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{comp.name}</span>
                    <span className="text-xs font-extrabold text-[#FF7582]">
                      {comp.score} / {comp.max} pts
                    </span>
                  </div>
                  <div className="w-full bg-[#18314A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FF7582] to-[#C56C86] h-full rounded-full"
                      style={{ width: `${(comp.score / comp.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{comp.issue}</p>
                  <p className="text-[11px] text-emerald-400">💡 <strong>Fix:</strong> {comp.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
