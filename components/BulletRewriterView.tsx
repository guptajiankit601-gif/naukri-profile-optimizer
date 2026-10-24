import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { generateBulletRewrite } from '@/services/bullet-rewriter';
import { Sparkles, Check, AlertCircle, Edit3, ArrowRight } from 'lucide-react';

interface BulletRewriterViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const BulletRewriterView: React.FC<BulletRewriterViewProps> = ({ profile, onUpdateProfile }) => {
  const [selectedBulletIndex, setSelectedBulletIndex] = useState<{ expIdx: number; bIdx: number }>({ expIdx: 0, bIdx: 0 });
  const [customMetricInput, setCustomMetricInput] = useState('');
  const [customEditingVariant, setCustomEditingVariant] = useState<{ type: string; text: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const exp = profile.experiences[selectedBulletIndex.expIdx];
  const originalBulletText = exp?.bullets[selectedBulletIndex.bIdx] || 'Responsible for building backend services.';

  const rewriteResult = generateBulletRewrite(originalBulletText, customMetricInput);

  const handleAcceptVariant = (variantText: string) => {
    const updated = { ...profile };
    const experiencesCopy = [...updated.experiences];
    const targetBullets = [...experiencesCopy[selectedBulletIndex.expIdx].bullets];
    targetBullets[selectedBulletIndex.bIdx] = variantText;
    experiencesCopy[selectedBulletIndex.expIdx] = {
      ...experiencesCopy[selectedBulletIndex.expIdx],
      bullets: targetBullets
    };
    updated.experiences = experiencesCopy;
    onUpdateProfile(updated);
    showToast('✅ Bullet updated in your profile! Recruiter score recalculated.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-900 font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF7582]" />
          <span>Smart Bullet Rewriter (Intent Classified & Metric Grounded)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Turns passive statements into high-impact recruiter hooks. <strong className="text-white">Strict Zero-Hallucination Policy:</strong> we never invent fake numbers; you provide your actual metric.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4 Cols - Bullet Picker */}
        <div className="lg:col-span-4 bg-[#13273A] rounded-2xl border border-[#234566] p-4 shadow-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Select Bullet to Optimize:
          </div>
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {profile.experiences.map((experience, expI) => (
              <div key={expI} className="space-y-1.5">
                <div className="text-[11px] font-bold text-[#FF7582] truncate">
                  {experience.title} @ {experience.company}
                </div>
                {experience.bullets.map((b, bI) => {
                  const isSelected = selectedBulletIndex.expIdx === expI && selectedBulletIndex.bIdx === bI;
                  return (
                    <button
                      key={bI}
                      onClick={() => {
                        setSelectedBulletIndex({ expIdx: expI, bIdx: bI });
                        setCustomMetricInput('');
                        setCustomEditingVariant(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#18314A] border-[#FF7582] text-white shadow-sm'
                          : 'bg-[#0F2233] border-[#234566] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="line-clamp-2 leading-relaxed">{b}</div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: 8 Cols - Active Bullet Analysis & 3 Variants */}
        <div className="lg:col-span-8 space-y-5">
          {/* Original Card & Issues */}
          <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#234566] mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Original Text</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18314A] text-[#FF7582] border border-[#FF7582]/30 font-bold uppercase">
                Detected Intent: {rewriteResult.intent}
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed bg-[#0F2233] p-3 rounded-xl border border-[#234566]">
              "{originalBulletText}"
            </p>

            {/* Detected Issues */}
            <div className="mt-3 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recruiter Friction Detected ({rewriteResult.detectedIssues.length}):
              </div>
              {rewriteResult.detectedIssues.map((issue, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>

            {/* Inline Metric Input Prompt */}
            <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#18314A] to-[#234566] border border-[#725A7A]/50">
              <label className="block text-xs font-bold text-white mb-1">
                Supply Your Actual Number / Outcome (Zero Hallucination):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMetricInput}
                  onChange={(e) => setCustomMetricInput(e.target.value)}
                  placeholder="e.g. 40% latency reduction / 15,000 req/sec / ₹2.5 Cr ARR / 6 team members"
                  className="flex-1 bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#725A7A] hover:bg-[#C56C86] text-white text-xs font-bold cursor-pointer"
                >
                  Apply Number
                </button>
              </div>
            </div>
          </div>

          {/* 3 Variants */}
          <div className="space-y-3.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Choose From 3 Tailored Variants:
            </div>

            {rewriteResult.variants.map((variant) => {
              const activeText = customEditingVariant?.type === variant.type ? customEditingVariant.text : variant.text;
              return (
                <div
                  key={variant.type}
                  className="bg-[#13273A] rounded-2xl border border-[#234566] hover:border-[#725A7A] p-5 shadow-xl transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      variant.type === 'SAFE'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : variant.type === 'METRIC'
                        ? 'bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {variant.type === 'SAFE' && '🛡 Safe Variant (Accurate & Crisp)'}
                      {variant.type === 'METRIC' && '⚡ Metric-Driven Variant (High Callback Rate)'}
                      {variant.type === 'IMPACT' && '🚀 Executive Impact Variant (SDE-2 / Senior)'}
                    </span>
                    <span className="text-[11px] text-slate-400">{variant.reason}</span>
                  </div>

                  {customEditingVariant?.type === variant.type ? (
                    <textarea
                      rows={2}
                      value={activeText}
                      onChange={(e) => setCustomEditingVariant({ type: variant.type, text: e.target.value })}
                      className="w-full bg-[#0F2233] border border-[#FF7582] rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-[#0F2233]/70 p-3 rounded-xl border border-[#234566]">
                      {activeText}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (customEditingVariant?.type === variant.type) {
                          setCustomEditingVariant(null);
                        } else {
                          setCustomEditingVariant({ type: variant.type, text: activeText });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{customEditingVariant?.type === variant.type ? 'Done Editing' : 'Edit Text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptVariant(activeText)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow hover:opacity-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Update Profile</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
