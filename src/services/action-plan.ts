import { ActionPlanItem, ParsedProfile, ScoreReport } from '../types';

export function generatePersonalizedActionPlan(profile: ParsedProfile, scoreReport: ScoreReport): ActionPlanItem[] {
  const plan: ActionPlanItem[] = [];

  // Today: Highest ROI fixes (Headline & Top missing keywords)
  const headlineComp = scoreReport.components.find(c => c.name.includes('Headline'));
  if (headlineComp && headlineComp.score < headlineComp.max) {
    plan.push({
      id: 'plan-1',
      dayGroup: 'Today',
      title: 'Fix Your Recruiter Headline',
      description: 'Replace generic company/title with role keyword + core specialization + metric in Naukri format.',
      estimatedMinutes: 5,
      expectedPoints: headlineComp.max - headlineComp.score,
      targetTab: 'headlines',
      completed: false
    });
  }

  const skillComp = scoreReport.components.find(c => c.name.includes('Skills'));
  if (skillComp && skillComp.score < skillComp.max) {
    plan.push({
      id: 'plan-2',
      dayGroup: 'Today',
      title: 'Prune Clutter & Add Missing Must-Have Keywords',
      description: 'Remove noise keywords (MS Office, basic tools) and add high-search terms that recruiters filter on.',
      estimatedMinutes: 10,
      expectedPoints: skillComp.max - skillComp.score,
      targetTab: 'keywords',
      completed: false
    });
  }

  // Day 2: Rewrite Bullets with Power Verbs and Numbers
  const bulletComp = scoreReport.components.find(c => c.name.includes('Bullet'));
  plan.push({
    id: 'plan-3',
    dayGroup: 'Day 2',
    title: 'Transform Top 3 Experience Bullets into Impact Statements',
    description: 'Convert passive "Responsible for" into power verbs with concrete scale metrics (%, ₹, req/s).',
    estimatedMinutes: 20,
    expectedPoints: bulletComp ? bulletComp.max - bulletComp.score : 8,
    targetTab: 'rewriter',
    completed: false
  });

  // Day 3-4: Summary Hook & Job Fit Filtering
  plan.push({
    id: 'plan-4',
    dayGroup: 'Day 3-4',
    title: 'Update Summary / About Section',
    description: 'Delete passive cliches ("seeking opportunity") and lead with your years, domain, and top win.',
    estimatedMinutes: 15,
    expectedPoints: 6,
    targetTab: 'rewriter',
    completed: false
  });

  plan.push({
    id: 'plan-5',
    dayGroup: 'Day 3-4',
    title: 'Run Job Fit on Your Next 3 Target Job Descriptions',
    description: 'Verify you hit 70%+ match score before applying. Avoid burning referral opportunities on <40% fits.',
    estimatedMinutes: 15,
    expectedPoints: 5,
    targetTab: 'job-fit',
    completed: false
  });

  // Week 2: Platform Sync & Profile Export
  plan.push({
    id: 'plan-6',
    dayGroup: 'Week 2',
    title: 'Sync Naukri Key Skills & LinkedIn About Section',
    description: 'Copy optimized 3-category skills into Naukri profile and pipe-separated headline to LinkedIn.',
    estimatedMinutes: 20,
    expectedPoints: 7,
    targetTab: 'export',
    completed: false
  });

  plan.push({
    id: 'plan-7',
    dayGroup: 'Week 2',
    title: 'Test 6-Second Recruiter Simulation Against Founder Persona',
    description: 'Check whether your revised profile clears the 6-second threshold with a green INTEREST verdict.',
    estimatedMinutes: 10,
    expectedPoints: 4,
    targetTab: 'recruiter-sim',
    completed: false
  });

  return plan;
}
