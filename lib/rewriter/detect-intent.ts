import { Intent } from '@/types';

/**
 * Domain-aware intent classification with safe fallback.
 * Preserves the original bullet's technical skills, role, and domain context.
 * Never introduces unrelated sales, marketing, or other domain terminology into technical bullets.
 */
export function detectIntent(text: string, targetRole?: string): Intent {
  const lower = text.toLowerCase().trim();

  // 1. Detect technical / engineering context indicators
  // Note: Words like "client" in Indian IT services (e.g. "banking client", "US client") or architecture
  // ("client-server", "REST client") are common technical contexts and must NEVER imply sales.
  const isTechnicalContext = Boolean(
    lower.match(/\b(api|apis|rest|restful|backend|frontend|fullstack|java|spring|boot|microservice|microservices|python|django|fastapi|node|react|angular|vue|golang|kubernetes|docker|aws|azure|sql|nosql|postgres|mysql|mongodb|redis|kafka|graphql|ci\/cd|pipeline|database|endpoint|endpoints|sdk|web service|architecture|git|code|coding|software|testing|qa|devops)\b/) ||
    (targetRole && /engineer|developer|architect|devops|data|software|sde|qa|tester|programmer/i.test(targetRole))
  );

  // 2. Optimization & Performance
  if (lower.match(/\b(optimiz|improv|accelerat|faster|speedup|streamlin|refactor|enhanced performance|reduced latency|reduced query|low latency|query optimization|bottleneck)\b/)) {
    return 'improved';
  }

  // 3. Leadership & Coordination
  if (lower.match(/\b(lead|led|spearhead|guided|directed|mentored|managed team|squad lead|tech lead|headed team|coordinated across)\b/)) {
    return 'led';
  }

  // 4. Support, Bug Fixing & Defect Triage
  if (lower.match(/\b(support|triage|incident|bug|defect|ticket|fix|customer issue|troubleshoot|hotfix|l1|l2|l3)\b/)) {
    return 'supported';
  }

  // 5. Training & Knowledge Sharing
  if (lower.match(/\b(taught|train|training|onboard|onboarding|knowledge transfer|kt session|upskill|documentation)\b/)) {
    return 'taught';
  }

  // 6. Analysis & Research
  if (lower.match(/\b(analy|evaluat|researched|audit|metric|kpi|benchmarked|ab test)\b/)) {
    return 'analyzed';
  }

  // 7. Operations & Infrastructure Maintenance
  if (lower.match(/\b(infrastructure|server|uptime|clusters|administer|monitoring|devops|production cluster|sla)\b/)) {
    return 'managed';
  }

  // 8. Commercial Sales & Outbound Revenue ONLY
  // Strictly requires explicit commercial sales terms (e.g. quota, outbound, deal closing)
  // NEVER triggers on "client" in isolation.
  if (
    !isTechnicalContext &&
    lower.match(/\b(sales quota|closed \d+|generated revenue|outbound prospecting|cold call|cold outreach|bdr|sdr|mql|sql|arr growth|quota attainment|sales pipeline|booked ₹|booked \$)\b/)
  ) {
    return 'sold';
  }

  // 9. Engineering & Creation (default for development and technical work)
  if (
    lower.match(/\b(develop|developing|developed|built|building|architect|architected|architecting|engineered|engineering|implemented|implementing|constructed|created|creating|programmed|coded|designed api|authored|integrated|integrating|deployed|deploying)\b/) ||
    isTechnicalContext
  ) {
    return 'built';
  }

  // Safe fallback: default to 'built' (faithful constructive action)
  return 'built';
}
