/**
 * SCORING ENGINE WEIGHTS (Configurable, exactly 100 points total)
 * Single source of truth shared by all pages.
 */

export interface ScoreWeights {
  headlineClarity: number;        // 10
  summaryQuality: number;         // 10
  skillKeywordRelevance: number;  // 15
  experienceRelevance: number;    // 15
  achievementImpact: number;      // 10
  projectsPortfolio: number;      // 12
  educationCertifications: number;// 8
  atsReadability: number;         // 8
  targetRoleAlignment: number;    // 8
  completenessConsistency: number;// 4
}

/** Standard weights for experienced candidates (Total = 100) */
export const STANDARD_SCORE_WEIGHTS: ScoreWeights = {
  headlineClarity: 10,
  summaryQuality: 10,
  skillKeywordRelevance: 15,
  experienceRelevance: 15,
  achievementImpact: 10,
  projectsPortfolio: 12,
  educationCertifications: 8,
  atsReadability: 8,
  targetRoleAlignment: 8,
  completenessConsistency: 4
};

/**
 * Fresher weights: dynamically reweights experience-dependent criteria
 * toward projects, portfolio, and demonstrated skills rather than
 * penalizing the lack of commercial employment history. (Total = 100)
 */
export const FRESHER_SCORE_WEIGHTS: ScoreWeights = {
  headlineClarity: 10,
  summaryQuality: 10,
  skillKeywordRelevance: 18,      // +3: fundamentals & coursework depth
  experienceRelevance: 5,          // -10: evaluated via internships, labs, open source
  achievementImpact: 10,          // practical problem solving
  projectsPortfolio: 19,          // +7: verified hands-on projects & live links
  educationCertifications: 8,     // academic honors & credentials
  atsReadability: 8,              // clean single-column structure
  targetRoleAlignment: 8,         // core role keyword alignment
  completenessConsistency: 4      // contact & integrity
};

/** Backward-compatible alias for existing imports */
export const COMPONENT_WEIGHTS = {
  headlineClarity: 10,
  summaryQuality: 10,
  bulletQuality: 15,
  skillStructure: 15,
  educationDetail: 8,
  projectsProof: 12,
  certifications: 8,
  parseability: 8,
  platformConsistency: 8,
  contactCredibility: 4
} as const;

export const PERSONA_WEIGHTS = {
  startup: { keyword: 0.20, filter: 0.15, first6: 0.25, differentiation: 0.25, recency: 0.10, proof: 0.05 },
  enterprise: { keyword: 0.35, filter: 0.30, first6: 0.20, differentiation: 0.05, recency: 0.05, proof: 0.05 },
  consultancy: { keyword: 0.30, filter: 0.20, first6: 0.20, differentiation: 0.10, recency: 0.15, proof: 0.05 },
  hrScreen: { keyword: 0.25, filter: 0.30, first6: 0.25, differentiation: 0.05, recency: 0.05, proof: 0.10 }
} as const;

/**
 * Normalizes remaining weights if one or more criteria are not applicable.
 * Uses largest-remainder method so the sum is guaranteed to equal exactly 100.
 */
export function normalizeWeights(
  baseWeights: ScoreWeights,
  applicableKeys: (keyof ScoreWeights)[]
): { normalized: ScoreWeights; note: string } {
  if (applicableKeys.length === 0) {
    return {
      normalized: { ...baseWeights },
      note: 'No active keys specified; using base weights.'
    };
  }

  const sumApplicable = applicableKeys.reduce((acc, key) => acc + (baseWeights[key] || 0), 0);
  if (sumApplicable === 0) {
    return {
      normalized: { ...baseWeights },
      note: 'Sum of applicable weights was zero; using base weights.'
    };
  }

  const result: Partial<ScoreWeights> = {};
  let currentSum = 0;

  applicableKeys.forEach((key) => {
    const rawProportion = ((baseWeights[key] || 0) / sumApplicable) * 100;
    const rounded = Math.round(rawProportion);
    result[key] = rounded;
    currentSum += rounded;
  });

  // Adjust any rounding drift (e.g. 99 or 101) onto the highest-weighted active component
  const diff = 100 - currentSum;
  if (diff !== 0 && applicableKeys.length > 0) {
    const highestKey = applicableKeys.reduce((maxKey, k) =>
      (result[k] || 0) > (result[maxKey] || 0) ? k : maxKey
    , applicableKeys[0]);
    result[highestKey] = (result[highestKey] || 0) + diff;
  }

  // Set non-applicable to 0
  const allKeys = Object.keys(baseWeights) as (keyof ScoreWeights)[];
  allKeys.forEach((k) => {
    if (!applicableKeys.includes(k)) {
      result[k] = 0;
    }
  });

  return {
    normalized: result as ScoreWeights,
    note: `Normalized across ${applicableKeys.length} active criteria using proportional reallocation (Total: 100 pts).`
  };
}
