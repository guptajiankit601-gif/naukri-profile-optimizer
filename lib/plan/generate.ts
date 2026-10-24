import { ParsedProfile, ActionPlanItem } from '@/types';
import { calculateCompletenessScore } from '@/lib/scoring/completeness';
import { calculateVisibilityScore } from '@/lib/scoring/visibility';
import { analyzeKeywordGaps } from '@/lib/scoring/keywords';

export interface ActionPlanSummary {
  items: ActionPlanItem[];
  totalExpectedGain: number;
  projectedScore: number;
  todayEstimatedMinutes: number;
  totalEstimatedMinutes: number;
}

export function generateActionPlan(profile: ParsedProfile): ActionPlanSummary {
  const completeness = calculateCompletenessScore(profile);
  const visibility = calculateVisibilityScore(profile);
  const keywordAnalysis = analyzeKeywordGaps(profile);

  const currentScore = completeness.overallScore;
  const headroom = Math.max(0, 100 - currentScore);

  interface CandidateTask {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    potentialGain: number;
    targetTab: string;
    roi: number; // potentialGain / estimatedMinutes
  }

  const candidateTasks: CandidateTask[] = [];

  // 1. Headline task
  const headlineComp = completeness.components.find(c => c.key === 'headlineClarity');
  if (headlineComp && headlineComp.score < headlineComp.max) {
    const gain = headlineComp.max - headlineComp.score;
    candidateTasks.push({
      id: 'task-headline',
      title: 'Upgrade Headline with Role & Impact Metric',
      description: 'Replace generic job title with the 3-part formula (Role | Core Stack | Quantified Metric) to increase recruiter search CTR.',
      estimatedMinutes: 5,
      potentialGain: gain,
      targetTab: 'headline',
      roi: gain / 5
    });
  }

  // 2. High priority missing keywords
  if (keywordAnalysis.highPriorityMissing.length > 0) {
    const topMissing = keywordAnalysis.highPriorityMissing.slice(0, 3).map(k => k.term).join(', ');
    const kwGain = Math.min(8, keywordAnalysis.highPriorityMissing.length * 2);
    candidateTasks.push({
      id: 'task-keywords',
      title: `Add ${keywordAnalysis.highPriorityMissing.length} Critical Missing Keywords`,
      description: `Include high-volume filter terms (${topMissing}) in your key skills and project summaries.`,
      estimatedMinutes: 10,
      potentialGain: kwGain,
      targetTab: 'keywords',
      roi: kwGain / 10
    });
  }

  // 3. Bullet rewriting & metrics
  const bulletComp = completeness.components.find(c => c.key === 'bulletQuality');
  if (bulletComp && bulletComp.score < bulletComp.max) {
    const gain = bulletComp.max - bulletComp.score;
    candidateTasks.push({
      id: 'task-bullets',
      title: 'Rewrite Passive Experience Bullets',
      description: 'Transform passive statements ("responsible for") into power-verb accomplishments with quantifiable outcomes.',
      estimatedMinutes: 15,
      potentialGain: Math.min(10, gain),
      targetTab: 'rewriter',
      roi: Math.min(10, gain) / 15
    });
  }

  // 4. Distractor keyword removal
  if (keywordAnalysis.distractorsToRemove.length > 0) {
    candidateTasks.push({
      id: 'task-distractors',
      title: 'Prune Low-Value Noise Skills',
      description: `Remove outdated noise keywords (${keywordAnalysis.distractorsToRemove.slice(0, 2).map(d => d.term).join(', ')}) that dilute your senior technical positioning.`,
      estimatedMinutes: 5,
      potentialGain: 3,
      targetTab: 'keywords',
      roi: 3 / 5
    });
  }

  // 5. Summary rewrite
  const summaryComp = completeness.components.find(c => c.key === 'summaryQuality');
  if (summaryComp && summaryComp.score < summaryComp.max) {
    const gain = summaryComp.max - summaryComp.score;
    candidateTasks.push({
      id: 'task-summary',
      title: 'Craft a 3-Sentence Professional Pitch',
      description: 'Remove generic objective clichés and lead with your years of domain depth and highest quantified achievement.',
      estimatedMinutes: 10,
      potentialGain: gain,
      targetTab: 'profile',
      roi: gain / 10
    });
  }

  // 6. ATS parseability fix
  const parseComp = completeness.components.find(c => c.key === 'parseability');
  if (parseComp && parseComp.score < parseComp.max) {
    const gain = parseComp.max - parseComp.score;
    candidateTasks.push({
      id: 'task-parseability',
      title: 'Standardize Resume Section Headers',
      description: 'Ensure standard headers (Experience, Education, Skills, Summary) so automated ATS parsers don\'t drop history.',
      estimatedMinutes: 10,
      potentialGain: gain,
      targetTab: 'profile',
      roi: gain / 10
    });
  }

  // 7. Projects proof
  const projComp = completeness.components.find(c => c.key === 'projectsProof');
  if (projComp && projComp.score < projComp.max) {
    const gain = projComp.max - projComp.score;
    candidateTasks.push({
      id: 'task-projects',
      title: 'Document 1-2 Scaled Project Deliverables',
      description: 'Add problem context, architectural stack, and GitHub or live system links to substantiate hands-on capabilities.',
      estimatedMinutes: 25,
      potentialGain: gain,
      targetTab: 'profile',
      roi: gain / 25
    });
  }

  // 8. Contact & verification
  const contactComp = completeness.components.find(c => c.key === 'contactCredibility');
  if (contactComp && contactComp.score < contactComp.max) {
    candidateTasks.push({
      id: 'task-contact',
      title: 'Verify Direct Contact Details & LinkedIn URL',
      description: 'Add a clean professional email, 10-digit Indian phone number, and customized LinkedIn profile handle.',
      estimatedMinutes: 5,
      potentialGain: contactComp.max - contactComp.score,
      targetTab: 'profile',
      roi: (contactComp.max - contactComp.score) / 5
    });
  }

  // Sort candidate tasks by points-per-minute ROI (highest ROI first)
  candidateTasks.sort((a, b) => b.roi - a.roi);

  // Group into Day buckets, capping Today to < 45 min, and total to max 12 tasks
  const prioritized = candidateTasks.slice(0, 12);

  let todayMinutes = 0;
  let accumulatedGain = 0;
  const items: ActionPlanItem[] = [];

  for (const t of prioritized) {
    let dayGroup: ActionPlanItem['dayGroup'] = 'Today';
    if (todayMinutes + t.estimatedMinutes <= 45) {
      dayGroup = 'Today';
      todayMinutes += t.estimatedMinutes;
    } else if (todayMinutes + t.estimatedMinutes <= 90) {
      dayGroup = 'Day 2';
    } else if (todayMinutes + t.estimatedMinutes <= 150) {
      dayGroup = 'Day 3-4';
    } else {
      dayGroup = 'Week 2';
    }

    // Clamp potential gain to headroom
    const clampedGain = Math.min(t.potentialGain, Math.max(0, headroom - accumulatedGain));
    accumulatedGain += clampedGain;

    items.push({
      id: t.id,
      dayGroup,
      title: t.title,
      description: t.description,
      estimatedMinutes: t.estimatedMinutes,
      expectedPoints: clampedGain,
      targetTab: t.targetTab,
      completed: false
    });
  }

  const totalEstimatedMinutes = items.reduce((sum, item) => sum + item.estimatedMinutes, 0);

  return {
    items,
    totalExpectedGain: accumulatedGain,
    projectedScore: Math.min(100, currentScore + accumulatedGain),
    todayEstimatedMinutes: todayMinutes,
    totalEstimatedMinutes
  };
}
