'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { matchJobDescription } from '@/services/jd-matcher';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Zap, 
  RotateCcw, 
  History, 
  MapPin, 
  ArrowRight,
  Eye,
  ShieldAlert,
  FileEdit,
  Type,
  Crosshair,
  CheckSquare,
  Download,
  UploadCloud,
  ArrowUpRight,
  Lightbulb,
  ClipboardCheck
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const {
    profile,
    scoreReport,
    versions,
    scoreDelta,
    canUndo,
    undoLastEdit,
    restoreVersion,
    resetAnalysis
  } = useReport();

  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Job Match calculation only when targetJobDescription is provided
  const jobMatchResult = useMemo(() => {
    if (!profile || !profile.targetJobDescription || profile.targetJobDescription.trim().length < 30) {
      return null;
    }
    return matchJobDescription(profile, profile.targetJobDescription, 'Target Company', profile.targetRole);
  }, [profile]);

  // Map action tab to dedicated route with targeted parameters
  const getRouteForFix = (actionTab: string, fixTitle?: string, fixDescription?: string) => {
    const text = `${fixTitle || ''} ${fixDescription || ''}`.toLowerCase();
    switch (actionTab) {
      case 'headlines':
        if (text.includes('summary') || text.includes('about')) {
          return '/headline-fixer?section=summary';
        }
        return '/headline-fixer?section=headline';
      case 'keywords':
        return '/keyword-analysis?group=missing';
      case 'rewriter':
        if (text.includes('metric') || text.includes('number') || text.includes('quantif')) {
          return '/bullet-rewriter?target=metrics';
        }
        return '/bullet-rewriter?target=passive';
      case 'job-fit':
        return '/job-fit';
      case 'benchmarks':
        return '/benchmarks';
      case 'action-plan':
        return '/action-plan';
      case 'export':
        return '/resume-export';
      default:
        return '/dashboard';
    }
  };

  // Derive Smart Next Step dynamically from actual report/component evaluation
  const smartRecommendation = useMemo(() => {
    if (!profile || !scoreReport) return null;

    // Find the component with lowest completion percentage
    const sortedComps = [...scoreReport.components]
      .filter(c => c.max > 0)
      .sort((a, b) => (a.score / a.max) - (b.score / b.max));

    const weakest = sortedComps[0];
    const topFix = scoreReport.topFixes[0];

    if (!weakest && !topFix) {
      return {
        title: 'Review Recruiter 6-Second Scan',
        whyItMatters: 'Validate how hiring managers perceive your resume in standard initial screening passes.',
        evidence: `Your profile has a solid baseline score of ${scoreReport.overallScore}/100.`,
        actionLabel: 'Open Recruiter View',
        href: '/recruiter-view',
        headroomPoints: 5,
        secondaryFixes: scoreReport.topFixes.slice(1, 3)
      };
    }

    if (weakest.name.toLowerCase().includes('headline')) {
      return {
        title: 'Refactor Headline with Role & Core Stack',
        whyItMatters: 'Recruiters scan headlines first on job portals. A targeted headline clarifies your core competency and improves initial keyword search discovery.',
        evidence: profile.headline 
          ? `Current headline: "${profile.headline}" lacks specific secondary keywords.`
          : 'No dedicated professional headline detected in your resume header.',
        actionLabel: 'Optimize Headline in Fixer',
        href: '/headline-fixer?section=headline',
        headroomPoints: weakest.max - weakest.score,
        secondaryFixes: scoreReport.topFixes.slice(1, 3)
      };
    }

    if (weakest.name.toLowerCase().includes('achievement') || weakest.name.toLowerCase().includes('experience')) {
      const sampleBullet = profile.experiences[0]?.bullets[0];
      return {
        title: 'Add Measurable Business Outcomes to Experience Bullets',
        whyItMatters: 'Passive duty bullets are often dismissed during human recruiter screening. Quantified achievements prove commercial impact.',
        evidence: sampleBullet 
          ? `Current bullet: "${sampleBullet.slice(0, 75)}..." lacks measurable numbers or outcomes.`
          : 'Multiple bullets describe passive tasks rather than measurable results.',
        actionLabel: 'Rewrite Bullets with Safe Polish',
        href: '/bullet-rewriter?target=passive',
        headroomPoints: weakest.max - weakest.score,
        secondaryFixes: scoreReport.topFixes.slice(1, 3)
      };
    }

    if (weakest.name.toLowerCase().includes('skill') || weakest.name.toLowerCase().includes('keyword')) {
      return {
        title: `Bridge Critical Keyword Gaps for ${profile.targetRole}`,
        whyItMatters: 'Applicant tracking systems rank resumes by keyword density and technical alignment before humans see them.',
        evidence: `${profile.skills.length} skills found, but high-demand keywords for ${profile.targetRole} are missing.`,
        actionLabel: 'View Keyword Gap Analysis',
        href: '/keyword-analysis?group=missing',
        headroomPoints: weakest.max - weakest.score,
        secondaryFixes: scoreReport.topFixes.slice(1, 3)
      };
    }

    if (weakest.name.toLowerCase().includes('summary')) {
      return {
        title: 'Structure Professional Summary with Value Proposition',
        whyItMatters: 'A 3-line summary immediately communicates your domain expertise and years of experience.',
        evidence: profile.summary 
          ? 'Current summary is unstructured or lacks explicit target role alignment.'
          : 'No executive summary detected in resume header.',
        actionLabel: 'Generate Summary Formulas',
        href: '/headline-fixer?section=summary',
        headroomPoints: weakest.max - weakest.score,
        secondaryFixes: scoreReport.topFixes.slice(1, 3)
      };
    }

    // Default to topFix
    return {
      title: topFix.title,
      whyItMatters: 'This fix addresses your largest scoring deficit and provides the highest point return.',
      evidence: topFix.description || `Component headroom: +${topFix.points} pts available.`,
      actionLabel: `Fix Now in ${topFix.actionTab}`,
      href: getRouteForFix(topFix.actionTab, topFix.title, topFix.description),
      headroomPoints: topFix.points,
      secondaryFixes: scoreReport.topFixes.slice(1, 3)
    };
  }, [profile, scoreReport]);

  if (!profile || !scoreReport) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const score = scoreReport.overallScore;
  const totalHeadroom = scoreReport.headroomTotal ?? (100 - score);
  const topYield = scoreReport.topFixes.reduce((sum, f) => sum + f.points, 0);

  const toolCards = [
    {
      href: '/audit',
      title: 'Complete Profile Audit',
      description: 'One unified report showing completeness, bullets, keywords, online profile, and job fit.',
      icon: ClipboardCheck,
      badge: 'Unified Report',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60'
    },
    {
      href: '/screening-audit',
      title: 'Resume Score Audit',
      description: '10-criteria deterministic scoring breakdown, risk audit, and formatting checks.',
      icon: ShieldAlert,
      badge: 'Score Audit',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60'
    },
    {
      href: '/recruiter-view',
      title: 'Recruiter View (6s)',
      description: 'Human recruiter triage simulation across 4 standard hiring contexts.',
      icon: Eye,
      badge: 'Readability',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60'
    },
    {
      href: '/keyword-analysis',
      title: 'Keywords & Skills Gap',
      description: 'Matched keywords, high-priority missing skills, and distractor noise.',
      icon: Sparkles,
      badge: `${profile.skills.length} Skills`,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60'
    },
    {
      href: '/job-fit',
      title: 'Job Match Analysis',
      description: 'Audit matched vs missing requirements against any target job description.',
      icon: Crosshair,
      badge: 'Target Match',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/60'
    },
    {
      href: '/bullet-rewriter',
      title: 'Bullet Rewriter',
      description: 'Safe, Metric-ready, and Impact-driven rewrites with exact before/after diff.',
      icon: FileEdit,
      badge: 'Fact Preserving',
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/60'
    },
    {
      href: '/headline-fixer',
      title: 'Headline & Summary',
      description: 'Optimized formulas with exact character counts for ATS, Naukri, and LinkedIn.',
      icon: Type,
      badge: 'Search CTR',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/60'
    },
    {
      href: '/action-plan',
      title: 'Priority Action Plan',
      description: 'Step-by-step roadmap ordered by highest potential score gain.',
      icon: CheckSquare,
      badge: 'Actionable',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      href: '/history',
      title: 'Version History',
      description: 'Saved revision snapshots, score delta tracking, and reversible edits.',
      icon: History,
      badge: `${versions.length} Snapshots`,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800'
    },
    {
      href: '/resume-export',
      title: 'Export Clean ATS Resume',
      description: 'Clean single-column ATS resume preview and copy-paste blocks.',
      icon: Download,
      badge: 'Ready to Apply',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    }
  ];

  return (
    <div className="w-full space-y-6">
      <DemoProfileBanner />

      {/* 1. TOP OVERVIEW SUMMARY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Ring Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resume Quality Score
            </span>
            <button
              onClick={() => setIsComponentModalOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>10 Criteria (100 Pts)</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ScoreRing score={score} size={88} strokeWidth={8} />
            <div className="space-y-1 min-w-0">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                scoreReport.verdict === 'Strong'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : scoreReport.verdict === 'Okay'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}>
                {scoreReport.verdict} Readiness
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Deterministic Evaluation
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Potential score gain: <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">+{totalHeadroom} pts</strong>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Evaluation Model:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {scoreReport.isFresher ? (
                <span className="text-emerald-700 dark:text-emerald-400">Fresher Model (Projects Reweighted)</span>
              ) : (
                <span>Standard 10-Criteria Model</span>
              )}
            </span>
          </div>
        </div>

        {/* Candidate Target Overview */}
        <div className="lg:col-span-4 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Candidate Profile
            </span>
            <div className="flex items-center gap-1.5">
              {scoreDelta !== 0 && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-mono ${
                  scoreDelta > 0 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts vs start
                </span>
              )}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                {profile.experienceBand}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                {profile.name}
              </h2>
              {canUndo && (
                <button
                  onClick={undoLastEdit}
                  title="Undo last accepted edit"
                  className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
            </div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 leading-snug line-clamp-1">
              {profile.headline}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>{profile.targetCities.slice(0, 2).join(', ') || profile.location}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{profile.skills.length} skills listed</span>
              {profile.expectedSalaryLakhs && (
                <>
                  <span>•</span>
                  <span className="text-slate-600 dark:text-slate-300">₹{profile.expectedSalaryLakhs} LPA</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>New Audit</span>
              </Link>
              {versions.length > 0 && (
                <button
                  onClick={() => setIsVersionModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Snapshots ({versions.length})</span>
                </button>
              )}
            </div>
            <button
              onClick={resetAnalysis}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Reset Session
            </button>
          </div>
        </div>

        {/* Card 3: Job Match Score (If JD provided) OR Highest-Yield Improvements */}
        {jobMatchResult ? (
          <div className="lg:col-span-4 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Target Job Match Score
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold font-mono">
                {jobMatchResult.matchScore}% Match
              </span>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Assessed against your provided job description for <strong className="text-slate-900 dark:text-slate-100">{profile.targetRole}</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Matched Skills</div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5 font-mono">{jobMatchResult.matchedSkills.length} Verified</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Missing Keywords</div>
                  <div className="text-amber-700 dark:text-amber-400 font-bold mt-0.5 font-mono">{jobMatchResult.missingMustHaves.length} Gaps</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Role Alignment</span>
              <Link
                href="/job-fit"
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Match Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-4 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Highest-Yield Improvements
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold font-mono">
                +{topYield} pts yield
              </span>
            </div>

            <div className="space-y-2">
              {scoreReport.topFixes.slice(0, 3).map((fix, idx) => (
                <Link
                  key={idx}
                  href={getRouteForFix(fix.actionTab, fix.title, fix.description)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">
                      {fix.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {fix.description || 'Estimated score gain for this improvement'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      +{fix.points}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-2 text-right">
              <Link
                href="/action-plan"
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Action Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Complete Profile Audit Quick Jump Banner */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Complete Profile Audit Available
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                1 Unified Report
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review all findings across completeness, content quality, keywords, online profile, and job fit without opening multiple pages.
            </p>
          </div>
        </div>

        <Link
          href="/audit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Open Complete Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. PROMINENT SMART NEXT STEP RECOMMENDATION CARD (Priority 5) */}
      {smartRecommendation && (
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-[#132238] dark:via-[#142236] dark:to-[#101b2b] rounded-2xl border border-blue-200/80 dark:border-blue-900/50 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Recommended Next Step
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold font-mono">
                    +{smartRecommendation.headroomPoints} Pts Potential Gain
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {smartRecommendation.title}
                </h3>
              </div>
            </div>

            <Link
              href={smartRecommendation.href}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              <span>{smartRecommendation.actionLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Why it matters
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {smartRecommendation.whyItMatters}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resume Evidence
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {smartRecommendation.evidence}
              </p>
            </div>
          </div>

          {/* At most 2 secondary suggestions */}
          {smartRecommendation.secondaryFixes.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Or consider next:</span>
              {smartRecommendation.secondaryFixes.map((f, i) => (
                <Link
                  key={i}
                  href={getRouteForFix(f.actionTab)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>{f.title}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+{f.points}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. JOB MATCH VS RESUME QUALITY SEPARATION */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Target Job Match vs Resume Quality</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">· Independent Assessment Layers</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resume Quality ({score}/100) measures universal clarity and keyword coverage. Job Match tests alignment with a specific job description.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/job-fit"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Run Job Match</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>
      </div>

      {/* 4. DEDICATED TOOL LAUNCHPAD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Dedicated Career Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each module opens as its own dedicated page with full feature controls:
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {toolCards.length} Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white dark:bg-[#142236] hover:bg-slate-50/70 dark:hover:bg-[#18283f] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 p-4 shadow-xs transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${tool.bg} border border-slate-200/60 dark:border-slate-700`}>
                        <Icon className={`w-4 h-4 ${tool.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. RECENT ACTIVITY & SNAPSHOT TIMELINE (When Edits Exist) */}
      {versions.length > 0 && (
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Report Versions ({versions.length} Snapshots)
              </span>
            </div>
            <Link
              href="/history"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Open History Page →
            </Link>
          </div>

          <div className="space-y-2">
            {versions.slice(-3).reverse().map((ver) => (
              <div
                key={ver.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{ver.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{ver.changeReason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    Score: {ver.score}/100
                  </span>
                  <button
                    onClick={() => restoreVersion(ver.id)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold cursor-pointer shadow-xs"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10 Component Scoring Breakdown Modal */}
      {isComponentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-xl relative my-8">
            <button
              onClick={() => setIsComponentModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>10-Component Scoring Formula (Total: 100 Pts)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Deterministic, explainable evaluation of how your {score}/100 score is computed across all 10 criteria.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {scoreReport.components.map((comp) => (
                <div key={comp.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{comp.name}</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {comp.score} / {comp.max} pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                      style={{ width: `${comp.max > 0 ? (comp.score / comp.max) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{comp.issue}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">💡 <strong>Action:</strong> {comp.fix}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Mathematical Guarantee: Sum of component maxima = 100 · Sum of points = {score}</span>
              <button
                onClick={() => setIsComponentModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8">
            <button
              onClick={() => setIsVersionModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Resume Version History</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All profile edits are recorded as independent snapshots. You can restore any previous version at any time.
            </p>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {versions.map((ver, idx) => (
                <div key={ver.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{ver.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {idx === 0 ? 'Original Baseline' : `Revision #${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Target: {ver.role} · Score: <strong className="text-blue-600 dark:text-blue-400 font-mono">{ver.score}/100</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      restoreVersion(ver.id);
                      setIsVersionModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>Restore</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
