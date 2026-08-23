"use client"

import { useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { answerQuery, type SearchAnswer } from "@/lib/search"
import { computeAlignment, CAREERS } from "@/lib/careers"
import type { TechEvidence } from "@/lib/evidence"
import { DEMO_PROFILE, PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS } from "@/lib/demoData"
import { DEMO_GITHUB } from "@/lib/demoGithub"
import {
  BotMessageSquare, SendHorizontal, UserRound, Sparkles,
  AlertTriangle, RotateCcw,
} from "lucide-react"

type Message =
  | { role: "user"; text: string }
  | { role: "ai"; text: string; source: "gemini" | "local"; question?: string }

const SUGGESTIONS = [
  "Where did I use React?",
  "What evidence do I have for Git?",
  "Why is Docker recommended for me?",
  "How ready am I to become a Full Stack Developer?",
  "What should I learn next and why?",
]

const TARGET_CAREER = CAREERS.find((c) => c.name === "Full Stack Developer") ?? CAREERS[0]

export default function AskAiView({
  evidence,
  state,
}: {
  evidence: TechEvidence[]
  state: { githubConnected: boolean; linkedinConnected: boolean }
}) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Compact context payload — everything the AI is allowed to know about the user.
  const context = useMemo(() => {
    const alignment = computeAlignment(TARGET_CAREER, evidence)
    return {
      profile: { ...DEMO_PROFILE, githubUsername: state.githubConnected ? DEMO_GITHUB.username : null },
      careerTarget: TARGET_CAREER.name,
      careerAlignmentPct: alignment.alignmentPct,
      strongTechs: alignment.strong.map((s) => s.name),
      developingTechs: alignment.developing?.map((s) => s.name) ?? [],
      missingTechs: alignment.missing.map((s) => s.name),
      technologies: evidence.map((e) => ({
        name: e.name,
        strength: e.bucket,
        selfDescribedOnly: e.selfDescribedOnly || undefined,
        projects: e.projectNames,
        learning: e.learningTitles,
      })),
      projects: PROJECTS.map((p) => ({ name: p.name, description: p.description, technologies: p.technologies, year: p.year })),
      learning: LEARNING.map((l) => ({ title: l.title, period: l.period, status: l.status, source: l.source, technologies: l.technologies })),
      experience: EXPERIENCES.map((x) => ({ role: x.role, org: x.org, duration: x.duration, technologies: x.technologies })),
      achievements: ACHIEVEMENTS.map((a) => ({ title: a.title, category: a.category, year: a.year, result: a.result })),
    }
  }, [evidence, state])

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  function fallbackAnswer(q: string): Message {
    const local: SearchAnswer = answerQuery(q, evidence)
    return { role: "ai", text: local.lines.join("\n"), source: "local", question: q }
  }

  async function ask(question: string) {
    if (!question.trim() || loading) return
    setInput("")
    setMessages((m) => [...m, { role: "user", text: question }, { role: "ai", text: "", source: "local" }])
    setLoading(true)
    scrollToBottom()

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      })
      let answer = ""
      let usedGemini = false
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.answer) {
          answer = data.answer
          usedGemini = true
        }
      }
      if (!usedGemini) answer = fallbackAnswer(question).text
      setMessages((m) => [...m.slice(0, -1), {
        role: "ai", text: answer, source: usedGemini ? "gemini" : "local",
      }])
    } catch {
      setMessages((m) => [...m.slice(0, -1), fallbackAnswer(question)])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  return (
    <section aria-label="Ask AI" className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" /> Ask AI
        </h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Answers from your Atlas data</span>
      </div>

      {/* Conversation */}
      <div ref={listRef} className="min-h-[320px] flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card/40 p-5 backdrop-blur">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
              <BotMessageSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold">Ask anything about your technical journey</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              The AI reads your projects, learning, evidence strengths and career alignment — nothing else.
            </p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="flex justify-end gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
                {msg.text}
              </div>
              <div aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                <UserRound className="h-3.5 w-3.5" />
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <div aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <BotMessageSquare className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border bg-background/60 px-4 py-2.5 shadow-sm">
                {loading && msg.text === "" ? (
                  <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </span>
                ) : (
                  <>
                    <div className="space-y-1 whitespace-pre-line text-sm leading-relaxed">{msg.text}</div>
                    {msg.source === "local" ? (
                      <Badge variant="outline" className="mt-2 gap-1 text-[10px]">
                        <AlertTriangle className="h-3 w-3" /> Offline answer · local data engine
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-2 text-[10px]">AI generated</Badge>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button key={s} size="sm" variant="outline" onClick={() => ask(s)}>
              {s}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        className="mt-3 flex shrink-0 gap-2"
        onSubmit={(e) => { e.preventDefault(); ask(input) }}
      >
        <input
          aria-label="Ask the AI about your atlas"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Which project proves my Node.js skills?"
          disabled={loading}
          className="w-full rounded-lg border border-border bg-input/30 px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
        />
        {messages.length > 0 && (
          <Button type="button" variant="ghost" size="icon" aria-label="Clear conversation" onClick={() => setMessages([])} disabled={loading}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" size="icon" aria-label="Send question" disabled={loading || !input.trim()}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-2 text-[11px] text-muted-foreground">
        Answers are grounded in your Atlas demo data only. If the Gemini API is unavailable, a deterministic
        offline engine answers from the same dataset.
      </p>
    </section>
  )
}
