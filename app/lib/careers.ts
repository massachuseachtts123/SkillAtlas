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

// Curated free learning resources for missing/developing skills.
// Links are stable, high-quality, no-login content (official docs, MDN, freeCodeCamp, etc.).
export const LEARNING_RESOURCES: Record<string, { title: string; url: string; type: "docs" | "course" | "guide" }[]> = {
  Docker: [
    { title: "Docker Official Get Started", url: "https://docs.docker.com/get-started/", type: "docs" },
    { title: "Docker for Beginners (freeCodeCamp, 2h)", url: "https://www.youtube.com/watch?v=pTFZFxd4hOI", type: "course" },
  ],
  "CI/CD": [
    { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "docs" },
    { title: "CI/CD with GitHub Actions (freeCodeCamp)", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", type: "course" },
  ],
  TypeScript: [
    { title: "TypeScript Handbook (Official)", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "docs" },
    { title: "TypeScript Course (freeCodeCamp, 5h)", url: "https://www.youtube.com/watch?v=gp5H0Vw39yw", type: "course" },
  ],
  SQL: [
    { title: "PostgreSQL Tutorial (Official)", url: "https://www.postgresql.org/docs/current/tutorial.html", type: "docs" },
    { title: "SQL for Data Analysis (Khan Academy)", url: "https://www.khanacademy.org/computing/computer-programming/sql", type: "course" },
  ],
  Kubernetes: [
    { title: "Kubernetes Basics (Official)", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", type: "docs" },
    { title: "Kubernetes for Beginners (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=d6Avejiq7zU", type: "course" },
  ],
  AWS: [
    { title: "AWS Free Tier & Getting Started", url: "https://aws.amazon.com/free/", type: "docs" },
    { title: "AWS Cloud Practitioner (freeCodeCamp, 12h)", url: "https://www.youtube.com/watch?v=3hLmDS179YE", type: "course" },
  ],
  Linux: [
    { title: "Linux Journey (Interactive)", url: "https://linuxjourney.com/", type: "guide" },
    { title: "The Linux Command Line (Book, free)", url: "http://linuxcommand.org/tlcl.php", type: "guide" },
  ],
  Bash: [
    { title: "Bash Guide (mywiki)", url: "https://mywiki.wooledge.org/BashGuide", type: "guide" },
    { title: "Shell Scripting Tutorial (freeCodeCamp)", url: "https://www.youtube.com/watch?v=e7BufAVwDiM", type: "course" },
  ],
  Express: [
    { title: "Express.js Guide (Official)", url: "https://expressjs.com/en/guide/routing.html", type: "docs" },
    { title: "Node.js & Express Course (freeCodeCamp, 2h)", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "course" },
  ],
  PyTorch: [
    { title: "PyTorch Tutorials (Official)", url: "https://pytorch.org/tutorials/", type: "docs" },
    { title: "Deep Learning with PyTorch (freeCodeCamp, 4h)", url: "https://www.youtube.com/watch?v=GIsg-ZUy0MY", type: "course" },
  ],
  TensorFlow: [
    { title: "TensorFlow Tutorials (Official)", url: "https://www.tensorflow.org/tutorials", type: "docs" },
    { title: "TensorFlow 2.0 Course (freeCodeCamp, 7h)", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", type: "course" },
  ],
  Pandas: [
    { title: "Pandas User Guide (Official)", url: "https://pandas.pydata.org/docs/user_guide/index.html", type: "docs" },
    { title: "Data Analysis with Pandas (freeCodeCamp, 1h)", url: "https://www.youtube.com/watch?v=vmEHCJofslg", type: "course" },
  ],
  NumPy: [
    { title: "NumPy Quickstart (Official)", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "docs" },
    { title: "NumPy Tutorial (Data School, 1h)", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", type: "course" },
  ],
  "scikit-learn": [
    { title: "scikit-learn User Guide (Official)", url: "https://scikit-learn.org/stable/user_guide.html", type: "docs" },
    { title: "Machine Learning with scikit-learn (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", type: "course" },
  ],
  Matplotlib: [
    { title: "Matplotlib Tutorials (Official)", url: "https://matplotlib.org/stable/tutorials/index.html", type: "docs" },
    { title: "Data Visualization with Matplotlib (freeCodeCamp)", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI", type: "course" },
  ],
  Playwright: [
    { title: "Playwright Docs (Official)", url: "https://playwright.dev/docs/intro", type: "docs" },
    { title: "Playwright Testing Course (freeCodeCamp, 2h)", url: "https://www.youtube.com/watch?v=Uu8pHG_8wjE", type: "course" },
  ],
  Cypress: [
    { title: "Cypress Docs (Official)", url: "https://docs.cypress.io/", type: "docs" },
    { title: "Cypress Testing Course (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=5oQZ9T8yLZM", type: "course" },
  ],
  Selenium: [
    { title: "Selenium Documentation", url: "https://www.selenium.dev/documentation/", type: "docs" },
    { title: "Selenium WebDriver with Java (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=Wj-IQDjTspA", type: "course" },
  ],
  Cryptography: [
    { title: "Cryptography 101 (Crypto101.io, free book)", url: "https://www.crypto101.io/", type: "guide" },
    { title: "Applied Cryptography (Coursera, free audit)", url: "https://www.coursera.org/learn/crypto", type: "course" },
  ],
  Spark: [
    { title: "Spark Documentation (Official)", url: "https://spark.apache.org/docs/latest/", type: "docs" },
    { title: "Apache Spark Tutorial (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=_C8kWwMvw0o", type: "course" },
  ],
  Airflow: [
    { title: "Airflow Documentation (Official)", url: "https://airflow.apache.org/docs/", type: "docs" },
    { title: "Apache Airflow Course (Astronomer Academy, free)", url: "https://academy.astronomer.io/", type: "course" },
  ],
  Terraform: [
    { title: "Terraform Tutorials (Official)", url: "https://developer.hashicorp.com/terraform/tutorials", type: "docs" },
    { title: "Terraform for Beginners (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", type: "course" },
  ],
  "React Native": [
    { title: "React Native Docs (Official)", url: "https://reactnative.dev/docs/getting-started", type: "docs" },
    { title: "React Native Course (freeCodeCamp, 3h)", url: "https://www.youtube.com/watch?v=Hf4MJH0jDb4", type: "course" },
  ],
  Flutter: [
    { title: "Flutter Documentation (Official)", url: "https://docs.flutter.dev/", type: "docs" },
    { title: "Flutter Course (freeCodeCamp, 4h)", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", type: "course" },
  ],
  Kotlin: [
    { title: "Kotlin Documentation (Official)", url: "https://kotlinlang.org/docs/home.html", type: "docs" },
    { title: "Kotlin Bootcamp (Google, free)", url: "https://developer.android.com/courses/kotlin-bootcamp", type: "course" },
  ],
  Wireshark: [
    { title: "Wireshark User Guide (Official)", url: "https://www.wireshark.org/docs/wsug_html_chunked/", type: "docs" },
    { title: "Wireshark Tutorial (freeCodeCamp, 1h)", url: "https://www.youtube.com/watch?v=BMED9YQcObM", type: "course" },
  ],
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
  resources: { title: string; url: string; type: "docs" | "course" | "guide" }[]
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
      resources: LEARNING_RESOURCES[cand] ?? [],
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
