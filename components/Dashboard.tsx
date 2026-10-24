import React, { useState } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem } from '@/types';
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
  X,
  PhoneCall,
  Calendar,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';

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

  // 8 Architecture Pillars mapping
  const tabs = [
    { id: 'recruiter-sim', label: '1. Recruiter View (6s)', icon: <Eye className="w-4 h-4" />, badge: 'Signature' },
    { id: 'keywords', label: '2. Search Optimizer', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'rewriter', label: '3. Profile Rewriter', icon: <FileEdit className="w-4 h-4" />, badge: 'No AI' },
    { id: 'headlines', label: '4. Headline Fixer', icon: <Type className="w-4 h-4" /> },
    { id: 'job-fit', label: '5. Job Fit Analyzer', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'rejection', label: '6. Rejection Predictor', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'benchmarks', label: '7. Comparison Engine', icon: <Users className="w-4 h-4" /> },
    { id: 'action-plan', label: '8. Application Strategy', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress History', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'export', label: 'Export & Copy', icon: <Download className="w-4 h-4" /> }
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

  // Potential calls projection: 5 calls/mo -> 20 calls/mo
  const baselineCalls = Math.max(1, Math.round(score * 0.08));
  const potentialScore = Math.min(95, score + 42);
  const potentialCalls = Math.min(25, Math.max(8, Math.round(potentialScore * 0.22)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 8. DASHBOARD TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Visibility Score & Gauge */}
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full border-4 border-[#234566] border-t-[#FF7582] border-r-[#C56C86] flex flex-col items-center justify-center bg-[#0F2233] flex-shrink-0">
            <span className={`text-xl font-black ${score >= 71 ? 'text-emerald-400' : score >= 41 ? 'text-amber-400' : 'text-[#FF7582]'}`}>
              {score}
            </span>
            <span className="text-[8px] uppercase text-slate-400 font-bold">/100</span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Visibility</div>
            <div className="text-base font-extrabold text-white mt-0.5">{scoreReport.verdict} Search Rank</div>
            <div className="text-[10px] text-slate-400">Expected Jump: <span className="text-[#FF7582] font-bold">{score} → {potentialScore} pts</span></div>
          </div>
        </div>

        {/* Card 2: Potential Recruiter Calls */}
        <div className="bg-gradient-to-r from-[#18314A] to-[#13273A] rounded-2xl border border-[#FF7582]/30 p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF7582]/20 border border-[#FF7582]/40 flex items-center justify-center text-[#FF7582] flex-shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF7582]">Recruiter Inbounds</div>
            <div className="text-base font-black text-white mt-0.5">
              {baselineCalls} calls <span className="text-slate-400 text-xs">→</span> <span className="text-emerald-400">{potentialCalls} calls / mo</span>
            </div>
            <div className="text-[10px] text-slate-300">Based on 6-second scan optimization</div>
          </div>
        </div>

        {/* Card 3: Applied vs Rejected Ratio */}
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0">
            <PieIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">Application Ratio</div>
            <div className="text-base font-black text-white mt-0.5">
              {score >= 70 ? '1 in 3 Screened' : '1 in 40 Screened'}
            </div>
            <div className="text-[10px] text-slate-400">{score >= 70 ? 'High response rate' : '97.5% blind drop-off risk'}</div>
          </div>
        </div>

        {/* Card 4: Improvement Timeline */}
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Target Timeline</div>
            <div className="text-base font-black text-white mt-0.5">Ready in 2 Weeks</div>
            <div className="text-[10px] text-slate-400">7-Day prioritized action sprint</div>
          </div>
        </div>
      </div>

      {/* Primary Banner: Candidate Context & Top 3 Fixes */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Candidate Profile Info: 4 Cols */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#234566] pb-6 lg:pb-0 lg:pr-6 space-y-3">
            <div className="flex items-center justify-between">
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
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#FF7582]" />
                <span>10 Scoring Rules</span>
              </button>
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">
                {profile.name}
              </h2>
              <p className="text-xs text-[#FF7582] font-semibold mt-0.5">
                {profile.headline}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {profile.targetRole} · {profile.experienceBand} yrs exp · {profile.location}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenShareCard}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Get Recruiter Score Card</span>
              </button>
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0F2233] border border-[#234566] text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>No External APIs</span>
              </div>
            </div>
          </div>

          {/* Top 3 Prioritized Fixes: 8 Cols */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Top 3 Highest-ROI Fixes (Points Yield × Ease)
              </span>
              <span className="text-[11px] text-[#FF7582] font-semibold">Immediate Impact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {scoreReport.topFixes.map((fix, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(fix.actionTab)}
                  className="p-3.5 rounded-xl bg-[#0F2233] border border-[#234566] hover:border-[#FF7582]/60 transition-all cursor-pointer group flex flex-col justify-between"
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
                  <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-[#FF7582] pt-1">
                    <span>Resolve Now</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar (8 Pillars) */}
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
              Deterministic, explainable breakdown of how your {score}/100 score is computed. No external APIs or black boxes.
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
