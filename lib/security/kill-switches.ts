/**
 * INCIDENT RESPONSE KILL SWITCHES (SECURITY.md Section 19)
 * Allows operational shutoff of individual modules without redeploying.
 */

export function isAiEnabled(): boolean {
  if (process.env.ENABLE_AI === 'false') return false;
  return true;
}

export function isUrlImportEnabled(): boolean {
  if (process.env.ENABLE_URL_IMPORT === 'false') return false;
  return true;
}

export function isShareEnabled(): boolean {
  if (process.env.ENABLE_SHARE === 'false') return false;
  return true;
}

export function isAnalysisDisabled(): boolean {
  if (process.env.DISABLE_ANALYSIS === 'true') return true;
  return false;
}
