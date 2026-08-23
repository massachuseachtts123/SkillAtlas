// Demo profile data - entirely fictional, one consistent persona (Alex Sharma).
// Everything here is DEMO DATA. Never present it as real.

export const DEMO_PROFILE = {
  name: "Alex Sharma",
  role: "Junior Web Developer",
  location: "Kathmandu, Nepal",
  experienceYears: 1,
  targetCareer: "Full Stack Developer",
} as const

export type Project = {
  id: string
  name: string
  description: string
  technologies: string[]
  skills: string[]
  githubRepo: string | null // linked demo repo id, if any
  year: number
}

export type LearningItem = {
  id: string
  title: string
  period: string
  status: "completed" | "current"
  source: string // college coursework / online course / personal practice
  technologies: string[]
  enabledProjects: string[] // project ids this learning fed into
}

export type Experience = {
  id: string
  role: string
  org: string
  location: string
  duration: string
  responsibilities: string[]
  technologies: string[]
}

export type Achievement = {
  id: string
  title: string
  org: string
  year: number
  category: "Hackathon" | "Certification" | "Competition"
  role?: string
  projectId?: string
  result: string
  technologies: string[]
  supportsSkills: string[]
}

export const PROJECTS: Project[] = [
  {
    id: "campus-events",
    name: "Campus Events Portal",
    description: "Web application for discovering campus events and registering online.",
    technologies: ["React", "JavaScript", "Firebase", "HTML", "CSS"],
    skills: ["Frontend Development", "Authentication", "Database Integration"],
    githubRepo: "campus-events",
    year: 2025,
  },
  {
    id: "shop-inventory",
    name: "Local Shop Inventory",
    description: "Simple inventory management system for a local shop.",
    technologies: ["Python", "Flask", "SQLite", "HTML"],
    skills: ["Backend Development", "REST APIs", "Database Management"],
    githubRepo: "shop-inventory",
    year: 2025,
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description: "Personal expense tracking web application.",
    technologies: ["React", "JavaScript", "Node.js", "MongoDB"],
    skills: ["CRUD", "API Integration", "Frontend Development", "Database Management"],
    githubRepo: "expense-tracker",
    year: 2025,
  },
  {
    id: "weather-dashboard",
    name: "Weather Dashboard",
    description: "Responsive dashboard using a weather API.",
    technologies: ["JavaScript", "React", "REST APIs", "CSS"],
    skills: ["API Integration", "Frontend Development", "Asynchronous Programming"],
    githubRepo: "weather-dashboard",
    year: 2026,
  },
  {
    id: "task-manager",
    name: "Task Management App",
    description: "Full-stack task management application.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
    skills: ["Full Stack Development", "REST APIs", "CRUD", "Database Integration"],
    githubRepo: "task-manager",
    year: 2026,
  },
  {
    id: "portfolio",
    name: "Personal Portfolio",
    description: "Personal developer portfolio website.",
    technologies: ["HTML", "CSS", "JavaScript"],
    skills: ["Responsive Design", "Frontend Development", "UI Development"],
    githubRepo: "personal-portfolio",
    year: 2024,
  },
]

export const LEARNING: LearningItem[] = [
  {
    id: "learn-html-css",
    title: "HTML + CSS Fundamentals",
    period: "2024",
    status: "completed",
    source: "College coursework + free online course",
    technologies: ["HTML", "CSS"],
    enabledProjects: ["portfolio"],
  },
  {
    id: "learn-js",
    title: "JavaScript",
    period: "2025",
    status: "completed",
    source: "Free online course + personal practice",
    technologies: ["JavaScript"],
    enabledProjects: ["portfolio", "campus-events", "weather-dashboard"],
  },
  {
    id: "learn-react",
    title: "React Course",
    period: "2025",
    status: "completed",
    source: "Demo Learning Platform certificate track",
    technologies: ["React"],
    enabledProjects: ["campus-events", "expense-tracker", "weather-dashboard", "task-manager"],
  },
  {
    id: "learn-python-flask",
    title: "Python + Flask",
    period: "2025",
    status: "completed",
    source: "College coursework + project-based learning",
    technologies: ["Python", "Flask"],
    enabledProjects: ["shop-inventory"],
  },
  {
    id: "learn-node",
    title: "Node.js Backend Basics",
    period: "2026",
    status: "completed",
    source: "Project-based learning",
    technologies: ["Node.js"],
    enabledProjects: ["expense-tracker", "task-manager"],
  },
  {
    id: "learn-docker",
    title: "Docker Fundamentals",
    period: "Currently learning",
    status: "current",
    source: "Self-study",
    technologies: ["Docker"],
    enabledProjects: [],
  },
]

export const EXPERIENCES: Experience[] = [
  {
    id: "intern-demo-digital",
    role: "Junior Web Development Intern",
    org: "Demo Digital Studio",
    location: "Kathmandu, Nepal",
    duration: "6 months · 2025",
    responsibilities: [
      "Built React components for client dashboards",
      "Integrated REST APIs into existing frontends",
      "Fixed frontend bugs and UI issues",
      "Worked with Git in a small team workflow",
      "Maintained small web applications",
    ],
    technologies: ["React", "JavaScript", "Git", "REST APIs"],
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "hack-kathmandu-2025",
    title: "Kathmandu Web Hackathon 2025",
    org: "Kathmandu Web Community",
    year: 2025,
    category: "Hackathon",
    role: "Frontend Developer",
    projectId: "campus-events",
    result: "Top 10 finalist",
    technologies: ["React", "JavaScript", "Firebase"],
    supportsSkills: ["React", "JavaScript", "Firebase"],
  },
  {
    id: "nsic-2026",
    title: "Nepal Student Innovation Challenge 2026",
    org: "NSIC Organizing Committee",
    year: 2026,
    category: "Hackathon",
    role: "Full Stack Developer",
    projectId: "task-manager",
    result: "Participant",
    technologies: ["React", "Node.js", "MongoDB"],
    supportsSkills: ["Node.js", "MongoDB", "REST APIs"],
  },
  {
    id: "cert-web-dev-2025",
    title: "Web Development Certificate",
    org: "Demo Learning Platform",
    year: 2025,
    category: "Certification",
    result: "Completed",
    technologies: ["JavaScript", "React", "HTML", "CSS"],
    supportsSkills: ["JavaScript", "React", "HTML", "CSS"],
  },
]

// ---- LinkedIn demo import (fictional) ----

export const LINKEDIN_DEMO = {
  name: "Alex Sharma",
  headline: "Junior Web Developer · React & JavaScript · Open to Full Stack roles",
  location: "Kathmandu, Nepal",
  about:
    "Junior web developer with 1 year of hands-on project experience. I enjoy building web applications with React and JavaScript, and I'm currently strengthening my backend and deployment skills. Looking for a junior full stack role where I can keep growing.",
  education: [
    { school: "Demo University", degree: "Bachelor of Computer Science", period: "2023–2027" },
  ],
  experience: EXPERIENCES,
  // NOTE: self-described only — SkillAtlas treats these claims separately from evidence.
  claimedSkills: ["JavaScript", "React", "Python", "Flask", "Node.js", "SQL", "Git", "REST APIs", "MongoDB"],
  certifications: [
    { title: "Web Development Certificate", issuer: "Demo Learning Platform", year: 2025 },
  ],
  achievements: ACHIEVEMENTS.map((a) => a.title),
}

// ---- Atlas completeness ----

export function atlasCompleteness(state: { githubConnected: boolean; linkedinConnected: boolean }) {
  const items = [
    { label: "Projects", done: true },
    { label: "Learning", done: true },
    { label: "Experience", done: true },
    { label: "Achievements", done: true },
    { label: "GitHub evidence", done: state.githubConnected },
    { label: "LinkedIn profile", done: state.linkedinConnected },
    { label: "Career goal", done: true },
  ]
  const pct = Math.round((items.filter((i) => i.done).length / items.length) * 100)
  return { items, pct }
}
