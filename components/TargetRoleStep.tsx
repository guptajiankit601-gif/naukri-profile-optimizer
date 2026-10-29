'use client';

import React, { useState } from 'react';
import { ROLES, CITIES_LIST, RoleDefinition } from '@/data/roles';
import { ExperienceBand } from '@/types';
import { ArrowRight, ArrowLeft, Search, CheckCircle2, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface TargetRoleStepProps {
  initialRoleId: string;
  initialBand: ExperienceBand;
  initialCities: string[];
  initialSalary: number;
  onConfirm: (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
    jobDescription?: string;
  }) => void;
  onBack: () => void;
}

const QUICK_ROLES = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Data Engineer',
  'DevOps Engineer',
  'Product Manager',
  'QA / SDET',
  'Android Developer',
  'Data Scientist',
  'System Architect'
];

export const TargetRoleStep: React.FC<TargetRoleStepProps> = ({
  initialRoleId,
  initialBand,
  initialCities,
  initialSalary,
  onConfirm,
  onBack
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoleId || ROLES[0].id);
  const [selectedRoleName, setSelectedRoleName] = useState(
    ROLES.find(r => r.id === initialRoleId)?.name || 'Full Stack Developer'
  );
  const [selectedBand, setSelectedBand] = useState<ExperienceBand>(initialBand || '3-5');
  const [selectedCities, setSelectedCities] = useState<string[]>(
    initialCities.length ? initialCities : ['Bangalore / Bengaluru', 'Pune']
  );
  const [expectedSalary, setExpectedSalary] = useState<number>(initialSalary || 16);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showAllRoles, setShowAllRoles] = useState(false);

  const handleCityToggle = (cityName: string) => {
    if (selectedCities.includes(cityName)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== cityName));
      }
    } else {
      setSelectedCities([...selectedCities, cityName]);
    }
  };

  const handleSelectQuickRole = (roleTitle: string) => {
    setSelectedRoleName(roleTitle);
    const matched = ROLES.find(r => r.name.toLowerCase() === roleTitle.toLowerCase());
    if (matched) {
      setSelectedRoleId(matched.id);
    }
  };

  const filteredRoles = ROLES.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.topSearchKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const roleCategories = Array.from(new Set(ROLES.map(r => r.category)));

  const handleContinueWithRole = () => {
    onConfirm({
      targetRoleId: selectedRoleId,
      targetRole: selectedRoleName,
      experienceBand: selectedBand,
      targetCities: selectedCities,
      expectedSalaryLakhs: expectedSalary,
      jobDescription: jobDescription.trim() || undefined
    });
  };

  const handleSkipTargetRole = () => {
    onConfirm({
      targetRoleId: 'software-engineer',
      targetRole: 'Software Engineer',
      experienceBand: selectedBand,
      targetCities: ['All India / Remote'],
      expectedSalaryLakhs: expectedSalary
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          What role are you targeting?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Target role and optional job description calibrate keyword gaps and recruiter search filters.
        </p>
      </div>

      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* 1. Quick Target Role Chips & Search */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Target Title:
          </label>

          {/* Quick Selection Chips */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ROLES.map((rTitle) => {
              const isSelected = selectedRoleName.toLowerCase() === rTitle.toLowerCase();
              return (
                <button
                  key={rTitle}
                  type="button"
                  onClick={() => handleSelectQuickRole(rTitle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {rTitle}
                </button>
              );
            })}
          </div>

          {/* Toggle or Search deeper */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowAllRoles(!showAllRoles)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{showAllRoles ? 'Hide catalog view' : 'Browse full role catalog & search'}</span>
              {showAllRoles ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">Selected: <strong className="text-slate-800 dark:text-slate-200">{selectedRoleName}</strong></span>
          </div>

          {showAllRoles && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search roles or technologies..."
                  className="w-full bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {roleCategories.map(cat => {
                  const catRoles = filteredRoles.filter(r => r.category === cat);
                  if (catRoles.length === 0) return null;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{cat}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {catRoles.map((role: RoleDefinition) => {
                          const isSelected = selectedRoleId === role.id;
                          return (
                            <div
                              key={role.id}
                              onClick={() => {
                                setSelectedRoleId(role.id);
                                setSelectedRoleName(role.name);
                              }}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 shadow-xs'
                                  : 'bg-white dark:bg-[#142236] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
                                <span>{role.name}</span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{role.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Experience Band */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Experience Level:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['Fresher', '1-3', '3-5', '5-8', '8+'] as ExperienceBand[]).map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setSelectedBand(band)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                  selectedBand === band
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div>{band === 'Fresher' ? 'Fresher' : `${band} Yrs`}</div>
                <div className={`text-[10px] ${selectedBand === band ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {band === 'Fresher' ? 'Entry Level' : band === '1-3' ? 'Junior' : band === '3-5' ? 'Mid-level' : band === '5-8' ? 'Senior' : 'Lead / Staff'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Optional Job Description Paste */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowJdInput(!showJdInput)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Target Job Description (Optional)</span>
              {showJdInput ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Enables Job Match %</span>
          </div>

          {showJdInput && (
            <div className="space-y-2 animate-in fade-in duration-100">
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description or requirements here to calculate your JD Match Score..."
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422] resize-y leading-relaxed"
              />
              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
                <span>We compare hard skills, requirements, and responsibilities.</span>
                <span>{jobDescription.length} chars</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Target Cities */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Locations
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{selectedCities.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CITIES_LIST.map((c) => {
              const active = selectedCities.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCityToggle(c.name)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-white text-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Expected Salary */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Expected Compensation
            </label>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              ₹{expectedSalary} LPA
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={50}
            step={1}
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>₹3L (Entry)</span>
            <span>Target Benchmark</span>
            <span>₹50L+</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSkipTargetRole}
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer transition-colors"
            >
              Continue without target role
            </button>

            <button
              type="button"
              onClick={handleContinueWithRole}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Review Extracted Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
