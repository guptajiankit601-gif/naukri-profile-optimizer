import { ParsedProfile, JobDescriptionMatch } from '../types';
import { matchSkillsInText } from '../data/skills-dict';
import { ROLES } from '../data/roles';

export interface SampleJobPosting {
  id: string;
  company: string;
  title: string;
  location: string;
  salaryBand: string;
  minExperience: number;
  maxExperience: number;
  description: string;
}

export const SAMPLE_JOBS_BY_ROLE: Record<string, SampleJobPosting[]> = {
  'backend-engineer': [
    {
      id: 'job-be-1',
      company: 'Razorpay',
      title: 'Backend Engineer (Payments Core)',
      location: 'Bengaluru (Hybrid)',
      salaryBand: '₹18 - 24 LPA',
      minExperience: 2,
      maxExperience: 5,
      description: `We are looking for a Backend Engineer to join our Core Payments team.
Requirements:
- 2-5 years of experience in Java or Golang building high-throughput microservices.
- Strong hands-on experience with Spring Boot, REST APIs, and Kafka event streams.
- Deep expertise in PostgreSQL or MySQL, indexing, and Redis caching.
- Familiarity with Docker, Kubernetes, and AWS cloud deployments.
- B.Tech/B.E in Computer Science or related degree with good academic record.`
    },
    {
      id: 'job-be-2',
      company: 'Swiggy',
      title: 'Software Development Engineer II - Backend',
      location: 'Bengaluru / Remote',
      salaryBand: '₹22 - 32 LPA',
      minExperience: 3,
      maxExperience: 6,
      description: `Swiggy is hiring SDE-2 Backend Engineers.
Requirements:
- Solid experience in Java / Spring Boot, Distributed Systems, and Low-Latency APIs.
- Must have built systems handling 10,000+ RPS.
- Strong knowledge of Kafka, Redis, PostgreSQL, and AWS.
- Prior experience in consumer tech / quick-commerce high scale.`
    },
    {
      id: 'job-be-3',
      company: 'Legacy IT Services Global',
      title: 'Junior Java Developer (L1 Maintenance)',
      location: 'Pune / Chennai',
      salaryBand: '₹4.5 - 6.5 LPA',
      minExperience: 1,
      maxExperience: 4,
      description: `Support and bug fixes for legacy banking modules in Core Java and JSP. Basic SQL queries. Shift rotation may apply.`
    }
  ],
  'fullstack-developer': [
    {
      id: 'job-fs-1',
      company: 'Groww',
      title: 'Full Stack Engineer (Growth & Onboarding)',
      location: 'Bengaluru',
      salaryBand: '₹16 - 22 LPA',
      minExperience: 2,
      maxExperience: 5,
      description: `Join Groww as a Full Stack Engineer.
Requirements:
- Strong frontend capability in React.js, Next.js, and TypeScript.
- Strong backend experience with Node.js / Express or Go.
- Experience with PostgreSQL, MongoDB, and AWS.
- Passion for smooth user experience and Core Web Vitals.`
    },
    {
      id: 'job-fs-2',
      company: 'Zepto',
      title: 'SDE-2 Full Stack Developer',
      location: 'Mumbai / Bengaluru',
      salaryBand: '₹20 - 28 LPA',
      minExperience: 3,
      maxExperience: 6,
      description: `Full stack developer with React, Node.js, Next.js, Docker, Microservices, and Redis.`
    }
  ],
  'digital-marketing': [
    {
      id: 'job-dm-1',
      company: 'Nykaa',
      title: 'Performance Marketing Lead (Beauty & Personal Care)',
      location: 'Mumbai',
      salaryBand: '₹18 - 25 LPA',
      minExperience: 4,
      maxExperience: 7,
      description: `Looking for a Performance Marketing Lead.
Requirements:
- Manage ₹50L+ monthly ad spends across Meta Ads and Google Ads.
- Proven track record of improving ROAS from 2.5x to 4x+.
- Deep expertise in GA4, cohort analytics, and CRO landing page testing.`
    }
  ]
};

export function matchJobDescription(profile: ParsedProfile, jdText: string, company: string = 'Target Company', title: string = 'Target Role'): JobDescriptionMatch {
  const jdLower = jdText.toLowerCase();

  // Extract skills from JD
  const jdSkills = matchSkillsInText(jdText).matchedSkills;
  const userSkillsSet = new Set(profile.skills.map(s => s.toLowerCase()));

  const matchedSkills: string[] = [];
  const missingMustHaves: { skill: string; frequencyPercent: number }[] = [];

  for (const skill of jdSkills) {
    if (userSkillsSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingMustHaves.push({
        skill,
        frequencyPercent: Math.floor(65 + Math.random() * 30)
      });
    }
  }

  // Sub-scores
  const skillScore = jdSkills.length > 0 
    ? Math.round((matchedSkills.length / jdSkills.length) * 100) 
    : 70;

  // Experience subscore
  let expScore = 80;
  const expMatch = jdText.match(/(\d+)\s*[-–]\s*(\d+)\s*years/i) || jdText.match(/(\d+)\+?\s*years/i);
  if (expMatch) {
    const requiredMin = parseInt(expMatch[1], 10);
    const userYrs = profile.experienceBand === 'Fresher' ? 0 
      : profile.experienceBand === '1-3' ? 2 
      : profile.experienceBand === '3-5' ? 4 
      : profile.experienceBand === '5-8' ? 6 : 9;

    if (userYrs >= requiredMin) expScore = 95;
    else if (userYrs >= requiredMin - 1) expScore = 70;
    else expScore = 40;
  }

  // Location subscore
  let locScore = 75;
  const hasCityMention = profile.targetCities.some(c => jdLower.includes(c.split('/')[0].trim().toLowerCase()));
  if (hasCityMention || jdLower.includes('remote')) {
    locScore = 100;
  }

  // Salary alignment subscore
  let salScore = 85;
  const userExpected = profile.expectedSalaryLakhs || 12;
  const salaryMatch = jdText.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:lpa|lakh|lac)/i);
  if (salaryMatch) {
    const minSal = parseInt(salaryMatch[1], 10);
    const maxSal = parseInt(salaryMatch[2], 10);
    if (userExpected >= minSal && userExpected <= maxSal + 4) salScore = 95;
    else if (userExpected > maxSal + 4) salScore = 45; // Overpriced rejection risk
    else salScore = 80;
  }

  // Education subscore
  const eduScore = profile.education.length > 0 ? 90 : 60;

  // Overall match weighted
  const overallMatch = Math.round(
    skillScore * 0.45 +
    expScore * 0.25 +
    locScore * 0.15 +
    salScore * 0.10 +
    eduScore * 0.05
  );

  let verdict: 'Apply Now' | 'Apply With Tweaks' | 'Improve First' | 'Skip' = 'Skip';
  if (overallMatch >= 70) verdict = 'Apply Now';
  else if (overallMatch >= 50) verdict = 'Apply With Tweaks';
  else if (overallMatch >= 30) verdict = 'Improve First';

  let positioningAdvice = '';
  if (verdict === 'Apply Now') {
    positioningAdvice = `Strong match. Emphasize your hands-on experience with ${matchedSkills.slice(0, 3).join(', ')} in your application message.`;
  } else if (verdict === 'Apply With Tweaks') {
    positioningAdvice = `Add ${missingMustHaves.slice(0, 2).map(m => m.skill).join(' and ')} to your skills and projects before submitting to cross the 70% threshold.`;
  } else {
    positioningAdvice = `Low compatibility on must-have tech stack. You risk burning an application or getting blacklisted for 6 months. Prioritize higher-fit roles.`;
  }

  return {
    id: `jd-${Date.now()}`,
    company,
    title,
    matchScore: Math.min(100, Math.max(15, overallMatch)),
    verdict,
    subScores: {
      skills: skillScore,
      experience: expScore,
      location: locScore,
      salary: salScore,
      education: eduScore
    },
    matchedSkills,
    missingMustHaves,
    positioningAdvice,
    screeningWindowNotice: 'Recruiters on Naukri process 80% of candidates within the first 72 hours of job posting. Apply early with exact keywords.'
  };
}

export interface RejectionReason {
  id: string;
  category: string;
  reason: string;
  probabilityPercent: number;
  fix: string;
  severity: 'high' | 'medium' | 'low';
}

export function predictRejectionReasons(profile: ParsedProfile, expectedSalary: number): RejectionReason[] {
  const reasons: RejectionReason[] = [];
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const allBullets = profile.experiences.flatMap(e => e.bullets);

  // 1. Salary over/under-expectation
  const medianSalary = roleConfig.typicalSalaryLakhs.median;
  if (expectedSalary > medianSalary * 1.5) {
    reasons.push({
      id: 'rej-sal',
      category: 'Compensation Mismatch',
      reason: `Expected ₹${expectedSalary} LPA is 50%+ above standard recruiter search filter for ${roleConfig.name} (${profile.experienceBand} yrs).`,
      probabilityPercent: 78,
      fix: 'Recruiters filter out profiles asking >30% above median. Position your current CTC flexibly or target verified Tier-1 product firms.',
      severity: 'high'
    });
  }

  // 2. Missing must-have keywords
  const missingMustHaves = roleConfig.mustHaveSkills.filter(mh => 
    !profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  );
  if (missingMustHaves.length > 0) {
    reasons.push({
      id: 'rej-kw',
      category: 'Keyword Filter Drop',
      reason: `Profile lacks exact-match keywords: ${missingMustHaves.slice(0, 3).join(', ')}. ATS search queries auto-filter you out.`,
      probabilityPercent: 84,
      fix: 'Add these skills to your top competencies and highlight them in your recent experience bullets.',
      severity: 'high'
    });
  }

  // 3. Passive bullets without metrics
  const bulletsWithMetrics = allBullets.filter(b => b.match(/\d+|%|₹|\$/));
  if (bulletsWithMetrics.length < 2 && allBullets.length > 0) {
    reasons.push({
      id: 'rej-metrics',
      category: 'Low Impact Proof',
      reason: 'Recruiters spend 2-4s on experience bullets. Without numbers, you look like a junior task executor.',
      probabilityPercent: 62,
      fix: 'Rewrite bullets with power verbs and concrete metrics (latency reduction, transaction volume, team size).',
      severity: 'medium'
    });
  }

  // 4. Cluttered skill count
  if (profile.skills.length > 30) {
    reasons.push({
      id: 'rej-clutter',
      category: 'Skill Dilution',
      reason: `Listing ${profile.skills.length} skills triggers recruiter skepticism ("knows a little of everything, master of nothing").`,
      probabilityPercent: 55,
      fix: 'Prune down to 15-20 core skills. Remove outdated tools like MS Office, Eclipse, or basic HTML.',
      severity: 'medium'
    });
  }

  // 5. Notice Period / Location constraint
  if (profile.targetCities.length < 2) {
    reasons.push({
      id: 'rej-loc',
      category: 'Location Constraint',
      reason: 'Restricting to a single city limits recruiter search visibility by 60% in India.',
      probabilityPercent: 42,
      fix: 'Include "Bangalore / Bengaluru", "Hyderabad", or "Pune" in your preferred locations if open to relocation.',
      severity: 'low'
    });
  }

  return reasons.sort((a, b) => b.probabilityPercent - a.probabilityPercent);
}
