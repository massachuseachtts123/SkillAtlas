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

// Embedded section rendered below the graph canvas on the same scrollable page.
export default function CareerView({
  evidence,
  onInsight,
  insight,
  insightLoading,
}: {
  evidence: TechEvidence[]
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
    <section id="careers" className="border-b border-border px-6 py-8 scroll-mt-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Career selector — wrapped chips (13 careers) */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-3">Career alignment</h2>
          <div className="flex flex-wrap gap-2">
            {CAREERS.map((c, i) => (
              <Button key={c.name} size="sm" variant={i === careerIdx ? "default" : "outline"} onClick={() => { setCareerIdx(i); setWhatIf(null) }}>
                {c.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Alignment % + formula tooltip */}
        <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
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
        </div>

        {/* What if I learn X */}
        {missingCandidates.length > 0 && (
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
            <h3 className="font-semibold">What if I learn…</h3>
            <p className="text-xs text-muted-foreground mb-3">Client-side simulation only — nothing saved. Sets one missing tech to &quot;Strong&quot; and recomputes.</p>
            <div className="flex flex-wrap gap-2">
              {missingCandidates.map((m) => (
                <button
                  key={m}
                  onClick={() => setWhatIf(whatIf === m ? null : m)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all duration-150 hover:scale-105 hover:bg-secondary active:scale-95 ${whatIf === m ? "bg-primary text-primary-foreground border-primary shadow-elevation" : "border-border bg-secondary/50 text-foreground"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            {simulated && simulated.alignmentPct >= 60 && base.alignmentPct < 60 && (
              <p className="mt-3 text-sm font-medium text-emerald-400">Learning {whatIf} would cross the 60% alignment threshold. 🎯</p>
            )}
          </div>
        )}

        {/* Buckets */}
        <div className="grid md:grid-cols-3 gap-4">
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
        </div>

        {/* AI insight - the only free-text AI output */}
        <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">AI summary</h3>
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
        </div>

        <p className="text-[11px] text-muted-foreground">
          Career requirements are static seed data (weights shown per item). Evidence levels map from buckets: {Object.entries(BUCKET_LEVEL).map(([k, v]) => `${k}=${v}`).join(" · ")}
        </p>
      </div>
    </section>
  )
}
