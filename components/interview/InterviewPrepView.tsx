'use client';

import React, { useState, useEffect } from 'react';
import { ParsedProfile } from '@/types';
import { 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Award,
  Check,
  Copy
} from 'lucide-react';

interface InterviewQuestion {
  id: string;
  category: 'Technical Architecture' | 'Project Execution' | 'Behavioral & Leadership';
  question: string;
  contextReason: string;
  sampleFramework: string;
}

interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface InterviewPrepViewProps {
  profile: ParsedProfile;
}

const STORAGE_KEY = 'roleready:interview_star_notes';

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({ profile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [starNotes, setStarNotes] = useState<Record<string, StarAnswer>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStarNotes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const primarySkills = profile.skills.slice(0, 3).join(', ') || 'Core Technologies';
  const topExp = profile.experiences[0];
  const topCompany = topExp?.company || 'Enterprise Services';

  // Questions grounded strictly in candidate's parsed skills & projects
  const questions: InterviewQuestion[] = [
    {
      id: 'q-tech-1',
      category: 'Technical Architecture',
      question: `How have you designed and maintained high-throughput services using ${profile.skills[0] || 'your core language'} in production?`,
      contextReason: `Directly assesses primary technical proficiency (${profile.skills[0] || 'Core Stack'}) highlighted in your resume skills section.`,
      sampleFramework: 'Explain service decomposition, concurrency handling, caching strategy, and database index tuning.'
    },
    {
      id: 'q-tech-2',
      category: 'Technical Architecture',
      question: `Describe your approach to error handling, resilience, and API versioning across ${profile.skills.slice(0, 2).join(' and ') || 'backend APIs'}.`,
      contextReason: `Recruiters look for architectural maturity and fault tolerance in ${profile.experienceBand} roles.`,
      sampleFramework: 'Walk through circuit breakers, retry policies, idempotent consumers, and backward-compatible schema changes.'
    },
    {
      id: 'q-proj-1',
      category: 'Project Execution',
      question: `Walk me through a challenging technical problem you solved at ${topCompany}. What trade-offs did you evaluate?`,
      contextReason: `Derived from your primary work experience at ${topCompany}.`,
      sampleFramework: 'Frame the technical bottleneck, 2 architectural alternatives evaluated, the final decision, and measurable outcome.'
    },
    {
      id: 'q-proj-2',
      category: 'Project Execution',
      question: `When building or modernizing ${profile.skills[1] || 'core services'}, how did you balance rapid delivery with code maintainability?`,
      contextReason: `Tests engineering trade-off discipline without claiming fabricated metrics.`,
      sampleFramework: 'Highlight automated unit/integration tests, clean modular interfaces, and CI/CD validation steps.'
    },
    {
      id: 'q-behav-1',
      category: 'Behavioral & Leadership',
      question: 'Tell me about a time you had a technical disagreement with a peer or stakeholder. How did you arrive at consensus?',
      contextReason: 'Standard behavioral indicator for team alignment and pragmatic technical debate.',
      sampleFramework: 'Use the STAR format: Explain the divergent perspectives, data-driven benchmarking used to resolve it, and the collaborative outcome.'
    },
    {
      id: 'q-behav-2',
      category: 'Behavioral & Leadership',
      question: 'Describe an instance where a production deployment did not go as planned. How did you triage and communicate the incident?',
      contextReason: 'Assesses production responsibility, root-cause blameless post-mortem analysis, and remediation.',
      sampleFramework: 'Detail immediate mitigation (rollback/flag), cross-team communication, and post-incident prevention actions.'
    }
  ];

  const handleUpdateStarField = (qId: string, field: keyof StarAnswer, value: string) => {
    setStarNotes((prev) => {
      const current = prev[qId] || { situation: '', task: '', action: '', result: '' };
      const updated = {
        ...prev,
        [qId]: { ...current, [field]: value }
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSaveNotes = (qId: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(starNotes));
      showToast('STAR answer notes saved to browser session!');
    } catch {
      // ignore
    }
  };

  const filteredQuestions = activeCategory === 'all'
    ? questions
    : questions.filter(q => q.category === activeCategory);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17324D] text-[#FF7582] border border-[#FF7582]/40 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Evidence-Based Interview Prep</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Interview Preparation Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Role-specific technical and behavioral questions generated directly from your verified resume skills ({primarySkills}) and company background.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shrink-0 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Structured STAR Methodology</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-3 pb-2 text-xs font-semibold overflow-x-auto">
        {['all', 'Technical Architecture', 'Project Execution', 'Behavioral & Leadership'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer capitalize whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Questions (6)' : cat}
          </button>
        ))}
      </div>

      {/* Questions Accordion */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQId === q.id || (expandedQId === null && idx === 0);
          const currentStar = starNotes[q.id] || { situation: '', task: '', action: '', result: '' };
          const hasNotes = Boolean(currentStar.situation || currentStar.action || currentStar.result);

          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              {/* Question Header Bar */}
              <div
                onClick={() => setExpandedQId(isExpanded ? '' : q.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {q.category}
                    </span>
                    {hasNotes && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Notes Saved</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>
                  <p className="text-xs text-slate-600">
                    <strong>Why Recruiters Ask:</strong> {q.contextReason}
                  </p>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Collapsible STAR Planning Workspace */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/60 space-y-4 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Recommended Response Framework:</span> {q.sampleFramework}
                    </div>
                  </div>

                  {/* 4 STAR Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Situation */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">S</span>
                        <span>Situation (Context & Setting)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentStar.situation}
                        onChange={(e) => handleUpdateStarField(q.id, 'situation', e.target.value)}
                        placeholder="Where and when did this occur? What was the business or architectural context at the time?"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    {/* Task */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] font-bold">T</span>
                        <span>Task (Objective & Technical Challenge)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentStar.task}
                        onChange={(e) => handleUpdateStarField(q.id, 'task', e.target.value)}
                        placeholder="What specific problem needed solving? What constraints or latency targets were you facing?"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    {/* Action */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">A</span>
                        <span>Action (Engineering Steps & Decisions)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentStar.action}
                        onChange={(e) => handleUpdateStarField(q.id, 'action', e.target.value)}
                        placeholder="What exact technical tools and architecture did you implement? How did you test and validate?"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    {/* Result */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">R</span>
                        <span>Result (Verified Outcomes & Learnings)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentStar.result}
                        onChange={(e) => handleUpdateStarField(q.id, 'result', e.target.value)}
                        placeholder="What was the concrete impact? How did system reliability, deployment velocity, or team productivity benefit?"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Save Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(q.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save STAR Answer Notes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
