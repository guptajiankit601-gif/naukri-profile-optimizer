'use client';

import React, { useState, useEffect } from 'react';
import { ParsedProfile } from '@/types';
import { 
  TrackedApplication, 
  getClientApplications, 
  saveClientApplication, 
  deleteClientApplication 
} from '@/lib/applications/store';
import { matchJobDescription, SAMPLE_JOBS_BY_ROLE } from '@/services/jd-matcher';
import { 
  Briefcase, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Mail, 
  FileText, 
  MessageSquare,
  HelpCircle,
  ListOrdered,
  Check, 
  Target,
  ExternalLink
} from 'lucide-react';

interface JobApplicationStudioProps {
  profile: ParsedProfile;
}

type DocumentTab = 'bullets' | 'coverLetter' | 'email' | 'inmail' | 'interview';

export const JobApplicationStudioView: React.FC<JobApplicationStudioProps> = ({ profile }) => {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<DocumentTab>('bullets');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states for active or new application
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState(profile.targetRole);
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<TrackedApplication['status']>('draft');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  // 5 Tailored Documents
  const [tailoredBullets, setTailoredBullets] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [outreachEmail, setOutreachEmail] = useState('');
  const [recruiterMessage, setRecruiterMessage] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number>(0);

  useEffect(() => {
    const loaded = getClientApplications();
    setApplications(loaded);
    if (loaded.length > 0) {
      loadApplicationIntoForm(loaded[0]);
    } else {
      // Preload with role sample
      const sample = SAMPLE_JOBS_BY_ROLE[profile.targetRoleId]?.[0] || {
        company: 'Swiggy',
        title: profile.targetRole,
        description: 'Looking for a talented engineer proficient in ' + profile.skills.slice(0, 4).join(', ') + ' with strong distributed systems design and production execution.'
      };
      setCompany(sample.company);
      setRoleTitle(sample.title);
      setJobDescription(sample.description);
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast(`Copied ${key} to clipboard!`);
  };

  const loadApplicationIntoForm = (app: TrackedApplication) => {
    setActiveAppId(app.id);
    setIsCreatingNew(false);
    setCompany(app.company);
    setRoleTitle(app.roleTitle);
    setJobDescription(app.jobDescription || '');
    setJobUrl(app.jobUrl || '');
    setStatus(app.status);
    setFollowUpDate(app.followUpDate || '');
    setNotes(app.notes || '');
    setTailoredBullets(app.tailoredBullets || profile.experiences[0]?.bullets.slice(0, 3) || []);
    setCoverLetter(app.coverLetter || '');
    setOutreachEmail(app.outreachEmail || '');
    setRecruiterMessage(app.recruiterMessage || '');
    setInterviewQuestions(app.interviewQuestions || []);
    setMatchScore(app.matchScore || 78);
  };

  const handleStartNewApplication = () => {
    setIsCreatingNew(true);
    setActiveAppId(null);
    setCompany('');
    setRoleTitle(profile.targetRole);
    setJobDescription('');
    setJobUrl('');
    setStatus('draft');
    setFollowUpDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setNotes('');
    setTailoredBullets(profile.experiences[0]?.bullets.slice(0, 3) || []);
    setCoverLetter('');
    setOutreachEmail('');
    setRecruiterMessage('');
    setInterviewQuestions([]);
    setMatchScore(0);
  };

  const handleGenerateTailoredPackage = () => {
    if (!company.trim() || !jobDescription.trim()) {
      showToast('Please specify Company and Job Description first.');
      return;
    }

    // Run real JD matcher
    const match = matchJobDescription(profile, jobDescription, company, roleTitle);
    setMatchScore(match.matchScore);

    const keySkills = profile.skills.slice(0, 4).join(', ');
    const matchedList = match.matchedSkills.length > 0 ? match.matchedSkills.slice(0, 4).join(', ') : keySkills;
    const topExp = profile.experiences[0];
    const topCompany = topExp?.company || 'Enterprise Services';

    // 1. Tailored Bullets (Derived from candidate's genuine experiences)
    const generatedBullets = (profile.experiences[0]?.bullets || []).slice(0, 3).map((b, i) => {
      if (i === 0 && match.matchedSkills[0]) {
        return `Architected and deployed scalable solutions leveraging ${match.matchedSkills[0]} and clean system design principles.`;
      }
      return b;
    });
    if (generatedBullets.length === 0) {
      generatedBullets.push(
        `Engineered production modules utilizing ${keySkills}, emphasizing reliability and performance optimization.`,
        `Collaborated in agile cross-functional sprints, contributing to robust testing, code reviews, and CI/CD pipelines.`
      );
    }

    // 2. Tailored Cover Letter
    const generatedLetter = `Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${roleTitle} opening. With hands-on engineering experience at ${topCompany} and deep proficiency across ${matchedList}, I have focused my career on delivering maintainable, high-availability software.

In my recent engineering deliverables:
• Applied ${matchedList} to implement robust services aligned directly with modern development best practices.
• Partnered closely with product and QA stakeholders to optimize code quality and sprint cycle times.

Your job description highlights the need for proven capability in ${matchedList}. My verified technical background and engineering discipline closely mirror your operational requirements.

I welcome the opportunity to discuss how my technical expertise can support ${company}'s goals.

Sincerely,
${profile.name}
${profile.email} | ${profile.location}`;

    // 3. Tailored Application Email
    const generatedEmail = `Subject: Application: ${roleTitle} — ${profile.name}

Hi Hiring Team at ${company},

I am writing to apply for the ${roleTitle} position at ${company}. 

As a ${profile.experienceBand} professional with direct production expertise in ${matchedList}, I have built reliable systems at ${topCompany} and would love to contribute to ${company}'s engineering initiatives.

Attached is my verified resume tailored specifically to ${company}'s requirements. I look forward to the possibility of discussing this role with your team.

Best regards,
${profile.name}
${profile.phone ? `${profile.phone} | ` : ''}${profile.email}`;

    // 4. Recruiter InMail / Short Connection Message (< 300 chars for LinkedIn)
    const generatedInMail = `Hi [Recruiter Name], I saw ${company}'s opening for ${roleTitle}. With production experience in ${matchedList} at ${topCompany}, my background strongly aligns with your requirements. Would love to connect and share my resume! — ${profile.name}`;

    // 5. Role-Specific Interview Questions & Evidence Talking Points
    const generatedQuestions = [
      `1. Architecture & Design: How have you implemented ${match.matchedSkills[0] || 'core technologies'} in production environments?
• Talking Point: Discuss specific architectural constraints at ${topCompany}, emphasizing data integrity and design decisions.`,
      `2. Problem Solving: Describe a challenging bug or performance bottleneck you resolved when working with ${match.matchedSkills[1] || profile.skills[0] || 'your primary stack'}.
• Talking Point: Use the STAR framework — focus on diagnostic profiling, root-cause identification, and the final verified outcome.`,
      `3. Team Collaboration: How do you handle disagreements on technical trade-offs during sprint planning at ${company}?
• Talking Point: Highlight constructive peer code reviews, clear documentation, and alignment with business deadlines.`
    ];

    setTailoredBullets(generatedBullets);
    setCoverLetter(generatedLetter);
    setOutreachEmail(generatedEmail);
    setRecruiterMessage(generatedInMail);
    setInterviewQuestions(generatedQuestions);

    showToast('Generated 5 tailored application documents!');
  };

  const handleSaveApplication = () => {
    if (!company.trim() || !roleTitle.trim()) {
      showToast('Company and Role Title are required.');
      return;
    }

    const appToSave: TrackedApplication = {
      id: activeAppId || `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      profileId: profile.name,
      company: company.trim(),
      roleTitle: roleTitle.trim(),
      jobUrl: jobUrl.trim(),
      jobDescription: jobDescription.trim(),
      status,
      matchScore: matchScore || 75,
      tailoredBullets,
      coverLetter,
      outreachEmail,
      recruiterMessage,
      interviewQuestions,
      followUpDate,
      notes,
      appliedAt: status === 'applied' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = saveClientApplication(appToSave);
    setApplications(updatedList);
    setActiveAppId(appToSave.id);
    setIsCreatingNew(false);
    showToast(`Saved application for ${company}!`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteClientApplication(id);
    setApplications(updated);
    if (activeAppId === id) {
      if (updated.length > 0) {
        loadApplicationIntoForm(updated[0]);
      } else {
        handleStartNewApplication();
      }
    }
    showToast('Deleted application record.');
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Job-Specific Isolation Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Job Application Pack & Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Tailor a complete 5-document application pack for any target job. All customizations are stored separately and never modify your base master resume.
          </p>
        </div>

        <button
          onClick={handleStartNewApplication}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Saved Applications ({applications.length})
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-xs">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">No applications saved yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click &ldquo;New Application&rdquo; to tailor your application for a specific role.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => loadApplicationIntoForm(app)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeAppId === app.id
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs'
                      : 'bg-white dark:bg-[#142236] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{app.company}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{app.roleTitle}</div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                        {app.matchScore}% Match
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(app.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Tailoring Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Form Fields: Company, Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Company *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Swiggy, Razorpay, Microsoft"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Title *</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Job Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Job Description *</label>
                <span className="text-[11px] text-slate-400">Used for genuine skill matching & document tailoring</span>
              </div>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description, required qualifications, and key responsibilities here..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Controls: Status, Date, Generate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TrackedApplication['status'])}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                >
                  <option value="draft">Draft (Preparing)</option>
                  <option value="applied">Applied (Submitted)</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected / Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateTailoredPackage}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Application Pack</span>
                </button>
              </div>
            </div>

            {/* Alignment Match Badge */}
            {matchScore > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Job Match Alignment: <span className="text-emerald-700 dark:text-emerald-300 font-mono">{matchScore}%</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Calculated against {profile.skills.length} verified candidate skills
                </span>
              </div>
            )}

            {/* Document Tabs Switcher (5 Documents) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveDocTab('bullets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeDocTab === 'bullets'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Tailored Bullets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('coverLetter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeDocTab === 'coverLetter'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cover Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeDocTab === 'email'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Application Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('inmail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeDocTab === 'inmail'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Recruiter InMail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('interview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeDocTab === 'interview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Interview Prep Q&A</span>
                </button>
              </div>

              {/* Document 1: Tailored Bullets */}
              {activeDocTab === 'bullets' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Tailored Bullets for {company || 'Target Role'}
                    </label>
                    <button
                      onClick={() => copyText(tailoredBullets.join('\n• '), 'Bullets')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedKey === 'Bullets' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'Bullets' ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tailoredBullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-blue-600 font-bold text-xs mt-2 shrink-0">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...tailoredBullets];
                            updated[idx] = e.target.value;
                            setTailoredBullets(updated);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-sans leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document 2: Cover Letter */}
              {activeDocTab === 'coverLetter' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Tailored Cover Letter
                    </label>
                    <button
                      onClick={() => copyText(coverLetter, 'Cover Letter')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedKey === 'Cover Letter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'Cover Letter' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Click 'Generate Application Pack' above to generate a tailored cover letter..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-sans leading-relaxed"
                  />
                </div>
              )}

              {/* Document 3: Application Email */}
              {activeDocTab === 'email' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Direct Application Email
                    </label>
                    <button
                      onClick={() => copyText(outreachEmail, 'Outreach Email')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedKey === 'Outreach Email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'Outreach Email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={outreachEmail}
                    onChange={(e) => setOutreachEmail(e.target.value)}
                    placeholder="Click 'Generate Application Pack' to produce a formatted email..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-sans leading-relaxed"
                  />
                </div>
              )}

              {/* Document 4: Recruiter InMail */}
              {activeDocTab === 'inmail' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        LinkedIn Recruiter InMail / Short Note
                      </label>
                      <span className="text-[10px] text-slate-400 ml-2">
                        {recruiterMessage.length} characters (ideal: &lt; 300)
                      </span>
                    </div>
                    <button
                      onClick={() => copyText(recruiterMessage, 'InMail')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedKey === 'InMail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'InMail' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={recruiterMessage}
                    onChange={(e) => setRecruiterMessage(e.target.value)}
                    placeholder="Concise message for recruiter outreach..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-sans leading-relaxed"
                  />
                </div>
              )}

              {/* Document 5: Interview Prep Q&A */}
              {activeDocTab === 'interview' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Grounded Interview Questions & Talking Points
                    </label>
                    <button
                      onClick={() => copyText(interviewQuestions.join('\n\n'), 'Interview Prep')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedKey === 'Interview Prep' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'Interview Prep' ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                  {interviewQuestions.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                      Click &ldquo;Generate Application Pack&rdquo; to analyze the job description and create grounded interview questions.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {interviewQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                          <textarea
                            rows={3}
                            value={q}
                            onChange={(e) => {
                              const updated = [...interviewQuestions];
                              updated[idx] = e.target.value;
                              setInterviewQuestions(updated);
                            }}
                            className="w-full bg-transparent border-0 p-0 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden font-sans leading-relaxed resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Save Application Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveApplication}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Application Package</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
