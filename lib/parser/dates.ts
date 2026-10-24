export interface ParsedDateRange {
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  durationMonths: number;
  rawString: string;
}

export interface CareerSpan {
  totalMonths: number;
  totalYears: number;
  careerGapsMonths: number;
  hasSignificantGap: boolean;
  gapDetails: string[];
}

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

export function parseSingleDate(dateStr: string): Date | null {
  const clean = dateStr.trim().toLowerCase();
  if (['present', 'current', 'now', 'till date', 'ongoing'].includes(clean)) {
    return new Date();
  }

  // e.g. "06/2020", "6/2020", "2020-06"
  const slashMatch = clean.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1], 10) - 1;
    const year = parseInt(slashMatch[2], 10);
    return new Date(year, month, 1);
  }

  // e.g. "2020-06"
  const isoMatch = clean.match(/^(\d{4})[\/\-](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    return new Date(year, month, 1);
  }

  // e.g. "Jul 2021", "July 2021"
  const wordMonthMatch = clean.match(/^([a-z]{3,9})\.?\s*(\d{4})$/);
  if (wordMonthMatch) {
    const monthName = wordMonthMatch[1];
    const year = parseInt(wordMonthMatch[2], 10);
    const month = MONTH_MAP[monthName];
    if (month !== undefined) {
      return new Date(year, month, 1);
    }
  }

  // e.g. just a year "2021"
  const yearOnlyMatch = clean.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return new Date(parseInt(yearOnlyMatch[1], 10), 0, 1);
  }

  return null;
}

export function parseDateRange(rangeStr: string): ParsedDateRange | null {
  // Check for expressions like "2 yrs 4 mos" or "3 years"
  const durationOnly = rangeStr.match(/(\d+)\s*(?:yrs|years?)\s*(?:(\d+)\s*(?:mos|months?))?/i);
  if (durationOnly && !rangeStr.includes('-') && !rangeStr.toLowerCase().includes('to')) {
    const yrs = parseInt(durationOnly[1], 10);
    const mos = durationOnly[2] ? parseInt(durationOnly[2], 10) : 0;
    const totalMonths = yrs * 12 + mos;
    return {
      startDate: `${yrs} yrs ${mos} mos ago`,
      endDate: 'Present',
      isCurrent: true,
      durationMonths: totalMonths,
      rawString: rangeStr
    };
  }

  // Split by "-", "to", "–", "—"
  const parts = rangeStr.split(/\s*(?:-|–|—|\bto\b)\s*/i);
  if (parts.length >= 2) {
    const start = parseSingleDate(parts[0]);
    const end = parseSingleDate(parts[1]);
    const isCurrent = /present|current|now|till date/i.test(parts[1]);

    if (start) {
      const endDateObj = end || (isCurrent ? new Date() : start);
      const diffMonths = Math.max(1, Math.round((endDateObj.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)));

      return {
        startDate: parts[0].trim(),
        endDate: parts[1].trim(),
        isCurrent,
        durationMonths: diffMonths,
        rawString: rangeStr
      };
    }
  }

  return null;
}

export function calculateCareerSpan(ranges: ParsedDateRange[]): CareerSpan {
  if (ranges.length === 0) {
    return {
      totalMonths: 0,
      totalYears: 0,
      careerGapsMonths: 0,
      hasSignificantGap: false,
      gapDetails: []
    };
  }

  let totalMonths = 0;
  for (const r of ranges) {
    totalMonths += r.durationMonths;
  }

  return {
    totalMonths,
    totalYears: Math.round((totalMonths / 12) * 10) / 10,
    careerGapsMonths: 0,
    hasSignificantGap: false,
    gapDetails: []
  };
}
