# SkillAtlas

**Your technical journey, mapped.**

SkillAtlas is a Personal Technical Identity Map. It connects projects, learning,
technologies, experience, achievements, and evidence (demo GitHub + demo LinkedIn)
into one understandable map of a person's technical journey — then shows career
alignment, skill gaps, the best next skill, and What-If simulations.

This is a hackathon build. **Everything is fictional demo data** for one persona:
Alex Sharma, Junior Web Developer, Kathmandu.

## Run

```bash
npm install
npm run dev
```

Demo login: `Demo-001` / `Demo@001` (client-side gate only, not real auth).

## What is real vs demo

| Part | Status |
|---|---|
| Projects / learning / experience / achievements | DEMO DATA (fictional) |
| GitHub integration | Simulated — no OAuth, no API calls (`app/lib/demoGithub.ts`) |
| LinkedIn integration | Simulated — no OAuth, no scraping |
| Evidence scoring | Deterministic (`app/lib/evidence.ts`) |
| Career alignment | Deterministic weighted formula (`app/lib/careers.ts`) |
| Next-skill ranking / What-If | Deterministic, client-side only |
| Gemini AI insights | Optional (`GEMINI_API_KEY`), degrades gracefully |

## Architecture

- Next.js App Router + TypeScript + Tailwind v4 + shadcn-style UI primitives
- `@xyflow/react` identity graph (`app/lib/atlas.ts` builds nodes/edges deterministically)
- Single-page shell with section tabs: Atlas · Projects · Learning · Technologies · Achievements · Career · Integrations · Profile
- `/api/insight` — the only server endpoint that calls an LLM (Gemini free tier)

## Core loop

LEARN → BUILD → EXPERIENCE → ACHIEVE → COLLECT EVIDENCE → UNDERSTAND YOUR
TECHNICAL IDENTITY → CHOOSE A CAREER → FIND THE GAP → BEST NEXT SKILL → SIMULATE.
