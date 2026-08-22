// Static career requirements - mirrors sql/seed.sql. No DB needed for demo.
// Weights are 1-5 and shown to the user in tooltips.

import type { TechEvidence } from './evidence'

export type CareerDef = {
  name: string
  // tech name -> weight 1-5
  requirements: Record<string, number>
}

export const CAREERS: CareerDef[] = [
  {
    name: 'Backend Developer',
    requirements: {
      'Node.js': 5, Python: 5, PostgreSQL: 4, Docker: 4, AWS: 3,
      TypeScript: 3, REST: 3, Git: 2,
    },
  },
  {
    name: 'AI Engineer',
    requirements: {
      Python: 5, PyTorch: 4, TensorFlow: 3, 'scikit-learn': 3,
      Pandas: 3, NumPy: 3, Docker: 3, OpenAI: 4,
    },
  },
  {
    name: 'Frontend Developer',
    requirements: {
      JavaScript: 5, React: 5, TypeScript: 4, CSS: 4,
      HTML: 4, 'Next.js': 3, Tailwind: 3, Git: 2,
    },
  },
]

// Bucket -> evidence level on the same 1-5 scale as requirement weights.
// Shown in the UI tooltip next to every alignment %.
export const BUCKET_LEVEL: Record<TechEvidence['bucket'], number> = {
  Weak: 1,
  Moderate: 2,
  Strong: 4,
  'Very Strong': 5,
}

export const ALIGNMENT_FORMULA =
  'alignment% = Σ min(evidenceLevel, requiredWeight) ÷ Σ all requiredWeight × 100. evidenceLevel mapped from bucket: Weak=1 · Moderate=2 · Strong=4 · Very Strong=5.'

export type CareerAlignment = {
  name: string
  alignmentPct: number
  strong: { name: string; level: number; weight: number }[]
  developing: { name: string; level: number; weight: number }[]
  missing: { name: string; weight: number }[]
}

function norm(name: string): string {
  return name.trim().toLowerCase()
}

export function computeAlignment(
  career: CareerDef,
  evidence: TechEvidence[],
  overrides?: Record<string, number> // for "what if I learn X" - client-side only
): CareerAlignment {
  const byName = new Map(evidence.map((e) => [norm(e.name), e]))
  let earned = 0
  let total = 0
  const strong: CareerAlignment['strong'] = []
  const developing: CareerAlignment['developing'] = []
  const missing: CareerAlignment['missing'] = []

  for (const [tech, weight] of Object.entries(career.requirements)) {
    total += weight
    const ev = byName.get(norm(tech))
    let level = ev ? BUCKET_LEVEL[ev.bucket] : 0
    if (overrides && norm(tech) in overrides) level = overrides[norm(tech)]!

    if (level === 0) {
      missing.push({ name: tech, weight })
    } else {
      earned += Math.min(level, weight)
      const entry = { name: tech, level, weight }
      ;(level >= weight ? strong : developing).push(entry)
    }
  }

  return {
    name: career.name,
    alignmentPct: total === 0 ? 0 : Math.round((earned / total) * 100),
    strong,
    developing,
    missing,
  }
}
