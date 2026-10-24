import { detectSections, ParsedSections } from './detect-sections';
import { scoreConfidence } from './confidence';

export { detectSections };
export type { ParsedSections };

export interface SegmentedSectionsWithConfidence {
  sections: ParsedSections;
  confidence: Record<string, number>;
  presentSections: string[];
  missingSections: string[];
}

export function segmentResumeSections(rawText: string, skillCount: number = 0): SegmentedSectionsWithConfidence {
  const sections = detectSections(rawText);
  const confidence = scoreConfidence(sections, skillCount);

  const presentSections: string[] = [];
  const missingSections: string[] = [];

  const sectionKeys: (keyof ParsedSections)[] = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];

  for (const key of sectionKeys) {
    if (sections[key].length > 0) {
      presentSections.push(key);
    } else {
      missingSections.push(key);
    }
  }

  return {
    sections,
    confidence,
    presentSections,
    missingSections
  };
}
