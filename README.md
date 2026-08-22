# SkillAtlas

Paste a GitHub username → get an evidence-based skill profile and career alignment scores.

**Every number is traceable.** Skills are extracted from real repo data (languages, topics, descriptions) with per-skill evidence levels (`Weak / Moderate / Strong / Very Strong`). Career alignment is a transparent weighted formula you can inspect — no black-box vibes.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, paste a GitHub username, hit Analyze.

## How scoring works

**Evidence level** per skill:
`raw = 2×(repos using it) + 1 if used in last 12 months + min(3, ⌊log₁₀(stars+1)⌋)`
→ Weak (0–2), Moderate (3–5), Strong (6–8), Very Strong (9+)

**Career alignment %**: `Σ min(evidenceLevel, weight) / Σ weights × 100`
Each career has weighted skill requirements; your evidence level is capped by how much each requirement matters.

Click any skill or percentage in the UI to see exactly how it was calculated.

## Optional env (all degrade gracefully — app works with none)

```bash
cp .env.example .env.local
```

- `GITHUB_TOKEN` — raises API limit from 60/hr to 5000/hr
- `OPENAI_API_KEY` or `GEMINI_API_KEY` — enables AI extraction of skills hidden in READMEs/descriptions + AI career insight summary (tagged `AI-INFERRED`, never mixed into verified evidence)
- Supabase vars — persistence layer (schema in `sql/schema.sql`); demo runs fine without it

## Stack

Next.js (App Router) · React Flow graph view · Tailwind v4 · shadcn/ui · Supabase (optional)
