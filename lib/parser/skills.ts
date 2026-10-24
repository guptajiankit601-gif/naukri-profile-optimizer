import { extractSkills } from './extract-skills';
import { matchSkillsInText, SkillDefinition, SKILLS_DICTIONARY } from '@/lib/data/skills-dict';

export { extractSkills };

export interface CategorizedSkills {
  hardSkills: string[];
  softSkills: string[];
  toolsAndFrameworks: string[];
  cloudAndDevOps: string[];
  all: string[];
}

export function extractAndCategorizeSkills(rawText: string, explicitLines: string[] = []): CategorizedSkills {
  const matched = extractSkills(rawText, explicitLines);

  const hard: string[] = [];
  const soft: string[] = [];
  const tools: string[] = [];
  const cloud: string[] = [];

  const entryMap = new Map<string, SkillDefinition>();
  for (const entry of SKILLS_DICTIONARY) {
    entryMap.set(entry.name.toLowerCase(), entry);
    if (entry.aliases) {
      for (const a of entry.aliases) {
        entryMap.set(a.toLowerCase(), entry);
      }
    }
  }

  for (const s of matched) {
    const entry = entryMap.get(s.toLowerCase());
    if (entry) {
      if (entry.category === 'soft') {
        soft.push(entry.name);
      } else if (entry.category === 'cloud' || entry.category === 'devops') {
        cloud.push(entry.name);
      } else if (entry.category === 'tool' || entry.category === 'database') {
        tools.push(entry.name);
      } else {
        hard.push(entry.name);
      }
    } else {
      hard.push(s);
    }
  }

  return {
    hardSkills: Array.from(new Set(hard)),
    softSkills: Array.from(new Set(soft)),
    toolsAndFrameworks: Array.from(new Set(tools)),
    cloudAndDevOps: Array.from(new Set(cloud)),
    all: matched
  };
}
