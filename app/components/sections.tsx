"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS, DEMO_PROFILE, LINKEDIN_DEMO, atlasCompleteness } from "@/lib/demoData"
import { DEMO_GITHUB, DEMO_REPOS } from "@/lib/demoGithub"
import type { TechEvidence } from "@/lib/evidence"
import { GitBranch as GithubIcon, Briefcase as LinkedinIcon, X, CheckCircle2, Loader2, GraduationCap, Award, Download, Printer, FileText } from "lucide-react"

// ---------- Projects ----------

export function ProjectsView({ githubConnected }: { githubConnected: boolean }) {
  return (
    <section aria-label="Projects">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Demo data · user provided</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((p) => (
          <article key={p.id} className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur transition-shadow hover:shadow-elevation-hover">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{p.name}</h3>
              <Badge variant="secondary">{p.year}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.technologies.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">{p.skills.join(" · ")}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {p.githubRepo
                ? githubConnected
                  ? <>✓ Demo GitHub evidence: <code className="font-mono-tech">{p.githubRepo}</code></>
                  : <>Repository <code className="font-mono-tech">{p.githubRepo}</code> — connect demo GitHub to link evidence</>
                : "No repository linked"}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

// ---------- Learning journey ----------

export function LearningView() {
  return (
    <section aria-label="Learning journey">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Learning Journey</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Demo data · user provided</span>
      </div>
      <ol className="relative space-y-0 border-l border-border pl-6">
        {LEARNING.map((l) => (
          <li key={l.id} className="relative pb-8">
            <span aria-hidden className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ${l.status === "current" ? "animate-pulse bg-teal-300 ring-4 ring-teal-300/20" : "bg-primary/60"}`} />
            <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{l.title}</h3>
                <Badge variant={l.status === "current" ? "default" : "secondary"}>{l.period}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{l.source}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {l.technologies.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
              </div>
              {l.enabledProjects.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Enabled:{" "}
                  {l.enabledProjects.map((pid) => PROJECTS.find((p) => p.id === pid)?.name).filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ---------- Technology DNA ----------

export function TechnologiesView({ evidence, githubConnected }: { evidence: TechEvidence[]; githubConnected: boolean }) {
  return (
    <section aria-label="Technology DNA">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Your Technology DNA</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Evidence strength — not skill percentages</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {evidence.map((ev) => {
          const repos = githubConnected ? DEMO_REPOS.filter((r) => r.technologies.some((t) => t.toLowerCase() === ev.name.toLowerCase())) : []
          return (
            <article key={ev.name} className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{ev.name}</h3>
                <Badge variant={strengthVariant(ev.bucket)}>{ev.bucket.toUpperCase()}</Badge>
              </div>
              {ev.selfDescribedOnly && (
                <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs">Self-described only</p>
              )}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <Row k="Projects" v={`${ev.projectNames.length}`} />
                <Row k="Learning" v={ev.learningTitles.length ? ev.learningTitles.join(" + ") : "—"} />
                <Row k="Recent usage" v={recentUsage(ev.name) ?? "—"} />
                <Row k="Experience" v={ev.experienceTitles.join(", ") || "—"} />
                <Row k="Achievements" v={ev.achievementTitles.join(", ") || "—"} />
                <Row k={`GitHub demo`} v={githubConnected ? `${repos.length} repositor${repos.length === 1 ? "y" : "ies"}` : "connect to view"} />
              </dl>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="truncate text-right font-medium" title={v}>{v}</dd>
    </>
  )
}

function recentUsage(tech: string): string | null {
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year)
  const hit = sorted.find((p) => p.technologies.some((t) => t.toLowerCase() === tech.toLowerCase()))
  return hit ? hit.name : null
}

export function strengthVariant(bucket: string): "default" | "secondary" | "destructive" | "outline" {
  if (bucket === "Very Strong" || bucket === "Strong") return "default"
  if (bucket === "Weak") return "destructive"
  return "secondary"
}

// ---------- Achievements ----------

export function AchievementsView() {
  return (
    <section aria-label="Achievements">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Hackathons · certifications · awards</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a) => (
          <article key={a.id} className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline">{a.category}</Badge>
              <span className="text-xs text-muted-foreground">{a.year}</span>
            </div>
            <h3 className="mt-3 font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.org}</p>
            <Separator className="my-3" />
            <dl className="space-y-1 text-sm">
              {a.role && <><dt className="sr-only">Role</dt><dd><span className="text-muted-foreground">Role:</span> {a.role}</dd></>}
              {a.projectId && <><dt className="sr-only">Project</dt><dd><span className="text-muted-foreground">Project:</span> {PROJECTS.find((p) => p.id === a.projectId)?.name}</dd></>}
              <dt className="sr-only">Result</dt>
              <dd><span className="text-muted-foreground">Result:</span> <span className="font-medium">{a.result}</span></dd>
            </dl>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.technologies.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ---------- Traditional profile ----------

export function ProfileView() {
  return (
    <section aria-label="Profile" className="max-w-3xl">
      <header className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{DEMO_PROFILE.name}</h1>
          <Badge variant="destructive">DEMO PROFILE</Badge>
        </div>
        <p className="mt-1 text-muted-foreground">{DEMO_PROFILE.role} · {DEMO_PROFILE.location} · {DEMO_PROFILE.experienceYears} year experience</p>
      </header>

      <Block title="About">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Junior web developer focused on React and JavaScript. Comfortable building small full-stack
          applications end to end and learning backend and deployment practices.
        </p>
      </Block>

      <Block title="Experience">
        {EXPERIENCES.map((x) => (
          <div key={x.id} className="border-l border-border pl-4">
            <h3 className="font-semibold">{x.role}</h3>
            <p className="text-sm text-muted-foreground">{x.org} · {x.location} · {x.duration}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {x.responsibilities.map((r) => <li key={r}>• {r}</li>)}
            </ul>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {x.technologies.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
          </div>
        ))}
      </Block>

      <Block title="Education">
        <p className="text-sm"><span className="font-medium">Bachelor of Computer Science</span> — Demo University, 2023–2027</p>
      </Block>

      <Block title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {LINKEDIN_DEMO.claimedSkills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Self-described skills from the demo profile.</p>
      </Block>

      <Block title="Certifications">
        {LINKEDIN_DEMO.certifications.map((c) => (
          <p key={c.title} className="text-sm">{c.title} — {c.issuer}, {c.year}</p>
        ))}
      </Block>

      <Block title="Achievements">
        <ul className="space-y-1 text-sm">
          {ACHIEVEMENTS.map((a) => <li key={a.id}>• {a.title} ({a.year}) — {a.result}</li>)}
        </ul>
      </Block>

      <Block title="Projects" last>
        <ul className="space-y-1 text-sm">
          {PROJECTS.map((p) => <li key={p.id}>• {p.name} — {p.description}</li>)}
        </ul>
      </Block>
    </section>
  )
}

function Block({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`mt-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur ${last ? "" : ""}`}>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ---------- Integrations (demo GitHub + demo LinkedIn) ----------

const GH_STEPS = [
  "Connecting…",
  "Authenticating demo account…",
  "Reading repositories…",
  "Analyzing technologies…",
  "Finding project evidence…",
  "Updating your Technical Atlas…",
]

const LI_STEPS = [
  "Connecting…",
  "Importing profile…",
  "Importing experience…",
  "Importing achievements…",
  "Connecting skills…",
  "Updating Technical Atlas…",
]

export function IntegrationsView({
  state, onConnectGithub, onConnectLinkedin,
}: {
  state: { githubConnected: boolean; linkedinConnected: boolean }
  onConnectGithub: () => void
  onConnectLinkedin: () => void
}) {
  const [modal, setModal] = useState<"github" | "linkedin" | null>(null)
  return (
    <section aria-label="Integrations">
      <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
      <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Evidence sources for your Atlas. Both integrations are simulated for this hackathon demo —
        no real OAuth, no external API calls, no tokens.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <IntegrationCard
          icon={<GithubIcon className="h-5 w-5" />}
          title="GitHub"
          desc="Import fictional repository evidence: commits, technologies, project links."
          label={state.githubConnected ? "DEMO GITHUB CONNECTED" : "NOT CONNECTED"}
          connected={state.githubConnected}
          onConnect={() => setModal("github")}
          onView={() => {}}
        />
        <IntegrationCard
          icon={<LinkedinIcon className="h-5 w-5" />}
          title="LinkedIn"
          desc="Import a simulated professional profile: experience, education, self-described skills."
          label={state.linkedinConnected ? "DEMO LINKEDIN CONNECTED" : "NOT CONNECTED"}
          connected={state.linkedinConnected}
          onConnect={() => setModal("linkedin")}
          onView={() => {}}
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card/30 p-5 backdrop-blur">
        <h2 className="font-semibold">Your Atlas Completeness</h2>
        <Completeness state={state} />
      </div>

      {modal && (
        <IntegrationModal
          kind={modal}
          onClose={() => setModal(null)}
          onComplete={modal === "github" ? onConnectGithub : onConnectLinkedin}
        />
      )}
    </section>
  )
}

function IntegrationCard({
  icon, title, desc, connected, label, onConnect,
}: {
  icon: React.ReactNode; title: string; desc: string
  connected: boolean; label: string; onConnect: () => void; onView: () => void
}) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">{icon}</div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Badge variant={connected ? "default" : "secondary"}>{label}</Badge>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      {!connected && <Button className="mt-4 w-full" onClick={onConnect}>Integrate with {title}</Button>}
    </article>
  )
}

export function Completeness({ state }: { state: { githubConnected: boolean; linkedinConnected: boolean } }) {
  const { items, pct } = atlasCompleteness(state)
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${i.done ? "border-teal-300/40 text-teal-200" : "border-border text-muted-foreground"}`}>
            {i.done && <CheckCircle2 className="h-3 w-3" />} {i.label} {i.done ? "✓" : "—"}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-medium tabular-nums">{pct}% complete</span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">UX completeness indicator — not a skill measure.</p>
    </div>
  )
}

export function IntegrationModal({
  kind, onClose, onComplete,
}: {
  kind: "github" | "linkedin"
  onClose: () => void
  onComplete: () => void
}) {
  const steps = kind === "github" ? GH_STEPS : LI_STEPS
  const [step, setStep] = useState(0)
  const done = step >= steps.length

  useEffect(() => {
    if (step >= steps.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 650)
    return () => clearTimeout(t)
  }, [step, steps.length])

  function finish() {
    onComplete()
    onClose()
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={kind === "github" ? "Connect GitHub" : "Connect LinkedIn"} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevation">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              {kind === "github" ? <GithubIcon className="h-5 w-5" /> : <LinkedinIcon className="h-5 w-5" />}
            </div>
            <h2 className="text-lg font-semibold">{kind === "github" ? "Connect GitHub" : "Continue with Demo LinkedIn"}</h2>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!done ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For this hackathon demo, connect a simulated {kind === "github" ? "GitHub" : "LinkedIn"} account and import technical evidence. No real account is used.
            </p>
            <ol className="mt-5 space-y-2 text-sm" aria-live="polite">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 ${i < step ? "text-foreground" : i === step ? "text-primary" : "text-muted-foreground opacity-50"}`}>
                  {i < step
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
                    : i === step ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-3.5 w-3.5 rounded-full border border-border" />}
                  {s}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <p className="mt-3 flex items-center gap-2 text-base font-semibold text-teal-300">
              <CheckCircle2 className="h-5 w-5" /> {kind === "github" ? "GitHub Connected" : "LinkedIn Connected"}
            </p>
            {kind === "github" ? (
              <div className="mt-4 space-y-1.5 text-sm">
                <p><span className="text-muted-foreground">Account:</span> <code className="font-mono-tech">{DEMO_GITHUB.username}</code> <Badge variant="destructive">DEMO GITHUB ACCOUNT</Badge></p>
                <p>Alex Sharma · {DEMO_REPOS.length} repositories · 10 technologies · {DEMO_GITHUB.commits} commits · {DEMO_GITHUB.contributions} contributions · 5 projects linked</p>
              </div>
            ) : (
              <div className="mt-4 space-y-1.5 text-sm">
                <p><Badge variant="destructive">DEMO LINKEDIN</Badge></p>
                <p>✓ Profile ✓ Experience ✓ Education ✓ Skills ✓ {ACHIEVEMENTS.length} Achievements</p>
              </div>
            )}
            <Button className="mt-5 w-full" onClick={finish}>View Imported Evidence</Button>
          </>
        )}
      </div>
    </div>
  )
}

// ---------- CV Page (Company Policy Compliant) ----------

export function CVView({ evidence }: { evidence: TechEvidence[] }) {
  const [format, setFormat] = useState<"ats" | "modern" | "minimal">("ats")

  const techSkills = evidence
    .filter((e) => e.bucket !== "Weak" || e.projectNames.length > 0)
    .map((e) => e.name)
    .slice(0, 12)

  const getTemplate = () => {
    switch (format) {
      case "modern": return modernTemplate
      case "minimal": return minimalTemplate
      default: return atsTemplate
    }
  }

  const Template = getTemplate()

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CV Builder</h1>
          <p className="text-sm text-muted-foreground">
            Generate a clean, ATS-friendly CV from your Atlas data. Templates follow common company policies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Template:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "ats" | "modern" | "minimal")}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="ats">ATS Standard — Safe for all systems</option>
            <option value="modern">Modern — Clean with subtle styling</option>
            <option value="minimal">Minimal — Plain text, maximum compatibility</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadTextCV(evidence)} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download .txt
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-border bg-card shadow-elevation overflow-hidden">
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[700px] p-8 md:p-12">
          <Template
            profile={DEMO_PROFILE}
            linkedin={LINKEDIN_DEMO as typeof LINKEDIN_DEMO & { githubUrl?: string; linkedinUrl?: string }}
            projects={PROJECTS}
            learning={LEARNING}
            experiences={EXPERIENCES}
            achievements={ACHIEVEMENTS}
            techSkills={techSkills}
            evidence={evidence}
          />
        </div>
      </div>

      {/* Policy notes */}
      <details className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
        <summary className="cursor-pointer font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Company CV Policy Guidelines
        </summary>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p><strong>ATS Standard:</strong> No columns, tables, graphics, or special characters. Uses standard section headers (Experience, Education, Skills). Safe for Workday, Greenhouse, Lever, iCIMS, Taleo.</p>
          <p><strong>Modern:</strong> Clean typography, subtle borders, single-column. Works with most modern ATS but may not parse perfectly in legacy systems.</p>
          <p><strong>Minimal:</strong> Plain text with markdown-style structure. Maximum compatibility, zero parsing risk.</p>
          <p>All templates use your verified evidence from the Atlas — no self-described claims without evidence backing.</p>
        </div>
      </details>
    </div>
  )
}

function downloadTextCV(evidence: TechEvidence[]) {
  const techSkills = evidence
    .filter((e: TechEvidence) => e.bucket !== "Weak" || e.projectNames.length > 0)
    .map((e: TechEvidence) => e.name)
    .slice(0, 12)

  const text = buildATSCV({
    profile: DEMO_PROFILE,
    linkedin: LINKEDIN_DEMO,
    projects: PROJECTS,
    learning: LEARNING,
    experiences: EXPERIENCES,
    achievements: ACHIEVEMENTS,
    techSkills,
    evidence,
  })

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${DEMO_PROFILE.name.replace(" ", "_")}_CV.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function buildATSCV({
  profile, linkedin, projects, learning, experiences, achievements, techSkills, evidence,
}: {
  profile: typeof DEMO_PROFILE
  linkedin: typeof LINKEDIN_DEMO & { githubUrl?: string; linkedinUrl?: string }
  projects: typeof PROJECTS
  learning: typeof LEARNING
  experiences: typeof EXPERIENCES
  achievements: typeof ACHIEVEMENTS
  techSkills: string[]
  evidence: TechEvidence[]
}) {
  const lines: string[] = []
  const add = (s: string) => lines.push(s)
  const rule = () => lines.push("".padEnd(60, "="))

  add(`${profile.name.toUpperCase()}`)
  add(`${profile.role} | ${profile.location}`)
  add(`${linkedin.githubUrl || "github.com"} | ${linkedin.linkedinUrl || "linkedin.com"}`)
  add(`${profile.experienceYears} year experience`)
  rule()

  add("PROFESSIONAL SUMMARY")
  add(linkedin.about)
  rule()

  add("TECHNICAL SKILLS")
  const skillsByStrength = new Map<string, string[]>()
  evidence.forEach((e) => {
    const key = e.bucket || "Developing"
    if (!skillsByStrength.has(key)) skillsByStrength.set(key, [])
    skillsByStrength.get(key)!.push(e.name)
  })
  ;["Very Strong", "Strong", "Moderate", "Developing", "Weak"].forEach((bucket) => {
    const skills = skillsByStrength.get(bucket)
    if (skills?.length) {
      add(`${bucket.toUpperCase()}: ${skills.join(", ")}`)
    }
  })
  if (techSkills.length) {
    add(`CORE: ${techSkills.join(", ")}`)
  }
  rule()

  add("EXPERIENCE")
  experiences.forEach((exp) => {
    add(`${exp.role} | ${exp.org} | ${exp.location}`)
    add(exp.duration)
    exp.responsibilities.forEach((r) => add(`- ${r}`))
    add(`Technologies: ${exp.technologies.join(", ")}`)
    add("")
  })
  rule()

  add("PROJECTS")
  projects.forEach((p) => {
    add(`${p.name} (${p.year})`)
    add(p.description)
    add(`Technologies: ${p.technologies.join(", ")}`)
    add(`Skills demonstrated: ${p.skills.join(", ")}`)
    if (p.githubRepo) add(`Repository: ${linkedin.githubUrl}/${p.githubRepo}`)
    add("")
  })
  rule()

  add("EDUCATION & LEARNING")
  learning.forEach((l) => {
    add(`${l.title} — ${l.source} (${l.period}) [${l.status}]`)
    add(`Technologies: ${l.technologies.join(", ")}`)
    add("")
  })
  linkedin.education.forEach((e) => {
    add(`${e.degree} — ${e.school} (${e.period})`)
  })
  rule()

  add("ACHIEVEMENTS & CERTIFICATIONS")
  achievements.forEach((a) => {
    add(`${a.title} (${a.year}) — ${a.org} [${a.category}]`)
    add(`Role: ${a.role || "N/A"} | Result: ${a.result}`)
    add(`Technologies: ${a.technologies.join(", ")}`)
    add("")
  })
  linkedin.certifications.forEach((c) => {
    add(`${c.title} — ${c.issuer} (${c.year})`)
  })
  rule()

  add("EVIDENCE-BASED PROFILE")
  add("This CV is generated from verified evidence in SkillAtlas.")
  add("Each skill is backed by projects, learning, experience, or GitHub data.")
  add("Self-described skills without evidence are marked separately in the Atlas.")

  return lines.join("\n")
}

// Template components
function atsTemplate(props: CVProps) {
  return (
    <div className="font-mono text-sm leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      <pre className="whitespace-pre-wrap font-inherit text-inherit">{buildATSCV(props)}</pre>
    </div>
  )
}

function modernTemplate(props: CVProps) {
  const { profile, linkedin, projects, learning, experiences, achievements, techSkills, evidence } = props
  const githubUrl = linkedin.githubUrl || "#"
  const linkedinUrl = linkedin.linkedinUrl || "#"
  return (
    <div className="font-sans text-sm leading-relaxed max-w-3xl mx-auto">
      <div className="mb-6 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{profile.role}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{profile.location}</span>
          <a href={githubUrl} target="_blank" rel="noopener" className="underline hover:text-primary">GitHub</a>
          <a href={linkedinUrl} target="_blank" rel="noopener" className="underline hover:text-primary">LinkedIn</a>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Professional Summary</h2>
        <p className="text-gray-700 dark:text-gray-300">{linkedin.about}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Technical Skills</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(() => {
            const byBucket = new Map<string, string[]>()
            evidence.forEach((e) => {
              const k = e.bucket || "Developing"
              if (!byBucket.has(k)) byBucket.set(k, [])
              byBucket.get(k)!.push(e.name)
            })
            return ["Very Strong", "Strong", "Moderate", "Developing"].map((b) => (
              byBucket.has(b) && (
                <div key={b} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{b}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{byBucket.get(b)!.join(", ")}</p>
                </div>
              )
            ))
          })()}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Experience</h2>
        {experiences.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{exp.org} · {exp.location}</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
              {exp.responsibilities.map((r, ri) => <li key={ri}>{r}</li>)}
            </ul>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Technologies: {exp.technologies.join(", ")}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.technologies.slice(0, 5).map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Education & Learning</h2>
        <div className="space-y-3">
          {learning.map((l, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-24 text-sm text-gray-500 dark:text-gray-400 shrink-0">{l.period}</div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{l.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{l.source}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Technologies: {l.technologies.join(", ")}</p>
              </div>
            </div>
          ))}
          {linkedin.education.map((e, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-24 text-sm text-gray-500 dark:text-gray-400 shrink-0">{e.period}</div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{e.degree}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{e.school}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Achievements & Certifications</h2>
        <div className="space-y-2">
          {achievements.map((a, i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="font-medium text-gray-900 dark:text-white">{a.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{a.org} · {a.year} · {a.category}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Technologies: {a.technologies.join(", ")}</p>
            </div>
          ))}
          {linkedin.certifications.map((c, i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.issuer} · {c.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>Generated from SkillAtlas — evidence-based technical profile.</p>
        <p>Skills are backed by verified projects, learning, experience, and GitHub data.</p>
      </footer>
    </div>
  )
}

function minimalTemplate(props: CVProps) {
  const { profile, linkedin, projects, learning, experiences, achievements, techSkills } = props
  const githubUrl = linkedin.githubUrl || "github.com"
  const linkedinUrl = linkedin.linkedinUrl || "linkedin.com"
  return (
    <div className="font-mono text-sm leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      <pre className="whitespace-pre-wrap font-inherit text-inherit">
{profile.name}
{profile.role} | {profile.location}
{githubUrl} | {linkedinUrl}

PROFESSIONAL SUMMARY
{linkedin.about}

TECHNICAL SKILLS
{techSkills.join(", ")}

EXPERIENCE
{experiences.map((exp) => (
  `${exp.role} | ${exp.org} | ${exp.location}
${exp.duration}
${exp.responsibilities.map((r) => `- ${r}`).join("\n")}
Technologies: ${exp.technologies.join(", ")}
`
)).join("\n")}

PROJECTS
{projects.map((p) => (
  `${p.name} (${p.year})
${p.description}
Technologies: ${p.technologies.join(", ")}
Skills: ${p.skills.join(", ")}
`
)).join("\n")}

EDUCATION & LEARNING
{learning.map((l) => `${l.title} — ${l.source} (${l.period}) [${l.status}]\nTechnologies: ${l.technologies.join(", ")}`).join("\n\n")}
{linkedin.education.map((e) => `${e.degree} — {e.school} ({e.period})`).join("\n\n")}

ACHIEVEMENTS & CERTIFICATIONS
{achievements.map((a) => `${a.title} ({a.year}) — {a.org} [{a.category}]\nResult: {a.result}\nTechnologies: {a.technologies.join(", ")}`).join("\n\n")}
{linkedin.certifications.map((c) => `{c.title} — {c.issuer} ({c.year})`).join("\n\n")}

---
Generated from SkillAtlas. Evidence-based profile.
      </pre>
    </div>
  )
}

interface CVProps {
  profile: typeof DEMO_PROFILE
  linkedin: typeof LINKEDIN_DEMO & { githubUrl?: string; linkedinUrl?: string }
  projects: typeof PROJECTS
  learning: typeof LEARNING
  experiences: typeof EXPERIENCES
  achievements: typeof ACHIEVEMENTS
  techSkills: string[]
  evidence: TechEvidence[]
}

