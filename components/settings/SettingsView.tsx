'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/context/ThemeContext';
import { useReport } from '@/lib/context/ReportContext';
import { 
  getStoredPreferences, 
  saveStoredPreferences, 
  resetStoredPreferences, 
  AnalysisPreferences 
} from '@/lib/settings/preferences';
import { AiConsentToggle } from './AiConsentToggle';
import { BRAND_CONFIG } from '@/config/brand';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Sliders, 
  ShieldCheck, 
  Database, 
  HelpCircle, 
  Download, 
  Trash2, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Keyboard,
  Info
} from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${isDestructive ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme, density, setDensity, textSize, setTextSize, reducedMotion, setReducedMotion } = useTheme();
  const { profile, versions, scoreReport, resetAnalysis } = useReport();

  const [preferences, setPreferences] = useState<AnalysisPreferences>(getStoredPreferences);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'clearResume' | 'clearHistory' | 'resetAll' | null;
  }>({ isOpen: false, type: null });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdatePreferences = (updated: Partial<AnalysisPreferences>) => {
    const saved = saveStoredPreferences(updated);
    setPreferences(saved);
    showToast('Preferences updated successfully.');
  };

  const handleExportJson = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        brand: BRAND_CONFIG.name,
        profile: profile || null,
        scoreReport: scoreReport || null,
        versions: versions || [],
        preferences
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `careerup-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Exported session data as JSON.');
    } catch {
      showToast('Failed to export JSON.');
    }
  };

  const executeClearResume = () => {
    resetAnalysis();
    setModalState({ isOpen: false, type: null });
    showToast('Active resume session cleared.');
    router.push('/');
  };

  const executeClearHistory = () => {
    try {
      sessionStorage.removeItem('npo:profile_versions');
      // If profile exists in context, reset its version list
      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem('npo:active_report_session');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.versions = [];
          sessionStorage.setItem('npo:active_report_session', JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore
    }
    setModalState({ isOpen: false, type: null });
    showToast('Version history cleared.');
  };

  const executeResetAll = () => {
    resetStoredPreferences();
    resetAnalysis();
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
                localStorage.removeItem('careerup:preferences');
        localStorage.removeItem('careerup:theme');
        localStorage.removeItem('careerup:density');
        localStorage.removeItem('careerup:text-size');
        localStorage.removeItem('careerup:reduced-motion');
        localStorage.removeItem('careerlens:preferences');
        localStorage.removeItem('careerlens:theme');
        localStorage.removeItem('careerlens:density');
        localStorage.removeItem('careerlens:text-size');
        localStorage.removeItem('careerlens:reduced-motion');
      } catch {
        // ignore
      }
    }
    setModalState({ isOpen: false, type: null });
    showToast('All local data wiped. Resetting session...');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const ROLE_OPTIONS = [
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Engineer',
    'Data Engineer',
    'DevOps / SRE',
    'Product Manager'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Configure appearance, default analysis preferences, optional AI features, and manage local data.
        </p>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <section className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Appearance & Accessibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Interface Density */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Layout Density
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  density === 'comfortable'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Comfortable</span>
              </button>

              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  density === 'compact'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Compact</span>
              </button>
            </div>
          </div>

          {/* Text Size */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Font Scale
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTextSize('default')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  textSize === 'default'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Default (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => setTextSize('large')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  textSize === 'large'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Large (110%)</span>
              </button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Motion Preferences
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Reduced Motion
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Disable transitions and animated meters
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ANALYSIS PREFERENCES */}
      <section className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Analysis & Role Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {/* Default Candidate Type */}
          <div>
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Default Experience Profile
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Determines scoring weighting: Fresher profiles dynamically reweight experience toward projects and technical evidence.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => handleUpdatePreferences({ candidateType: 'Fresher' })}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  preferences.candidateType === 'Fresher'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Fresher / Intern</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Projects weighted 20%, Experience 0-5%</div>
              </button>

              <button
                type="button"
                onClick={() => handleUpdatePreferences({ candidateType: 'Experienced' })}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  preferences.candidateType === 'Experienced'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Experienced Professional</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Experience & Impact weighted 25%</div>
              </button>
            </div>
          </div>

          {/* Preferred Target Role */}
          <div>
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Default Target Role
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleUpdatePreferences({ preferredTargetRole: role })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    preferences.preferredTargetRole === role
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={preferences.preferredTargetRole}
              onChange={(e) => handleUpdatePreferences({ preferredTargetRole: e.target.value })}
              placeholder="Or enter custom target role..."
              className="max-w-md w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transparent Engine Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Deterministic 10-Criterion Engine & File Support</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Every score is computed locally through our deterministic rubric totalling exactly 100 points: Headline Clarity (10), Summary Quality (10), Skill Keyword Relevance (15), Experience Relevance (15), Achievement Impact (10), Projects & Portfolio (12), Education & Certifications (8), ATS Readability (8), Role Alignment (8), and Completeness & Consistency (4).
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Supported file formats: standard PDF, Microsoft Word (.docx), and plain text (.txt) files under 5MB.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI & PRIVACY */}
      <section className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            AI Enhancements & Privacy Controls
          </h2>
        </div>

        <AiConsentToggle
          consent={preferences.aiConsent}
          onConsentChange={(granted) => handleUpdatePreferences({ aiConsent: granted })}
        />

        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>DPDP Act 2023 & Architecture Guarantees</span>
          </div>
          <p className="leading-relaxed">
            CareerUp complies with the India Digital Personal Data Protection (DPDP) Act 2023. AI polish via Google Gemini 2.0 is an optional enhancement tier. The core deterministic rewriting engine operates 100% locally and never requires AI to function.
          </p>
        </div>
      </section>

      {/* SECTION 4: DATA & HISTORY */}
      <section className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Session Data & Version Storage
          </h2>
        </div>

        {/* Current Session Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Active Candidate</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 truncate">
              {profile ? profile.name : 'No active resume'}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 truncate">
              {profile ? profile.targetRole : '—'}
            </div>
          </div>

          <div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Saved Snapshots</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1">
              {versions.length} Version{versions.length === 1 ? '' : 's'}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Stored in session</div>
          </div>

          <div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Quality Score</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 font-mono">
              {scoreReport ? `${scoreReport.overallScore}/100` : '—'}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              {scoreReport ? scoreReport.verdict : 'Pending upload'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJson}
            disabled={!profile}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export Session JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setModalState({ isOpen: true, type: 'clearResume' })}
            disabled={!profile}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>Clear Active Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setModalState({ isOpen: true, type: 'clearHistory' })}
            disabled={versions.length === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>Clear Version History</span>
          </button>

          <button
            type="button"
            onClick={() => setModalState({ isOpen: true, type: 'resetAll' })}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Reset All Application Data</span>
          </button>
        </div>
      </section>

      {/* SECTION 5: ACCESSIBILITY & ABOUT */}
      <section className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Accessibility &amp; About {BRAND_CONFIG.name}
          </h2>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-slate-500" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Close modal or drawer</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">Esc</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Print / PDF Export</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">Ctrl + P</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Focus next interactive element</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">Tab</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Activate button or toggle</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">Enter / Space</kbd>
            </div>
          </div>
        </div>

        {/* Software Details */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100">
            {BRAND_CONFIG.name} — {BRAND_CONFIG.descriptor} (v{BRAND_CONFIG.version})
          </div>
          <div className="text-slate-600 dark:text-slate-400 space-y-1">
            <div>• Tagline: &ldquo;{BRAND_CONFIG.tagline}&rdquo;</div>
            <div>• Scoring Engine: Deterministic 10-Criterion Engine v3.0 (Zero fabricated metrics)</div>
            <div>• Security: Client-side parsing with server-only optional Gemini polish</div>
            <div>• Compliance: India DPDP Act 2023 with default-OFF revocable consent</div>
          </div>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'clearResume'}
        title="Clear Active Resume?"
        message="This will reset the current active resume from your session. You can re-upload or select a sample report at any time."
        confirmLabel="Clear Resume"
        isDestructive={false}
        onConfirm={executeClearResume}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />

      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'clearHistory'}
        title="Clear Version History?"
        message="This will remove all saved snapshot versions from this browser session. This action cannot be undone."
        confirmLabel="Clear History"
        isDestructive={false}
        onConfirm={executeClearHistory}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />

      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'resetAll'}
        title="Reset All Application Data?"
        message="Warning: This will permanently wipe all local resumes, saved snapshot versions, job application drafts, and custom preferences from this browser. The application will return to its clean initial state."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={executeResetAll}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />
    </div>
  );
};


