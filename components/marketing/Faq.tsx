'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why does Naukri tell me my profile is 100% complete, but I get zero recruiter calls?',
      a: 'Naukri’s built-in completeness meter is purely structural — it gives you 100% as long as the text boxes aren’t empty. It never analyzes keyword density, verb strength, scannability, or metric quantification. A resume that says "responsible for APIs" scores 100% on Naukri but gets skipped in 4 seconds by recruiters.'
    },
    {
      q: 'Is Naukri Profile Optimizer really 100% free with no hidden charges?',
      a: 'Yes. There are zero subscriptions, zero paid tiers, no credit card prompts, and no paywalls. All 14 diagnostic tools, rewriters, JD matchers, and ATS exports are completely free.'
    },
    {
      q: 'How does this protect my privacy and data under India’s DPDP Act 2023?',
      a: 'Your resume text is parsed in-memory. Guest sessions are stored with a 24-hour expiration and can be deleted instantly via the "Forget My Data" button. We never sell profile data or train public models on your personal documents.'
    },
    {
      q: 'Does your AI rewriter invent or hallucinate metrics?',
      a: 'Never. Our engine operates under a strict Zero-Hallucination Policy. The SAFE variant keeps 100% of your facts intact. The METRIC variant prompts you to insert your real numbers rather than guessing. If optional Gemini AI is enabled, every output passes through our automated fabrication filter to discard invented numbers.'
    },
    {
      q: 'Can I use this for LinkedIn and US / Remote jobs as well?',
      a: 'Absolutely. While tuned for the Indian tech market (TCS, Infosys, product startups, GCCs), the headline generator outputs LinkedIn-specific character bounds, and the ATS plain-text exporter is compatible with Greenhouse, Lever, and Workday.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF7582]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-[rgba(26,49,69,0.35)] border border-white/10 backdrop-blur-md overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-200 hover:text-white transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-[#FF7582]'
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
