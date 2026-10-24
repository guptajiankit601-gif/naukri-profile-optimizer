import { extractMetrics, ExtractedMetric } from './extract-metrics';

export { extractMetrics };
export type { ExtractedMetric };

export interface DetailedMetric {
  value: string;
  type: 'percentage' | 'currency' | 'scale' | 'speed_latency' | 'team_count' | 'other';
  raw: string;
}

export function extractDetailedMetrics(text: string): DetailedMetric[] {
  const base = extractMetrics(text);
  const detailed: DetailedMetric[] = [];

  for (const item of base) {
    let type: DetailedMetric['type'] = 'other';
    const val = item.value;

    if (/%/.test(val)) {
      type = 'percentage';
    } else if (/[₹$]|rs\.?|inr|lakh|crore|cr\b/i.test(val)) {
      type = 'currency';
    } else if (/\b(users|dau|mau|clients|queries|tps|rps|req\/sec)\b/i.test(val)) {
      type = 'scale';
    } else if (/\b(ms|seconds|latency|drop|faster|reduction)\b/i.test(val)) {
      type = 'speed_latency';
    } else if (/\b(engineers|developers|members|team of)\b/i.test(val)) {
      type = 'team_count';
    }

    detailed.push({
      value: item.value,
      type,
      raw: item.raw
    });
  }

  return detailed;
}
