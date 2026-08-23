"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  CAREERS, computeAlignment, rankNextSkills, ALIGNMENT_FORMULA, BUCKET_LEVEL,
  type CareerDef,
} from "@/lib/careers"
import type { TechEvidence } from "@/lib/evidence"
import { strengthVariant } from "@/components/sections"

export default function CareerView({
  evidence,
  careerIdx,
  onCareerChange,
  simSkill,
  onSimChange,
}: {
  evidence: TechEvidence[]
  careerIdx: number
  onCareerChange: (i: number) => void
  simSkill: string | null
  onSimChange: (skill: string | null) => void
}) {
  const career: CareerDef = CAREERS[careerIdx]

  const base = useMemo(() => computeAlignment(career, evidence), [career, evidence])
  const simulated = useMemo(
    () => (simSkill ? computeAlignment(career, evidence, { [simSkill.toLowerCase()]: 4 }) : null),
    [simSkill, career, evidence]
  )
  const suggestions = useMemo(() => rankNextSkills(career, evidence), [career, evidence])

  const pct = simulated?.alignmentPct ?? base.alignmentPct

  return (
    <section aria-label="Career" className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Career</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Illustrative alignment — not a validated probability</span>
      </div>

      {/* Career selector */}
      <div className="flex flex-wrap gap-2">
        {CAREERS.map((c, i) => (
          <Button
            key={c.name}
            size="sm"
            variant={i === careerIdx ? "default" : "outline"}
            onClick={() => { onCareerChange(i); onSimChange(null) }}
          >
            {c.name}
          </Button>
        ))}
      </div>

      {/* Alignment */}
      <div className="rounded-xl border border-border bg-card/50 p-6 shadow-elevation backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-5xl font-bold tracking-tighter tabular-nums">{pct}%</span>
          <span className={`text-sm font-medium ${pct > base.alignmentPct ? "text-teal-300" : ""}`}>
            {base.alignmentPct}% → {pct}%
          </span>
          <span className="text-sm text-muted-foreground">alignment with {career.name}</span>
          {simulated && <Badge>SIMULATION</Badge>}
        </div>
        {simulated && (
          <p className="mt-2 text-sm text-teal-300">
            Simulating “{simSkill}” unlocks: {suggestions.find((s) => s.name === simSkill)?.reason ?? "new paths"}
          </p>
        )}
        <details className="mt-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground">How this was calculated</summary>
          <p className="mt-1 leading-relaxed">{ALIGNMENT_FORMULA}</p>
        </details>
      </div>

      {/* Skill gap buckets */}
      <div className="grid gap-4 md:grid-cols-3">
        <GapCard title="Strong evidence" badge="✓" tone="teal" entries={base.strong.map((s) => `${s.name}`)} />
        <GapCard title="Developing" badge="⚠" tone="amber" entries={base.developing.map((d) => `${d.name}`)} />
        <GapCard title="Missing" badge="✗" tone="red" entries={base.missing.map((m) => m.name)} />
      </div>

      {/* Next best skill */}
      {suggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card/50 p-6 shadow-elevation backdrop-blur">
          <h2 className="font-semibold">Your Next Best Skill</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Deterministic ranking: careerImportance + pathsBoosted×3 + inCareerGain − effort×2. Transparent estimates, not predictions.
          </p>
          <Separator className="my-4" />
          <ol className="space-y-4">
            {suggestions.slice(0, 5).map((s, i) => (
              <li key={s.name} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="font-medium">
                    {i === 0 && <Badge className="mr-2">BEST</Badge>}
                    {s.name}
                    <span className="ml-2 text-xs text-muted-foreground">effort {"●".repeat(s.effort)}{"○".repeat(3 - s.effort)}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.reason}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={strengthVariant("Strong")}>
                    +{s.alignmentGain} pts here · {s.pathsBoosted} path{s.pathsBoosted === 1 ? "" : "s"} boosted
                  </Badge>
                  <Button size="sm" variant={simSkill === s.name ? "secondary" : "default"} onClick={() => onSimChange(simSkill === s.name ? null : s.name)}>
                    What if I learn {s.name}?
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* What-if active banner */}
      {simSkill && (
        <div className="rounded-xl border border-teal-300/40 bg-teal-300/10 p-4">
          <p className="text-sm">
            <strong>SIMULATION ACTIVE:</strong> {simSkill} treated as “Strong” client-side only. The Atlas shows the simulated node and newly unlocked paths. Nothing was saved.
          </p>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => onSimChange(null)}>Clear simulation</Button>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Career requirements are static seed data (weights shown per item). Evidence levels map from buckets:{" "}
        {Object.entries(BUCKET_LEVEL).map(([k, v]) => `${k}=${v}`).join(" · ")}
      </p>
    </section>
  )
}

function GapCard({ title, badge, tone, entries }: { title: string; badge: string; tone: "teal" | "amber" | "red"; entries: string[] }) {
  const toneClass = tone === "teal" ? "border-teal-300/40 text-teal-200" : tone === "amber" ? "border-amber-400/40 text-amber-200" : "border-destructive/40 text-destructive"
  return (
    <div className={`rounded-xl border bg-card/50 p-4 backdrop-blur ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider">{badge} {title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {entries.length === 0 && <li className="text-muted-foreground">None</li>}
        {entries.map((e) => <li key={e}>{e}</li>)}
      </ul>
    </div>
  )
}
