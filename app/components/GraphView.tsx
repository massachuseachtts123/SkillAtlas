"use client"

import { useMemo, useState, useCallback, useEffect, useRef } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
  useReactFlow,
  type Viewport,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { EVIDENCE_FORMULA, type TechEvidence } from "@/lib/evidence"
import CareerView from "@/components/CareerView"
import JobsSection from "@/components/JobsSection"
import MarketSection from "@/components/MarketSection"
import { GitBranch, Zap, Circle, X, ChevronLeft, ChevronRight, Minus, Plus, RotateCw, Code } from "lucide-react"

type RepoLite = { repo_name: string; languages: Record<string, number>; topics: string[]; stars: number }

const BUCKET_COLOR: Record<TechEvidence["bucket"], string> = {
  Weak: "var(--evidence-weak)",
  Moderate: "var(--evidence-moderate)",
  Strong: "var(--evidence-strong)",
  "Very Strong": "var(--evidence-very-strong)",
}

const BUCKET_LABEL: Record<TechEvidence["bucket"], string> = {
  Weak: "Weak",
  Moderate: "Moderate",
  Strong: "Strong",
  "Very Strong": "Very Strong",
}

function norm(s: string) { return s.trim().toLowerCase() }

// Custom node renderers. Without these registered on <ReactFlow nodeTypes={...}>,
// nodes with type "developer" | "technology" | "repo" silently fall back to React
// Flow's default node, which only reads `data.label` — so tech bubbles and repo
// pills would render with no text at all, and the user node with no avatar.
function DeveloperNode({ data }: { data: { label: string; name: string; avatar: string | null } }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-primary/30 shadow-elevation">
        {data.avatar ? (
          <img src={data.avatar} alt={data.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/20 text-lg font-bold text-primary">
            {data.label.replace("@", "").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="whitespace-nowrap rounded-full border border-border bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-elevation">
        {data.label}
      </div>
    </div>
  )
}

function TechnologyNode({ data }: { data: { name: string; bucket: TechEvidence["bucket"]; rawScore: number } }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full px-1 text-center">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <span className="text-[11px] font-semibold leading-tight text-white drop-shadow-sm">{data.name}</span>
    </div>
  )
}

function RepoNode({ data }: { data: { name: string; stars: number } }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span className="truncate">{data.name}</span>
    </div>
  )
}

const nodeTypes = { developer: DeveloperNode, technology: TechnologyNode, repo: RepoNode }

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

function getPrimaryLanguage(repos: RepoLite[]): string | null {
  const langCounts = new Map<string, number>()
  for (const repo of repos) {
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      langCounts.set(lang, (langCounts.get(lang) ?? 0) + bytes)
    }
  }
  if (langCounts.size === 0) return null
  return [...langCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function getEvidenceDistribution(evidence: TechEvidence[]) {
  const dist: Record<TechEvidence["bucket"], number> = { Weak: 0, Moderate: 0, Strong: 0, "Very Strong": 0 }
  for (const e of evidence) dist[e.bucket]++
  return dist
}

export default function GraphView(props: {
  username: string
  user: { name: string | null; avatar_url: string | null; public_repos: number; followers: number }
  repos: RepoLite[]
  evidence: TechEvidence[]
  onBack: () => void
  insight: string | null
  insightLoading: boolean
  onInsight: (payload: object) => void
}) {
  return (
    <ReactFlowProvider>
      <GraphViewInner {...props} />
    </ReactFlowProvider>
  )
}

function GraphViewInner({
  username,
  user,
  repos,
  evidence,
  onBack,
  insight,
  insightLoading,
  onInsight,
}: {
  username: string
  user: { name: string | null; avatar_url: string | null; public_repos: number; followers: number }
  repos: RepoLite[]
  evidence: TechEvidence[]
  onBack: () => void
  insight: string | null
  insightLoading: boolean
  onInsight: (payload: object) => void
}) {
  const [selected, setSelected] = useState<TechEvidence | null>(null)
  const [showLegend, setShowLegend] = useState(true)
  const [lastAnalyzed] = useState(new Date())
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { fitView } = useReactFlow()

  const { nodes, edges } = useMemo(() => {
    const top = evidence.slice(0, 18)
    const nodes: Node[] = [
      {
        id: "user",
        type: "developer",
        position: { x: 0, y: 0 },
        data: { label: `@${username}`, name: user.name ?? username, avatar: user.avatar_url },
      },
    ]
    const edges: Edge[] = []

    const cols = Math.min(top.length, 6)
    top.forEach((t, i) => {
      const id = `tech-${norm(t.name)}`
      const size = Math.max(32, 38 + t.rawScore * 4)
      nodes.push({
        id,
        type: "technology",
        position: { x: (i % cols) * 160, y: 160 + Math.floor(i / cols) * 130 },
        data: { name: t.name, bucket: t.bucket, rawScore: t.rawScore },
        style: {
          width: size,
          height: size,
          background: BUCKET_COLOR[t.bucket],
          border: "none",
          borderRadius: "50%",
          boxShadow: `0 0 0 4px ${BUCKET_COLOR[t.bucket]}40, 0 4px 20px -4px ${BUCKET_COLOR[t.bucket]}80`,
        },
      })
      edges.push({
        id: `e-user-${id}`,
        source: "user",
        target: id,
        type: "smoothstep",
        style: { stroke: "rgba(255,255,255,0.08)", strokeWidth: 1.5 },
        markerEnd: { type: "arrowclosed", color: "rgba(255,255,255,0.08)" },
      })
    })

    repos.slice(0, 12).forEach((r, i) => {
      const rid = `repo-${i}`
      nodes.push({
        id: rid,
        type: "repo",
        position: { x: i * 120 - (Math.min(repos.length, 12) * 120) / 2 + 60, y: 480 + Math.floor(i / 6) * 80 },
        data: { name: r.repo_name, stars: r.stars },
        style: {
          width: 100,
          height: 36,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
          color: "var(--muted-foreground)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      })
      top.forEach((t) => {
        const has =
          norm(t.name) in Object.fromEntries(Object.keys(r.languages).map((k) => [norm(k), true])) ||
          r.topics.some((tp) => norm(tp) === norm(t.name))
        if (has) {
          edges.push({
            id: `${rid}-${norm(t.name)}`,
            source: rid,
            target: `tech-${norm(t.name)}`,
            type: "smoothstep",
            style: { stroke: "rgba(255,255,255,0.04)", strokeWidth: 1 },
            animated: false,
          })
        }
      })
    })

    return { nodes, edges }
  }, [evidence, repos, username, user])

  const onTechClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!node.id.startsWith("tech-")) {
        setSelected(null)
        return
      }
      const name = node.id.replace("tech-", "")
      setSelected(evidence.find((e) => norm(e.name) === name) ?? null)
    },
    [evidence]
  )

  useEffect(() => {
    if (reactFlowWrapper.current) {
      fitView({ duration: 500, padding: 0.15 })
    }
  }, [fitView, nodes.length])

  const primaryLang = getPrimaryLanguage(repos)
  const evidenceDist = getEvidenceDistribution(evidence)
  const totalTechs = evidence.length

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card/50 backdrop-blur flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillAtlas</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>
          {[
            { id: "graph", label: "Identity Graph" },
            { id: "careers", label: "Career alignment" },
            { id: "jobs", label: "Jobs & internships" },
            { id: "market", label: "Market insights" },
          ].map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-secondary/70 hover:text-foreground transition-colors"
              onClick={() => scrollTo(item.id)}
            >
              <Circle className="w-4 h-4" style={{ fill: "currentColor" }} />
              {item.label}
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/70 transition-colors" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
            New analysis
          </Button>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name ?? username} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">{username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">@{username}</p>
              <p className="text-xs text-muted-foreground">{user.name ?? "No display name"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 shrink-0 border-b border-border bg-card/50 backdrop-blur flex items-center px-6 gap-4">
          <h1 className="text-lg font-semibold tracking-tight">Technical Identity Graph</h1>
          <span className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="w-3.5 h-3.5" />
            <span>@{username}</span>
            <span className="w-px h-4 bg-border mx-1" />
            <span>Analyzed {formatTimestamp(lastAnalyzed)}</span>
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => fitView({ duration: 400, padding: 0.15 })}>
            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
            Re-center
          </Button>
        </header>

        {/* Summary Strip */}
        <section className="h-24 shrink-0 border-b border-border bg-card/30 backdrop-blur px-6 flex items-center gap-8 overflow-x-auto">
          <StatItem label="Repositories" value={repos.length} icon={<GitBranch className="w-5 h-5" />} />
          <StatItem label="Technologies" value={totalTechs} icon={<Zap className="w-5 h-5" />} />
          <StatItem label="Primary Language" value={primaryLang ?? "—"} icon={<Circle className="w-5 h-5" />} />
          <EvidenceDist dist={evidenceDist} />
        </section>

        {/* Graph Canvas — capped so it doesn't dominate the page */}
        <div id="graph" className="relative h-[480px] max-h-[480px] shrink-0 border-b border-border" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView={false}
            minZoom={0.15}
            maxZoom={2}
            onNodeClick={onTechClick}
            proOptions={{ hideAttribution: true }}
            className="h-full w-full"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={28}
              size={1}
              color="rgba(255,255,255,0.02)"
            />
            <Controls
              showZoom={true}
              showFitView={true}
              showInteractive={false}
              position="bottom-right"
            />
          </ReactFlow>

          {/* Legend */}
          {showLegend && (
            <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur border border-border rounded-xl p-3 shadow-elevation">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Evidence Strength</span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="p-0 h-5 w-5"
                  onClick={() => setShowLegend(false)}
                  aria-label="Hide legend"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1.5">
                {(["Very Strong", "Strong", "Moderate", "Weak"] as TechEvidence["bucket"][]).map((bucket) => (
                  <div key={bucket} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: BUCKET_COLOR[bucket] }}
                    />
                    <span className="text-xs text-foreground">{BUCKET_LABEL[bucket]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Career alignment — embedded section below the graph (same scroll) */}
        <CareerView
          evidence={evidence}
          insight={insight}
          insightLoading={insightLoading}
          onInsight={onInsight}
        />

        <JobsSection />

        <MarketSection />
      </div>

      {/* Right Panel */}
      <aside className="w-80 shrink-0 border-l border-border bg-card/50 backdrop-blur flex flex-col sticky top-0 h-screen">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Evidence Details</h2>
          <Button variant="ghost" size="xs" onClick={() => setSelected(null)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Zap className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm max-w-xs">Click a technology node to see its evidence breakdown.</p>
            </div>
          ) : (
            <TechDetailPanel username={username} evidence={selected} repos={repos} />
          )}
        </div>
      </aside>
    </div>
  )
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function EvidenceDist({ dist }: { dist: Record<TechEvidence["bucket"], number> }) {
  const total = Object.values(dist).reduce((a, b) => a + b, 0)
  if (total === 0) return null

  return (
    <div className="flex items-center gap-4 shrink-0 ml-auto">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">Distribution</span>
      <div className="flex items-center gap-1.5 h-2" role="img" aria-label="Evidence strength distribution">
        {(["Very Strong", "Strong", "Moderate", "Weak"] as TechEvidence["bucket"][]).map((bucket) => {
          const pct = (dist[bucket] / total) * 100
          if (pct === 0) return null
          return (
            <div
              key={bucket}
              className="rounded-full h-full transition-all"
              style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: BUCKET_COLOR[bucket] }}
              title={`${BUCKET_LABEL[bucket]}: ${dist[bucket]}`}
            />
          )
        })}
      </div>
    </div>
  )
}

function TechDetailPanel({ username, evidence, repos }: { username: string; evidence: TechEvidence; repos: RepoLite[] }) {
  const matchingRepos = repos.filter((r) =>
    norm(evidence.name) in Object.fromEntries(Object.keys(r.languages).map((k) => [norm(k), true])) ||
    r.topics.some((tp) => norm(tp) === norm(evidence.name))
  )

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          {evidence.name}
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{evidence.bucket}</span>
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {evidence.sources.map((s) => (
            <Badge key={s} variant={s === "VERIFIED" ? "default" : "outline"} className="gap-1">
              {s === "VERIFIED" ? "VERIFIED" : "AI-INFERRED"}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Repos (GitHub API)</dt>
          <dd className="font-mono font-medium tabular-nums">{evidence.verifiedRepos}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Repos (AI-extracted)</dt>
          <dd className="font-mono font-medium tabular-nums">{evidence.inferredRepos}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Pushed ≤12 months</dt>
          <dd className="font-mono font-medium tabular-nums">{evidence.recentRepos}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Total stars</dt>
          <dd className="font-mono font-medium tabular-nums">{evidence.totalStars.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3">
          <dt className="font-medium">Raw score</dt>
          <dd className="font-mono font-medium tabular-nums">{evidence.rawScore} → {evidence.bucket}</dd>
        </div>
      </dl>

      <details className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
        <summary className="cursor-pointer font-medium text-foreground">How this was calculated</summary>
        <p className="mt-2 leading-relaxed">{EVIDENCE_FORMULA}</p>
      </details>

      {matchingRepos.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Repositories using {evidence.name}
          </h4>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {matchingRepos.slice(0, 10).map((r) => (
              <li key={r.repo_name}>
                <a
                  href={`https://github.com/${username}/${r.repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors group"
                >
                  <span className="truncate pr-2 font-medium group-hover:underline">{r.repo_name}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <span className="w-3 h-3" />
                    {r.stars.toLocaleString()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}