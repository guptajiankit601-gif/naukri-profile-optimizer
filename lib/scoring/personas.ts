import { ParsedProfile } from '@/types';
import { calculateCompletenessScore } from './completeness';
import { calculateVisibilityScore } from './visibility';

export type RecruiterPersonaKey = 'startup' | 'enterprise' | 'consultancy' | 'hrScreen';

export interface PersonaEvaluation {
  personaKey: RecruiterPersonaKey;
  personaName: string;
  personaTitle: string;
  avatar: string;
  focusArea: string;
  weightedScore: number;
  verdict: 'Pass' | 'Borderline' | 'Reject';
  keyChecks: {
    check: string;
    passed: boolean;
    reason: string;
  }[];
  verdictQuote: string;
}

export function evaluatePersona(profile: ParsedProfile, personaKey: RecruiterPersonaKey): PersonaEvaluation {
  const completeness = calculateCompletenessScore(profile);
  const visibility = calculateVisibilityScore(profile);

  const bulletComponent = completeness.components.find(c => c.key === 'bulletQuality')?.score || 10;
  const skillComponent = completeness.components.find(c => c.key === 'skillStructure')?.score || 10;
  const headlineComponent = completeness.components.find(c => c.key === 'headlineClarity')?.score || 6;
  const projectComponent = completeness.components.find(c => c.key === 'projectsProof')?.score || 4;
  const eduComponent = completeness.components.find(c => c.key === 'educationDetail')?.score || 3;

  switch (personaKey) {
    case 'startup': {
      // Focus: Proof of execution, speed, measurable output
      const raw = (bulletComponent / 20) * 35 + (projectComponent / 8) * 25 + (visibility.score / 100) * 25 + (skillComponent / 15) * 15;
      const score = Math.round(raw);
      const passedBullets = bulletComponent >= 12;
      const passedProjects = projectComponent >= 5;

      return {
        personaKey: 'startup',
        personaName: 'Rohan Mehta',
        personaTitle: 'Startup Founder / VP Engineering',
        avatar: '🚀',
        focusArea: 'Ownership, real metrics, independent execution',
        weightedScore: score,
        verdict: score >= 75 ? 'Pass' : score >= 55 ? 'Borderline' : 'Reject',
        keyChecks: [
          { check: 'Quantified metrics in experience', passed: passedBullets, reason: passedBullets ? 'Shows concrete achievements.' : 'Too passive — looks like task execution, not ownership.' },
          { check: 'Demonstrated projects / independent systems', passed: passedProjects, reason: passedProjects ? 'Verified project deliverables.' : 'Needs verifiable projects or architecture depth.' }
        ],
        verdictQuote: score >= 75
          ? 'Clear bias for action and tangible outcomes. I would invite to a technical screen.'
          : 'I need to see what you actually shipped and how many users/requests you handled.'
      };
    }

    case 'enterprise': {
      // Focus: Tiered criteria, years of experience, ATS keyword compliance
      const raw = (skillComponent / 15) * 35 + (eduComponent / 5) * 20 + (completeness.overallScore / 100) * 30 + (visibility.score / 100) * 15;
      const score = Math.round(raw);
      const passedSkills = skillComponent >= 10;
      const passedEdu = eduComponent >= 4;

      return {
        personaKey: 'enterprise',
        personaName: 'Sunita Rao',
        personaTitle: 'Enterprise Talent Acquisition Lead (MNC)',
        avatar: '🏢',
        focusArea: 'Strict JD keyword match, education pedigree, stability',
        weightedScore: score,
        verdict: score >= 75 ? 'Pass' : score >= 60 ? 'Borderline' : 'Reject',
        keyChecks: [
          { check: 'Must-have skills match JD filter', passed: passedSkills, reason: passedSkills ? 'Meets core skill threshold.' : 'Lacks mandatory enterprise stack keywords.' },
          { check: 'Standard education and degree format', passed: passedEdu, reason: passedEdu ? 'Degree and graduation year explicit.' : 'Incomplete degree or missing college notation.' }
        ],
        verdictQuote: score >= 75
          ? 'Profile cleanly passes automated ATS criteria and internal compliance bands.'
          : 'High risk of automated filter rejection before reaching the hiring manager.'
      };
    }

    case 'consultancy': {
      // Focus: Billability, certifications, client domain
      const certComponent = completeness.components.find(c => c.key === 'certifications')?.score || 2;
      const raw = (skillComponent / 15) * 30 + (certComponent / 5) * 25 + (visibility.score / 100) * 25 + (headlineComponent / 12) * 20;
      const score = Math.round(raw);
      const passedCerts = certComponent >= 3;

      return {
        personaKey: 'consultancy',
        personaName: 'Vikram Joshi',
        personaTitle: 'Consulting Practice Director',
        avatar: '💼',
        focusArea: 'Client billability, domain certifications, communication',
        weightedScore: score,
        verdict: score >= 70 ? 'Pass' : score >= 50 ? 'Borderline' : 'Reject',
        keyChecks: [
          { check: 'Client-ready professional headline', passed: headlineComponent >= 8, reason: 'Must position skills clearly for client proposals.' },
          { check: 'Industry / Cloud certifications', passed: passedCerts, reason: passedCerts ? 'Valid vendor certifications present.' : 'Lacks cloud certifications expected by clients.' }
        ],
        verdictQuote: score >= 70
          ? 'Strong candidate for immediate deployment into enterprise client accounts.'
          : 'Needs credentials or certifications to justify premium billing rates.'
      };
    }

    case 'hrScreen':
    default: {
      // Focus: 6-second scan, layout, clean contact info, lack of gaps
      const contactComponent = completeness.components.find(c => c.key === 'contactCredibility')?.score || 3;
      const raw = (headlineComponent / 12) * 30 + (contactComponent / 5) * 25 + (completeness.overallScore / 100) * 25 + (eduComponent / 5) * 20;
      const score = Math.round(raw);

      return {
        personaKey: 'hrScreen',
        personaName: 'Ananya Deshmukh',
        personaTitle: 'Recruitment Coordinator (6-Second Screener)',
        avatar: '⏱️',
        focusArea: 'Initial 6-second scan, clear title, reachable contact info',
        weightedScore: score,
        verdict: score >= 70 ? 'Pass' : score >= 50 ? 'Borderline' : 'Reject',
        keyChecks: [
          { check: 'Instantly legible headline & contact details', passed: contactComponent === 5 && headlineComponent >= 6, reason: 'Quickly answers who you are and how to reach you.' },
          { check: 'No obvious red flags or layout mess', passed: completeness.overallScore >= 50, reason: 'Document is scannable in under 10 seconds.' }
        ],
        verdictQuote: score >= 70
          ? 'Fast pass. Fits the basic job criteria cleanly.'
          : 'Messy layout or vague headline made me move on to the next candidate.'
      };
    }
  }
}

export function evaluateAllPersonas(profile: ParsedProfile): Record<RecruiterPersonaKey, PersonaEvaluation> {
  return {
    startup: evaluatePersona(profile, 'startup'),
    enterprise: evaluatePersona(profile, 'enterprise'),
    consultancy: evaluatePersona(profile, 'consultancy'),
    hrScreen: evaluatePersona(profile, 'hrScreen')
  };
}
