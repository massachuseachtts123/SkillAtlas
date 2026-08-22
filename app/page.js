"use client"

import { useState } from "react"

export default function LandingPage() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)
    // TODO: Trigger analysis flow
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <main className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-bold tracking-tighter text-neutral-900">
          SkillAtlas
        </h1>
        <p className="mt-4 text-neutral-600">
          Turn any GitHub profile into a Technical Identity Graph and compare it against target career paths
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="github-username" className="block text-sm font-medium text-neutral-700 mb-2">
              GitHub Username
            </label>
            <input
              id="github-username"
              type="text"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm rounded-md border border-neutral-300 w-full px-3 py-2 text-neutral-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., octocat"
            />
          </div>

          <button
            type="submit"
            className="group relative rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">Analyze</span>
            {loading && (
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v5h.582m-15.356-2A8.001 8.001 0 005.582 9m0 0H15m-2.154-4a4.002 4.002 0 01-3.742-1.313l-.708.737a5.502 5.502 0 01-.908 1.035l1.435 1.313a5.502 5.502 0 01-.908 1.035l-.708.737,A4.002 4.002 0 016.154 15z"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
