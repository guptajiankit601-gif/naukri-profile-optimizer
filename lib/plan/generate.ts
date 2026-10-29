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
  const keywordAnalysis = analyzeKeywordGaps(profile);

  const currentScore = completeness.overallScore;
  const headroom = Math.max(0, 100 - currentScore);

  interface CandidateTask {
    id: string;
    title: string;
    description: string;
    reason: string;
    criteria: string;
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
      title: 'Upgrade Headline with Role & Stack Specialization',
      description: 'Replace generic job title with the 3-part recruiter formula: [Target Role] | [Core Technologies] | [Experience or Domain Focus].',
      reason: 'Recruiters and search algorithms index the first 120 characters to match query keywords.',
      criteria: 'Headline Clarity & Search Indexing',
      estimatedMinutes: 5,
      potentialGain: gain,
      targetTab: 'headlines',
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
      description: `Incorporate high-volume filter terms (${topMissing}) in your key skills and project summaries.`,
      reason: 'Automated recruiter searches filter profiles lacking must-have primary technology keywords.',
      criteria: 'Skill & Search Keyword Relevance',
      estimatedMinutes: 10,
      potentialGain: kwGain,
      targetTab: 'keywords',
      roi: kwGain / 10
    });
  }

  // 3. Bullet rewriting & active ownership
  const expComp = completeness.components.find(c => c.key === 'experienceRelevance');
  if (expComp && expComp.score < expComp.max) {
    const gain = expComp.max - expComp.score;
    candidateTasks.push({
      id: 'task-bullets',
      title: 'Rewrite Passive Experience Bullets to Active Ownership',
      description: 'Transform passive statements ("Responsible for", "Helped with") into active verb achievements preserving your real technologies.',
      reason: 'Recruiters scan bullets in under 6 seconds; strong action verbs communicate engineering ownership.',
      criteria: 'Experience Relevance & Action Verbs',
      estimatedMinutes: 15,
      potentialGain: Math.min(8, gain),
      targetTab: 'rewriter',
      roi: Math.min(8, gain) / 15
    });
  }

  // 4. Quantified outcomes & impact
  const impactComp = completeness.components.find(c => c.key === 'achievementImpact');
  if (impactComp && impactComp.score < impactComp.max) {
    const gain = impactComp.max - impactComp.score;
    candidateTasks.push({
      id: 'task-metrics',
      title: 'Incorporate Verified Deliverables & Scale Metrics',
      description: 'Add genuine performance numbers (%, throughput, latency, users, SLA) or use metric-ready placeholders to prove execution.',
      reason: 'Profiles with concrete outcome metrics differentiate candidates from generic job-holders.',
      criteria: 'Achievement & Quantified Impact',
      estimatedMinutes: 15,
      potentialGain: Math.min(7, gain),
      targetTab: 'rewriter',
      roi: Math.min(7, gain) / 15
    });
  }

  // 5. Projects portfolio
  const projComp = completeness.components.find(c => c.key === 'projectsPortfolio');
  if (projComp && projComp.score < projComp.max) {
    const gain = projComp.max - projComp.score;
    candidateTasks.push({
      id: 'task-projects',
      title: profile.experienceBand === 'Fresher'
        ? 'Document 2-3 Verified Projects with GitHub Links'
        : 'Feature 1-2 Scaled Project Deliverables',
      description: 'Specify problem context, modern architectural stack, and link live demos or repositories to substantiate practical execution.',
      reason: profile.experienceBand === 'Fresher'
        ? 'For freshers, technical projects serve as primary proof of execution in place of full-time work.'
        : 'Demonstrates modern architecture and hands-on tool mastery beyond daily maintenance.',
      criteria: 'Projects & Technical Portfolio',
      estimatedMinutes: 20,
      potentialGain: gain,
      targetTab: 'rewriter',
      roi: gain / 20
    });
  }

  // 6. Summary rewrite
  const summaryComp = completeness.components.find(c => c.key === 'summaryQuality');
  if (summaryComp && summaryComp.score < summaryComp.max) {
    const gain = summaryComp.max - summaryComp.score;
    candidateTasks.push({
      id: 'task-summary',
      title: 'Craft a 3-Sentence Professional Summary Pitch',
      description: 'Remove generic objective clichés ("looking for an opportunity") and lead with your core technical depth and verified achievements.',
      reason: 'Recruiters read the summary to confirm role seniority and specialization before viewing experience.',
      criteria: 'Professional Summary Pitch',
      estimatedMinutes: 10,
      potentialGain: gain,
      targetTab: 'headlines',
      roi: gain / 10
    });
  }

  // 7. ATS parseability fix
  const atsComp = completeness.components.find(c => c.key === 'atsReadability');
  if (atsComp && atsComp.score < atsComp.max) {
    const gain = atsComp.max - atsComp.score;
    candidateTasks.push({
      id: 'task-ats',
      title: 'Standardize Resume Section Headers & Single-Column Layout',
      description: 'Ensure standard headers (EXPERIENCE, EDUCATION, SKILLS, SUMMARY, PROJECTS) in single-column layout so automated parsers do not drop content.',
      reason: 'Non-standard headings or complex multi-column tables risk losing key sections in recruiting software.',
      criteria: 'ATS Parseability & Section Structure',
      estimatedMinutes: 10,
      potentialGain: gain,
      targetTab: 'export',
      roi: gain / 10
    });
  }

  // 8. Distractor keyword removal
  if (keywordAnalysis.distractorsToRemove.length > 0) {
    candidateTasks.push({
      id: 'task-distractors',
      title: 'Prune Low-Value Generic Skills',
      description: `Remove outdated noise keywords (${keywordAnalysis.distractorsToRemove.slice(0, 2).map(d => d.term).join(', ')}) that dilute your technical positioning.`,
      reason: 'Generic office skills dilute keyword relevance in recruiter search filters.',
      criteria: 'Skill & Search Keyword Relevance',
      estimatedMinutes: 5,
      potentialGain: 2,
      targetTab: 'keywords',
      roi: 2 / 5
    });
  }

  // Sort candidate tasks by points-per-minute ROI (highest ROI first)
  candidateTasks.sort((a, b) => b.roi - a.roi);

  // Group into Day buckets, capping Today to < 45 min
  const prioritized = candidateTasks.slice(0, 10);

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
      completed: false,
      reason: t.reason,
      criteria: t.criteria,
      headroomPoints: clampedGain
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
