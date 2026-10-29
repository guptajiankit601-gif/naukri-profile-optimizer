'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ParsedProfile, ExperienceItem } from '@/types';
import { rewriteBullet, validateRewriteFactualIntegrity } from '@/lib/rewriter/engine';
import { 
  Sparkles, 
  Check, 
  AlertCircle, 
  Edit3, 
  ShieldAlert, 
  Cpu, 
  Copy, 
  RotateCcw, 
  GitCompare, 
  CheckCircle2, 
  Sliders,
  Plus,
  ArrowRight,
  Info
} from 'lucide-react';
import { AiConsentToggle } from './settings/AiConsentToggle';

interface BulletRewriterViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile, changeReason?: string) => void;
}

interface RewrittenVariant {
  type: string;
  text: string;
  reason: string;
  metricsNeeded?: boolean;
}

interface FlatBullet {
  key: string;
  type: 'experience' | 'project';
  sourceIdx: number;
  bulletIdx: number;
  sourceTitle: string;
  sourceSubtitle: string;
  text: string;
}

export const BulletRewriterView: React.FC<BulletRewriterViewProps> = ({ profile, onUpdateProfile }) => {
  const searchParams = useSearchParams();
  const targetParam = searchParams?.get('target'); // 'metrics' | 'passive'
  const keywordParam = searchParams?.get('keyword');
  const expParam = searchParams?.get('exp');
  const bIdxParam = searchParams?.get('bIdx');

  // Flatten all bullets across experiences (and projects if no experiences)
  const allBullets = useMemo<FlatBullet[]>(() => {
    const list: FlatBullet[] = [];
    (profile.experiences || []).forEach((exp, expIdx) => {
      (exp.bullets || []).forEach((b, bIdx) => {
        if (b && b.trim()) {
          list.push({
            key: `exp-${expIdx}-${bIdx}`,
            type: 'experience',
            sourceIdx: expIdx,
            bulletIdx: bIdx,
            sourceTitle: exp.title || 'Role',
            sourceSubtitle: exp.company || 'Company',
            text: b.trim()
          });
        }
      });
    });

    if (list.length === 0 && profile.projects && profile.projects.length > 0) {
      profile.projects.forEach((proj, projIdx) => {
        if (proj.description && proj.description.trim()) {
          list.push({
            key: `proj-${projIdx}-0`,
            type: 'project',
            sourceIdx: projIdx,
            bulletIdx: 0,
            sourceTitle: proj.title || 'Project',
            sourceSubtitle: proj.technologies?.slice(0, 2).join(', ') || 'Independent Work',
            text: proj.description.trim()
          });
        }
      });
    }

    return list;
  }, [profile.experiences, profile.projects]);

  // Selected bullet key state
  const [selectedKey, setSelectedKey] = useState<string>(() => allBullets[0]?.key || '');
  const [customMetricInput, setCustomMetricInput] = useState<string>(() => keywordParam ? `Implemented with ${keywordParam}` : '');
  const [customEditingVariant, setCustomEditingVariant] = useState<{ type: string; text: string } | null>(null);
  const [showDiff, setShowDiff] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add bullet modal state when profile has 0 bullets
  const [showAddBulletModal, setShowAddBulletModal] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newBulletText, setNewBulletText] = useState('');

  // Map tracking original text of bullets that have been rewritten in this session for one-click Undo
  const [rewriteHistory, setRewriteHistory] = useState<Record<string, string>>({});

  // Gemini AI Polish state
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [source, setSource] = useState<'template' | 'ai' | 'ai-cache'>('template');
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [aiCustomVariants, setAiCustomVariants] = useState<RewrittenVariant[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync selectedKey with query params or changes to allBullets
  useEffect(() => {
    if (allBullets.length === 0) return;

    // Check specific exp & bIdx params
    if (expParam !== null && bIdxParam !== null) {
      const match = allBullets.find(b => b.type === 'experience' && b.sourceIdx === Number(expParam) && b.bulletIdx === Number(bIdxParam));
      if (match) {
        setSelectedKey(match.key);
        return;
      }
    }

    // Check keyword param
    if (keywordParam) {
      const match = allBullets.find(b => b.text.toLowerCase().includes(keywordParam.toLowerCase()));
      if (match) {
        setSelectedKey(match.key);
        return;
      }
    }

    // Check targetParam: 'metrics' or 'passive'
    if (targetParam === 'metrics') {
      const match = allBullets.find(b => !/\b(\d+%?|₹[\d.]+\s*(?:cr|lakh)?|\d+\s*(?:k|m|ms|rps|tps|users|req\/s)|[0-9]+)\b/i.test(b.text));
      if (match) {
        setSelectedKey(match.key);
        return;
      }
    } else if (targetParam === 'passive') {
      const match = allBullets.find(b => /^(responsible for|worked on|helped with|assisted in|involved in|participated in|handled)\b/i.test(b.text));
      if (match) {
        setSelectedKey(match.key);
        return;
      }
    }

    // Default to existing selectedKey if still valid, or first bullet
    if (!allBullets.some(b => b.key === selectedKey)) {
      setSelectedKey(allBullets[0]?.key || '');
    }
  }, [allBullets, targetParam, keywordParam, expParam, bIdxParam, selectedKey]);

  // Current bullet guaranteed to exist if allBullets.length > 0
  const currentBullet = useMemo(() => {
    return allBullets.find(b => b.key === selectedKey) || allBullets[0] || null;
  }, [allBullets, selectedKey]);

  const originalBulletText = currentBullet?.text || '';
  const bulletKey = currentBullet?.key || '';
  const previousOriginal = bulletKey ? rewriteHistory[bulletKey] : null;
  const isCurrentlyRewritten = Boolean(previousOriginal && previousOriginal !== originalBulletText);

  // Deterministic engine variants using domain-aware classifier
  const deterministicResult = useMemo(() => {
    if (!originalBulletText) {
      return {
        intent: 'Feature Delivery',
        detectedIssues: [],
        variants: []
      };
    }
    return rewriteBullet(originalBulletText, customMetricInput, profile.targetRole);
  }, [originalBulletText, customMetricInput, profile.targetRole]);

  // Active variants (either AI polished or deterministic)
  const activeVariants: RewrittenVariant[] = (aiEnabled && aiCustomVariants)
    ? aiCustomVariants
    : deterministicResult.variants;

  const handleFetchAiPolish = async () => {
    if (!originalBulletText) return;
    setAiLoading(true);
    setAiNote(null);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ai-consent': 'true'
        },
        body: JSON.stringify({
          bulletText: originalBulletText,
          role: profile.targetRole || 'Software Engineer',
          userMetric: customMetricInput || undefined,
          consented: true
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSource('template');
        setAiCustomVariants(null);
        setAiNote(data?.error?.message || 'AI service unavailable — showing faithful template suggestions');
        showToast(data?.error?.message || 'Showing template-based suggestions');
      } else {
        const firstResult = data.data?.results?.[0];
        if (firstResult && firstResult.variants && firstResult.variants.length > 0) {
          const mappedVariants: RewrittenVariant[] = firstResult.variants.map((v: { level: string; text: string; reason: string; requiresInput: unknown }) => ({
            type: v.level.toUpperCase(),
            text: v.text,
            reason: v.reason,
            metricsNeeded: v.requiresInput !== null
          }));
          setAiCustomVariants(mappedVariants);
          setSource(data.data.source || 'ai');
          if (firstResult.note) {
            setAiNote(firstResult.note);
          }
          showToast(firstResult.source === 'ai-cache' ? '⚡ Loaded from 30-day AI cache' : '✨ Gemini 2.0 AI Polish applied!');
        } else {
          setSource('template');
          setAiCustomVariants(null);
          setAiNote('Showing template-based suggestions');
        }
      }
    } catch {
      setSource('template');
      setAiCustomVariants(null);
      setAiNote('AI request failed — showing template-based suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleAiConsent = (granted: boolean) => {
    setAiEnabled(granted);
    if (!granted) {
      setSource('template');
      setAiCustomVariants(null);
      setAiNote(null);
    } else {
      handleFetchAiPolish();
    }
  };

  const handleAcceptVariant = (variantText: string) => {
    if (!currentBullet) return;

    // Step 4: Validate output against original facts before accepting
    const validation = validateRewriteFactualIntegrity(originalBulletText, variantText, customMetricInput);
    const textToApply = validation.isValid ? variantText : validation.fallbackText;

    if (!validation.isValid) {
      showToast('⚠️ Factual check applied: Replaced unverified metrics with faithful active verbs.');
    }

    // Save original for Undo capability if not already saved
    if (!rewriteHistory[currentBullet.key]) {
      setRewriteHistory(prev => ({ ...prev, [currentBullet.key]: originalBulletText }));
    }

    const updated: ParsedProfile = JSON.parse(JSON.stringify(profile));

    if (currentBullet.type === 'experience') {
      if (updated.experiences[currentBullet.sourceIdx]?.bullets) {
        updated.experiences[currentBullet.sourceIdx].bullets[currentBullet.bulletIdx] = textToApply;
      }
    } else if (currentBullet.type === 'project') {
      if (updated.projects[currentBullet.sourceIdx]) {
        updated.projects[currentBullet.sourceIdx].description = textToApply;
      }
    }

    onUpdateProfile(updated, `Accepted Rewritten Bullet (${currentBullet.sourceTitle})`);
    showToast('✅ Bullet updated in your profile! Recruiter score recalculated.');
  };

  const handleUndoRewrite = () => {
    if (!currentBullet) return;
    const orig = rewriteHistory[currentBullet.key];
    if (!orig) return;

    const updated: ParsedProfile = JSON.parse(JSON.stringify(profile));
    if (currentBullet.type === 'experience') {
      if (updated.experiences[currentBullet.sourceIdx]?.bullets) {
        updated.experiences[currentBullet.sourceIdx].bullets[currentBullet.bulletIdx] = orig;
      }
    } else if (currentBullet.type === 'project') {
      if (updated.projects[currentBullet.sourceIdx]) {
        updated.projects[currentBullet.sourceIdx].description = orig;
      }
    }

    onUpdateProfile(updated, `Reverted Bullet to Original (${currentBullet.sourceTitle})`);

    // Remove from history
    setRewriteHistory(prev => {
      const copy = { ...prev };
      delete copy[currentBullet.key];
      return copy;
    });

    showToast('↩️ Reverted bullet back to its original text!');
  };

  const handleCopyVariant = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
    showToast(`Copied ${type} variant to clipboard!`);
  };

  const handleAddFirstBullet = () => {
    if (!newBulletText.trim()) return;
    const title = newRoleTitle.trim() || profile.targetRole || 'Software Engineer';
    const company = newCompany.trim() || 'Technology Company';

    const updated: ParsedProfile = JSON.parse(JSON.stringify(profile));
    if (!updated.experiences || updated.experiences.length === 0) {
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title,
        company,
        startDate: '2023',
        endDate: 'Present',
        bullets: [newBulletText.trim()]
      };
      updated.experiences = [newExp];
    } else {
      updated.experiences[0].bullets.push(newBulletText.trim());
    }

    onUpdateProfile(updated, `Added Experience Bullet (${title})`);
    setShowAddBulletModal(false);
    setNewBulletText('');
    setNewRoleTitle('');
    setNewCompany('');
    showToast('✅ Added new bullet to profile!');
  };

  // Helper to compute a simple word diff highlight
  const renderDiff = (original: string, rewritten: string) => {
    const origWords = original.replace(/[.,]/g, '').toLowerCase().split(/\s+/);
    const rewrittenTokens = rewritten.split(/(\s+)/);

    return (
      <div className="space-y-2">
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-400"></span>
          <span className="line-through">{original}</span>
        </div>
        <div className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          {rewrittenTokens.map((token, i) => {
            const cleanToken = token.trim().replace(/[.,]/g, '').toLowerCase();
            const isNew = cleanToken.length > 2 && !origWords.includes(cleanToken);
            if (isNew) {
              return (
                <span key={i} className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-1 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {token}
                </span>
              );
            }
            return <span key={i}>{token}</span>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Fact-Preserving Bullet Rewriter</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Converts passive duty statements into high-impact recruiter hooks. <strong className="text-slate-900 dark:text-slate-100">Fact-Preserving Policy:</strong> preserves your real tools and domain context without fabricating unverified metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showDiff 
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{showDiff ? 'Diff View ON' : 'Diff View OFF'}</span>
          </button>
        </div>
      </div>

      {/* AI Consent / Enhancement Banner */}
      <AiConsentToggle
        consent={aiEnabled}
        onConsentChange={handleToggleAiConsent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 4 Cols - Bullet Picker */}
        <div className="lg:col-span-4 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col max-h-[580px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Select Bullet to Optimize
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              {allBullets.length} {allBullets.length === 1 ? 'Bullet' : 'Bullets'}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {allBullets.length === 0 ? (
              <div className="text-center py-8 px-4 space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No experience bullets found in your profile.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddBulletModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Bullet</span>
                </button>
              </div>
            ) : (
              allBullets.map((bullet) => {
                const isSelected = selectedKey === bullet.key;
                const hasBeenRewritten = Boolean(rewriteHistory[bullet.key]);
                return (
                  <button
                    key={bullet.key}
                    onClick={() => {
                      setSelectedKey(bullet.key);
                      setCustomMetricInput('');
                      setCustomEditingVariant(null);
                      setAiCustomVariants(null);
                      setSource('template');
                      if (aiEnabled) {
                        setTimeout(handleFetchAiPolish, 50);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-100 shadow-xs ring-1 ring-blue-600 dark:ring-blue-500'
                        : 'bg-white dark:bg-[#142236] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-1">
                      <span className="truncate">{bullet.sourceTitle}</span>
                      <span className="text-[10px] text-slate-400 truncate">@{bullet.sourceSubtitle}</span>
                    </div>
                    <div className="line-clamp-2 leading-relaxed text-slate-700 dark:text-slate-300">{bullet.text}</div>
                    {hasBeenRewritten && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {allBullets.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddBulletModal(true)}
                className="w-full py-1.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Bullet</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: 8 Cols - 4-Step Standard Workflow (Understand -> Improve -> Review -> Confirm) */}
        <div className="lg:col-span-8 space-y-4">
          {allBullets.length === 0 ? (
            <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No Bullets to Rewrite</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Your uploaded profile does not currently have parsed experience bullet points. Add an experience bullet point to start applying fact-preserving action verbs and scale metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBulletModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience Bullet</span>
              </button>
            </div>
          ) : (
            <>
              {/* AI Banner / Disclaimer */}
              {aiEnabled && source !== 'template' && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                    AI polish powered by Google Gemini (Server-side) — verify factual accuracy before applying.
                  </span>
                  {source === 'ai-cache' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                      Cached (30d)
                    </span>
                  )}
                </div>
              )}

              {/* Fallback Note Display */}
              {aiNote && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2 text-xs text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{aiNote}</span>
                </div>
              )}

              {/* STEP 1: UNDERSTAND (Current Original Text & Screening Friction) */}
              <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 1: Understand
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {currentBullet?.sourceTitle} @ {currentBullet?.sourceSubtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold uppercase">
                      Intent: {deterministicResult.intent}
                    </span>
                    {isCurrentlyRewritten && (
                      <button
                        onClick={handleUndoRewrite}
                        className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Undo to Original</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  &quot;{originalBulletText}&quot;
                </p>

                {/* Detected Issues */}
                {deterministicResult.detectedIssues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Screening Friction Detected:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {deterministicResult.detectedIssues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: IMPROVE (Verified Metric Input) */}
              <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 2: Improve — Supply Verified Outcome (Optional)
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Never fabricated without your input</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMetricInput}
                    onChange={(e) => setCustomMetricInput(e.target.value)}
                    placeholder="e.g. 40% latency reduction / 15,000 req/sec / 99.95% uptime SLA / ₹2.5 Cr"
                    className="flex-1 bg-slate-50 dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (aiEnabled) {
                        handleFetchAiPolish();
                      } else {
                        showToast('Updated variant metrics');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    Apply Metric
                  </button>
                </div>
              </div>

              {/* STEPS 3 & 4: REVIEW & CONFIRM (3 Fact-Preserving Variants) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span>Steps 3 & 4: Review Variants & Confirm Rewrite</span>
                    {aiLoading && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-normal animate-pulse">
                        <Cpu className="w-3 h-3 animate-spin" /> Calling Gemini 2.0...
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Engine: <span className="font-semibold text-slate-700 dark:text-slate-300">{aiEnabled && source !== 'template' ? 'AI Polished' : 'Deterministic Engine'}</span>
                  </div>
                </div>

                {activeVariants.map((variant) => {
                  const activeText = customEditingVariant?.type === variant.type ? customEditingVariant.text : variant.text;
                  const isCopied = copiedType === variant.type;

                  return (
                    <div
                      key={variant.type}
                      className={`bg-white dark:bg-[#142236] rounded-2xl border p-4 sm:p-5 shadow-xs transition-all space-y-3 ${
                        variant.type === 'SAFE'
                          ? 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                          : variant.type === 'METRIC'
                          ? 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            variant.type === 'SAFE'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : variant.type === 'METRIC'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          }`}>
                            {variant.type === 'SAFE' && '🛡 Safe Variant (Fact-Preserving)'}
                            {variant.type === 'METRIC' && '⚡ Metric-Ready Variant (Quantified Proof)'}
                            {variant.type === 'IMPACT' && '🚀 Architectural Impact (Senior Focus)'}
                          </span>
                          {aiEnabled && source !== 'template' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                              AI
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{variant.reason}</span>
                      </div>

                      {customEditingVariant?.type === variant.type ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Edit In-Place Before Accepting:</label>
                          <textarea
                            rows={3}
                            value={activeText}
                            onChange={(e) => setCustomEditingVariant({ type: variant.type, text: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-blue-600 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                      ) : showDiff ? (
                        renderDiff(originalBulletText, activeText)
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          {activeText}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 gap-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleCopyVariant(activeText, variant.type)}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (customEditingVariant?.type === variant.type) {
                                setCustomEditingVariant(null);
                              } else {
                                setCustomEditingVariant({ type: variant.type, text: activeText });
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>{customEditingVariant?.type === variant.type ? 'Done' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptVariant(activeText)}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept &amp; Update Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Bullet Modal */}
      {showAddBulletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Add Experience Bullet</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your role, organization, and bullet text to optimize.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Job Title / Role</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder={profile.targetRole || 'e.g. Senior Backend Engineer'}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company / Organization</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. TechCorp Solutions"
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bullet Text</label>
                <textarea
                  rows={3}
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  placeholder="e.g. Responsible for developing microservices and optimizing database queries."
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddBulletModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFirstBullet}
                disabled={!newBulletText.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save &amp; Optimize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
