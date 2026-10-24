'use client';

import React from 'react';
import { 
  Eye, 
  BarChart3, 
  Search, 
  Sparkles, 
  Type, 
  Users, 
  Target, 
  CheckSquare2 
} from 'lucide-react';

export const ProofSection: React.FC = () => {
  const capabilities = [
    {
      icon: Eye,
      title: '6-Second Recruiter Simulation',
      desc: 'Heatmap visualization showing exactly what recruiter eyes track in the critical first glance.',
      badge: 'Attention Map'
    },
    {
      icon: BarChart3,
      title: '10-Component Scoring Engine',
      desc: 'Deterministic 100-point audit. Every point loss explains the recruiter barrier, rule ID, and exact fix.',
      badge: 'Zero Black Box'
    },
    {
      icon: Search,
      title: 'Indian Keyword Volume Matrix',
      desc: 'Compares your profile against 800+ skills and reveals estimated monthly recruiter search volumes.',
      badge: 'Search Ranking'
    },
    {
      icon: Sparkles,
      title: 'Deterministic Bullet Rewriter',
      desc: '3 revision variants (Safe, Metric, Impact) with zero metric hallucinations and power-verb upgrades.',
      badge: 'Zero Fabrication'
    },
    {
      icon: Type,
      title: 'Multi-Platform Headline Engine',
      desc: '5 ranked variants optimized for Naukri (250c), LinkedIn (220c), and Resume (100c) bounds.',
      badge: 'CTR Booster'
    },
    {
      icon: Users,
      title: '4 Recruiter Personas Panel',
      desc: 'Evaluates your profile through Startup Founder, Enterprise TA, Agency Recruiter, and HR Screener lenses.',
      badge: 'Multi-Perspective'
    },
    {
      icon: Target,
      title: 'Job Fit & Rejection Predictor',
      desc: 'Matches any pasted JD across 5 dimensions and surfaces the 48-hour golden application window.',
      badge: 'Rejection Shield'
    },
    {
      icon: CheckSquare2,
      title: 'Points-Per-Minute Action Plan',
      desc: 'Prioritized checklist ranked by score ROI. Finish the "Today" sprint in under 45 minutes.',
      badge: 'Actionable ROI'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          Engineered for Indian Tech Recruitment
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Every rule, benchmark, and score formula is calibrated against the real search mechanics of Indian job boards.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl bg-[rgba(26,49,69,0.35)] border border-white/10 hover:border-[#FF7582]/40 transition-all duration-200 backdrop-blur-md space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,117,130,0.1)] border border-[rgba(255,117,130,0.2)] flex items-center justify-center text-[#FF7582] group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                  {cap.badge}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                  {cap.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
