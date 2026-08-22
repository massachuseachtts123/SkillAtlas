"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2, Plus, Trash2, User, ExternalLink } from "lucide-react"

// Demo profile builder. Entirely client-side in-memory state — nothing
// persists across a refresh (acceptable for this hackathon build).
// LinkedIn is a static placeholder field, not a real integration.
type Project = { title: string; description: string; link: string }
type Experience = { role: string; company: string; duration: string; description: string }

const inputCls =
  "w-full rounded-lg border border-border bg-input/30 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 transition-shadow"

export default function ProfileSection({ username }: { username: string }) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [draftProject, setDraftProject] = useState<Project>({ title: "", description: "", link: "" })
  const [experience, setExperience] = useState<Experience[]>([])
  const [draftExperience, setDraftExperience] = useState<Experience>({ role: "", company: "", duration: "", description: "" })
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/demo-001")

  const githubUrl = `https://github.com/${username}`

  return (
    <section id="profile" className="px-6 py-8 scroll-mt-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Profile &amp; portfolio</h2>
          <Badge variant="secondary">demo · session only</Badge>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          Build a quick portfolio from your analysis. Entries live in memory for this session — refresh clears them.
        </p>

        {/* Identity links */}
        <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation flex flex-wrap items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground" />
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors group"
          >
            <ExternalLink className="w-4 h-4" />
            github.com/{username}
          </a>
          <span className="w-px h-5 bg-border" />
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <input
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/demo-001"
            aria-label="LinkedIn profile URL"
            className={`${inputCls} max-w-xs`}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Achievements */}
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation space-y-3">
            <h3 className="font-semibold text-sm">Hackathon achievements</h3>
            <ul className="space-y-1.5">
              {achievements.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing added yet.</li>
              )}
              {achievements.map((a, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm bg-secondary/40 rounded-lg px-3 py-2">
                  <span>{a}</span>
                  <button
                    onClick={() => setAchievements(achievements.filter((_, j) => j !== i))}
                    aria-label={`Remove achievement ${i + 1}`}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!newAchievement.trim()) return
                setAchievements([...achievements, newAchievement.trim()])
                setNewAchievement("")
              }}
            >
              <input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Winner — XYZ Hackathon 2026"
                aria-label="New achievement"
                className={inputCls}
              />
              <Button type="submit" size="sm" variant="outline" className="shrink-0 px-2.5">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Projects */}
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation space-y-3">
            <h3 className="font-semibold text-sm">Projects</h3>
            <ul className="space-y-2">
              {projects.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing added yet.</li>
              )}
              {projects.map((p, i) => (
                <li key={i} className="text-sm bg-secondary/40 rounded-lg px-3 py-2 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{p.title}</span>
                    <button
                      onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                      aria-label={`Remove project ${p.title}`}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {p.description && <p className="text-muted-foreground">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">
                      {p.link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!draftProject.title.trim()) return
                setProjects([...projects, draftProject])
                setDraftProject({ title: "", description: "", link: "" })
              }}
            >
              <input
                value={draftProject.title}
                onChange={(e) => setDraftProject({ ...draftProject, title: e.target.value })}
                placeholder="Title"
                aria-label="Project title"
                required
                className={inputCls}
              />
              <input
                value={draftProject.description}
                onChange={(e) => setDraftProject({ ...draftProject, description: e.target.value })}
                placeholder="Short description"
                aria-label="Project description"
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  value={draftProject.link}
                  onChange={(e) => setDraftProject({ ...draftProject, link: e.target.value })}
                  placeholder="Link (optional)"
                  aria-label="Project link"
                  className={inputCls}
                />
                <Button type="submit" size="sm" variant="outline" className="shrink-0 px-2.5">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Work experience */}
          <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation space-y-3">
            <h3 className="font-semibold text-sm">Work experience</h3>
            <ul className="space-y-2">
              {experience.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing added yet.</li>
              )}
              {experience.map((x, i) => (
                <li key={i} className="text-sm bg-secondary/40 rounded-lg px-3 py-2 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{x.role} · {x.company}</span>
                    <button
                      onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                      aria-label={`Remove experience at ${x.company}`}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{x.duration}</p>
                  {x.description && <p className="text-muted-foreground">{x.description}</p>}
                </li>
              ))}
            </ul>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!draftExperience.role.trim() || !draftExperience.company.trim()) return
                setExperience([...experience, draftExperience])
                setDraftExperience({ role: "", company: "", duration: "", description: "" })
              }}
            >
              <input
                value={draftExperience.role}
                onChange={(e) => setDraftExperience({ ...draftExperience, role: e.target.value })}
                placeholder="Role"
                aria-label="Job role"
                required
                className={inputCls}
              />
              <input
                value={draftExperience.company}
                onChange={(e) => setDraftExperience({ ...draftExperience, company: e.target.value })}
                placeholder="Company"
                aria-label="Company name"
                required
                className={inputCls}
              />
              <input
                value={draftExperience.duration}
                onChange={(e) => setDraftExperience({ ...draftExperience, duration: e.target.value })}
                placeholder="Duration (e.g. 2024–2026)"
                aria-label="Duration"
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  value={draftExperience.description}
                  onChange={(e) => setDraftExperience({ ...draftExperience, description: e.target.value })}
                  placeholder="Description (optional)"
                  aria-label="Experience description"
                  className={inputCls}
                />
                <Button type="submit" size="sm" variant="outline" className="shrink-0 px-2.5">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
