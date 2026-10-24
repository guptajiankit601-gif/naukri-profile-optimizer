import { JobDescriptionMatch } from '@/types';
import { ParsedJobDescription } from './parse-jd';

export interface ApplicationTimingAdvisory {
  timingWindow: 'APPLY_NOW_GOLDEN_48H' | 'APPLY_WITH_TWEAKS' | 'HOLD_AND_UPSKILL';
  headline: string;
  advice: string;
  reasons: string[];
}

export function generateApplicationRecommendations(
  match: JobDescriptionMatch,
  parsedJd: ParsedJobDescription
): {
  advisory: ApplicationTimingAdvisory;
  tailoringSteps: string[];
} {
  const score = match.matchScore;
  const missingCount = match.missingMustHaves.length;

  let advisory: ApplicationTimingAdvisory;

  if (score >= 75) {
    advisory = {
      timingWindow: 'APPLY_NOW_GOLDEN_48H',
      headline: '48-Hour Golden Application Window: Strong Fit',
      advice: 'Your profile matches 75%+ of this job description. On Indian job portals (Naukri/LinkedIn), 60% of recruiter screening shortlists happen within the first 48 hours of posting.',
      reasons: [
        'Apply within 48 hours before applicant volume hits 300+',
        `Matched ${match.matchedSkills.length} core required skills`,
        'Experience and compensation align with recruiter expectations'
      ]
    };
  } else if (score >= 50) {
    advisory = {
      timingWindow: 'APPLY_WITH_TWEAKS',
      headline: 'Spend 20 Minutes Tailoring Before Applying',
      advice: 'You have solid baseline match, but missing keywords will depress your ranking on automated recruiter filter queries.',
      reasons: [
        `Missing ${missingCount} key terms from the JD: ${match.missingMustHaves.slice(0, 3).map(m => m.skill).join(', ')}`,
        'Add verified instances of these tools to your skills and project bullets before submitting',
        'Apply once tailored to ensure you land in the recruiter top 20 candidates'
      ]
    };
  } else {
    advisory = {
      timingWindow: 'HOLD_AND_UPSKILL',
      headline: 'Low Fit: High Risk of Automated Rejection',
      advice: 'Your profile currently matches below 50% of the job criteria. Submitting now risks burning your application cooldown for this employer.',
      reasons: [
        'Experience band or core tech stack differs significantly from JD requirements',
        'Consider targeting adjacent roles or upskilling missing prerequisite technologies first'
      ]
    };
  }

  const tailoringSteps = match.missingMustHaves.slice(0, 4).map(m => 
    `Add "${m.skill}" to your skills section and mention how you used it in a bullet point.`
  );

  return {
    advisory,
    tailoringSteps
  };
}
