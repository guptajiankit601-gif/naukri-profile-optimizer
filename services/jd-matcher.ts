import { ParsedProfile, JobDescriptionMatch, MatchedSkillEvidence, MissingResumeSkill, LearningGapSkill } from '@/types';
import { matchSkillsInText } from '@/data/skills-dict';
import { ROLES } from '@/data/roles';

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
  const matchedEvidence: MatchedSkillEvidence[] = [];
  const missingFromResume: MissingResumeSkill[] = [];
  const learningGaps: LearningGapSkill[] = [];

  const rawResumeTextLower = (profile.rawText || '').toLowerCase();
  const allBullets = profile.experiences.flatMap(e => e.bullets);

  for (const skill of jdSkills) {
    const skillLower = skill.toLowerCase();
    const isInSkills = userSkillsSet.has(skillLower);
    const isInRaw = rawResumeTextLower.includes(skillLower);

    if (isInSkills || isInRaw) {
      matchedSkills.push(skill);

      // Find specific evidence citation
      let evidenceText = 'Listed in Skills section';
      let foundIn = 'Skills Inventory';

      const matchingExp = profile.experiences.find(e =>
        e.bullets.some(b => b.toLowerCase().includes(skillLower)) ||
        e.title.toLowerCase().includes(skillLower)
      );

      if (matchingExp) {
        const bullet = matchingExp.bullets.find(b => b.toLowerCase().includes(skillLower));
        evidenceText = bullet ? `"${bullet.slice(0, 110)}..."` : `Role: ${matchingExp.title} @ ${matchingExp.company}`;
        foundIn = `Experience @ ${matchingExp.company}`;
      } else {
        const matchingProj = profile.projects.find(p =>
          (p.technologies || []).some(t => t.toLowerCase().includes(skillLower)) ||
          p.title.toLowerCase().includes(skillLower) ||
          p.description.toLowerCase().includes(skillLower)
        );
        if (matchingProj) {
          evidenceText = `Project: ${matchingProj.title}`;
          foundIn = 'Projects Portfolio';
        }
      }

      matchedEvidence.push({
        skill,
        evidence: evidenceText,
        foundIn
      });
    } else {
      // Deterministic frequency based on occurrences in JD
      const occurrences = (jdLower.match(new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length;
      const frequencyPercent = Math.min(95, Math.max(60, 60 + occurrences * 10));

      missingMustHaves.push({
        skill,
        frequencyPercent
      });

      // Distinguish between Missing from Resume (Tailoring Opportunity) vs Potential Learning Gap
      // If user has related stack tools (e.g. has Java and missing Spring Boot, or has Docker and missing K8s)
      const isRelatedToExistingStack = profile.skills.some(userSkill => {
        const us = userSkill.toLowerCase();
        return (
          (us.includes('java') && (skillLower.includes('spring') || skillLower.includes('jvm') || skillLower.includes('maven'))) ||
          (us.includes('python') && (skillLower.includes('django') || skillLower.includes('fastapi') || skillLower.includes('flask'))) ||
          (us.includes('react') && (skillLower.includes('next') || skillLower.includes('typescript') || skillLower.includes('redux'))) ||
          (us.includes('docker') && (skillLower.includes('kubernetes') || skillLower.includes('aws') || skillLower.includes('ci/cd'))) ||
          (us.includes('sql') && (skillLower.includes('postgres') || skillLower.includes('mysql') || skillLower.includes('indexing')))
        );
      });

      if (isRelatedToExistingStack) {
        missingFromResume.push({
          skill,
          context: `Mentioned in JD requirements (${occurrences > 1 ? `${occurrences}x in text` : 'key requirement'}), but not explicitly found in your resume text.`,
          recommendation: `If you have worked with ${skill}, document it under your relevant projects or skills to pass automated ATS filters.`
        });
      } else {
        learningGaps.push({
          skill,
          reason: `Required core capability in the JD with no adjacent stack evidence in your profile.`,
          difficulty: skillLower.match(/kubernetes|distributed|system design|microservices|architecture|kafka/i)
            ? 'Core Prerequisite'
            : skillLower.match(/redis|docker|git|aws|ci\/cd|tailwind/i)
            ? 'Quick Add'
            : 'Moderate'
        });
      }
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
    else if (userExpected > maxSal + 4) salScore = 45; // Overpriced compensation mismatch risk
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
    positioningAdvice = `Strong alignment with core requirements. Highlight your verified experience with ${matchedSkills.slice(0, 3).join(', ')} in your application headline.`;
  } else if (verdict === 'Apply With Tweaks') {
    positioningAdvice = `Good baseline alignment. If you have practical experience with ${missingMustHaves.slice(0, 2).map(m => m.skill).join(' or ')}, incorporate those keywords before submitting.`;
  } else {
    positioningAdvice = `Lower alignment with must-have technologies. Review the learning gaps to determine whether upskilling is needed before prioritizing this application.`;
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
    matchedEvidence,
    missingFromResume,
    learningGaps,
    positioningAdvice,
    screeningWindowNotice: 'Recruiter Screening Advisory: Aligning your primary resume keywords with key job requirements ensures automated screening filters accurately reflect your experience.'
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

  // 1. Salary over/under-expectation with ethical framing & benchmark defensibility
  const medianSalary = roleConfig.typicalSalaryLakhs?.median;
  if (!medianSalary || medianSalary <= 0) {
    reasons.push({
      id: 'rej-sal-nodata',
      category: 'Market Benchmark Advisory',
      reason: `Insufficient verifiable market compensation data for ${profile.targetRole}. Portal benchmark check skipped.`,
      probabilityPercent: 20,
      fix: 'Verify peer compensation data through verified industry surveys or employee network before locking portal CTC expectations.',
      severity: 'low'
    });
  } else if (expectedSalary > medianSalary * 1.6) {
    reasons.push({
      id: 'rej-sal',
      category: 'Compensation Threshold Advisory',
      reason: `Target CTC (₹${expectedSalary} LPA) is significantly above typical portal baseline (₹${medianSalary} LPA) for ${profile.targetRole}. High portal filters may flag this in initial automated scans.`,
      probabilityPercent: 55,
      fix: `Do not lower your baseline compensation solely to appease portal screening filters. For higher brackets, prioritize direct recruiter reach-outs, peer referrals, and specialized executive search channels where portal pay caps are bypassed.`,
      severity: 'medium'
    });
  }

  // 2. Experience seniority gap
  if (profile.experienceBand === 'Fresher') {
    reasons.push({
      id: 'rej-yoe',
      category: 'Years of Experience Threshold',
      reason: `Mid-senior roles apply automated filters excluding profiles without full-time years of experience. Profile is currently set to Fresher band.`,
      probabilityPercent: 65,
      fix: 'Target Graduate Engineer Trainee (GET), Associate, or Fresher-specific job postings, and showcase substantial project portfolios, hackathons, and internship proofs of execution.',
      severity: 'medium'
    });
  }

  // 3. Location mismatch
  const hasPreferredCity = profile.targetCities.length > 0;
  if (!hasPreferredCity) {
    reasons.push({
      id: 'rej-loc',
      category: 'Location Filter Exclusion',
      reason: 'No target cities specified. Recruiter search filters heavily penalize open or unspecified locations.',
      probabilityPercent: 55,
      fix: 'Select 2-3 target hiring hubs (e.g. Bengaluru, Pune, Hyderabad, Gurgaon) in your targeting settings.',
      severity: 'medium'
    });
  }

  // 4. Missing metrics
  const metricCount = allBullets.filter(b => /\b(\d+%|\d+k|\d+x|₹\d+|\$\d+)\b/i.test(b)).length;
  if (metricCount < 2 && allBullets.length > 2) {
    reasons.push({
      id: 'rej-metric',
      category: 'Lack of Quantified Deliverables',
      reason: `Only ${metricCount} bullets contain verifiable metrics. Recruiters prioritize candidates with quantified results.`,
      probabilityPercent: 50,
      fix: 'Add scale, throughput, or efficiency measurements to your top 3 experience bullets.',
      severity: 'low'
    });
  }

  return reasons;
}
