import { createServerClient } from '@supabase/ssr'

// Server-side Supabase client. Returns null when env vars are absent -
// callers degrade to GitHub-only mode instead of crashing.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createServerClient(url, key, { cookies: { getAll: () => [], setAll: () => {} } })
}
