# 08 Security Architecture & Data Residency

## Principles
1. **Local-First Privacy:** Resumes are processed in browser memory and transient server route memory.
2. **Zero PII Logging:** Names, emails, and phone numbers are redacted in application logs.
3. **DPDP Compliance & 24h Auto-Purge:** Anonymous profiles and generated cache snapshots older than 24 hours are automatically purged.
4. **Rate Limiting:** IP and user quotas on parsing and AI endpoints.
5. **Safe Failovers:** If Gemini API is unreachable, the system fails over gracefully to deterministic template generation.
