import { ParsedProfile } from '@/types';
import { BACKEND_METRO_BENCHMARK, DATA_VERSION, AS_OF_DATE, SAMPLE_NOTE, PercentileSet } from '@/lib/data/benchmarks';
import { calculateCompletenessScore } from './completeness';
import { calculateVisibilityScore } from './visibility';

export interface ProfileBenchmarkComparison {
  dataVersion: string;
  dataAsOf: string;
  sampleNote: string;
  sampleSize: number;
  userCompletenessScore: number;
  userVisibilityScore: number;
  completenessPercentile: number;
  visibilityPercentile: number;
  dimensionComparisons: {
    dimension: string;
    userScore: number;
    medianScore: number;
    topDecileScore: number;
    standing: 'ABOVE_AVERAGE' | 'MEDIAN' | 'BELOW_AVERAGE';
  }[];
}

function calculatePercentile(score: number, percentiles: PercentileSet): number {
  if (score >= percentiles.p90) return 92;
  if (score >= percentiles.p75) return 75 + Math.round(((score - percentiles.p75) / (percentiles.p90 - percentiles.p75)) * 15);
  if (score >= percentiles.p50) return 50 + Math.round(((score - percentiles.p50) / (percentiles.p75 - percentiles.p50)) * 25);
  if (score >= percentiles.p25) return 25 + Math.round(((score - percentiles.p25) / (percentiles.p50 - percentiles.p25)) * 25);
  if (score >= percentiles.p10) return 10 + Math.round(((score - percentiles.p10) / (percentiles.p25 - percentiles.p10)) * 15);
  return Math.max(5, Math.round((score / percentiles.p10) * 10));
}

export function compareProfileToBenchmark(profile: ParsedProfile): ProfileBenchmarkComparison {
  const completeness = calculateCompletenessScore(profile);
  const visibility = calculateVisibilityScore(profile);

  const bench = BACKEND_METRO_BENCHMARK;

  const compPercentile = calculatePercentile(completeness.overallScore, bench.completeness);
  const visPercentile = calculatePercentile(visibility.score, bench.visibility);

  const dims = [
    {
      dimension: 'Headline & Target Role',
      userScore: completeness.components.find(c => c.key === 'headlineClarity')?.score || 6,
      medianScore: bench.dimensions.headline?.p50 || 11,
      topDecileScore: bench.dimensions.headline?.p90 || 12
    },
    {
      dimension: 'Bullet Quantification',
      userScore: completeness.components.find(c => c.key === 'bulletQuality')?.score || 8,
      medianScore: bench.dimensions.bullets?.p50 || 15,
      topDecileScore: bench.dimensions.bullets?.p90 || 20
    },
    {
      dimension: 'Skills Section Architecture',
      userScore: completeness.components.find(c => c.key === 'skillStructure')?.score || 8,
      medianScore: bench.dimensions.skills?.p50 || 12,
      topDecileScore: bench.dimensions.skills?.p90 || 15
    },
    {
      dimension: 'ATS Parseability',
      userScore: completeness.components.find(c => c.key === 'parseability')?.score || 8,
      medianScore: bench.dimensions.parseability?.p50 || 10,
      topDecileScore: bench.dimensions.parseability?.p90 || 10
    }
  ].map(d => ({
    ...d,
    standing: (d.userScore >= d.medianScore
      ? (d.userScore >= d.topDecileScore ? 'ABOVE_AVERAGE' : 'MEDIAN')
      : 'BELOW_AVERAGE') as 'ABOVE_AVERAGE' | 'MEDIAN' | 'BELOW_AVERAGE'
  }));

  return {
    dataVersion: DATA_VERSION,
    dataAsOf: AS_OF_DATE,
    sampleNote: SAMPLE_NOTE,
    sampleSize: bench.n,
    userCompletenessScore: completeness.overallScore,
    userVisibilityScore: visibility.score,
    completenessPercentile: compPercentile,
    visibilityPercentile: visPercentile,
    dimensionComparisons: dims
  };
}
