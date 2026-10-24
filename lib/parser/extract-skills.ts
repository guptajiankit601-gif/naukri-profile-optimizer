import { matchSkillsInText } from '@/lib/data/skills-dict';

export function extractSkills(rawText: string, explicitSkillLines: string[] = []): string[] {
  const dictionaryMatches = matchSkillsInText(rawText).matchedSkills;
  if (dictionaryMatches.length > 0) {
    return dictionaryMatches;
  }

  if (explicitSkillLines.length > 0) {
    return explicitSkillLines
      .join(',')
      .split(/[,|•·\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 32);
  }

  return [];
}
