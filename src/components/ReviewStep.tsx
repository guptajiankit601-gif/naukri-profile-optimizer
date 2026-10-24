import React, { useState } from 'react';
import { ParsedProfile } from '../types';
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface ReviewStepProps {
  initialProfile: ParsedProfile;
  onConfirmAndAnalyze: (updatedProfile: ParsedProfile) => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  initialProfile,
  onConfirmAndAnalyze,
  onBack
}) => {
  const [profile, setProfile] = useState<ParsedProfile>(initialProfile);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets[bulletIndex] = val;
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleAddBullet = (expIndex: number) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets.push('Spearheaded system enhancement delivering measurable impact.');
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets.splice(bulletIndex, 1);
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const renderConfidenceBadge = (sectionKey: string, score: number) => {
    const isLow = score < 70;
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
        isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      }`}>
        {isLow ? <AlertTriangle className="w-3 h-3 text-amber-400" /> : <CheckCircle className="w-3 h-3 text-emerald-400" />}
        <span>{score}% Confidence {isLow && '· Verify Below'}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#725A7A]/30 border border-[#C56C86]/30 text-xs text-[#FF7582] font-semibold mb-3">
          <span>📝 Step 3 of 4: Verify Parsed Data</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Review & Refine Profile Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Sections flagged with &lt;70% confidence have been highlighted. Making quick edits here guarantees maximum scoring precision.
        </p>
      </div>

      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / Location</label>
            <input
              type="text"
              value={profile.phone ? `${profile.phone} | ${profile.location}` : profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
            />
          </div>
        </div>

        {/* Headline */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-white">Current Headline / Title</label>
            {renderConfidenceBadge('headline', profile.sectionConfidence.headline || 85)}
          </div>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
          />
        </div>

        {/* Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-white">Summary / About Section</label>
            {renderConfidenceBadge('summary', profile.sectionConfidence.summary || 85)}
          </div>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full bg-[#0F2233] border border-[#234566] rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
          />
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <label className="text-xs font-bold text-white">Extracted Skills ({profile.skills.length})</label>
              <span className="text-[11px] text-slate-400 ml-2">Click to remove, or type to add</span>
            </div>
            {renderConfidenceBadge('skills', profile.sectionConfidence.skills || 65)}
          </div>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0F2233] border border-[#234566] max-h-40 overflow-y-auto mb-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#18314A] hover:bg-red-950/60 text-slate-200 hover:text-red-300 text-xs border border-[#234566] transition-all cursor-pointer group"
                onClick={() => handleRemoveSkill(skill)}
                title="Click to remove"
              >
                <span>{skill}</span>
                <span className="text-slate-500 group-hover:text-red-400 text-[10px]">✕</span>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skill (e.g. Kafka, Docker, Next.js)..."
              className="flex-1 bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-1.5 rounded-xl bg-[#725A7A] hover:bg-[#C56C86] text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Experiences & Bullets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-white">Experience Bullets (Critical for Recruiter Scan)</label>
            {renderConfidenceBadge('experience', profile.sectionConfidence.experience || 80)}
          </div>
          <div className="space-y-4">
            {profile.experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="p-4 rounded-xl bg-[#0F2233] border border-[#234566]">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#FF7582]">
                  <span>{exp.title} — {exp.company}</span>
                  <span className="text-slate-400 font-normal">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="space-y-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-500 text-xs mt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                        className="flex-1 bg-[#13273A] border border-[#234566] rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(expIdx, bIdx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer mt-1"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddBullet(expIdx)}
                    className="text-[11px] text-[#FF7582] hover:underline font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add another bullet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 border-t border-[#234566] flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={() => onConfirmAndAnalyze(profile)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] text-white font-extrabold text-sm shadow-xl shadow-[#FF7582]/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Run 6-Second Recruiter Simulation & Score</span>
          </button>
        </div>
      </div>
    </div>
  );
};
