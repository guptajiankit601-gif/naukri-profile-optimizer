export const COMPONENT_WEIGHTS = {
  headlineClarity: 12,
  summaryQuality: 10,
  bulletQuality: 20,
  skillStructure: 15,
  educationDetail: 5,
  projectsProof: 8,
  certifications: 5,
  parseability: 10,
  platformConsistency: 10,
  contactCredibility: 5
} as const;

export const PERSONA_WEIGHTS = {
  startup: { keyword: 0.20, filter: 0.15, first6: 0.25, differentiation: 0.25, recency: 0.10, proof: 0.05 },
  enterprise: { keyword: 0.35, filter: 0.30, first6: 0.20, differentiation: 0.05, recency: 0.05, proof: 0.05 },
  consultancy: { keyword: 0.30, filter: 0.20, first6: 0.20, differentiation: 0.10, recency: 0.15, proof: 0.05 },
  hrScreen: { keyword: 0.25, filter: 0.30, first6: 0.25, differentiation: 0.05, recency: 0.05, proof: 0.10 }
} as const;
