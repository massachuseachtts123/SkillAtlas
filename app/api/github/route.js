import { NextResponse } from 'next/server'
import { githubApi } from '@/lib/githubApi'
import { supabase } from '@/lib/supabaseBrowser'

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      )
    }

    // Step 1: Fetch deterministic data from GitHub API
    const githubData = await githubApi.fetchUserData(username)

    // Step 2: Write to Supabase repos table
    const { error: dbError } = await supabase
      .from('repos')
      .insert({
        github_username: username,
        repo_name: githubData.repos.map(r => r.repo_name),
        description: githubData.userData.description,
        languages: githubData.repos.map(r => r.languages),
        topics: githubData.repos.map(r => r.topics),
        stars: githubData.repos.reduce((sum, r) => sum + r.stars, 0),
        pushed_at: githubData.repos.length > 0 ? githubData.repos[0].pushed_at : null,
        readme_summary: githubData.repos.map(r => r.readme_summary).join('\n'),
      })
      .select()

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      // Continue even if DB insert fails - we'll show GitHub data anyway
    }

    // Step 3: Return the fetched data for further processing
    return NextResponse.json({
      success: true,
      username,
      repoCount: githubData.repos.length,
      totalStars: githubData.repos.reduce((sum, r) => sum + r.stars, 0),
      repos: githubData.repos.map(r => ({
        name: r.repo_name,
        description: r.description,
        languages: Object.keys(r.languages),
        topics: r.topics,
        stars: r.stars,
        pushed_at: r.pushed_at,
      })),
      userData: {
        name: githubData.userData.name,
        blog: githubData.userData.blog,
        location: githubData.userData.location,
        public_repos: githubData.userData.public_repos,
        followers: githubData.userData.followers,
        following: githubData.userData.following,
      },
    })
  } catch (error) {
    console.error('GitHub analysis error:', error)

    // Graceful degradation - show error message but don't crash
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze GitHub profile',
        success: false 
      },
      { status: 500 }
    )
  }
}
