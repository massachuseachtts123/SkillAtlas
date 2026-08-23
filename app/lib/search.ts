// Structured search - answers come from the demo dataset, never an LLM.
import { PROJECTS, LEARNING, EXPERIENCES, ACHIEVEMENTS } from "./demoData"
import { CAREERS, rankNextSkills } from "./careers"
import type { TechEvidence } from "./evidence"

export type SearchAnswer = {
  question: string
  lines: string[]
  targetTab?: "atlas" | "projects" | "learning" | "technologies" | "career"
}

function norm(s: string) { return s.trim().toLowerCase() }

const EXAMPLES = [
  "Where did I use React?",
  "What projects use Python?",
  "What evidence do I have for Git?",
  "Why is Docker recommended?",
]

export function answerQuery(q: string, evidence: TechEvidence[]): SearchAnswer {
  const query = norm(q)

  const matched = evidence.find((e) => query.includes(norm(e.name)))
  if (!matched) {
    return {
      question: q,
      lines: [
        `No technology named “${q}” found in your Atlas.`,
        `Try one of your technologies: ${evidence.slice(0, 8).map((e) => e.name).join(", ")}.`,
      ],
    }
  }

  // Why is Docker recommended?
  if (query.includes("why") || query.includes("recommend")) {
  for (const c of CAREERS) {
    const sugg = rankNextSkills(c, evidence).find((s) => norm(s.name) === norm(matched.name))
      if (sugg) {
        return {
          question: q,
          lines: [`${matched.name} is recommended because: ${sugg.reason}`, `Estimated impact: +${sugg.alignmentGain} alignment points across careers.`],
          targetTab: "career",
        }
      }
    }
    return {
      question: q,
      lines: [`${matched.name} appears in your profile with ${matched.bucket.toLowerCase()} evidence. It is not currently a ranked suggestion for any career gap.`],
    }
  }

  const lines: string[] = []
  const projHits = PROJECTS.filter((p) => p.technologies.some((t) => norm(t) === norm(matched.name)))
  const learnHits = LEARNING.filter((l) => l.technologies.some((t) => norm(t) === norm(matched.name)))
  const expHits = EXPERIENCES.filter((x) => x.technologies.some((t) => norm(t) === norm(matched.name)))
  const achHits = ACHIEVEMENTS.filter((a) => a.supportsSkills.some((t) => norm(t) === norm(matched.name)))

  lines.push(`${matched.name} — evidence strength: ${matched.bucket}${matched.selfDescribedOnly ? " (self-described only)" : ""}.`)
  if (projHits.length) lines.push(`Projects: ${projHits.map((p) => p.name).join(", ")}.`)
  if (learnHits.length) lines.push(`Learned through: ${learnHits.map((l) => l.title).join(", ")}.`)
  if (expHits.length) lines.push(`Experience: ${expHits.map((x) => x.role).join(", ")}.`)
  if (achHits.length) lines.push(`Achievements supporting it: ${achHits.map((a) => a.title).join(", ")}.`)
  lines.push(matched.githubRepoCount > 0
    ? `Demo GitHub: ${matched.githubRepos.join(", ")}.`
    : `No GitHub demo evidence connected yet — integrate GitHub to add repository evidence.`)

  const wantsLearning = query.includes("learn")
  return {
    question: q,
    lines,
    targetTab: wantsLearning ? "learning" : query.includes("project") ? "projects" : query.includes("evidence") ? "technologies" : undefined,
  }
}
