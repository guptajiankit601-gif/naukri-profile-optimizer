import { Intent } from '@/types';

export function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();
  if (lower.match(/\b(lead|led|spearhead|guided|directed|mentored|managed team|coordinated)\b/)) return 'led';
  if (lower.match(/\b(optimiz|improv|accelerat|faster|reduced|enhanced|boosted|streamlin)\b/)) return 'improved';
  if (lower.match(/\b(sales|sold|revenue|pipeline|closed|deal|client|mql|prospecting|bdr|sdr)\b/)) return 'sold';
  if (lower.match(/\b(support|triage|incident|bug|defect|ticket|fix|customer issue)\b/)) return 'supported';
  if (lower.match(/\b(taught|train|onboard|document|knowledge|upskill)\b/)) return 'taught';
  if (lower.match(/\b(analy|evaluat|researched|audit|metric|kpi)\b/)) return 'analyzed';
  if (lower.match(/\b(maintain|monitor|governed|managed|administer|infrastructure|server|uptime)\b/)) return 'managed';
  return 'built';
}
