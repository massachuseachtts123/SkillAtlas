"use client"

import { Badge } from "@/components/ui/badge"
import { MARKET_DATA, type TechDemand } from "@/lib/market"
import { TrendingDown, TrendingUp } from "lucide-react"

// Demo market intelligence from app/lib/market.ts — all numbers invented.
export default function MarketSection() {
  return (
    <section id="market" className="border-b border-border px-6 py-8 scroll-mt-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Market insights</h2>
          <Badge variant="secondary">demo data</Badge>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          Mock salary ranges and demand trends. Placeholder numbers — not real market data.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {MARKET_DATA.map((row) => (
            <article
              key={row.career}
              className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation transition-all duration-200 hover:shadow-elevation-hover hover:border-ring/40"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{row.career}</h3>
                <span className="font-mono-tech text-sm text-primary">${row.salaryMin}k–${row.salaryMax}k</span>
              </div>
              <ul className="mt-3 space-y-2">
                {row.demand.map((d) => (
                  <DemandRow key={d.name} tech={d} />
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function DemandRow({ tech }: { tech: TechDemand }) {
  const up = tech.trendPct >= 0
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 truncate">{tech.name}</span>
      {/* Demand bar reuses the evidence-bucket color language */}
      <div className="flex-1 h-2 rounded-full bg-secondary/60 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${tech.demandScore}%`,
            backgroundColor:
              tech.demandScore >= 85 ? "var(--evidence-very-strong)"
                : tech.demandScore >= 70 ? "var(--evidence-strong)"
                  : tech.demandScore >= 55 ? "var(--evidence-moderate)"
                    : "var(--evidence-weak)",
          }}
        />
      </div>
      <span className={`shrink-0 w-14 text-right flex items-center justify-end gap-1 ${up ? "text-emerald-400" : "text-destructive"}`}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {up ? "+" : ""}{tech.trendPct}%
      </span>
    </li>
  )
}
