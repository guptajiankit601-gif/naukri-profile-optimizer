# 09 Gemini API Integration

- **Model:** `gemini-2.0-flash`
- **Fallback Model:** `gemini-1.5-flash` / Deterministic Template Engine
- **Temperature:** 0.4 (low creativity, factual rewriting only)
- **Zero Hallucination Guardrail:** The system rejects any generated variants that fabricate metrics not supplied by the candidate.
- **Server-Side Only:** Client never interacts directly with Gemini; all requests pass through `/api/ai/rewrite`.
