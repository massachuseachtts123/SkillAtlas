// Static career requirements. Weights are 1-5 and shown to the user.
// Alignment is illustrative, not a scientifically validated probability.

import type { TechEvidence } from './evidence'

export type CareerDef = {
  name: string
  // tech name -> weight 1-5
  requirements: Record<string, number>
}

export const CAREERS: CareerDef[] = [
  {
    name: 'Full Stack Developer',
    requirements: {
      JavaScript: 4, TypeScript: 4, React: 4, 'Node.js': 4,
      MongoDB: 3, SQL: 2, 'REST APIs': 3, Git: 2, Docker: 3,
    },
  },
  {
    name: 'Frontend Developer',
    requirements: {
      JavaScript: 5, React: 5, TypeScript: 4, CSS: 4,
      HTML: 4, Git: 2,
    },
  },
  {
    name: 'Backend Developer',
    requirements: {
      'Node.js': 5, Python: 5, SQL: 4, Docker: 4,
      'REST APIs': 3, Git: 2, Express: 2,
    },
  },
  {
    name: 'Mobile Developer',
    requirements: {
      'React Native': 4, Flutter: 3, JavaScript: 3,
      Firebase: 2, Git: 2, Kotlin: 3,
    },
  },
  {
    name: 'DevOps Engineer',
    requirements: {
      Docker: 5, Kubernetes: 5, 'CI/CD': 4, AWS: 4,
      Linux: 3, Python: 3, Git: 3,
    },
  },
  {
    name: 'Cloud Engineer',
    requirements: {
      AWS: 5, Terraform: 4, Docker: 3,
      Kubernetes: 3, Linux: 3, Python: 2,
    },
  },
  {
    name: 'AI Engineer',
    requirements: {
      Python: 5, PyTorch: 4, Pandas: 3, NumPy: 3,
      Docker: 3, SQL: 2, 'REST APIs': 2,
    },
  },
  {
    name: 'Data Engineer',
    requirements: {
      SQL: 5, Python: 4, Spark: 4, Airflow: 3,
      MongoDB: 2, AWS: 3, Git: 2,
    },
  },
  {
    name: 'Data Scientist',
    requirements: {
      Python: 5, Pandas: 4, NumPy: 3, SQL: 3,
      'scikit-learn': 4, Matplotlib: 2,
    },
  },
  {
    name: 'Machine Learning Engineer',
    requirements: {
      Python: 5, PyTorch: 4, TensorFlow: 3, Docker: 3,
      Pandas: 2, 'REST APIs': 2, Git: 2,
    },
  },
  {
    name: 'Cybersecurity Engineer',
    requirements: {
      Linux: 5, Python: 4, Bash: 3, Cryptography: 3,
      Docker: 2, Git: 2,
    },
  },
  {
    name: 'QA / Test Automation Engineer',
    requirements: {
      Playwright: 4, Cypress: 4, Selenium: 4, Python: 3,
      JavaScript: 3, Git: 2, 'CI/CD': 3,
    },
  },
]

// Bucket -> evidence level on the same 1-5 scale as requirement weights.
export const BUCKET_LEVEL: Record<TechEvidence['bucket'], number> = {
  Weak: 1,
  Moderate: 2,
  Strong: 4,
  'Very Strong': 5,
}

export const ALIGNMENT_FORMULA =
  'alignment% = Σ min(evidenceLevel, requiredWeight) ÷ Σ all requiredWeight × 100. evidenceLevel mapped from bucket: Weak=1 · Moderate=2 · Strong=4 · Very Strong=5.'

// Static learning-effort estimates (1 = light, 3 = heavy). Product estimates,
// not scientific truth - shown transparently in the UI.
export const SKILL_EFFORT: Record<string, number> = {
  Docker: 2, 'CI/CD': 3, TypeScript: 2, SQL: 1, Kubernetes: 3, AWS: 3,
  Linux: 2, Bash: 1, Express: 1, PyTorch: 3, TensorFlow: 3, Pandas: 2,
  NumPy: 1, 'scikit-learn': 2, Matplotlib: 1, Playwright: 2, Cypress: 2,
  Selenium: 2, Cryptography: 3, Spark: 3, Airflow: 3, Terraform: 3,
  'React Native': 2, Flutter: 2, Kotlin: 2, Wireshark: 1,
}

export type SkillGapEntry = { name: string; level?: number; weight?: number }
export type CareerAlignment = {
  name: string
  alignmentPct: number
  strong: SkillGapEntry[]
  developing: SkillGapEntry[]
  missing: SkillGapEntry[]
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
  // Normalize override keys so "Docker" and "docker" both match.
  const normOverrides = new Map(
    overrides ? Object.entries(overrides).map(([k, v]) => [norm(k), v]) : []
  )
  let earned = 0
  let total = 0
  const strong: SkillGapEntry[] = []
  const developing: SkillGapEntry[] = []
  const missing: SkillGapEntry[] = []

  for (const [tech, weight] of Object.entries(career.requirements)) {
    total += weight
    const ev = byName.get(norm(tech))
    let level = ev ? BUCKET_LEVEL[ev.bucket] : 0
    if (normOverrides.has(norm(tech))) level = normOverrides.get(norm(tech))!

    if (level === 0) {
      missing.push({ name: tech, weight })
    } else {
      earned += Math.min(level, weight)
      ;(level >= weight ? strong : developing).push({ name: tech, level, weight })
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

const STRONG_EQUIV = 4 // level a simulated skill gets in What-If

export type NextSkillSuggestion = {
  name: string
  alignmentGain: number
  pathsBoosted: number
  importance: number
  effort: number
  score: number
  reason: string
}

// Deterministic next-best-skill ranking for one career. Every factor below is
// shown to the user - these are transparent product estimates, not predictions.
//   score = careerImportance + pathsBoosted×3 + inCareerGain − effort×2
export function rankNextSkills(
  career: CareerDef,
  evidence: TechEvidence[]
): NextSkillSuggestion[] {
  const byName = new Map(evidence.map((e) => [norm(e.name), e]))
  const base = computeAlignment(career, evidence)

  // Candidates: relevant skills Alex is missing or has only weak/moderate evidence for.
  const candidates = new Set<string>()
  for (const m of base.missing) candidates.add(m.name)
  for (const d of base.developing) if ((d.level ?? 0) <= 2) candidates.add(d.name)

  const suggestions: NextSkillSuggestion[] = []
  for (const cand of candidates) {
    const key = norm(cand)
    const effort = SKILL_EFFORT[cand] ?? 2

    // Career importance: total requirement weight across ALL careers asking for this skill.
    let importance = 0
    let pathsBoosted = 0
    let bestCompat: string[] = []
    for (const c of CAREERS) {
      const w = c.requirements[cand]
      if (w) importance += w
      const beforePct = computeAlignment(c, evidence).alignmentPct
      const afterPct = computeAlignment(c, evidence, { [key]: STRONG_EQUIV }).alignmentPct
      if (afterPct - beforePct >= 10) pathsBoosted++
      if (beforePct - afterPct !== 0 || w) {
        const owned = Object.keys(c.requirements).filter((t) => byName.has(norm(t)) && t !== cand)
        if (owned.length > bestCompat.length) bestCompat = owned
      }
    }

    const inCareerGain =
      computeAlignment(career, evidence, { [key]: STRONG_EQUIV }).alignmentPct -
      computeAlignment(career, evidence).alignmentPct

    const score = Math.round(importance + pathsBoosted * 3 + Math.max(inCareerGain, 0) - effort * 2)

    const compat = bestCompat.slice(0, 4).filter((t) => t !== cand)
    suggestions.push({
      name: cand,
      alignmentGain: inCareerGain,
      pathsBoosted,
      importance,
      effort,
      score,
      reason: `Builds on ${compat.join(", ")}. Asked for by ${CAREERS.filter((c) => c.requirements[cand]).length} careers${pathsBoosted ? `, would boost ${pathsBoosted} path${pathsBoosted > 1 ? "s" : ""} by 10+ pts` : ""}.`,
    })
  }

  return suggestions.sort((a, b) => b.score - a.score)
}

// Careers where reaching Strong in the given skill would lift alignment by 10+ points.
// Shown as "potential paths" in the What-If simulation.
export function newlyUnlockedCareers(evidence: TechEvidence[], skill: string): string[] {
  return CAREERS.filter((c) => {
    const before = computeAlignment(c, evidence).alignmentPct
    const after = computeAlignment(c, evidence, { [skill]: STRONG_EQUIV }).alignmentPct
    return after - before >= 10
  }).map((c) => c.name)
}
