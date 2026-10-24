import { ParsedProfile } from '@/types';
import { ROLE_KEYWORDS_DATA } from '@/lib/data/keywords';
import { calculateVisibilityScore } from './visibility';

export type KeywordStatus = 'PRESENT' | 'WEAK' | 'MISSING' | 'NOISE';

export interface KeywordGapItem {
  term: string;
  category: 'must-have' | 'high-value' | 'booster' | 'distractor' | 'location';
  monthlySearches: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  status: KeywordStatus;
  occurrences: number;
  potentialPointGain: number;
}

export interface KeywordGapAnalysis {
  roleId: string;
  totalEvaluated: number;
  presentCount: number;
  weakCount: number;
  missingCount: number;
  noiseCount: number;
  keywords: KeywordGapItem[];
  highPriorityMissing: KeywordGapItem[];
  distractorsToRemove: KeywordGapItem[];
}

export function analyzeKeywordGaps(profile: ParsedProfile): KeywordGapAnalysis {
  const roleId = profile.targetRoleId || 'backend-engineer';
  const keywordData = ROLE_KEYWORDS_DATA[roleId] || ROLE_KEYWORDS_DATA['backend-engineer'] || [];
  const textLower = profile.rawText.toLowerCase();

  const items: KeywordGapItem[] = [];

  for (const kw of keywordData) {
    const termLower = kw.name.toLowerCase();
    // Count exact word occurrences
    const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = textLower.match(regex);
    const count = matches ? matches.length : 0;

    let status: KeywordStatus = 'MISSING';
    if (kw.category === 'distractor') {
      status = count > 0 ? 'NOISE' : 'PRESENT';
    } else if (count >= 2) {
      status = 'PRESENT';
    } else if (count === 1) {
      status = 'WEAK';
    } else {
      status = 'MISSING';
    }

    let pointGain = 0;
    if (status === 'MISSING') {
      pointGain = kw.importance === 'critical' ? 4 : kw.importance === 'high' ? 3 : 1;
    } else if (status === 'WEAK') {
      pointGain = kw.importance === 'critical' ? 2 : 1;
    }

    items.push({
      term: kw.name,
      category: kw.category,
      monthlySearches: kw.monthlySearches,
      importance: kw.importance,
      recommendation: kw.recommendation,
      status,
      occurrences: count,
      potentialPointGain: pointGain
    });
  }

  const highPriorityMissing = items
    .filter(i => (i.status === 'MISSING' || i.status === 'WEAK') && (i.importance === 'critical' || i.importance === 'high'))
    .sort((a, b) => b.potentialPointGain - a.potentialPointGain);

  const distractorsToRemove = items
    .filter(i => i.status === 'NOISE' || (i.category === 'distractor' && i.occurrences > 0));

  return {
    roleId,
    totalEvaluated: items.length,
    presentCount: items.filter(i => i.status === 'PRESENT').length,
    weakCount: items.filter(i => i.status === 'WEAK').length,
    missingCount: items.filter(i => i.status === 'MISSING').length,
    noiseCount: distractorsToRemove.length,
    keywords: items,
    highPriorityMissing,
    distractorsToRemove
  };
}

export function simulateKeywordAddition(
  profile: ParsedProfile,
  addedKeywords: string[]
): {
  originalScore: number;
  projectedScore: number;
  pointGain: number;
} {
  const currentVis = calculateVisibilityScore(profile).score;
  const simulatedProfile: ParsedProfile = {
    ...profile,
    skills: Array.from(new Set([...profile.skills, ...addedKeywords])),
    rawText: `${profile.rawText}\n\nAdditional Skills: ${addedKeywords.join(', ')}`
  };

  const projectedVis = calculateVisibilityScore(simulatedProfile).score;
  const pointGain = Math.max(0, projectedVis - currentVis);

  return {
    originalScore: currentVis,
    projectedScore: Math.min(100, projectedVis),
    pointGain
  };
}
