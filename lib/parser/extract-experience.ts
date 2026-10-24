import { ExperienceItem } from '@/types';

export function extractExperience(expLines: string[]): ExperienceItem[] {
  const experiences: ExperienceItem[] = [];
  let currentExp: Partial<ExperienceItem> | null = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const isDateLine = /\b(19\d\d|20\d\d|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(line);
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('·');

    if (!isBullet && (line.includes(' - ') || line.includes(' | ') || isDateLine || currentExp === null)) {
      if (currentExp && currentExp.title) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          title: currentExp.title || 'Engineer',
          company: currentExp.company || 'Technology Company',
          startDate: currentExp.startDate || '2022',
          endDate: currentExp.endDate || 'Present',
          bullets: currentExp.bullets || []
        });
      }
      currentExp = {
        title: line.split(/[-–|]/)[0]?.trim() || line,
        company: line.split(/[-–|]/)[1]?.trim() || 'Company',
        startDate: '2022',
        endDate: 'Present',
        bullets: []
      };
    } else if (currentExp) {
      const cleanBullet = line.replace(/^[-•*·]\s*/, '').trim();
      if (cleanBullet.length > 8) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(cleanBullet);
      }
    }
  }

  if (currentExp && currentExp.title) {
    experiences.push({
      id: `exp-${experiences.length + 1}`,
      title: currentExp.title,
      company: currentExp.company || 'Company',
      startDate: currentExp.startDate || '2022',
      endDate: currentExp.endDate || 'Present',
      bullets: currentExp.bullets || []
    });
  }

  return experiences;
}
