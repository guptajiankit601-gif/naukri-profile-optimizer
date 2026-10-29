'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ParsedProfile, ScoreReport } from '@/types';
import { BRAND } from '@/config/brand';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParsedProfile;
  scoreReport: ScoreReport;
}

type CardTheme = 'Classic' | 'Ocean' | 'Forest' | 'Slate';
type CardSize = 'square' | 'linkedin' | 'story';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, onClose, profile, scoreReport }) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('Classic');
  const [selectedSize, setSelectedSize] = useState<CardSize>('linkedin');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sizeDimensions: Record<CardSize, { width: number; height: number; label: string }> = {
    square: { width: 1080, height: 1080, label: 'Instagram (1080 × 1080)' },
    linkedin: { width: 1200, height: 627, label: 'LinkedIn (1200 × 627)' },
    story: { width: 1080, height: 1920, label: 'Story / Reel (1080 × 1920)' }
  };

  const themeColors: Record<CardTheme, { bg1: string; bg2: string; accent: string; text: string; subtext: string }> = {
    Classic: { bg1: '#0F172A', bg2: '#1E293B', accent: '#3B82F6', text: '#FFFFFF', subtext: '#94A3B8' },
    Ocean: { bg1: '#0A192F', bg2: '#0284C7', accent: '#38BDF8', text: '#FFFFFF', subtext: '#94A3B8' },
    Forest: { bg1: '#052E16', bg2: '#166534', accent: '#4ADE80', text: '#FFFFFF', subtext: '#BBF7D0' },
    Slate: { bg1: '#18181B', bg2: '#27272A', accent: '#A1A1AA', text: '#FFFFFF', subtext: '#71717A' }
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = sizeDimensions[selectedSize];
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = themeColors[selectedTheme];

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.bg1);
    gradient.addColorStop(1, theme.bg2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative glow circle
    const glow = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 400);
    glow.addColorStop(0, `${theme.accent}33`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 2. App Branding & Watermark
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`⚡ ${BRAND.name.toUpperCase()} · ${BRAND.descriptor.toUpperCase()}`, 80, 100);

    ctx.fillStyle = theme.subtext;
    ctx.font = '22px sans-serif';
    ctx.fillText('Recruiter 6-Second Triage Simulation', 80, 135);

    // 3. Candidate Info
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(profile.name, 80, height * 0.38);

    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`${profile.targetRole}  •  ${profile.experienceBand} Yrs Exp`, 80, height * 0.44);

    // 4. Score Display
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 110px sans-serif';
    ctx.fillText(`${scoreReport.overallScore}`, 80, height * 0.65);

    ctx.fillStyle = theme.subtext;
    ctx.font = '36px sans-serif';
    ctx.fillText('/ 100', 250, height * 0.65);

    // 5. Verdict Pill
    const verdictText = `Verdict: ${scoreReport.verdict.toUpperCase()} READINESS`;
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(verdictText, 80, height * 0.72);

    // 6. Percentile Line
    ctx.fillStyle = theme.subtext;
    ctx.font = '26px sans-serif';
    ctx.fillText(`Evaluation Model: 10-Criteria Deterministic Scoring Engine`, 80, height * 0.77);

    // 7. Footer Watermark & URL
    ctx.fillStyle = theme.subtext;
    ctx.font = '22px sans-serif';
    ctx.fillText(`Free Evaluation: ${BRAND.name.toLowerCase()}.app`, 80, height - 60);

  }, [isOpen, selectedTheme, selectedSize, profile, scoreReport]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${BRAND.name}-ScoreCard-${profile.name.replace(/\s+/g, '_')}-${selectedTheme.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const captionTemplate = `🚀 Just tested my resume through ${BRAND.name}!

Scored ${scoreReport.overallScore}/100 (${scoreReport.verdict} Readiness) against recruiter screening criteria for ${profile.targetRole}.

Key improvements made: refined my headline with high-priority search keywords and structured my experience bullets with verified metrics.

#${BRAND.name} #JobFit #ResumeAudit #CareerGrowth #TechCareers`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionTemplate);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Shareable Recruiter Score Card</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 7 Cols - Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[360px] object-contain rounded-xl shadow-xl"
            />
            <div className="text-xs text-slate-400 mt-2">
              Resolution: {sizeDimensions[selectedSize].label}
            </div>
          </div>

          {/* Right: 5 Cols - Customization & Actions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Theme Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Palette Theme:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Classic', 'Ocean', 'Forest', 'Slate'] as CardTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      selectedTheme === theme
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#142236] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Image Dimensions:</label>
              <div className="space-y-1.5">
                {(['linkedin', 'square', 'story'] as CardSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#142236] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{sizeDimensions[size].label}</span>
                    {selectedSize === size && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Score Card</span>
            </button>

            {/* Copy Caption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ready-to-Paste Caption:</span>
                <button
                  onClick={handleCopyCaption}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                readOnly
                value={captionTemplate}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
