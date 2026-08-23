// Deterministic multi-source evidence scoring - NEVER calls an LLM.
//
// Every technical claim gets an origin. Sources are tracked separately and
// never silently merged:
//   PROJECT (+2) · EXPERIENCE (+2) · ACHIEVEMENT (+1) · LEARNING (+1)
//   GITHUB_DEMO (+1 per repo, only after demo GitHub integration)
//   LINKEDIN_DEMO (self-described claim - capped at Moderate on its own)
//
// Buckets: 0–1 Weak | 2–3 Moderate | 4–6 Strong | 7+ Very Strong

import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS, LINKEDIN_DEMO } from "./demoData"
import { reposForTech } from "./demoGithub"

export type SourceKind =
  | "PROJECT"
  | "LEARNING"
  | "EXPERIENCE"
  | "ACHIEVEMENT"
  | "GITHUB_DEMO"
  | "LINKEDIN_DEMO"

export type TechEvidence = {
  name: string
  bucket: "Weak" | "Moderate" | "Strong" | "Very Strong"
  rawScore: number
  sources: SourceKind[]
  projectNames: string[]
  learningTitles: string[]
  experienceTitles: string[]
  achievementTitles: string[]
  githubRepoCount: number
  githubRepos: string[]
  linkedinClaimed: boolean
  selfDescribedOnly: boolean
}

export const EVIDENCE_FORMULA =
  "raw = 2×projects + 2×experience + achievements + learning + demo GitHub repos (after connect). Buckets: 0–1 Weak · 2–3 Moderate · 4–6 Strong · 7+ Very Strong. LinkedIn claims are labelled self-described and never inflate evidence alone."

function norm(name: string): string {
  return name.trim().toLowerCase()
}

export function bucketFor(raw: number): TechEvidence["bucket"] {
  if (raw <= 1) return "Weak"
  if (raw <= 3) return "Moderate"
  if (raw <= 6) return "Strong"
  return "Very Strong"
}

type Entry = Omit<TechEvidence, "bucket" | "rawScore" | "sources" | "selfDescribedOnly">

function newEntry(name: string): Entry {
  return {
    name: name.trim(),
    projectNames: [],
    learningTitles: [],
    experienceTitles: [],
    achievementTitles: [],
    githubRepoCount: 0,
    githubRepos: [],
    linkedinClaimed: false,
  }
}

export function computeEvidence(state: { githubConnected: boolean; linkedinConnected: boolean }): TechEvidence[] {
  const byTech = new Map<string, Entry>()
  const get = (name: string) => {
    const k = norm(name)
    let e = byTech.get(k)
    if (!e) {
      e = newEntry(name)
      byTech.set(k, e)
    }
    return e
  }

  for (const p of PROJECTS)
    for (const t of p.technologies) get(t).projectNames.push(p.name)

  for (const l of LEARNING)
    for (const t of l.technologies) get(t).learningTitles.push(l.title)

  for (const x of EXPERIENCES)
    for (const t of x.technologies) get(t).experienceTitles.push(x.role)

  for (const a of ACHIEVEMENTS)
    for (const s of a.supportsSkills) get(s).achievementTitles.push(a.title)

  const results: TechEvidence[] = []
  for (const [, e] of byTech) {
    // Deterministic scoring
    let raw = e.projectNames.length * 2 + e.experienceTitles.length * 2 +
      e.achievementTitles.length + e.learningTitles.length

    if (state.githubConnected) {
      const repos = reposForTech(e.name)
      e.githubRepoCount = repos.length
      e.githubRepos = repos.map((r) => r.repo_name)
      raw += repos.length
    }

    const sources: SourceKind[] = []
    if (e.projectNames.length) sources.push("PROJECT")
    if (e.learningTitles.length) sources.push("LEARNING")
    if (e.experienceTitles.length) sources.push("EXPERIENCE")
    if (e.achievementTitles.length) sources.push("ACHIEVEMENT")
    if (e.githubRepoCount > 0) sources.push("GITHUB_DEMO")

    // LinkedIn claims: tracked but capped - a self-described skill with no
    // other backing stays Weak/Moderate and is flagged.
    if (state.linkedinConnected && LINKEDIN_DEMO.claimedSkills.some((s) => norm(s) === norm(e.name))) {
      e.linkedinClaimed = true
      raw += 1
      sources.push("LINKEDIN_DEMO")
    }

    const selfDescribedOnly =
      e.linkedinClaimed && e.projectNames.length === 0 && e.experienceTitles.length === 0 &&
      e.githubRepoCount === 0 && e.achievementTitles.length === 0

    results.push({ ...e, rawScore: raw, bucket: bucketFor(raw), sources, selfDescribedOnly })
  }

  return results.sort((a, b) => b.rawScore - a.rawScore || a.name.localeCompare(b.name))
}
