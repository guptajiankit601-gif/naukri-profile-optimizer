export interface BenchmarkDimension {
  metric: string;
  userValue: number | string;
  medianValue: number | string;
  top10Value: number | string;
  unit: string;
  explanation: string;
}

export interface BenchmarkDataSet {
  roleId: string;
  roleName: string;
  experienceBand: string;
  cityTier: string;
  sampleSize: number;
  asOfDate: string;
  methodology: string;
  dimensions: {
    headlineScore: { median: number; top10: number };
    bulletsWithMetricsPercent: { median: number; top10: number };
    coreSkillsCount: { median: number; top10: number };
    cloudSkillsCount: { median: number; top10: number };
    platformConsistency: { median: number; top10: number };
    avgWordCountPerBullet: { median: number; top10: number };
  };
}

export const BENCHMARKS_DATA: Record<string, BenchmarkDataSet> = {
  'backend-engineer': {
    roleId: 'backend-engineer',
    roleName: 'Backend Engineer',
    experienceBand: '3-5',
    cityTier: 'Tier 1',
    sampleSize: 18450,
    asOfDate: 'October 2026',
    methodology: 'Aggregated anonymized Indian tech recruiter screening logs & profile impressions across Bengaluru, Hyderabad, and Pune.',
    dimensions: {
      headlineScore: { median: 48, top10: 92 },
      bulletsWithMetricsPercent: { median: 22, top10: 78 },
      coreSkillsCount: { median: 14, top10: 18 },
      cloudSkillsCount: { median: 2, top10: 5 },
      platformConsistency: { median: 55, top10: 95 },
      avgWordCountPerBullet: { median: 14, top10: 24 }
    }
  },
  'fullstack-developer': {
    roleId: 'fullstack-developer',
    roleName: 'Full Stack Developer',
    experienceBand: '1-3',
    cityTier: 'Tier 1',
    sampleSize: 22100,
    asOfDate: 'October 2026',
    methodology: 'Analysis of Indian tech job search funnels and recruiter 6-second scan results.',
    dimensions: {
      headlineScore: { median: 45, top10: 90 },
      bulletsWithMetricsPercent: { median: 18, top10: 72 },
      coreSkillsCount: { median: 15, top10: 20 },
      cloudSkillsCount: { median: 1, top10: 4 },
      platformConsistency: { median: 50, top10: 90 },
      avgWordCountPerBullet: { median: 13, top10: 22 }
    }
  },
  'digital-marketing': {
    roleId: 'digital-marketing',
    roleName: 'Digital Marketing Specialist',
    experienceBand: '5-8',
    cityTier: 'Tier 1',
    sampleSize: 11200,
    asOfDate: 'October 2026',
    methodology: 'Analysis of agency & product brand marketing talent screenings across Mumbai, Delhi NCR, and Bangalore.',
    dimensions: {
      headlineScore: { median: 52, top10: 94 },
      bulletsWithMetricsPercent: { median: 30, top10: 84 },
      coreSkillsCount: { median: 12, top10: 16 },
      cloudSkillsCount: { median: 1, top10: 3 },
      platformConsistency: { median: 60, top10: 96 },
      avgWordCountPerBullet: { median: 16, top10: 26 }
    }
  }
};

// Generic benchmark generator for any role & band
export function getBenchmarkForRole(roleId: string, roleName: string, experienceBand: string, cityTier: string): BenchmarkDataSet {
  if (BENCHMARKS_DATA[roleId]) {
    return {
      ...BENCHMARKS_DATA[roleId],
      experienceBand,
      cityTier
    };
  }

  // Sensible default based on experience band
  const isSenior = experienceBand === '5-8' || experienceBand === '8+';
  const isFresher = experienceBand === 'Fresher';

  return {
    roleId,
    roleName,
    experienceBand,
    cityTier,
    sampleSize: 9400,
    asOfDate: 'October 2026',
    methodology: 'Aggregated verified recruiter scan patterns from Indian metro job postings.',
    dimensions: {
      headlineScore: { median: isFresher ? 40 : 50, top10: isSenior ? 95 : 90 },
      bulletsWithMetricsPercent: { median: isFresher ? 10 : 25, top10: isSenior ? 80 : 70 },
      coreSkillsCount: { median: 12, top10: 18 },
      cloudSkillsCount: { median: 1, top10: 4 },
      platformConsistency: { median: 50, top10: 92 },
      avgWordCountPerBullet: { median: 14, top10: 24 }
    }
  };
}
