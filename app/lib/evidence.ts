// Deterministic evidence scoring - NEVER calls an LLM.
// Formula (shown verbatim in UI tooltip):
//   raw = 2*repos + recent + starBonus
//     repos  = # repos containing the tech
//     recent = # of those repos pushed within last 12 months
//     starBonus = min(3, floor(log10(totalStars + 1)))
//   Buckets: 0-2 Weak | 3-5 Moderate | 6-8 Strong | 9+ Very Strong

export type SourceTag = 'VERIFIED' | 'AI_INFERRED'

export type TechEvidence = {
  name: string
  verifiedRepos: number
  inferredRepos: number
  recentRepos: number
  totalStars: number
  rawScore: number
  bucket: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
  sources: SourceTag[]
}

export const EVIDENCE_FORMULA =
  'raw = 2×(repo count) + (recent repos ≤12mo) + min(3, ⌊log₁₀(stars+1)⌋). Buckets: 0–2 Weak · 3–5 Moderate · 6–8 Strong · 9+ Very Strong.'

const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000

function normalize(name: string): string {
  // Canonicalize case-insensitively so "react" == "React"
  return name.trim().toLowerCase()
}

export function bucketFor(raw: number): TechEvidence['bucket'] {
  if (raw <= 2) return 'Weak'
  if (raw <= 5) return 'Moderate'
  if (raw <= 8) return 'Strong'
  return 'Very Strong'
}

type RepoRecord = {
  repo_name: string
  description: string | null
  languages: Record<string, number>
  topics: string[] | { names?: string[] }
  stars: number
  pushed_at: string | null
  readme_summary: string
  aiTechnologies?: string[] | null // null/undefined => AI pass failed or skipped
}

export function computeEvidence(repos: RepoRecord[]): TechEvidence[] {
  const byTech = new Map<
    string,
    {
      displayName: string
      verifiedRepoNames: Set<string>
      inferredRepoNames: Set<string>
      recent: Set<string>
      starsByName: Map<string, number>
    }
  >()

  const now = Date.now()

  const getEntry = (name: string) => {
    const key = normalize(name)
    let e = byTech.get(key)
    if (!e) {
      e = {
        displayName: name.trim(),
        verifiedRepoNames: new Set(),
        inferredRepoNames: new Set(),
        recent: new Set(),
        starsByName: new Map(),
      }
      byTech.set(key, e)
    }
    return e
  }

  for (const repo of repos) {
    const isRecent =
      repo.pushed_at && now - new Date(repo.pushed_at).getTime() <= TWELVE_MONTHS_MS

    // VERIFIED: straight from GitHub API language stats + topics
    for (const lang of Object.keys(repo.languages ?? {})) getEntry(lang).verifiedRepoNames.add(repo.repo_name)
    const topics = Array.isArray(repo.topics)
      ? repo.topics
      : (repo.topics?.names ?? [])
    for (const topic of topics) getEntry(topic).verifiedRepoNames.add(repo.repo_name)

    // AI-INFERRED: tracked separately, never blended silently
    if (Array.isArray(repo.aiTechnologies)) {
      for (const t of repo.aiTechnologies) getEntry(t).inferredRepoNames.add(repo.repo_name)
    }

    // Recency/stars apply to any tech present in this repo (either source)
    const allTechs = [
      ...Object.keys(repo.languages ?? {}),
      ...(Array.isArray(repo.topics) ? repo.topics : repo.topics?.names ?? []),
      ...(Array.isArray(repo.aiTechnologies) ? repo.aiTechnologies : []),
    ]
    for (const t of allTechs) {
      const e = getEntry(t)
      if (isRecent) e.recent.add(repo.repo_name)
      e.starsByName.set(repo.repo_name, repo.stars)
    }
  }

  const results: TechEvidence[] = []
  for (const [, e] of byTech) {
    const repoUnion = new Set([...e.verifiedRepoNames, ...e.inferredRepoNames])
    const repoCount = repoUnion.size
    const recentCount = e.recent.size
    const totalStars = [...e.starsByName.values()].reduce((a, b) => a + b, 0)
    const starBonus = Math.min(3, Math.floor(Math.log10(totalStars + 1)))
    const raw = repoCount * 2 + recentCount + starBonus

    const sources: SourceTag[] = []
    if (e.verifiedRepoNames.size > 0) sources.push('VERIFIED')
    if (e.inferredRepoNames.size > 0) sources.push('AI_INFERRED')

    results.push({
      name: e.displayName,
      verifiedRepos: e.verifiedRepoNames.size,
      inferredRepos: e.inferredRepoNames.size,
      recentRepos: recentCount,
      totalStars,
      rawScore: raw,
      bucket: bucketFor(raw),
      sources,
    })
  }

  return results.sort((a, b) => b.rawScore - a.rawScore)
}
