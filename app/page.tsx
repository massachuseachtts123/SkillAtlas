"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import GraphView from "@/components/GraphView"
import CareerView from "@/components/CareerView"
import type { TechEvidence } from "@/lib/evidence"
import { Zap } from "lucide-react"

type AnalysisResult = {
  aiUsed: boolean
  formula: string
  user: { name: string | null; avatar_url: string | null; public_repos: number; followers: number }
  repos: Array<{ repo_name: string; languages: Record<string, number>; topics: string[]; stars: number }>
  evidence: TechEvidence[]
}

const STAGES = [
  "Fetching public repos from GitHub…",
  "Reading languages, topics & READMEs…",
  "Extracting technologies (AI pass)…",
  "Building your Technical Identity Graph…",
]

type View = "landing" | "loading" | "graph" | "career"

export default function Home() {
  const [view, setView] = useState<View>("landing")
  const [username, setUsername] = useState("")
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [insight, setInsight] = useState<string | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (view === "landing") usernameRef.current?.focus()
  }, [view])

  async function analyze(e?: React.FormEvent) {
    e?.preventDefault()
    if (!username.trim()) return
    setError(null)
    setStage(0)
    setView("loading")
    // Stage ticker so the wait reads as intentional work
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 2500)
    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(username.trim())}`, { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? "Analysis failed")
      setResult(data)
      setView("graph")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setView("landing")
    } finally {
      clearInterval(timer)
    }
  }

  async function generateInsight(payload: object) {
    setInsightLoading(true)
    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setInsight(
        res.ok && data.success
          ? data.insight
          : `AI summary unavailable (${data.error === "no-llm-key" ? "no API key configured" : "LLM call failed"}). All scores above remain fully computed and valid.`
      )
    } catch {
      setInsight("AI summary unavailable (network error). All scores above remain fully computed and valid.")
    } finally {
      setInsightLoading(false)
    }
  }

  if ((view === "graph" || view === "career") && result) {
    return view === "graph" ? (
      <GraphView
        username={username.trim()}
        user={result.user}
        repos={result.repos}
        evidence={result.evidence}
        onBack={() => { setView("landing"); setResult(null); setInsight(null) }}
        onViewCareer={() => setView("career")}
      />
    ) : (
      <CareerView
        evidence={result.evidence}
        insight={insight}
        insightLoading={insightLoading}
        onInsight={generateInsight}
        onBack={() => setView("graph")}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
          <Zap className="h-5 w-5 text-primary" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">evidence-backed</Badge>
          <Badge variant="secondary">deterministic scoring</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-balance">
          SkillAtlas
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Turn any GitHub profile into a Technical Identity Graph and see how it aligns
          with real career paths. Every score shows its math.
        </p>

        <form onSubmit={analyze} className="mt-8 space-y-3">
          <label htmlFor="gh-user" className="block text-sm font-medium">
            GitHub username
          </label>
          <input
            id="gh-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. torvalds, octocat"
            ref={usernameRef}
            className="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
          />
          <Button type="submit" disabled={!username.trim() || view === "loading"} className="w-full">
            {view === "loading" ? "Analyzing…" : "Analyze"}
          </Button>
        </form>

        {view === "loading" && (
          <ol className="mt-6 space-y-2 text-sm" aria-live="polite">
            {STAGES.map((s, i) => (
              <li key={s} className={`flex items-center gap-2 ${i <= stage ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${i < stage ? "bg-primary" : i === stage ? "bg-primary animate-pulse" : "bg-muted"}`} />
                {s}
              </li>
            ))}
          </ol>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
