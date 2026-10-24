import { ParsedProfile, RejectionReason } from '@/types';
import { ROLES } from '@/lib/data/roles';

export function predictRejection(profile: ParsedProfile, expectedSalary: number): RejectionReason[] {
  const reasons: RejectionReason[] = [];
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const allBullets = profile.experiences.flatMap(e => e.bullets);

  // 1. Salary gate
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

  // 2. Keyword gate
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

  // 3. Low impact proof
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

  // 5. Single city constraint
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
