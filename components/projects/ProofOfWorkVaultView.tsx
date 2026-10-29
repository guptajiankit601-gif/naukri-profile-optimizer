'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  Plus, 
  ExternalLink, 
  GitBranch, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Code2, 
  Rocket, 
  ArrowRight, 
  X, 
  Star, 
  FileText, 
  Check,
  ShieldCheck,
  Award,
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import { ParsedProfile, ProjectItem, ProjectType } from '@/types';

interface ProofOfWorkVaultViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile, note?: string) => void;
}

const PROJECT_TYPE_OPTIONS: ProjectType[] = [
  'Academic',
  'Personal',
  'Internship',
  'Hackathon',
  'Open Source'
];

export const ProofOfWorkVaultView: React.FC<ProofOfWorkVaultViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>(profile.projects || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Personal');
  const [timeline, setTimeline] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [metrics, setMetrics] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isValidUrl = (urlStr: string): boolean => {
    if (!urlStr.trim()) return true;
    try {
      const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://') 
        ? urlStr 
        : `https://${urlStr}`;
      new URL(formatted);
      return formatted.includes('.');
    } catch {
      return false;
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setRole('');
    setProjectType('Personal');
    setTimeline('');
    setTechnologies('');
    setLink('');
    setRepoLink('');
    setMetrics('');
    setUrlError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setRole(proj.role || '');
    setProjectType(proj.projectType || 'Personal');
    setTimeline(proj.timeline || '');
    setTechnologies((proj.technologies || []).join(', '));
    setLink(proj.link || '');
    setRepoLink(proj.repoLink || '');
    setMetrics(proj.metrics || '');
    setUrlError(null);
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (!title.trim() || !description.trim()) {
      showToast('Project title and description are required.');
      return;
    }

    if (link.trim() && !isValidUrl(link.trim())) {
      setUrlError('Please enter a valid Live Demo URL (e.g. https://myproject.vercel.app)');
      return;
    }

    if (repoLink.trim() && !isValidUrl(repoLink.trim())) {
      setUrlError('Please enter a valid Source Code URL (e.g. https://github.com/username/project)');
      return;
    }

    const techArray = technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectData: ProjectItem = {
      id: editingProject?.id || `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      role: role.trim() || undefined,
      projectType,
      timeline: timeline.trim() || undefined,
      technologies: techArray.length > 0 ? techArray : ['Web Development'],
      link: link.trim() || undefined,
      repoLink: repoLink.trim() || undefined,
      metrics: metrics.trim() || undefined
    };

    let updatedList: ProjectItem[];
    if (editingProject) {
      updatedList = projects.map(p => p.id === editingProject.id ? projectData : p);
      showToast(`Updated project: ${projectData.title}`);
    } else {
      updatedList = [...projects, projectData];
      showToast(`Added new project: ${projectData.title}`);
    }

    setProjects(updatedList);
    onUpdateProfile(
      {
        ...profile,
        projects: updatedList
      },
      editingProject ? `Updated project "${projectData.title}"` : `Added project "${projectData.title}" to Proof of Work Vault`
    );

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, title: projTitle } = deleteTarget;
    const updatedList = projects.filter(p => p.id !== id);
    setProjects(updatedList);
    onUpdateProfile(
      {
        ...profile,
        projects: updatedList
      },
      `Removed project "${projTitle}"`
    );
    setDeleteTarget(null);
    showToast(`Deleted project: ${projTitle}`);
  };

  const handleCopyStarMethod = (proj: ProjectItem) => {
    const starText = `[STAR Technical Summary: ${proj.title}]
• SITUATION & TASK: ${proj.description}
• ACTION & DIRECT CONTRIBUTION: ${proj.role || 'Architected and built core functionality'} using ${(proj.technologies || []).join(', ')}.
• RESULT & OUTCOMES: ${proj.metrics || 'Successfully engineered and deployed application'}${proj.link ? ` (Live Demo: ${proj.link})` : ''}${proj.repoLink ? ` (GitHub: ${proj.repoLink})` : ''}`;

    navigator.clipboard.writeText(starText);
    setCopiedId(proj.id);
    showToast('Copied STAR method summary to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyResumeBullet = (proj: ProjectItem) => {
    const tech = (proj.technologies || []).slice(0, 4).join(', ');
    const bullet = `Architected and built ${proj.title} utilizing ${tech}; ${proj.description.replace(/\.$/, '')}${proj.metrics ? `, delivering ${proj.metrics}` : ''}.`;
    
    navigator.clipboard.writeText(bullet);
    setCopiedId(`${proj.id}-bullet`);
    showToast('Copied formatted resume bullet!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-[#142236] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-semibold mb-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Evidence-Based Portfolio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Proof of Work Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Document your academic capstones, hackathons, personal builds, and open-source contributions. Every project is recorded with problem statements, your personal contribution, tech stack, and verifiable links.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Value Prop Banner for Freshers & Early Career */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/60 dark:from-slate-900/60 dark:via-[#132238] dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Zero Fabrication Policy</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">All bullets and metrics originate from real projects, never synthetic hallucinations.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">STAR Method Format</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Export structured Situation, Task, Action, and Result talking points for technical interviews.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Available for Resume</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Projects saved here are available to add to your resume draft, Complete Profile Audit, and export.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Project List / Empty State */}
      {projects.length === 0 ? (
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Rocket className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No Projects in Vault Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For students and early career candidates, technical projects contribute up to 19 points in resume quality evaluation. Add your first project to boost your score.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                {/* Header: Title, Type, and Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                        #{idx + 1}
                      </span>
                      {proj.projectType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{proj.projectType}</span>
                        </span>
                      )}
                      {proj.timeline && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{proj.timeline}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 pt-0.5">
                      {proj.title}
                    </h3>
                    {proj.role && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block">
                        Direct Role: {proj.role}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit Project"
                      aria-label={`Edit project ${proj.title}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: proj.id, title: proj.title })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Delete Project"
                      aria-label={`Delete project ${proj.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Problem & Contribution */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Problem Solved / System Architecture:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.metrics && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Documented Metrics & Outcomes:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-xs mt-0.5">
                        {proj.metrics}
                      </p>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Technologies Used:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies && proj.technologies.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Public Links */}
                  {(proj.link || proj.repoLink) && (
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {proj.link && (
                        <a
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demonstration</span>
                        </a>
                      )}
                      {proj.repoLink && (
                        <a
                          href={proj.repoLink.startsWith('http') ? proj.repoLink : `https://${proj.repoLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 dark:text-slate-300 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Source Repository</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Copy STAR Summary & Copy Resume Bullet */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyStarMethod(proj)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedId === proj.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied STAR</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy STAR Summary</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyResumeBullet(proj)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedId === `${proj.id}-bullet` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied Bullet</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>Copy ATS Bullet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {urlError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{urlError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Queue & Telemetry Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {PROJECT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>{type} Project</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Timeline / Dates (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2024 - Apr 2024"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Specific Role (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Backend Engineer / Solo Creator"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tech Stack (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React, TypeScript, Node.js, Redis, Docker"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Problem Solved & Key Functionality *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what the system does, the business or technical problem it solves, and how you architected it."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Measurable Impact or Verifiable Outcome (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handled 5,000 req/sec, cut latency by 35%, 150+ GitHub stars"
                  value={metrics}
                  onChange={(e) => setMetrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://myproject.vercel.app"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    GitHub / Source Code URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username/project"
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingProject ? 'Save Changes' : 'Add to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Delete Project from Vault?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-900 dark:text-slate-100">&ldquo;{deleteTarget.title}&rdquo;</strong>? This will remove it from your Proof of Work Vault and active profile.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
