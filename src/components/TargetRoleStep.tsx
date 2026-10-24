import React, { useState } from 'react';
import { ROLES, CITIES_LIST, RoleDefinition } from '../data/roles';
import { ExperienceBand } from '../types';
import { Briefcase, MapPin, IndianRupee, ArrowRight, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';

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
  }) => void;
  onBack: () => void;
}

export const TargetRoleStep: React.FC<TargetRoleStepProps> = ({
  initialRoleId,
  initialBand,
  initialCities,
  initialSalary,
  onConfirm,
  onBack
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoleId || ROLES[0].id);
  const [selectedBand, setSelectedBand] = useState<ExperienceBand>(initialBand || '3-5');
  const [selectedCities, setSelectedCities] = useState<string[]>(initialCities.length ? initialCities : ['Bangalore / Bengaluru', 'Pune']);
  const [expectedSalary, setExpectedSalary] = useState<number>(initialSalary || 16);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];

  const handleCityToggle = (cityName: string) => {
    if (selectedCities.includes(cityName)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== cityName));
      }
    } else {
      setSelectedCities([...selectedCities, cityName]);
    }
  };

  const filteredRoles = ROLES.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.topSearchKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const roleCategories = Array.from(new Set(ROLES.map(r => r.category)));

  const handleSubmit = () => {
    onConfirm({
      targetRoleId: selectedRole.id,
      targetRole: selectedRole.name,
      experienceBand: selectedBand,
      targetCities: selectedCities,
      expectedSalaryLakhs: expectedSalary
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#725A7A]/30 border border-[#C56C86]/30 text-xs text-[#FF7582] font-semibold mb-3">
          <span>🎯 Step 2 of 4: Target Positioning</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Target Role & Market Positioning
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Recruiters search by exact role dictionaries and location tiers. Calibrating your target ensures high-accuracy keyword scoring.
        </p>
      </div>

      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 sm:p-8 shadow-xl space-y-8">
        {/* 1. Target Role Selection */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Briefcase className="w-4 h-4 text-[#FF7582]" />
              <span>Select Target Role Dictionary (10 Available)</span>
            </label>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search roles or skills..."
                className="w-full bg-[#0F2233] border border-[#234566] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {roleCategories.map(cat => {
              const catRoles = filteredRoles.filter(r => r.category === cat);
              if (catRoles.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF7582] mb-2">{cat}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {catRoles.map((role: RoleDefinition) => {
                      const isSelected = selectedRoleId === role.id;
                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRoleId(role.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#18314A] to-[#725A7A]/40 border-[#FF7582] shadow-md shadow-[#FF7582]/10'
                              : 'bg-[#0F2233] border-[#234566] hover:border-[#C56C86]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-white">{role.name}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF7582]" />}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{role.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {role.topSearchKeywords.slice(0, 3).map(kw => (
                              <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded bg-[#13273A] text-slate-300 border border-[#234566]">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Band */}
        <div>
          <label className="block text-sm font-bold text-white mb-3">
            Your Experience Band:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(['Fresher', '1-3', '3-5', '5-8', '8+'] as ExperienceBand[]).map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setSelectedBand(band)}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  selectedBand === band
                    ? 'bg-[#FF7582] text-slate-900 border-[#FF7582] shadow-lg shadow-[#FF7582]/20'
                    : 'bg-[#0F2233] text-slate-300 border-[#234566] hover:border-[#C56C86]'
                }`}
              >
                <div>{band === 'Fresher' ? 'Fresher (0-1 yr)' : `${band} Years`}</div>
                <div className={`text-[10px] font-normal ${selectedBand === band ? 'text-slate-800' : 'text-slate-400'}`}>
                  {band === 'Fresher' ? 'Entry Level' : band === '1-3' ? 'Junior' : band === '3-5' ? 'Mid / SDE-2' : band === '5-8' ? 'Senior' : 'Staff / Lead'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Target Cities & Tiers */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <MapPin className="w-4 h-4 text-[#FF7582]" />
              <span>Target Cities (Multi-select)</span>
            </label>
            <span className="text-[11px] text-slate-400">{selectedCities.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES_LIST.map((c) => {
              const active = selectedCities.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCityToggle(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#725A7A] border-[#FF7582] text-white shadow'
                      : 'bg-[#0F2233] border-[#234566] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${c.tier === 'Tier 1' ? 'bg-[#FF7582]/20 text-[#FF7582]' : 'bg-slate-700 text-slate-300'}`}>
                    {c.tier}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Expected Salary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <IndianRupee className="w-4 h-4 text-[#FF7582]" />
              <span>Target Expected Compensation</span>
            </label>
            <span className="text-base font-extrabold text-[#FF7582]">
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
            className="w-full accent-[#FF7582] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>₹3L (Fresher)</span>
            <span className="text-slate-300">Role Market Median: ₹{selectedRole.typicalSalaryLakhs.median}L</span>
            <span>₹50L+ (Staff/Top)</span>
          </div>
        </div>

        {/* Buttons */}
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
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-bold text-xs shadow-lg shadow-[#FF7582]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>Review Extracted Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
