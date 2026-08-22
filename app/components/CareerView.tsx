"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CAREERS, computeAlignment, ALIGNMENT_FORMULA, BUCKET_LEVEL, type CareerDef,
} from "@/lib/careers"
import type { TechEvidence } from "@/lib/evidence"

const STRONG_EQUIV = 4 // "Strong" bucket level used for the what-if simulation

export default function CareerView({
  evidence,
  onBack,
  onInsight,
  insight,
  insightLoading,
}: {
  evidence: TechEvidence[]
  onBack: () => void
  onInsight: (payload: object) => void
  insight: string | null
  insightLoading: boolean
}) {
  const [careerIdx, setCareerIdx] = useState(0)
  const [whatIf, setWhatIf] = useState<string | null>(null)

  const career: CareerDef = CAREERS[careerIdx]

  const base = useMemo(() => computeAlignment(career, evidence), [career, evidence])
  const simulated = useMemo(() => {
    if (!whatIf) return null
    return computeAlignment(career, evidence, { [whatIf.toLowerCase()]: STRONG_EQUIV })
  }, [whatIf, career, evidence])

  // Missing techs across this career that user lacks - candidates for what-if
  const missingCandidates = base.missing.map((m) => m.name)
  const pct = simulated?.alignmentPct ?? base.alignmentPct

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur px-6 py-3 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>← Graph</Button>
        <div className="flex gap-2">
          {CAREERS.map((c, i) => (
            <Button key={c.name} size="sm" variant={i === careerIdx ? "default" : "outline"} onClick={() => { setCareerIdx(i); setWhatIf(null) }}>
              {c.name}
            </Button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Alignment % + formula tooltip */}
        <section className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tighter">{pct}%</span>
            {simulated && (
              <span className={`text-sm font-medium ${pct > base.alignmentPct ? "text-emerald-400" : ""}`}>
                {base.alignmentPct}% → {pct}%
              </span>
            )}
            <span className="text-sm text-muted-foreground">alignment with {career.name}</span>
          </div>
          <details className="mt-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">How this was calculated</summary>
            <p className="mt-1 leading-relaxed">{ALIGNMENT_FORMULA}</p>
          </details>
        </section>

        {/* What if I learn X */}
        {missingCandidates.length > 0 && (
          <section className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
            <h2 className="font-semibold">What if I learn…</h2>
            <p className="text-xs text-muted-foreground mb-3">Client-side simulation only — nothing saved. Sets one missing tech to &quot;Strong&quot; and recomputes.</p>
            <div className="flex flex-wrap gap-2">
              {missingCandidates.map((m) => (
                <button
                  key={m}
                  onClick={() => setWhatIf(whatIf === m ? null : m)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${whatIf === m ? "bg-primary text-primary-foreground border-primary" : "border-border bg-secondary/50 hover:bg-secondary text-foreground"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            {simulated && simulated.alignmentPct >= 60 && base.alignmentPct < 60 && (
              <p className="mt-3 text-sm font-medium text-emerald-400">Learning {whatIf} would cross the 60% alignment threshold. 🎯</p>
            )}
          </section>
        )}

        {/* Buckets */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation">
            <Badge variant="default">STRONG EVIDENCE</Badge>
            <ul className="mt-3 space-y-1 text-sm">
              {base.strong.length === 0 && <li className="text-muted-foreground">None yet</li>}
              {base.strong.map((s) => <li key={s.name}>{s.name} <span className="text-muted-foreground">(lvl {s.level}/{s.weight})</span></li>)}
            </ul>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation">
            <Badge variant="secondary">DEVELOPING</Badge>
            <ul className="mt-3 space-y-1 text-sm">
              {base.developing.length === 0 && <li className="text-muted-foreground">None yet</li>}
              {base.developing.map((s) => <li key={s.name}>{s.name} <span className="text-muted-foreground">(lvl {s.level}/{s.weight})</span></li>)}
            </ul>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation">
            <Badge variant="destructive">MISSING</Badge>
            <ul className="mt-3 space-y-1 text-sm">
              {base.missing.length === 0 && <li className="text-muted-foreground">Nothing missing</li>}
              {base.missing.map((m) => <li key={m.name}>{m.name} <span className="text-muted-foreground">(weight {m.weight})</span></li>)}
            </ul>
          </div>
        </section>

        {/* AI insight - the only free-text AI output */}
        <section className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">AI summary</h2>
            <Button size="sm" disabled={insightLoading} onClick={() =>
              onInsight({
                career: career.name,
                alignment: base.alignmentPct,
                strong: base.strong.map((s) => s.name),
                developing: base.developing.map((s) => s.name),
                missing: base.missing.map((m) => m.name),
                topEvidence: evidence.slice(0, 10).map((e) => ({ name: e.name, bucket: e.bucket })),
              })
            }>
              {insightLoading ? "Generating…" : "Generate"}
            </Button>
          </div>
          <Separator className="my-3" />
          {insight ? (
            <p className="text-sm leading-relaxed">{insight}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Generate a 2–3 sentence summary from your computed evidence. Everything above stays deterministic regardless.</p>
          )}
        </section>

        <p className="text-[11px] text-muted-foreground">
          Career requirements are static seed data (weights shown per item). Evidence levels map from buckets: {Object.entries(BUCKET_LEVEL).map(([k, v]) => `${k}=${v}`).join(" · ")}
        </p>
      </main>
    </div>
  )
}
