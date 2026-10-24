export * from './weights';
export * from './rules';
export * from './completeness';
export * from './visibility';
export * from './personas';
export * from './benchmark';
export * from './keywords';
export * from './headline';

import { ParsedProfile, ScoreReport } from '@/types';
import { calculateCompletenessScore } from './completeness';

/**
 * Primary synchronous score calculation entrypoint
 */
export function calculateScore(profile: ParsedProfile): ScoreReport {
  return calculateCompletenessScore(profile);
}
