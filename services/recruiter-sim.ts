import { ParsedProfile, RecruiterPersona } from '@/types';
import { extractMetricsFromText } from './parser';
import { PASSIVE_PHRASES } from '@/data/verbs';

export interface ScanTimelineStep {
  timeWindow: string; // "0 - 2s", "2 - 4s", "4 - 6s", "6s+"
  title: string;
  focusArea: string;
  observation: string;
  sentiment: 'positive' | 'warning' | 'negative';
  weightText: string;
}

export interface PersonaSimulationResult {
  persona: RecruiterPersona;
  personaTitle: string;
  avatarSeed: string;
  personaDescription: string;
  personaFocus: string;
  visibilityScore: number; // 0 - 100
  verdict: 'INTEREST' | 'SKIP' | 'MAYBE';
  primaryBlockerOrCatalyst: string;
  timeline: ScanTimelineStep[];
}

export function simulateRecruiterScan(profile: ParsedProfile, persona: RecruiterPersona): PersonaSimulationResult {
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const first3Bullets = allBullets.slice(0, 3);
  const headlineLower = profile.headline.toLowerCase();
  const hasStrongHeadline = profile.headline.includes('|') && (headlineLower.includes('engineer') || headlineLower.includes('developer') || headlineLower.includes('specialist') || headlineLower.includes('manager'));
  
  const metricsFound = first3Bullets.flatMap(b => extractMetricsFromText(b));
  const hasPassiveFirstBullet = first3Bullets.length > 0 && PASSIVE_PHRASES.some(p => first3Bullets[0].toLowerCase().includes(p));
  const skillCount = profile.skills.length;

  let visibilityScore = 50;
  let timeline: ScanTimelineStep[] = [];
  let primaryReason = '';
  let verdict: 'INTEREST' | 'SKIP' | 'MAYBE' = 'SKIP';

  if (persona === 'Startup Founder') {
    // Startup founders look for speed, autonomy, high-impact numbers, zero corporate fluff
    let score = 40;
    if (metricsFound.length >= 2) score += 25;
    if (hasStrongHeadline) score += 15;
    if (!hasPassiveFirstBullet) score += 10;
    if (profile.projects.length >= 2) score += 10;

    visibilityScore = Math.min(100, score);
    verdict = visibilityScore >= 70 ? 'INTEREST' : visibilityScore >= 50 ? 'MAYBE' : 'SKIP';
    primaryReason = visibilityScore < 70 
      ? 'Against a Startup Founder, you lack quantifiable proof of ownership and production shipping.'
      : 'Startup Founder loves your project evidence and quantified metrics.';

    timeline = [
      {
        timeWindow: '0 - 2s',
        title: 'Headline & Pedigree Scan',
        focusArea: 'Headline & Target Title',
        observation: hasStrongHeadline 
          ? `Noticed specialized title: "${profile.headline}". Indicates ready-to-code autonomy.`
          : `Generic title detected: "${profile.headline}". Lacks modern startup stack signal.`,
        sentiment: hasStrongHeadline ? 'positive' : 'warning',
        weightText: 'High Weight: Needs to know if you can ship day 1'
      },
      {
        timeWindow: '2 - 4s',
        title: 'Top Impact Statement Scan',
        focusArea: 'First 2 Experience Bullets',
        observation: hasPassiveFirstBullet
          ? 'First bullet begins with passive "Responsible for". Signals task-taker rather than product owner.'
          : metricsFound.length > 0
          ? `Spotted measurable metric: "${metricsFound[0]}". Proof of real outcome.`
          : 'No metrics or business impact in first 2 bullets. Needs numbers.',
        sentiment: metricsFound.length > 0 && !hasPassiveFirstBullet ? 'positive' : 'negative',
        weightText: 'Critical Weight: Startups filter out task executors'
      },
      {
        timeWindow: '4 - 6s',
        title: 'Skills & Project Proof Scan',
        focusArea: 'Skills & Github/Projects',
        observation: profile.projects.length > 0
          ? `Found ${profile.projects.length} distinct project implementations.`
          : 'Zero independent or deployed projects found.',
        sentiment: profile.projects.length > 0 ? 'positive' : 'warning',
        weightText: 'Medium Weight: Validates actual coding ability'
      },
      {
        timeWindow: '6s+',
        title: 'Founder Call Verdict',
        focusArea: 'Decision Gate',
        observation: verdict === 'INTEREST' 
          ? 'Decision: Bookmark for founder phone screen. Strong bias for action.'
          : 'Decision: SKIP. Looks like a slow corporate hire.',
        sentiment: verdict === 'INTEREST' ? 'positive' : 'negative',
        weightText: 'Final 6-second cutoff'
      }
    ];

    return {
      persona,
      personaTitle: 'Early Stage Startup Founder / CTO',
      avatarSeed: 'founder',
      personaDescription: 'Moves in 4 seconds. Skips corporate buzzwords. Demands metrics, personal projects, and proof of fast shipping.',
      personaFocus: 'Execution Speed & Quantified Output',
      visibilityScore,
      verdict,
      primaryBlockerOrCatalyst: primaryReason,
      timeline
    };
  }

  if (persona === 'Enterprise TA') {
    // Enterprise TA looks for corporate brand, steady tenure, standard certifications, cloud compliance
    let score = 45;
    if (profile.certifications.length > 0) score += 15;
    if (profile.education.length > 0 && profile.education[0].score) score += 15;
    if (skillCount >= 10 && skillCount <= 25) score += 15;
    if (profile.skills.some(s => s.toLowerCase().includes('cloud') || s.toLowerCase().includes('aws') || s.toLowerCase().includes('azure'))) score += 15;

    visibilityScore = Math.min(100, score);
    verdict = visibilityScore >= 70 ? 'INTEREST' : visibilityScore >= 50 ? 'MAYBE' : 'SKIP';
    primaryReason = visibilityScore < 70
      ? 'Against Enterprise TA, cloud certifications and explicit vendor tools are the primary blocker.'
      : 'Enterprise TA approves strong academic pedigree and standardized tech stack.';

    timeline = [
      {
        timeWindow: '0 - 2s',
        title: 'Mandatory Requisition Filter',
        focusArea: 'Current Company & Degree',
        observation: profile.education.length > 0 
          ? `Degree verified: ${profile.education[0].degree} from ${profile.education[0].institution}.` 
          : 'Missing explicit degree tier.',
        sentiment: profile.education.length > 0 ? 'positive' : 'warning',
        weightText: 'Must-have compliance gate'
      },
      {
        timeWindow: '2 - 4s',
        title: 'Cloud & Tech Stack Checklist',
        focusArea: 'Core Technologies',
        observation: profile.skills.some(s => s.toLowerCase().includes('aws') || s.toLowerCase().includes('cloud') || s.toLowerCase().includes('docker'))
          ? 'Cloud keywords detected. Meets infrastructure baseline.'
          : 'Lacks explicit AWS/Azure/Docker certifications or cloud keywords.',
        sentiment: profile.skills.some(s => s.toLowerCase().includes('aws')) ? 'positive' : 'negative',
        weightText: 'Enterprise client requirement'
      },
      {
        timeWindow: '4 - 6s',
        title: 'Certifications & Consistency Scan',
        focusArea: 'Certifications & Timeline',
        observation: profile.certifications.length > 0
          ? `Verified credential: ${profile.certifications[0]}.`
          : 'No formal vendor certifications listed.',
        sentiment: profile.certifications.length > 0 ? 'positive' : 'warning',
        weightText: 'Bonus points in enterprise rate cards'
      },
      {
        timeWindow: '6s+',
        title: 'ATS Pipeline Forwarding',
        focusArea: 'Decision Gate',
        observation: verdict === 'INTEREST'
          ? 'Forwarding to Hiring Manager for L1 technical round.'
          : 'Pushed to generic talent pool (unlikely callback).',
        sentiment: verdict === 'INTEREST' ? 'positive' : 'negative',
        weightText: 'Enterprise screening shortlist'
      }
    ];

    return {
      persona,
      personaTitle: 'Enterprise Talent Acquisition Lead',
      avatarSeed: 'enterprise',
      personaDescription: 'Screens against strict client SLAs. Prioritizes cloud certifications, clean tenures, and tier-1 skills.',
      personaFocus: 'Certifications, Cloud Skills & Stability',
      visibilityScore,
      verdict,
      primaryBlockerOrCatalyst: primaryReason,
      timeline
    };
  }

  if (persona === 'Consultancy Recruiter') {
    // Consultancy recruiter looks for billing keywords, client communication, multi-skilling
    let score = 42;
    if (skillCount >= 12) score += 20;
    if (profile.skills.some(s => s.toLowerCase().includes('microservices') || s.toLowerCase().includes('rest') || s.toLowerCase().includes('react'))) score += 20;
    if (profile.headline.length > 30) score += 15;

    visibilityScore = Math.min(100, score);
    verdict = visibilityScore >= 68 ? 'INTEREST' : 'SKIP';
    primaryReason = visibilityScore < 68
      ? 'Against a Consultancy Recruiter, keyword density and client-facing domain keywords are too thin.'
      : 'High billable match for staffing client requirements.';

    timeline = [
      {
        timeWindow: '0 - 2s',
        title: 'Keyword Match Rate',
        focusArea: 'Client Ratecard Keywords',
        observation: `Detected ${skillCount} listed skills. Checking against active client RFPs.`,
        sentiment: skillCount >= 10 ? 'positive' : 'warning',
        weightText: 'Direct billing potential'
      },
      {
        timeWindow: '2 - 4s',
        title: 'Notice Period & Location Check',
        focusArea: 'Location & Immediate Joiner',
        observation: `Location: ${profile.location}. Target cities: ${profile.targetCities.join(', ')}.`,
        sentiment: 'positive',
        weightText: 'Critical for immediate deployment'
      },
      {
        timeWindow: '4 - 6s',
        title: 'Domain & Client Experience',
        focusArea: 'Project Scopes',
        observation: profile.experiences.length > 0
          ? `Work history at ${profile.experiences[0].company}.`
          : 'Limited client project history.',
        sentiment: 'positive',
        weightText: 'Staff augmentation compatibility'
      },
      {
        timeWindow: '6s+',
        title: 'Consultancy Recruiter Verdict',
        focusArea: 'Decision Gate',
        observation: verdict === 'INTEREST' ? 'Instant WhatsApp message sent for salary check.' : 'Skipped for high-match candidate.',
        sentiment: verdict === 'INTEREST' ? 'positive' : 'negative',
        weightText: 'Recruiter outbound call'
      }
    ];

    return {
      persona,
      personaTitle: 'IT Staffing & Consultancy Recruiter',
      avatarSeed: 'consultancy',
      personaDescription: 'Has 15 client positions to fill today. Needs high keyword density, immediate joiner potential, and crisp client-ready bullets.',
      personaFocus: 'Keyword Density & Rate-Card Matching',
      visibilityScore,
      verdict,
      primaryBlockerOrCatalyst: primaryReason,
      timeline
    };
  }

  // HR Screen default
  let hrScore = 48;
  if (profile.email && profile.phone) hrScore += 15;
  if (profile.education.length > 0) hrScore += 15;
  if (!hasPassiveFirstBullet) hrScore += 12;

  visibilityScore = Math.min(100, hrScore);
  verdict = visibilityScore >= 65 ? 'INTEREST' : 'SKIP';
  primaryReason = visibilityScore < 65 
    ? 'HR Screen flagged passive phrasing and incomplete academic details.'
    : 'HR Screen marked as safe for preliminary screening round.';

  timeline = [
    {
      timeWindow: '0 - 2s',
      title: 'Formatting & Hygiene Check',
      focusArea: 'Contact & Layout Structure',
      observation: 'Clear contact details and legible section headers.',
      sentiment: 'positive',
      weightText: 'Screening hygiene'
    },
    {
      timeWindow: '2 - 4s',
      title: 'Basic Eligibility Scan',
      focusArea: 'Experience & Qualifications',
      observation: `Experience level: ${profile.experienceBand} band.`,
      sentiment: 'positive',
      weightText: 'Matches initial requisitions'
    },
    {
      timeWindow: '4 - 6s',
      title: 'Clarity & Communication Tone',
      focusArea: 'Language & Grammar',
      observation: hasPassiveFirstBullet ? 'Noticeable passive phrasing in experience summary.' : 'Professional phrasing.',
      sentiment: hasPassiveFirstBullet ? 'warning' : 'positive',
      weightText: 'Soft-skills and communication signal'
    },
    {
      timeWindow: '6s+',
      title: 'HR Screen Verdict',
      focusArea: 'Decision Gate',
      observation: verdict === 'INTEREST' ? 'Schedule 15-min intro call.' : 'Auto-reject notification sent.',
      sentiment: verdict === 'INTEREST' ? 'positive' : 'negative',
      weightText: 'Initial stage clearance'
    }
  ];

  return {
    persona,
    personaTitle: 'Corporate HR Generalist / First Screener',
    avatarSeed: 'hr',
    personaDescription: 'First human filter. Reviews 150 resumes before lunch. Looks for clear contact info, clean formatting, and no red flags.',
    personaFocus: 'Format Hygiene, Communication & Eligibility',
    visibilityScore,
    verdict,
    primaryBlockerOrCatalyst: primaryReason,
    timeline
  };
}
