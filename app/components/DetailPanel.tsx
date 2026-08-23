"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Zap } from "lucide-react"
import { EVIDENCE_FORMULA, type TechEvidence, type SourceKind } from "@/lib/evidence"
import { CAREERS, computeAlignment } from "@/lib/careers"
import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS, DEMO_PROFILE, LINKEDIN_DEMO } from "@/lib/demoData"
import { DEMO_GITHUB } from "@/lib/demoGithub"

const SOURCE_LABEL: Record<SourceKind, string> = {
  PROJECT: "Project",
  LEARNING: "Learning",
  EXPERIENCE: "Experience",
  ACHIEVEMENT: "Achievement",
  GITHUB_DEMO: "Demo GitHub",
  LINKEDIN_DEMO: "Demo LinkedIn",
}

function norm(s: string) { return s.trim().toLowerCase() }

export default function DetailPanel({
  nodeId, evidence, state, onClose,
}: {
  nodeId: string | null
  evidence: TechEvidence[]
  state: { githubConnected: boolean; linkedinConnected: boolean }
  onClose: () => void
}) {
  if (!nodeId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <Zap className="h-10 w-10 opacity-30" />
        <p className="max-w-[220px] text-sm">Click any node to see what it is, why it is connected, and the evidence behind it.</p>
      </div>
    )
  }

  const [prefix, ...rest] = nodeId.split("-")
  const kind: string = prefix
  const id = rest.join("-")

  let body: React.ReactNode = null
  let title = ""
  let subtitle = ""

  if (kind === "person") {
    title = DEMO_PROFILE.name
    subtitle = "DEMO PROFILE"
    body = (
      <>
        <Section label="What is this?">
          A demo technical identity for {DEMO_PROFILE.role} in {DEMO_PROFILE.location}, {DEMO_PROFILE.experienceYears} year of experience.
        </Section>
        <Section label="Why is it connected to me?">
          Everything in this map describes one person&apos;s journey. The center is you.
        </Section>
        <Section label="Career value">
          Target career: <span className="text-teal-300">{DEMO_PROFILE.targetCareer}</span>. Every skill below feeds into that goal.
        </Section>
      </>
    )
  } else if (kind === "tech") {
    const ev = evidence.find((e) => norm(e.name) === norm(id)) ?? evidence.find((e) => norm(e.name) === norm(nodeId.replace("tech-", "")))
    if (!ev) return <NotFound onClose={onClose} />
    return (
      <div className="space-y-5">
        <Header name={ev.name} badge={ev.bucket} sub={ev.selfDescribedOnly ? "SELF-DESCRIBED" : `${ev.sources.length} evidence source${ev.sources.length === 1 ? "" : "s"}`} onClose={onClose} />
        {ev.selfDescribedOnly && (
          <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed">
            Self-described only. Claimed on the imported LinkedIn profile but not backed by projects or repositories yet — so it stays weak until real evidence appears.
          </p>
        )}
        <EvidenceStrength ev={ev} />
        <Separator />
        {ev.projectNames.length > 0 && (
          <Section label={`Used in (${ev.projectNames.length})`}>
            <ul className="space-y-1">{ev.projectNames.map((p) => <li key={p}>• {p}</li>)}</ul>
          </Section>
        )}
        {ev.learningTitles.length > 0 && (
          <Section label="Learned through">{ev.learningTitles.join(" · ")}</Section>
        )}
        {ev.experienceTitles.length > 0 && (
          <Section label="Used during">{ev.experienceTitles.join(" · ")}</Section>
        )}
        {state.githubConnected && (
          <Section label={`GitHub demo evidence (${ev.githubRepoCount})`}>
            {ev.githubRepoCount === 0 ? <span className="text-muted-foreground">No demo repositories use this.</span> :
              <ul className="space-y-1 font-mono-tech text-xs">{ev.githubRepos.map((r) => <li key={r}>▸ {r}</li>)}</ul>}
          </Section>
        )}
        {!state.githubConnected && (
          <p className="text-xs text-muted-foreground">Connect demo GitHub to see repository evidence for this technology.</p>
        )}
        <CareerRelevance techName={ev.name} evidence={evidence} />
        <details className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground">How evidence was calculated</summary>
          <p className="mt-2 leading-relaxed">{EVIDENCE_FORMULA}</p>
          <p className="mt-1">Raw score for {ev.name}: {ev.rawScore} → {ev.bucket}</p>
        </details>
      </div>
    )
  } else if (kind === "proj") {
    const p = PROJECTS.find((x) => x.id === id)
    if (!p) return <NotFound onClose={onClose} />
    title = p.name; subtitle = "PROJECT"
    body = (
      <>
        <Section label="What is this?">{p.description}</Section>
        <Section label="Technologies used">{p.technologies.join(" · ")}</Section>
        <Section label="Skills demonstrated">{p.skills.join(" · ")}</Section>
        <Section label="Evidence">
          {p.githubRepo && state.githubConnected
            ? <>✓ Demo GitHub repository <code className="font-mono-tech">{p.githubRepo}</code> · project description</>
            : <span className="text-muted-foreground">Project description{p.githubRepo ? ` · repository ${p.githubRepo} (connect demo GitHub to link evidence)` : ""}</span>}
        </Section>
        <CareerRelevance techs={p.technologies} evidence={evidence} />
      </>
    )
  } else if (kind === "learn") {
    const l = LEARNING.find((x) => x.id === id)
    if (!l) return <NotFound onClose={onClose} />
    title = l.title; subtitle = l.status === "current" ? "LEARNING · CURRENTLY" : "LEARNING"
    body = (
      <>
        <Section label="What is this?">
          {l.period} · {l.source}. Labelled USER PROVIDED / DEMO DATA.
        </Section>
        <Section label="Technologies covered">{l.technologies.join(" · ")}</Section>
        {l.enabledProjects.length > 0 && (
          <Section label="Enabled projects">
            <ul className="space-y-1">{l.enabledProjects.map((pid) => {
              const p = PROJECTS.find((x) => x.id === pid)
              return <li key={pid}>• {p?.name ?? pid}</li>
            })}</ul>
          </Section>
        )}
      </>
    )
  } else if (kind === "exp") {
    const x = EXPERIENCES.find((e2) => e2.id === id)
    if (!x) return <NotFound onClose={onClose} />
    title = x.role; subtitle = "EXPERIENCE"
    body = (
      <>
        <Section label="What is this?">{x.org}, {x.location} · {x.duration}. Fictional demo data.</Section>
        <Section label="Responsibilities"><ul className="space-y-1">{x.responsibilities.map((r) => <li key={r}>• {r}</li>)}</ul></Section>
        <Section label="Technologies used">{x.technologies.join(" · ")}</Section>
        {state.linkedinConnected && <p className="text-xs text-blue-300">Imported from DEMO LINKEDIN profile.</p>}
      </>
    )
  } else if (kind === "ach") {
    const a = ACHIEVEMENTS.find((x) => x.id === id)
    if (!a) return <NotFound onClose={onClose} />
    title = a.title; subtitle = `ACHIEVEMENT · ${a.category.toUpperCase()}`
    body = (
      <>
        <Section label="What is this?">{a.org}, {a.year} · Result: {a.result}{a.role ? ` · Role: ${a.role}` : ""}. Demo data.</Section>
        {a.projectId && <Section label="Associated with">{PROJECTS.find((p) => p.id === a.projectId)?.name}</Section>}
        <Section label="Supports skills">{a.supportsSkills.join(" · ")}</Section>
      </>
    )
  } else if (kind === "github-demo" || kind === "github") {
    title = DEMO_GITHUB.username; subtitle = "DEMO GITHUB ACCOUNT"
    body = (
      <>
        <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs leading-relaxed">
          Fictional simulated account. Not fetched from GitHub — no OAuth, no API calls.
        </p>
        <Section label="Stats">
          {DEMO_GITHUB.contributions} contributions · {DEMO_GITHUB.commits} commits · {DEMO_GITHUB.pullRequests} pull requests · {DEMO_GITHUB.issues} issues
        </Section>
        <Section label="Repositories providing evidence">
          <ul className="space-y-1.5">
            {PROJECTS.filter((p) => p.githubRepo).map((p) => (
              <li key={p.id} className="font-mono-tech text-xs">▸ {p.githubRepo} <span className="font-sans text-muted-foreground">→ {p.name}</span></li>
            ))}
          </ul>
        </Section>
      </>
    )
  } else if (kind === "linkedin-demo" || kind === "linkedin") {
    title = LINKEDIN_DEMO.name; subtitle = "DEMO LINKEDIN PROFILE"
    body = (
      <>
        <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs leading-relaxed">
          Simulated profile import. Shows what Alex says about himself — SkillAtlas cross-checks it against evidence.
        </p>
        <Section label="Headline">{LINKEDIN_DEMO.headline}</Section>
        <Section label="Self-described skills">
          <div className="flex flex-wrap gap-1.5">
            {LINKEDIN_DEMO.claimedSkills.map((s) => {
              const ev = evidence.find((e) => norm(e.name) === norm(s))
              return <Badge key={s} variant="outline">{s}{ev ? ` · ${ev.bucket}` : " · no data"}</Badge>
            })}
          </div>
        </Section>
      </>
    )
  } else if (kind === "career") {
    const c = CAREERS.find((x) => x.name === id)
    if (!c) return <NotFound onClose={onClose} />
    const align = computeAlignment(c, evidence)
    title = c.name; subtitle = "CAREER PATH"
    body = (
      <>
        <Section label="Illustrative alignment">
          <span className="text-3xl font-bold">{align.alignmentPct}%</span>
        </Section>
        {align.missing.length > 0 && <Section label={`Blocking gaps (${align.missing.length})`}>{align.missing.map((m) => m.name).join(" · ")}</Section>}
        <Section label="Requirements shown with weights">
          {Object.entries(c.requirements).map(([t, w]) => `${t} (${w})`).join(" · ")}
        </Section>
        <p className="text-xs text-muted-foreground">Illustrative career alignment from static requirement weights — not a scientifically validated probability.</p>
      </>
    )
  } else if (kind === "sim") {
    return (
      <div className="space-y-4">
        <Header name={nodeId.replace("sim-node", "Simulated skill")} badge="SIMULATION" onClose={onClose} />
        <p className="text-sm leading-relaxed">
          This node exists only inside your What-If simulation. Nothing was saved. Clear the simulation in the Career tab to remove it.
        </p>
      </div>
    )
  }

  if (!body) return <NotFound onClose={onClose} />

  return (
    <div className="space-y-5">
      <Header name={title} badge={subtitle} onClose={onClose} />
      {body}
    </div>
  )
}

function Header({ name, badge, sub, onClose }: { name: string; badge?: string; sub?: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
        {badge && <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{badge}</p>}
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close detail panel">
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

function NotFound({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3">
      <Header name="Unknown node" onClose={onClose} />
      <p className="text-sm text-muted-foreground">No details available for this node.</p>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</h4>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function EvidenceStrength({ ev }: { ev: TechEvidence }) {
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Evidence strength</h4>
      <Badge variant={ev.bucket === "Very Strong" || ev.bucket === "Strong" ? "default" : ev.bucket === "Weak" ? "destructive" : "secondary"}>
        {ev.bucket.toUpperCase()}
      </Badge>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ev.sources.map((s) => <Badge key={s} variant="outline">{SOURCE_LABEL[s]}</Badge>)}
      </div>
    </div>
  )
}

function CareerRelevance({ techName, techs, evidence }: { techName?: string; techs?: string[]; evidence: TechEvidence[] }) {
  const names = techs ?? [techName!]
  const rel = new Set<string>()
  for (const n of names) {
    for (const c of CAREERS) {
      if (c.requirements[n] || Object.keys(c.requirements).some((k) => norm(k) === norm(n))) rel.add(c.name)
    }
  }
  if (rel.size === 0) return null
  return (
    <Section label="Career relevance">
      {[...rel].join(" · ")}
    </Section>
  )
}
