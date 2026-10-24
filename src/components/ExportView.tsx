import React, { useState } from 'react';
import { ParsedProfile } from '../types';
import { Download, Copy, Check, Printer, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ExportViewProps {
  profile: ParsedProfile;
}

export const ExportView: React.FC<ExportViewProps> = ({ profile }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast(`Copied ${key} to clipboard!`);
  };

  const handlePrintResume = () => {
    window.print();
  };

  // 3-Category skills for Naukri
  const coreSkills = profile.skills.slice(0, 8).join(', ');
  const cloudTools = profile.skills.filter(s => s.match(/aws|cloud|docker|git|sql|db|linux|api|redis/i)).slice(0, 8).join(', ') || 'Docker, AWS, Git, CI/CD, SQL';
  const methodologies = 'Agile/Scrum, Microservices Architecture, RESTful API Design, Performance Optimization';

  const naukriAbout = `${profile.headline}\n\n${profile.summary}\n\nCore Competencies:\n- Backend & Cloud Architecture\n- Scalable API Engineering & Microservices\n- Agile Sprint Execution`;

  const linkedInHeadline = `${profile.headline} | Open to Opportunities`;
  const linkedInAbout = `👋 I am a ${profile.headline} with ${profile.experienceBand} years experience.\n\n${profile.summary}\n\n💡 Core Tech Stack:\n${profile.skills.slice(0, 15).join(' • ')}\n\n📫 Contact: ${profile.email} | ${profile.phone}`;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-900 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-[#FF7582]" />
            <span>ATS Resume Export & Platform Ready-to-Paste Copy Blocks</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Single-click export your optimized profile. Single-column ATS resume guarantees 100% parseability in Workday, Greenhouse & Naukri.
          </p>
        </div>
        <button
          onClick={handlePrintResume}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save ATS PDF</span>
        </button>
      </div>

      {/* Grid of Copy-Ready Blocks (Naukri & LinkedIn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        {/* Naukri Copy Blocks */}
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#234566]">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF7582]">Naukri Profile Ready Blocks</span>
            <span className="text-[10px] text-slate-400">Exact character counts</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Naukri Resume Headline</label>
              <button
                onClick={() => copyToClipboard(profile.headline, 'Naukri Headline')}
                className="text-[11px] text-[#FF7582] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Headline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-200">
              {profile.headline}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Naukri Key Skills (3 Categories)</label>
              <button
                onClick={() => copyToClipboard(`Core: ${coreSkills}\nCloud/DB: ${cloudTools}\nPractices: ${methodologies}`, 'Naukri Skills')}
                className="text-[11px] text-[#FF7582] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Skills' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Skills' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-200 space-y-1.5 font-mono">
              <div><strong className="text-slate-400">Core Tech:</strong> {coreSkills}</div>
              <div><strong className="text-slate-400">Cloud & Data:</strong> {cloudTools}</div>
              <div><strong className="text-slate-400">Architecture:</strong> {methodologies}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Naukri Profile Summary</label>
              <button
                onClick={() => copyToClipboard(naukriAbout, 'Naukri Summary')}
                className="text-[11px] text-[#FF7582] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Summary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-200 whitespace-pre-line">
              {naukriAbout}
            </div>
          </div>
        </div>

        {/* LinkedIn Copy Blocks */}
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#234566]">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400">LinkedIn Profile Ready Blocks</span>
            <span className="text-[10px] text-slate-400">Algorithm optimized</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">LinkedIn Pipe-Separated Headline</label>
              <button
                onClick={() => copyToClipboard(linkedInHeadline, 'LinkedIn Headline')}
                className="text-[11px] text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'LinkedIn Headline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'LinkedIn Headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-200">
              {linkedInHeadline}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">LinkedIn About Section (Hook + Tech Stack)</label>
              <button
                onClick={() => copyToClipboard(linkedInAbout, 'LinkedIn About')}
                className="text-[11px] text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'LinkedIn About' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'LinkedIn About' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-200 whitespace-pre-line max-h-48 overflow-y-auto">
              {linkedInAbout}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-300 mb-1">LinkedIn Featured Section Recommendations</div>
            <div className="p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-400 space-y-1">
              <div>• Pin your top GitHub repo or architecture diagram</div>
              <div>• Attach your AWS / Vendor certification PDF verification link</div>
              <div>• Feature a screenshot of your highest-impact production project</div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS 1-Column Printable Template Preview */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto border border-slate-300">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900">{profile.name}</h1>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            {profile.location} · {profile.phone} · {profile.email}
          </div>
          <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
            {profile.headline}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-400 pb-1 mb-2 text-slate-900">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed">
            {profile.summary}
          </p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-400 pb-1 mb-2 text-slate-900">
            Technical Competencies
          </h2>
          <div className="text-xs text-slate-800 leading-relaxed">
            <span className="font-bold">Core Technologies: </span>
            {profile.skills.join(', ')}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-400 pb-1 mb-2 text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {profile.experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>{exp.title} | {exp.company}</span>
                  <span className="text-slate-600 font-normal">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-slate-800 leading-relaxed">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-400 pb-1 mb-2 text-slate-900">
            Education
          </h2>
          {profile.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-xs text-slate-900">
              <span className="font-bold">{edu.degree} — {edu.institution}</span>
              <span className="text-slate-600">{edu.year} {edu.score && `(${edu.score})`}</span>
            </div>
          ))}
        </div>

        {/* Projects / Certifications */}
        {profile.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-400 pb-1 mb-2 text-slate-900">
              Certifications & Credentials
            </h2>
            <div className="text-xs text-slate-800 space-y-0.5">
              {profile.certifications.map((cert, idx) => (
                <div key={idx}>• {cert}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
