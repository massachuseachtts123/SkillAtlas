// Deterministic identity-map construction. No LLM here.
import type { Node, Edge } from "@xyflow/react"
import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS, DEMO_PROFILE } from "./demoData"
import { DEMO_GITHUB } from "./demoGithub"
import { CAREERS, computeAlignment } from "./careers"
import type { TechEvidence } from "./evidence"

export type NodeKind =
  | "person" | "technology" | "project" | "learning"
  | "experience" | "achievement" | "github" | "linkedin" | "career" | "simulated"

export const TARGET_CAREER = "Full Stack Developer"

const TAU = Math.PI * 2
function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export function buildAtlas(
  evidence: TechEvidence[],
  state: { githubConnected: boolean; linkedinConnected: boolean },
  simSkill: string | null,
  unlockedCareers: string[]
): { nodes: Node[]; edges: Edge[] } {
  const cx = 0
  const cy = 0
  const nodes: Node[] = []
  const edges: Edge[] = []
  const evByName = new Map(evidence.map((e) => [e.name.trim().toLowerCase(), e]))

  // Center: person
  nodes.push({
    id: "person",
    type: "atlas",
    position: { x: cx, y: cy },
    data: { kind: "person", name: DEMO_PROFILE.name, sub: `${DEMO_PROFILE.role} · ${DEMO_PROFILE.location}` },
    draggable: false,
  })

  // Inner layer: technologies (evidence-ordered)
  const techs = [...evidence].sort((a, b) => b.rawScore - a.rawScore)
  techs.forEach((t, i) => {
    const angle = (i / techs.length) * TAU - Math.PI / 2
    const p = polar(cx, cy, 220, angle)
    const size = Math.max(46, 52 + Math.min(t.rawScore, 10) * 3)
    nodes.push({
      id: `tech-${t.name}`,
      type: "atlas",
      position: p,
      data: {
        kind: "technology", name: t.name, bucket: t.bucket, sourceCount: t.sources.length,
        simulated: t.selfDescribedOnly ? "Self-described" : undefined,
      },
      style: {
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, var(--ev-${slug(t.bucket)}), color-mix(in oklab, var(--ev-${slug(t.bucket)}) 55%, #0A0B0E))`,
        border: "1px solid rgba(255,255,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 4,
      },
      draggable: false,
    })
    edges.push(edge(`person`, `tech-${t.name}`, "", "#7C6FF033"))
  })

  // Middle layer: projects / learning / experience
  const middle = [
    ...PROJECTS.map((p) => ({ id: `proj-${p.id}`, kind: "project" as NodeKind, label: p.name, obj: p })),
    ...LEARNING.map((l) => ({ id: `learn-${l.id}`, kind: "learning" as NodeKind, label: l.title, obj: l })),
    ...EXPERIENCES.map((x) => ({ id: `exp-${x.id}`, kind: "experience" as NodeKind, label: x.role, obj: x })),
  ]
  middle.forEach((m, i) => {
    const angle = Math.PI * (0.15 + (i / (middle.length - 1)) * 1.7) // lower-left fan
    const p = polar(cx, cy, 470, angle)
    nodes.push({
      id: m.id, type: "atlas", position: p,
      data: { kind: m.kind, name: m.label },
      style: {
        width: 150, height: 40, borderRadius: 12,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px",
      },
      draggable: false,
    })
  })
  for (const pr of PROJECTS) {
    for (const t of pr.technologies) {
      if (evByName.has(t.toLowerCase())) edges.push(edge(`proj-${pr.id}`, `tech-${t}`, "USES", "rgba(45,212,191,0.25)"))
    }
  }
  for (const l of LEARNING) {
    for (const t of l.technologies) {
      if (evByName.has(t.toLowerCase())) edges.push(edge(`learn-${l.id}`, `tech-${t}`, "ENABLED", "rgba(124,111,240,0.22)"))
    }
  }
  for (const x of EXPERIENCES) {
    for (const t of x.technologies) {
      if (evByName.has(t.toLowerCase())) edges.push(edge(`exp-${x.id}`, `tech-${t}`, "USED", "rgba(96,165,250,0.22)"))
    }
  }

  // Outer layer: achievements, sources, careers
  const outerCount = ACHIEVEMENTS.length + 2 + (state.linkedinConnected ? 1 : 0) + 1 + unlockedCareers.length
  let oi = 0
  const nextOuter = () => polar(cx, cy, 700, -Math.PI * (0.05 + (oi++ / Math.max(outerCount - 1, 1)) * 0.9))

  for (const a of ACHIEVEMENTS) {
    const pos = nextOuter()
    nodes.push({
      id: `ach-${a.id}`, type: "atlas", position: pos,
      data: { kind: "achievement", name: a.title, sub: a.result },
      style: outerStyle("rgba(212,167,44,0.14)", "rgba(212,167,44,0.35)"),
      draggable: false,
    })
    if (a.projectId) edges.push(edge(`ach-${a.id}`, `proj-${a.projectId}`, "ASSOCIATED WITH", "rgba(212,167,44,0.3)"))
    const firstSkill = a.supportsSkills.find((s) => evByName.has(s.toLowerCase()))
    if (firstSkill) edges.push(edge(`ach-${a.id}`, `tech-${firstSkill}`, "SUPPORTS", "rgba(212,167,44,0.3)"))
  }

  if (state.githubConnected) {
    const pos = nextOuter()
    nodes.push({
      id: "github-demo", type: "atlas", position: pos,
      data: { kind: "github", name: DEMO_GITHUB.username, sub: "DEMO GITHUB ACCOUNT" },
      style: outerStyle("rgba(255,255,255,0.06)", "rgba(255,255,255,0.18)"),
      draggable: false,
    })
    for (const pr of PROJECTS) {
      if (pr.githubRepo) edges.push(edge("github-demo", `proj-${pr.id}`, "PROVIDES EVIDENCE FOR", "rgba(255,255,255,0.16)"))
    }
  }

  if (state.linkedinConnected) {
    const pos = nextOuter()
    nodes.push({
      id: "linkedin-demo", type: "atlas", position: pos,
      data: { kind: "linkedin", name: "Alex Sharma", sub: "DEMO LINKEDIN PROFILE" },
      style: outerStyle("rgba(96,165,250,0.14)", "rgba(96,165,250,0.35)"),
      draggable: false,
    })
    for (const x of EXPERIENCES) edges.push(edge("linkedin-demo", `exp-${x.id}`, "IMPORTED EXPERIENCE", "rgba(96,165,250,0.28)"))
    for (const a of ACHIEVEMENTS) edges.push(edge("linkedin-demo", `ach-${a.id}`, "IMPORTED ACHIEVEMENT", "rgba(96,165,250,0.28)"))
  }

  // Career target + unlocked paths
  const career = CAREERS.find((c) => c.name === TARGET_CAREER)!
  const align = computeAlignment(career, evidence).alignmentPct
  nodes.push({
    id: "career-target", type: "atlas", position: nextOuter(),
    data: { kind: "career", name: TARGET_CAREER, sub: `${align}% illustrative alignment` },
    style: outerStyle("rgba(45,212,191,0.14)", "rgba(45,212,191,0.4)"),
    draggable: false,
  })
  for (const [t] of Object.entries(career.requirements)) {
    if (evByName.has(t.toLowerCase())) edges.push(edge(`tech-${t}`, "career-target", "CONTRIBUTES TO", "rgba(45,212,191,0.25)"))
  }
  for (const m of computeAlignment(career, evidence).missing) {
    if (evByName.has(m.name.toLowerCase())) {
      edges.push({ ...edge(`tech-${m.name}`, "career-target", "BLOCKS", "rgba(232,93,117,0.5)"), animated: true, labelStyle: { fill: "#E85D75" } })
    }
  }
  for (const cName of unlockedCareers) {
    const pos = nextOuter()
    nodes.push({
      id: `career-unlocked-${cName}`, type: "atlas", position: pos,
      data: { kind: "career", name: cName, sub: "Unlocked by simulation" },
      style: outerStyle("rgba(45,212,191,0.08)", "rgba(45,212,191,0.3)", true),
      draggable: false,
    })
    edges.push(edge("sim-node", `career-unlocked-${cName}`, "UNLOCKS", "rgba(45,212,191,0.5)", true))
  }

  // What-if simulated skill node
  if (simSkill) {
    nodes.push({
      id: "sim-node", type: "atlas",
      position: polar(cx, cy, 220, Math.PI * 1.75),
      data: { kind: "simulated", name: simSkill, sub: "SIMULATION" },
      style: {
        width: 56, height: 56, borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, rgba(45,212,191,0.9), rgba(17,19,24,0.9))",
        border: "1px dashed var(--evidence-strong)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 4,
      },
      draggable: false,
    })
    edges.push(edge("sim-node", "career-target", "UNLOCKS", "rgba(45,212,191,0.5)", true))
    edges.push({ ...edge("person", "sim-node", "IF LEARNED", "rgba(45,212,191,0.5)", true), animated: true })
  }

  return { nodes, edges }
}

function slug(bucket: string) {
  return bucket.toLowerCase().replace(" ", "-")
}

function outerStyle(bg: string, border: string, dashed = false): React.CSSProperties {
  return {
    width: 170, height: 48, borderRadius: 12, background: bg,
    border: `${dashed ? "1px dashed" : "1px solid"} ${border}`,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px",
    backdropFilter: "blur(6px)",
  }
}

function edge(source: string, target: string, label: string, color: string, animated = false): Edge {
  const e: Edge = {
    id: `${source}->${target}:${label || "e"}`,
    source, target, label,
    type: "straight",
    animated,
    style: { stroke: color, strokeWidth: 1 },
  }
  if (label) {
    e.labelStyle = { fill: "var(--muted-foreground)", fontSize: 9 }
    e.labelBgStyle = { fill: "#0A0B0Ecc" }
  }
  return e
}
