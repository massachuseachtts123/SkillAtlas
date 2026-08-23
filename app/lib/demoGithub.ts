// Demo GitHub account - entirely fictional. NOT a real GitHub account.
// No network calls anywhere in this file.

export const DEMO_GITHUB = {
  username: "alex.dev.demo",
  name: "Alex Sharma",
  role: "Junior Web Developer",
  location: "Kathmandu, Nepal",
  contributions: 142,
  commits: 167,
  pullRequests: 7,
  issues: 11,
} as const

export type DemoRepo = {
  repo_name: string
  description: string
  technologies: string[]
  commits: number
  stars: number
  forks: number
  lastActive: string
  linkedProjectId: string | null
}

export const DEMO_REPOS: DemoRepo[] = [
  {
    repo_name: "campus-events",
    description: "Web application for discovering campus events and registering online.",
    technologies: ["React", "JavaScript", "Firebase"],
    commits: 23,
    stars: 4,
    forks: 1,
    lastActive: "2025-11",
    linkedProjectId: "campus-events",
  },
  {
    repo_name: "shop-inventory",
    description: "Simple inventory management system for a local shop.",
    technologies: ["Python", "Flask", "SQLite"],
    commits: 31,
    stars: 3,
    forks: 0,
    lastActive: "2025-09",
    linkedProjectId: "shop-inventory",
  },
  {
    repo_name: "expense-tracker",
    description: "Personal expense tracking web application.",
    technologies: ["React", "Node.js", "MongoDB"],
    commits: 42,
    stars: 5,
    forks: 1,
    lastActive: "2026-02",
    linkedProjectId: "expense-tracker",
  },
  {
    repo_name: "weather-dashboard",
    description: "Responsive dashboard using a weather API.",
    technologies: ["React", "JavaScript", "REST APIs"],
    commits: 18,
    stars: 2,
    forks: 0,
    lastActive: "2026-04",
    linkedProjectId: "weather-dashboard",
  },
  {
    repo_name: "task-manager",
    description: "Full-stack task management application.",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    commits: 37,
    stars: 3,
    forks: 0,
    lastActive: "2026-06",
    linkedProjectId: "task-manager",
  },
  {
    repo_name: "personal-portfolio",
    description: "Personal developer portfolio website.",
    technologies: ["HTML", "CSS", "JavaScript"],
    commits: 16,
    stars: 2,
    forks: 0,
    lastActive: "2024-12",
    linkedProjectId: "portfolio",
  },
]

export function reposForTech(tech: string): DemoRepo[] {
  return DEMO_REPOS.filter((r) => r.technologies.some((t) => t.toLowerCase() === tech.trim().toLowerCase()))
}
