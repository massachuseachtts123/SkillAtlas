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
  {
    name: 'Full-Stack Developer',
    requirements: {
      JavaScript: 4, TypeScript: 4, React: 4, 'Node.js': 4,
      MongoDB: 3, PostgreSQL: 3, 'Next.js': 3, Git: 2,
    },
  },
  {
    name: 'DevOps Engineer',
    requirements: {
      Docker: 5, Kubernetes: 5, Terraform: 4, AWS: 4,
      'CI/CD': 4, Linux: 3, Python: 3, Git: 3,
    },
  },
  {
    name: 'Cloud Engineer',
    requirements: {
      AWS: 5, GCP: 4, Azure: 4, Terraform: 4,
      Docker: 3, Kubernetes: 3, Linux: 3, Python: 2,
    },
  },
  {
    name: 'Data Engineer',
    requirements: {
      SQL: 5, Python: 4, Spark: 4, Airflow: 3,
      Kafka: 3, PostgreSQL: 3, AWS: 3, Scala: 2,
    },
  },
  {
    name: 'Data Scientist',
    requirements: {
      Python: 5, Pandas: 4, 'scikit-learn': 4, NumPy: 3,
      SQL: 3, R: 3, TensorFlow: 2, Matplotlib: 2,
    },
  },
  {
    name: 'Machine Learning Engineer',
    requirements: {
      Python: 5, PyTorch: 4, TensorFlow: 3, Docker: 3,
      AWS: 3, MLOps: 3, Pandas: 2, Kubernetes: 2,
    },
  },
  {
    name: 'Mobile Developer',
    requirements: {
      Kotlin: 4, Swift: 4, 'React Native': 4, Flutter: 3,
      JavaScript: 3, Java: 2, Firebase: 2, Git: 2,
    },
  },
  {
    name: 'Site Reliability Engineer',
    requirements: {
      Linux: 5, Kubernetes: 4, Prometheus: 4, Docker: 3,
      Go: 3, Python: 3, Terraform: 3, Grafana: 2,
    },
  },
  {
    name: 'Cybersecurity Engineer',
    requirements: {
      Linux: 5, Python: 4, Wireshark: 3, Metasploit: 3,
      Docker: 2, AWS: 2, Cryptography: 3, Bash: 3,
    },
  },
  {
    name: 'QA / Test Automation Engineer',
    requirements: {
      Selenium: 4, Cypress: 4, Playwright: 4, Python: 3,
      JavaScript: 3, TypeScript: 2, Jest: 3, 'CI/CD': 3,
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
