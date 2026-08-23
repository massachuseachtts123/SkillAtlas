"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS, DEMO_PROFILE, LINKEDIN_DEMO, atlasCompleteness } from "@/lib/demoData"
import { DEMO_GITHUB, DEMO_REPOS } from "@/lib/demoGithub"
import type { TechEvidence } from "@/lib/evidence"
import { GitBranch as GithubIcon, Briefcase as LinkedinIcon, X, CheckCircle2, Loader2 } from "lucide-react"

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

