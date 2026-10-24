export * from './extract-text';
export * from './detect-sections';
export * from './extract-experience';
export * from './extract-education';
export * from './extract-skills';
export * from './extract-metrics';
export * from './fetch-profile-url';
export * from './confidence';
export * from './extract';
export * from './sections';
export * from './dates';
export * from './skills';
export * from './metrics';

import { parseRawResumeText } from './extract-text';
import { ParsedProfile } from '@/types/profile';

/**
 * Single asynchronous entrypoint to orchestrate profile parsing
 */
export async function parseProfile(rawText: string, defaultRole: string = 'backend-engineer'): Promise<ParsedProfile> {
  return parseRawResumeText(rawText, defaultRole);
}
