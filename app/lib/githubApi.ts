// Deterministic GitHub fetcher - public endpoints only, no auth.
// Everything here is computed straight from the API. Never an LLM.

const GH = 'https://api.github.com'

// Optional PAT raises limit 60/hr -> 5000/hr. Still public endpoints, no OAuth.
const HEADERS: Record<string, string> = { Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

// Short-lived in-memory cache so repeat analyses don't re-burn quota.
const cache = new Map<string, { at: number; data: unknown }>()
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_REPOS = 25 // keeps us under 60/hr unauthenticated limit incl. languages+readmes

export type FetchedRepo = {
  repo_name: string
  description: string | null
  languages: Record<string, number>
  topics: string[]
  stars: number
  pushed_at: string | null
  readme_summary: string
  aiTechnologies?: string[] | null
}

async function gh(path: string): Promise<Response> {
  const res = await fetch(`${GH}${path}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error(`GitHub user not found`)
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded - try again later')
    throw new Error(`GitHub API error ${res.status}`)
  }
  return res
}

async function fetchReadme(username: string, repoName: string): Promise<string> {
  try {
    const res = await gh(`/repos/${username}/${repoName}/readme`)
    const data = await res.json()
    // Node runtime has Buffer; content is base64
    const text = Buffer.from(data.content ?? '', 'base64').toString('utf-8')
    return text.slice(0, 2000)
  } catch {
    return ''
  }
}

// Simple bounded-concurrency map to keep cold demo fast without hammering rate limit
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

export async function fetchUserData(username: string): Promise<{
  username: string
  userData: Record<string, unknown>
  repos: FetchedRepo[]
}> {
  const key = username.toLowerCase()
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data as { username: string; userData: Record<string, unknown>; repos: FetchedRepo[] }

  const userRes = await gh(`/users/${username}`)
  const userData = await userRes.json()

  const reposRes = await gh(`/users/${username}/repos?per_page=100&sort=pushed`)
  const rawRepos: Array<Record<string, unknown>> = await reposRes.json()

  const selected = rawRepos.slice(0, MAX_REPOS)

  const repos = await mapLimit(selected, 6, async (repo) => {
    const name = String(repo.name)

    let languages: Record<string, number> = {}
    try {
      const langRes = await gh(`/repos/${username}/${name}/languages`)
      languages = await langRes.json()
    } catch {
      languages = {}
    }

    // Modern API includes topics directly on the repo object
    const topics = Array.isArray(repo.topics) ? (repo.topics as string[]) : []

    const readme_summary = await fetchReadme(username, name)

    return {
      repo_name: name,
      description: (repo.description as string | null) ?? null,
      languages,
      topics,
      stars: Number(repo.stargazers_count ?? 0),
      pushed_at: (repo.pushed_at as string | null) ?? null,
      readme_summary,
    }
  })

  const result = { username, userData, repos }
  cache.set(key, { at: Date.now(), data: result })
  return result
}
