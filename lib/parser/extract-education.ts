import { EducationItem } from '@/types';

export function extractEducation(eduLines: string[]): EducationItem[] {
  const education: EducationItem[] = [];

  for (const line of eduLines) {
    if (line.match(/(b\.?tech|b\.?e|m\.?tech|mca|bca|b\.?sc|mba|bachelor|master|diploma)/i)) {
      education.push({
        id: `edu-${education.length + 1}`,
        degree: line.split(/[-–|,]/)[0]?.trim() || line,
        institution: line.split(/[-–|,]/)[1]?.trim() || 'University',
        year: line.match(/20\d\d/)?.[0] || '2023',
        score: line.match(/\b\d+(\.\d+)?\s*(?:CGPA|%)\b/i)?.[0] || ''
      });
    }
  }

  return education;
}
