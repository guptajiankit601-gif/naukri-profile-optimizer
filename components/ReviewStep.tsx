'use client';

import React, { useState } from 'react';
import { ParsedProfile, ProfileSkillItem } from '@/types';
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle, Plus, Trash2, ShieldCheck, UserCheck, FileText } from 'lucide-react';
import { SkillAutocomplete } from '@/components/skills/SkillAutocomplete';

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
  // Track skills that were in the original extracted resume
  const [extractedSkills] = useState<Set<string>>(
    () => new Set((initialProfile.skills || []).map(s => s.toLowerCase().trim()))
  );
  // Track skills added by user during editing
  const [userAddedSkills, setUserAddedSkills] = useState<Set<string>>(() => {
    const existing = new Set<string>();
    if (initialProfile.skillInventory) {
      initialProfile.skillInventory.forEach(item => {
        if (item.origin === 'user_added') {
          existing.add(item.name.toLowerCase().trim());
        }
      });
    }
    return existing;
  });
  const [draftSyncNotice, setDraftSyncNotice] = useState<string | null>(null);

  const handleAddSkill = (skillName: string) => {
    const cleanSkill = skillName.trim();
    if (!cleanSkill) return;

    // Check duplicate case-insensitively
    if (profile.skills.some(s => s.toLowerCase().trim() === cleanSkill.toLowerCase())) {
      return;
    }

    const updatedSkills = [...profile.skills, cleanSkill];
    const nextUserAdded = new Set(userAddedSkills);
    nextUserAdded.add(cleanSkill.toLowerCase());
    setUserAddedSkills(nextUserAdded);

    // Build skillInventory tracking origins
    const updatedInventory: ProfileSkillItem[] = updatedSkills.map(name => {
      const isExtracted = extractedSkills.has(name.toLowerCase().trim());
      return {
        name,
        origin: isExtracted ? 'extracted' : 'user_added',
        confirmed: true
      };
    });

    setProfile({
      ...profile,
      skills: updatedSkills,
      skillInventory: updatedInventory
    });

    setDraftSyncNotice(`Added "${cleanSkill}" to profile inventory. You can optionally draft it into your resume text below.`);
    setTimeout(() => setDraftSyncNotice(null), 4000);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter(
      s => s.toLowerCase().trim() !== skillToRemove.toLowerCase().trim()
    );
    const nextUserAdded = new Set(userAddedSkills);
    nextUserAdded.delete(skillToRemove.toLowerCase().trim());
    setUserAddedSkills(nextUserAdded);

    const updatedInventory = updatedSkills.map(name => ({
      name,
      origin: extractedSkills.has(name.toLowerCase().trim()) ? ('extracted' as const) : ('user_added' as const),
      confirmed: true
    }));

    setProfile({
      ...profile,
      skills: updatedSkills,
      skillInventory: updatedInventory
    });
  };

  const handleDraftSkillIntoSummary = (skillName: string) => {
    const currentSummary = profile.summary || '';
    if (currentSummary.toLowerCase().includes(skillName.toLowerCase())) {
      setDraftSyncNotice(`"${skillName}" is already present in your summary.`);
      setTimeout(() => setDraftSyncNotice(null), 3000);
      return;
    }

    const updatedSummary = currentSummary 
      ? `${currentSummary.trim()} Skilled in ${skillName}.`
      : `Skilled in ${skillName}.`;

    setProfile({
      ...profile,
      summary: updatedSummary,
      rawText: `${profile.rawText}\nTechnical Skills: ${skillName}`
    });

    setDraftSyncNotice(`Incorporated "${skillName}" into resume summary and draft document text.`);
    setTimeout(() => setDraftSyncNotice(null), 3500);
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets[bulletIndex] = val;
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleAddBullet = (expIndex: number) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets.push('Contributed to system design and reliable technical execution.');
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const updatedExperiences = [...profile.experiences];
    updatedExperiences[expIndex].bullets.splice(bulletIndex, 1);
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Project / Hackathon Build',
      description: 'Engineered a system handling core data flow with clean API contracts.',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      link: 'https://github.com/username/project'
    };
    setProfile({ ...profile, projects: [...profile.projects, newProj] });
  };

  const handleUpdateProject = (pIdx: number, field: string, val: string | string[]) => {
    const updated = [...profile.projects];
    updated[pIdx] = { ...updated[pIdx], [field]: val };
    setProfile({ ...profile, projects: updated });
  };

  const handleDeleteProject = (pIdx: number) => {
    const updated = [...profile.projects];
    updated.splice(pIdx, 1);
    setProfile({ ...profile, projects: updated });
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Technical University',
      year: '2024',
      score: '8.2 CGPA'
    };
    setProfile({ ...profile, education: [...profile.education, newEdu] });
  };

  const handleUpdateEducation = (eIdx: number, field: string, val: string) => {
    const updated = [...profile.education];
    updated[eIdx] = { ...updated[eIdx], [field]: val };
    setProfile({ ...profile, education: updated });
  };

  const handleDeleteEducation = (eIdx: number) => {
    const updated = [...profile.education];
    updated.splice(eIdx, 1);
    setProfile({ ...profile, education: updated });
  };

  const renderConfidenceBadge = (sectionKey: string, score: number) => {
    const isLow = score < 70;
    return (
      <div 
        title="Automated parser extraction confidence on uploaded document (does not reflect candidate skill proficiency)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
          isLow 
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        }`}
      >
        {isLow ? <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
        <span>Parser Extraction Fidelity: {score}%</span>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Step Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Review extracted information
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify and correct any field-level parsing details before generating your resume report.
        </p>
      </div>

      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Phone</label>
            <input
              type="text"
              value={profile.phone ? `${profile.phone} | ${profile.location}` : profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422]"
            />
          </div>
        </div>

        {/* Headline */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Headline / Current Title</label>
            {renderConfidenceBadge('headline', profile.sectionConfidence.headline || 85)}
          </div>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422]"
          />
        </div>

        {/* Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Summary Section</label>
            {renderConfidenceBadge('summary', profile.sectionConfidence.summary || 85)}
          </div>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422] leading-relaxed"
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Skills Inventory ({profile.skills.length})
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Start typing to find a skill, or enter a custom skill. Only add skills you genuinely possess.
              </p>
            </div>
            {renderConfidenceBadge('skills', profile.sectionConfidence.skills || 75)}
          </div>

          {/* Skill chips with origin tracking */}
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
            {profile.skills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No skills in inventory yet. Use the autocomplete below to add skills.</span>
            ) : (
              profile.skills.map((skill) => {
                const isUserAdded = userAddedSkills.has(skill.toLowerCase().trim());
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-colors shadow-2xs ${
                      isUserAdded
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-[#142236] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-medium">{skill}</span>
                    <span 
                      className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider ${
                        isUserAdded
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                      title={isUserAdded ? 'Manually added by user to profile inventory' : 'Extracted from uploaded resume text'}
                    >
                      {isUserAdded ? 'User Added' : 'From Resume'}
                    </span>

                    {/* Optional draft into resume button for user-added skills */}
                    {isUserAdded && (
                      <button
                        type="button"
                        onClick={() => handleDraftSkillIntoSummary(skill)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-[10px] font-semibold underline cursor-pointer ml-0.5"
                        title="Incorporate this confirmed skill into your draft resume summary text"
                      >
                        +Draft
                      </button>
                    )}

                    {/* Accessible Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove skill ${skill}`}
                      title={`Remove ${skill}`}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs cursor-pointer ml-0.5 p-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                );
              })
            )}
          </div>

          {/* Autocomplete Input */}
          <div className="pt-1">
            <SkillAutocomplete
              existingSkills={profile.skills}
              onAddSkill={handleAddSkill}
              targetRoleId={profile.targetRoleId}
              placeholder="Search skill (e.g. py → Python, PyTorch; jav → Java; rea → React)..."
            />
          </div>

          {/* Sync Notice Alert */}
          {draftSyncNotice && (
            <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2 animate-in fade-in">
              <FileText className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>{draftSyncNotice}</span>
            </div>
          )}
        </div>

        {/* Experiences & Bullets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Experience Entries & Bullets</label>
            {renderConfidenceBadge('experience', profile.sectionConfidence.experience || 80)}
          </div>
          <div className="space-y-3">
            {profile.experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <span>{exp.title} — {exp.company}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="space-y-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 text-xs mt-1.5">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                        className="flex-1 bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(expIdx, bIdx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer mt-1"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddBullet(expIdx)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add bullet to this role</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Education & Academic Credentials ({profile.education.length})
            </label>
            {renderConfidenceBadge('education', profile.sectionConfidence?.education || 85)}
          </div>
          <div className="space-y-3">
            {profile.education.map((edu, eduIdx) => (
              <div key={edu.id || eduIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Degree & College #{eduIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(eduIdx)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    title="Delete education entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(eduIdx, 'degree', e.target.value)}
                    placeholder="Degree (e.g. B.Tech in Computer Science)"
                    className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(eduIdx, 'institution', e.target.value)}
                    placeholder="Institution / University"
                    className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(eduIdx, 'year', e.target.value)}
                    placeholder="Graduation Year (e.g. 2024)"
                    className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={edu.score || ''}
                    onChange={(e) => handleUpdateEducation(eduIdx, 'score', e.target.value)}
                    placeholder="Score / CGPA (e.g. 8.4 CGPA or 78%)"
                    className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer pt-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Education Entry</span>
            </button>
          </div>
        </div>

        {/* Technical & Academic Projects (Crucial for Freshers) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Projects, Hackathons & Open Source ({profile.projects.length})
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">Vital proof-of-work for freshers</span>
            </div>
            {renderConfidenceBadge('projects', profile.sectionConfidence?.projects || 80)}
          </div>
          <div className="space-y-3">
            {profile.projects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Project #{pIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(pIdx)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 font-semibold"
                    />
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => handleUpdateProject(pIdx, 'link', e.target.value)}
                      placeholder="GitHub / Live Demo URL"
                      className="bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(pIdx, 'description', e.target.value)}
                    placeholder="Problem solved, architecture, and candidate contribution..."
                    className="w-full bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={proj.technologies?.join(', ') || ''}
                    onChange={(e) => handleUpdateProject(pIdx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Technologies (comma-separated: e.g. React, Node.js, PostgreSQL, Docker)"
                    className="w-full bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProject}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer pt-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Project / Proof of Work</span>
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (profile.skills.length === 0 && profile.experiences.length === 0 && !profile.summary) {
                alert('Please ensure your resume contains at least some skills, experience bullets, or summary text before analyzing.');
                return;
              }
              onConfirmAndAnalyze(profile);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Analyze My Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
