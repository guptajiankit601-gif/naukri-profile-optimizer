import React, { useRef, useState, useEffect } from 'react';
import { ParsedProfile, ScoreReport } from '@/types';
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParsedProfile;
  scoreReport: ScoreReport;
}

type CardTheme = 'Sunset' | 'Ocean' | 'Forest' | 'Mono';
type CardSize = 'square' | 'linkedin' | 'story';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, onClose, profile, scoreReport }) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('Sunset');
  const [selectedSize, setSelectedSize] = useState<CardSize>('linkedin');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sizeDimensions: Record<CardSize, { width: number; height: number; label: string }> = {
    square: { width: 1080, height: 1080, label: 'Instagram (1080 × 1080)' },
    linkedin: { width: 1200, height: 627, label: 'LinkedIn (1200 × 627)' },
    story: { width: 1080, height: 1920, label: 'Story / Reel (1080 × 1920)' }
  };

  const themeColors: Record<CardTheme, { bg1: string; bg2: string; accent: string; text: string; subtext: string }> = {
    Sunset: { bg1: '#0F2233', bg2: '#725A7A', accent: '#FF7582', text: '#FFFFFF', subtext: '#CBD5E1' },
    Ocean: { bg1: '#0A192F', bg2: '#0284C7', accent: '#38BDF8', text: '#FFFFFF', subtext: '#94A3B8' },
    Forest: { bg1: '#052E16', bg2: '#166534', accent: '#4ADE80', text: '#FFFFFF', subtext: '#BBF7D0' },
    Mono: { bg1: '#111827', bg2: '#1F2937', accent: '#E5E7EB', text: '#FFFFFF', subtext: '#9CA3AF' }
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
    ctx.fillText('⚡ NAUKRI PROFILE OPTIMIZER', 80, 100);

    ctx.fillStyle = theme.subtext;
    ctx.font = '22px sans-serif';
    ctx.fillText('Recruiter 6-Second Human Scan Simulation', 80, 135);

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
    const verdictText = `Verdict: ${scoreReport.verdict.toUpperCase()} RECRUITER VISIBILITY`;
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(verdictText, 80, height * 0.72);

    // 6. Percentile Line
    ctx.fillStyle = theme.subtext;
    ctx.font = '26px sans-serif';
    ctx.fillText(`Top Benchmark: ${scoreReport.overallScore >= 70 ? 'Top 10%' : 'Beats 68% of Applicants'} in Indian Tech Markets`, 80, height * 0.77);

    // 7. Footer Watermark & URL
    ctx.fillStyle = theme.subtext;
    ctx.font = '22px sans-serif';
    ctx.fillText('Free Recruiter Scan: naukri-profile-optimizer.vercel.app', 80, height - 60);

  }, [isOpen, selectedTheme, selectedSize, profile, scoreReport]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `Naukri-ScoreCard-${profile.name.replace(/\s+/g, '_')}-${selectedTheme.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const captionTemplate = `🚀 Just tested my resume through the Naukri Profile Optimizer!

Scored ${scoreReport.overallScore}/100 (${scoreReport.verdict} Recruiter Visibility) against Indian tech recruiter 6-second scan patterns.

Key takeaway: Fixed my headline from generic title to exact-match search keywords and added numbers to my bullets.

Try your profile 100% free (local-only, zero signup): https://naukri-profile-optimizer.vercel.app

#Naukri #JobSearch #CareerTips #SoftwareEngineering #ResumeScore`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionTemplate);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13273A] border border-[#234566] rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#0F2233] hover:bg-[#18314A] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#FF7582]" />
          <h3 className="text-xl font-bold text-white">Shareable Recruiter Score Card</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 7 Cols - Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#0F2233] rounded-2xl border border-[#234566] p-4 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[360px] object-contain rounded-xl shadow-2xl"
            />
            <div className="text-[11px] text-slate-400 mt-2">
              Resolution: {sizeDimensions[selectedSize].label}
            </div>
          </div>

          {/* Right: 5 Cols - Customization & Actions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Theme Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Palette Theme:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Sunset', 'Ocean', 'Forest', 'Mono'] as CardTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      selectedTheme === theme
                        ? 'border-[#FF7582] bg-[#FF7582]/20 text-white'
                        : 'border-[#234566] bg-[#0F2233] text-slate-400'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Image Dimensions:</label>
              <div className="space-y-1.5">
                {(['linkedin', 'square', 'story'] as CardSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                      selectedSize === size
                        ? 'border-[#FF7582] bg-[#18314A] text-white'
                        : 'border-[#234566] bg-[#0F2233] text-slate-400'
                    }`}
                  >
                    <span>{sizeDimensions[size].label}</span>
                    {selectedSize === size && <Check className="w-3.5 h-3.5 text-[#FF7582]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Score Card</span>
            </button>

            {/* Copy Caption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300">Ready-to-Paste LinkedIn Caption:</span>
                <button
                  onClick={handleCopyCaption}
                  className="text-[11px] text-[#FF7582] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                readOnly
                value={captionTemplate}
                className="w-full bg-[#0F2233] border border-[#234566] rounded-xl p-2.5 text-[11px] text-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
