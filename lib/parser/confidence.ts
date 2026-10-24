import { ParsedSections } from './detect-sections';

export function scoreConfidence(sections: ParsedSections | Record<string, unknown[]>, skillsCount: number): Record<string, number> {
  const summaryLength = (sections as ParsedSections).summary?.length || 0;
  const experienceLength = (sections as ParsedSections).experience?.length || 0;
  const educationLength = (sections as ParsedSections).education?.length || 0;
  const projectsLength = (sections as ParsedSections).projects?.length || 0;

  return {
    headline: 88,
    summary: summaryLength > 0 ? 90 : 45,
    experience: experienceLength > 0 ? 85 : 50,
    skills: skillsCount > 5 ? (skillsCount > 35 ? 65 : 92) : 48,
    education: educationLength > 0 ? 95 : 60,
    projects: projectsLength > 0 ? 85 : 55
  };
}
