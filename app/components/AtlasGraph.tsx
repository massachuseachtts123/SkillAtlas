"use client"

import { memo, useEffect, useCallback } from "react"
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Controls,
  Handle, Position, useReactFlow,
  type Node, type Edge, type NodeProps, type NodeMouseHandler,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

export type AtlasNodeData = {
  kind: string
  name: string
  sub?: string
  bucket?: string
  sourceCount?: number
  simulated?: string | undefined
}

const KIND_GLYPH: Record<string, string> = {
  project: "◆", learning: "◇", experience: "▣", achievement: "★",
  github: "⌥", linkedin: "in", career: "➤", person: "",
}

function kindClass(kind: string): string {
  switch (kind) {
    case "person": return "text-primary"
    case "project": return "text-teal-300"
    case "learning": return "text-violet-300"
    case "experience": return "text-blue-300"
    case "achievement": return "text-amber-200"
    case "github": return "text-foreground"
    case "linkedin": return "text-blue-300"
    case "career": return "text-teal-200"
    case "simulated": return "text-teal-200"
    default: return ""
  }
}

const AtlasNode = memo(function AtlasNode({ data }: NodeProps) {
  const d = data as AtlasNodeData
  if (d.kind === "person") {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-xl font-bold text-primary shadow-[0_0_32px_-6px_var(--primary)]">
          AS
        </div>
        <div className="whitespace-nowrap rounded-full border border-border bg-card/95 px-3 py-0.5 text-xs font-semibold">
          {d.name}
        </div>
        <div className="whitespace-nowrap text-[10px] text-muted-foreground">{d.sub}</div>
      </div>
    )
  }
  if (d.kind === "technology") {
    return (
      <div className="relative flex h-full w-full cursor-pointer items-center justify-center text-center transition-transform duration-200 hover:scale-110">
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        <span className="text-[11px] font-semibold leading-tight drop-shadow-sm">{d.name}</span>
      </div>
    )
  }
  // pill nodes (project / learning / experience / achievement / github / linkedin / career / sim)
  return (
    <div className="flex h-full w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl transition-all duration-200 hover:border-ring/50">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <span aria-hidden className={`shrink-0 text-xs ${kindClass(d.kind)}`}>{KIND_GLYPH[d.kind] ?? "•"}</span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[11px] font-medium">{d.name}</span>
        {d.sub && <span className="truncate text-[9px] text-muted-foreground">{d.sub}</span>}
      </span>
    </div>
  )
})

const nodeTypes = { atlas: AtlasNode }

function Fit({ dep }: { dep: number }) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    const t = setTimeout(() => fitView({ duration: 600, padding: 0.12 }), 80)
    return () => clearTimeout(t)
  }, [fitView, dep])
  return null
}

export default function AtlasGraph({
  nodes, edges, onSelect, recenterKey,
}: {
  nodes: Node[]
  edges: Edge[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  recenterKey: number
}) {
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => onSelect(node.id),
    [onSelect]
  )

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => onSelect(null)}
        fitView
        minZoom={0.08}
        maxZoom={1.6}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="rgba(255,255,255,0.03)" />
        <Controls showInteractive={false} position="bottom-right" />
        <Fit dep={recenterKey} />
      </ReactFlow>
    </ReactFlowProvider>
  )
}
