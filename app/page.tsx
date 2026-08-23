"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AtlasGraph from "@/components/AtlasGraph"
import DetailPanel from "@/components/DetailPanel"
import CareerView from "@/components/CareerView"
import LoginGate from "@/components/LoginGate"
import AskAiView from "@/components/AskAiView"
import { useTheme } from "@/components/ThemeProvider"
import {
  ProjectsView, LearningView, TechnologiesView, AchievementsView,
  ProfileView, IntegrationsView, CVView,
} from "@/components/sections"
import { computeEvidence } from "@/lib/evidence"
import { CAREERS, computeAlignment, rankNextSkills, newlyUnlockedCareers } from "@/lib/careers"
import { buildAtlas } from "@/lib/atlas"
import { DEMO_PROFILE, PROJECTS, ACHIEVEMENTS } from "@/lib/demoData"
import { DEMO_GITHUB } from "@/lib/demoGithub"
import {
  Map as MapIcon, FolderKanban, GraduationCap, Cpu, Trophy, Compass,
  Plug, UserRound, Zap, Sparkles, ArrowRight, Sun, Moon, BotMessageSquare, FileText,
} from "lucide-react"

type Tab = "atlas" | "askai" | "projects" | "learning" | "technologies" | "achievements" | "career" | "integrations" | "profile" | "cv"

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "atlas", label: "Atlas", icon: <MapIcon className="h-4 w-4" /> },
  { id: "askai", label: "Ask AI", icon: <BotMessageSquare className="h-4 w-4" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  { id: "learning", label: "Learning", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "technologies", label: "Technologies", icon: <Cpu className="h-4 w-4" /> },
  { id: "achievements", label: "Achievements", icon: <Trophy className="h-4 w-4" /> },
  { id: "career", label: "Career", icon: <Compass className="h-4 w-4" /> },
  { id: "integrations", label: "Integrations", icon: <Plug className="h-4 w-4" /> },
  { id: "profile", label: "Profile", icon: <UserRound className="h-4 w-4" /> },
  { id: "cv", label: "CV", icon: <FileText className="h-4 w-4" /> },
]

// Target career shown on the compact intelligence card + top stat strip.
// "Junior" is a display-only prefix — the underlying weighted requirements
// are the existing "Full Stack Developer" entry in lib/careers.ts.
const TARGET_CAREER = CAREERS.find((c) => c.name === "Full Stack Developer") ?? CAREERS[0]
const TARGET_CAREER_LABEL = "Junior Full Stack Developer"

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [authed, setAuthed] = useState<boolean | null>(null)

  const [tab, setTab] = useState<Tab>("atlas")
  const [githubConnected, setGithubConnected] = useState(false)
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [simSkill, setSimSkill] = useState<string | null>(null)
  const [careerIdx, setCareerIdx] = useState(0)

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [recenterKey, setRecenterKey] = useState(0)

  useEffect(() => {
    try { setAuthed(sessionStorage.getItem("skillatlas-auth") === "1") } catch { setAuthed(false) }
    try {
      if (sessionStorage.getItem("skillatlas-gh") === "1") setGithubConnected(true)
      if (sessionStorage.getItem("skillatlas-li") === "1") setLinkedinConnected(true)
    } catch { /* private mode */ }
  }, [])

  const state = { githubConnected, linkedinConnected }

  // Deterministic derivations - computed unconditionally to keep hook order stable.
  const evidence = useMemo(() => computeEvidence(state), [githubConnected, linkedinConnected])
  const unlockedCareers = useMemo(
    () => (simSkill ? newlyUnlockedCareers(evidence, simSkill) : []),
    [simSkill, evidence]
  )
  const { nodes, edges } = useMemo(
    () => buildAtlas(evidence, state, simSkill, unlockedCareers),
    [evidence, githubConnected, linkedinConnected, simSkill, unlockedCareers]
  )

  // Compact "SkillAtlas Intelligence" card — computed client-side from the same
  // deterministic evidence/career data everywhere else in the app uses. This is
  // the fallback the app relies on if a live Gemini call for a fuller narrative
  // ever fails or isn't configured — the app must work without it either way.
  const targetAlignment = useMemo(() => computeAlignment(TARGET_CAREER, evidence), [evidence])
  const nextSkill = useMemo(() => rankNextSkills(TARGET_CAREER, evidence)[0], [evidence])
  const strongestArea = targetAlignment.strong.length > 0
    ? targetAlignment.strong.slice(0, 2).map((s) => s.name).join(" + ")
    : "Just getting started"

  function connectGithub() {
    setGithubConnected(true)
    try { sessionStorage.setItem("skillatlas-gh", "1") } catch {}
    setTab("atlas")
    setRecenterKey((k) => k + 1)
  }
  function connectLinkedin() {
    setLinkedinConnected(true)
    try { sessionStorage.setItem("skillatlas-li", "1") } catch {}
    setTab("atlas")
    setRecenterKey((k) => k + 1)
  }

  if (authed !== true) {
    if (authed === null) return <main className="min-h-screen bg-background" />
    return <LoginGate onLogin={() => setAuthed(true)} />
  }

  // No marketing/landing page between login and the product — you're always
  // looking at the real dashboard from the first frame after signing in.

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur md:flex">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">SkillAtlas</span>
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
          {TABS.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              {t.label}
            </Button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{DEMO_PROFILE.name}</p>
          <p className="text-xs text-muted-foreground">{githubConnected ? DEMO_GITHUB.username : DEMO_PROFILE.role}</p>
          <Badge variant="destructive" className="mt-2">DEMO PROFILE</Badge>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/40 px-4 backdrop-blur md:px-6">
          {/* Mobile nav */}
          <nav aria-label="Mobile navigation" className="flex gap-1 overflow-x-auto md:hidden">
            {TABS.filter((t) => ["atlas", "askai", "career", "profile"].includes(t.id)).map((t) => (
              <Button key={t.id} size="sm" variant={tab === t.id ? "secondary" : "ghost"} onClick={() => setTab(t.id)}>
                {t.label}
              </Button>
            ))}
          </nav>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        {/* Content */}
        {tab === "atlas" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* Compact hero */}
            <div className="shrink-0 border-b border-border px-6 py-5">
              <h1 className="text-2xl font-bold tracking-tight">Your technical journey, mapped.</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {DEMO_PROFILE.name} · {DEMO_PROFILE.role} · Projects, learning, experience and evidence — connected in one place.
                {simSkill && <Badge className="ml-2">SIMULATION · {simSkill}</Badge>}
              </p>

              {/* Top summary strip */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Projects" value={PROJECTS.length} />
                <StatCard label="Technologies" value={`${evidence.length}+`} />
                <StatCard label="Achievements" value={ACHIEVEMENTS.length} />
                <StatCard label="Career alignment" value={`${targetAlignment.alignmentPct}%`} />
              </div>
            </div>

            {/* Graph + Intelligence card + detail panel */}
            <div className="flex min-h-[560px] flex-col gap-4 p-4 lg:flex-row lg:p-6">
              <div id="atlas-canvas" className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-border" aria-label="Technical identity graph">
                <AtlasGraph
                  nodes={nodes}
                  edges={edges}
                  selectedId={selectedNodeId}
                  onSelect={setSelectedNodeId}
                  recenterKey={recenterKey}
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
                  Click any node — inner ring: skills · middle: work & learning · outer: evidence & careers
                </div>
              </div>

              <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
                <IntelligenceCard
                  strongestArea={strongestArea}
                  nextSkill={nextSkill?.name ?? "—"}
                  alignmentPct={targetAlignment.alignmentPct}
                  onExplore={() => setTab("career")}
                />
                <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card/40 p-5 backdrop-blur">
                  <DetailPanel nodeId={selectedNodeId} evidence={evidence} state={state} onClose={() => setSelectedNodeId(null)} />
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <main className="min-w-0 flex-1 overflow-y-auto p-6">
            {tab === "askai" && <AskAiView evidence={evidence} state={state} />}
            {tab === "projects" && <ProjectsView githubConnected={githubConnected} />}
            {tab === "learning" && <LearningView />}
            {tab === "technologies" && <TechnologiesView evidence={evidence} githubConnected={githubConnected} />}
            {tab === "achievements" && <AchievementsView />}
            {tab === "career" && (
              <CareerView
                evidence={evidence}
                careerIdx={careerIdx}
                onCareerChange={(i) => { setCareerIdx(i); setSimSkill(null); }}
                simSkill={simSkill}
                onSimChange={setSimSkill}
              />
            )}
            {tab === "integrations" && (
              <IntegrationsView state={state} onConnectGithub={connectGithub} onConnectLinkedin={connectLinkedin} />
            )}
            {tab === "profile" && <ProfileView />}
            {tab === "cv" && <CVView evidence={evidence} />}
          </main>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-3 backdrop-blur">
      <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function IntelligenceCard({
  strongestArea, nextSkill, alignmentPct, onExplore,
}: {
  strongestArea: string
  nextSkill: string
  alignmentPct: number
  onExplore: () => void
}) {
  const firstName = DEMO_PROFILE.name.split(" ")[0]
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        SkillAtlas Intelligence
      </div>
      <p className="mt-3 text-sm">Hello, {firstName} 👋</p>

      <dl className="mt-3 space-y-2.5 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Strongest area</dt>
          <dd className="font-medium">{strongestArea}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Next best move</dt>
          <dd className="font-medium">{nextSkill}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Career alignment</dt>
          <dd className="font-medium">{TARGET_CAREER_LABEL} · <span className="tabular-nums">{alignmentPct}%</span></dd>
        </div>
      </dl>

      <Button size="sm" variant="outline" className="mt-4 w-full gap-1.5" onClick={onExplore}>
        Explore My Path <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
