import { NextResponse } from 'next/server'
import { fetchUserData } from '@/lib/githubApi'
import { extractFromRepo, llmAvailable } from '@/lib/ai-extraction'
import { computeEvidence, EVIDENCE_FORMULA } from '@/lib/evidence'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST /api/github?username=X
// Pipeline: deterministic GitHub fetch -> optional AI extraction -> deterministic evidence.
export async function POST(request: Request) {
  try {
    const username = new URL(request.url).searchParams.get('username')?.trim()
    if (!username) {
      return NextResponse.json({ error: 'GitHub username is required' }, { status: 400 })
    }

    // Step 1 - deterministic fetch
    const { userData, repos } = await fetchUserData(username)

    // Step 2 - AI extraction pass (skips silently when no key / on any failure)
    let aiUsed = false
    if (llmAvailable()) {
      const results = await Promise.all(
        repos.map(async (repo) => {
          const extracted = await extractFromRepo({
            repo_name: repo.repo_name,
            description: repo.description,
            readme_summary: repo.readme_summary,
          })
          return extracted?.technologies ?? null
        })
      )
      repos.forEach((repo, i) => {
        if (results[i]) {
          repo.aiTechnologies = results[i]
          aiUsed = true
        }
      })
    }

    // Step 3 - deterministic evidence scoring
    const evidence = computeEvidence(repos)

    // Best-effort DB write; never blocks the response path on failure.
    try {
      const { getSupabase } = await import('@/lib/supabaseServer')
      const supabase = getSupabase()
      if (supabase) {
        await supabase.from('repos').insert(
          repos.map((r) => ({
            github_username: username,
            repo_name: r.repo_name,
            description: r.description,
            languages: r.languages,
            topics: r.topics,
            stars: r.stars,
            pushed_at: r.pushed_at,
            readme_summary: r.readme_summary,
          }))
        )
      }
    } catch (e) {
      console.error('Supabase write skipped:', e)
    }

    return NextResponse.json({
      success: true,
      aiUsed,
      formula: EVIDENCE_FORMULA,
      user: {
        name: userData.name ?? null,
        avatar_url: userData.avatar_url ?? null,
        bio: userData.bio ?? null,
        public_repos: userData.public_repos ?? 0,
        followers: userData.followers ?? 0,
      },
      repos: repos.map(({ readme_summary: _r, ...rest }) => rest),
      evidence,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
