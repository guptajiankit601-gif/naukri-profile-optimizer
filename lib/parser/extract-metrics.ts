export interface ExtractedMetric {
  value: string;
  unit?: string;
  raw: string;
}

export function extractMetrics(text: string): ExtractedMetric[] {
  const metricRegexes = [
    /\b\d+(\.\d+)?\s*%/g,
    /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\.\d+)?\s*(?:Cr|L|Lakh|K)?/gi,
    /\$\s*[\d,]+(?:\.\d+)?\s*(?:M|K|B)?/gi,
    /\b\d+(\.\d+)?\s*x\b/gi,
    /\b\d+\+?\s*(?:req\/sec|tps|rps|dau|mau|users|clients|engineers|queries|tickets)\b/gi
  ];

  const results: ExtractedMetric[] = [];
  for (const regex of metricRegexes) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => results.push({ value: m.trim(), raw: m.trim() }));
    }
  }
  return results;
}
