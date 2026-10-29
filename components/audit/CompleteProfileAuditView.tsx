'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ParsedProfile, ScoreReport } from '@/types';
import { AuditFinding, AuditCategory, AuditStatus, AuditPriority } from '@/types/audit';
import { generateCompleteProfileAudit } from '@/lib/audit/generate-audit';
import { 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  ArrowUpRight, 
  Filter, 
  Search, 
  ShieldCheck, 
  FileText, 
  Crosshair, 
  Layers, 
  Check, 
  X, 
  FileEdit, 
  Type, 
  Plus, 
  UploadCloud,
  Briefcase,
  Lightbulb,
  Info
} from 'lucide-react';

interface CompleteProfileAuditViewProps {
  profile: ParsedProfile;
  scoreReport: ScoreReport;
  onUpdateProfile: (updated: ParsedProfile, changeReason?: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const CompleteProfileAuditView: React.FC<CompleteProfileAuditViewProps> = ({
  profile,
  scoreReport,
  onUpdateProfile,
  onNavigateToTab
}) => {
  const router = useRouter();
  const [resolvedFindingIds, setResolvedFindingIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<AuditStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<AuditPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    completeness: true,
    content_quality: true,
    skills_keywords: true,
    professional_profile: true,
    job_alignment: true,
    readability: false
  });
  const [expandedHowAssessed, setExpandedHowAssessed] = useState<Record<string, boolean>>({});

  // Modals for adding Profile Text or Job Description on the fly
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [tempJd, setTempJd] = useState(profile.targetJobDescription || '');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempProfileText, setTempProfileText] = useState(profile.professionalProfile?.rawText || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate unified audit
  const auditReport = useMemo(() => {
    return generateCompleteProfileAudit(profile, scoreReport, resolvedFindingIds);
  }, [profile, scoreReport, resolvedFindingIds]);

  const toggleSection = (cat: string) => {
    setExpandedSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleHowAssessed = (id: string) => {
    setExpandedHowAssessed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleResolve = (id: string) => {
    setResolvedFindingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Marked finding as open');
      } else {
        next.add(id);
        showToast('Marked finding as resolved');
      }
      return next;
    });
  };

  const handleSaveJd = () => {
    onUpdateProfile({
      ...profile,
      targetJobDescription: tempJd
    }, 'Added Target Job Description for Alignment');
    setIsJdModalOpen(false);
    showToast('Updated target job description and recalculated match alignment!');
  };

  const handleSaveProfileText = () => {
    onUpdateProfile({
      ...profile,
      professionalProfile: {
        rawText: tempProfileText,
        updatedAt: Date.now()
      }
    }, 'Added Professional Profile Text');
    setIsProfileModalOpen(false);
    showToast('Saved online profile text for unified review!');
  };

  // Filtered findings
  const filteredFindings = useMemo(() => {
    return auditReport.findings.filter(f => {
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || f.status === selectedStatus;
      const matchPriority = selectedPriority === 'all' || f.priority === selectedPriority;
      const matchQuery = !searchQuery.trim() || 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.whatWeFound.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.evidence.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchPriority && matchQuery;
    });
  }, [auditReport.findings, selectedCategory, selectedStatus, selectedPriority, searchQuery]);

  // Categories definition
  const categories: { id: AuditCategory; title: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'completeness',
      title: 'Resume Completeness',
      icon: <ClipboardCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      description: 'Contact header, headline, education, project proof-of-work, and career history.'
    },
    {
      id: 'content_quality',
      title: 'Content Quality & Bullets',
      icon: <FileEdit className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      description: 'Active verbs, measurable scale, deliverables, and clarity in experience points.'
    },
    {
      id: 'skills_keywords',
      title: 'Skills & Keywords',
      icon: <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      description: 'Must-have core technologies, complementary frameworks, and clutter pruning.'
    },
    {
      id: 'professional_profile',
      title: 'Professional Online Profile',
      icon: <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      description: 'Naukri and LinkedIn search headline, summary, and skills clustering.'
    },
    {
      id: 'job_alignment',
      title: 'Target Job Alignment',
      icon: <Crosshair className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
      description: 'Direct requirements match against opening-specific job descriptions.'
    },
    {
      id: 'readability',
      title: 'Readability & Extraction',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      description: 'Automated parser confidence, linear formatting, and ATS layout hygiene.'
    }
  ];

  // Highest priority finding
  const highestPriorityFinding = useMemo(() => {
    return auditReport.findings.find(f => f.priority === 'high' && f.status !== 'resolved') || auditReport.findings[0];
  }, [auditReport.findings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Executive Overview Banner */}
      <div className="bg-white dark:bg-[#142236] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-[11px] font-semibold mb-2">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Unified Audit Report</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Complete Profile Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              See everything that needs attention in your resume and professional profile, with clear explanations and practical ways to improve it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!auditReport.hasJobDescription && (
              <button
                onClick={() => setIsJdModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>+ Add Target Job Description</span>
              </button>
            )}
            {!auditReport.hasProfessionalProfile && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>+ Supply Online Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Summary Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Resume Quality Score */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Resume Quality Score
            </span>
            <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
              {auditReport.overallScore}/100
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              10-Factor Evaluation
            </span>
          </div>

          {/* Job Match Score */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Target Job Match
            </span>
            {auditReport.jobMatchScore !== null ? (
              <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                {auditReport.jobMatchScore}%
              </div>
            ) : (
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 pt-1">
                No JD Added
              </div>
            )}
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {auditReport.jobMatchScore !== null ? 'JD Alignment' : 'General Role Mode'}
            </span>
          </div>

          {/* Needs Attention Count */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Needs Attention
            </span>
            <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {auditReport.summary.needsAttention + auditReport.summary.notFound}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              High Priority Findings
            </span>
          </div>

          {/* Verified & Resolved Count */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Verified & Resolved
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {auditReport.summary.verified}
              </span>
              <span className="text-xs font-semibold text-slate-500">verified</span>
              {auditReport.summary.resolved > 0 && (
                <>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                    +{auditReport.summary.resolved}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">resolved</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {auditReport.summary.verified + auditReport.summary.resolved} of {auditReport.summary.total} Evaluated
            </span>
          </div>
        </div>

        {/* Plain English Summary Sentence */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {auditReport.plainEnglishSummary}
          </p>
        </div>
      </div>

      {/* 2. Prominent Recommended Next Step Card */}
      {highestPriorityFinding && (
        <div className="bg-gradient-to-r from-blue-50/90 via-white to-slate-50 dark:from-[#132238] dark:via-[#142236] dark:to-[#101b2b] rounded-2xl border border-blue-200 dark:border-blue-900/60 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Recommended Next Improvement
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {highestPriorityFinding.title}
                </h3>
              </div>
            </div>

            <Link
              href={highestPriorityFinding.actionHref}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>{highestPriorityFinding.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Why It Matters</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{highestPriorityFinding.whyItMatters}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Evidence</span>
              <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed truncate">{highestPriorityFinding.evidence}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search and Multi-Dimensional Filter Bar */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings, evidence, or recommendations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AuditStatus | 'all')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified (Evidence Found)</option>
              <option value="resolved">Resolved (Corrected)</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="not_found">Not Found in Resume</option>
              <option value="recommended">Recommended</option>
              <option value="needs_confirmation">Needs Confirmation</option>
              <option value="not_assessed">Not Assessed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as AuditPriority | 'all')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {(selectedStatus !== 'all' || selectedPriority !== 'all' || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            All Areas ({auditReport.findings.length})
          </button>
          {categories.map((c) => {
            const count = auditReport.findings.filter(f => f.category === c.id).length;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {c.icon}
                <span>{c.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Categorized Findings Sections */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const categoryFindings = filteredFindings.filter(f => f.category === cat.id);
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          if (categoryFindings.length === 0 && (searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all')) return null;

          const isExpanded = expandedSections[cat.id] ?? true;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Category Header (Click to toggle accordion) */}
              <button
                onClick={() => toggleSection(cat.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shrink-0">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{cat.title}</span>
                      <span className="text-xs font-normal text-slate-500 font-mono">
                        ({categoryFindings.length} finding{categoryFindings.length === 1 ? '' : 's'})
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Category Findings Cards */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80">
                  {categoryFindings.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 italic">
                      No matching findings in this category for current filters.
                    </div>
                  ) : (
                    categoryFindings.map((finding) => {
                      const isResolved = finding.status === 'resolved' || resolvedFindingIds.has(finding.id);

                      return (
                        <div
                          key={finding.id}
                          className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3 ${
                            isResolved
                              ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-80'
                              : finding.priority === 'high'
                              ? 'bg-white dark:bg-[#142236] border-rose-200/80 dark:border-rose-900/40 hover:border-rose-300 shadow-xs'
                              : 'bg-white dark:bg-[#142236] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 shadow-xs'
                          }`}
                        >
                          {/* Finding Title & Badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Status Badge */}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isResolved || finding.status === 'resolved'
                                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                  : finding.status === 'verified'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : finding.status === 'needs_attention'
                                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                  : finding.status === 'not_found'
                                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : finding.status === 'needs_confirmation'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : finding.status === 'recommended'
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}>
                                {isResolved 
                                  ? 'Resolved by Candidate' 
                                  : finding.status === 'verified'
                                  ? 'Verified Evidence'
                                  : finding.status === 'not_found'
                                  ? 'Not Found in Resume'
                                  : finding.status.replace('_', ' ')}
                              </span>

                              {/* Priority Pill */}
                              {!isResolved && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  finding.priority === 'high'
                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                                    : finding.priority === 'medium'
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {finding.priority.toUpperCase()} PRIORITY
                                </span>
                              )}
                            </div>

                            {/* Mark as Resolved Toggle */}
                            <button
                              onClick={() => handleToggleResolve(finding.id)}
                              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                            >
                              <Check className={`w-3.5 h-3.5 ${isResolved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                              <span>{isResolved ? 'Mark as Open' : 'Mark as Done'}</span>
                            </button>
                          </div>

                          {/* Finding Title */}
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {finding.title}
                          </h3>

                          {/* 4 Actionable Components Grid: What found | Current evidence | Why matters | Improvement */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* What we found */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                What we found:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {finding.whatWeFound}
                              </p>
                            </div>

                            {/* Current evidence */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Current evidence:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed break-words">
                                {finding.evidence}
                              </p>
                            </div>

                            {/* Why it matters */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Why it matters:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {finding.whyItMatters}
                              </p>
                            </div>

                            {/* Suggested improvement */}
                            <div className="p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                {isResolved ? 'Candidate Status:' : 'Suggested improvement:'}
                              </span>
                              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                {isResolved
                                  ? 'Marked as completed by candidate. Ensure this update is substantiated in your exported resume to satisfy recruiter screening checks.'
                                  : finding.suggestedImprovement}
                              </p>
                            </div>
                          </div>

                          {/* Action Footer & Progressive Disclosure */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div>
                              {finding.howAssessed && (
                                <button
                                  onClick={() => toggleHowAssessed(finding.id)}
                                  className="text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer font-medium"
                                >
                                  <HelpCircle className="w-3 h-3" />
                                  <span>{expandedHowAssessed[finding.id] ? 'Hide scoring details' : 'How this was assessed'}</span>
                                </button>
                              )}
                              {expandedHowAssessed[finding.id] && finding.howAssessed && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                                  💡 {finding.howAssessed}
                                </p>
                              )}
                            </div>

                            <Link
                              href={finding.actionHref}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5 self-end sm:self-auto cursor-pointer transition-colors"
                            >
                              <span>{finding.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Add/Update Target Job Description */}
      {isJdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Supply Target Job Description</span>
              </h3>
              <button onClick={() => setIsJdModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Paste the text of the job opening you are applying for. The audit will immediately extract required qualifications, missing must-haves, and calculate opening-specific fit.
            </p>
            <textarea
              rows={6}
              value={tempJd}
              onChange={(e) => setTempJd(e.target.value)}
              placeholder="Paste job description (Responsibilities, Requirements, Required Tech Stack)..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsJdModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJd}
                disabled={tempJd.trim().length < 30}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs cursor-pointer disabled:opacity-50"
              >
                Save & Recalculate Alignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add/Update Professional Online Profile Text */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Supply Online Profile Content</span>
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Paste your current Naukri or LinkedIn profile text (headline, summary, key skills, experience). The audit will review your search strings and 3-category skills clustering.
            </p>
            <textarea
              rows={6}
              value={tempProfileText}
              onChange={(e) => setTempProfileText(e.target.value)}
              placeholder="Paste online profile sections (Headline, About/Summary, Key Skills cluster)..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfileText}
                disabled={tempProfileText.trim().length < 20}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer disabled:opacity-50"
              >
                Save Profile for Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
