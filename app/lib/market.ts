// Static mock market intelligence for the demo. Salary ranges, demand scores
// and trend deltas are invented placeholder numbers — not real market data.

export type TechDemand = {
  name: string
  demandScore: number // 0-100 (mock)
  trendPct: number // YoY change (mock)
}

export type MarketRow = {
  career: string
  salaryMin: number // USD k/yr (mock)
  salaryMax: number
  demand: TechDemand[]
}

export const MARKET_DATA: MarketRow[] = [
  {
    career: 'Backend Developer',
    salaryMin: 85,
    salaryMax: 145,
    demand: [
      { name: 'Node.js', demandScore: 78, trendPct: 4 },
      { name: 'PostgreSQL', demandScore: 82, trendPct: 9 },
      { name: 'Docker', demandScore: 88, trendPct: 6 },
    ],
  },
  {
    career: 'AI Engineer',
    salaryMin: 110,
    salaryMax: 190,
    demand: [
      { name: 'Python', demandScore: 95, trendPct: 18 },
      { name: 'PyTorch', demandScore: 90, trendPct: 24 },
      { name: 'OpenAI', demandScore: 86, trendPct: 31 },
    ],
  },
  {
    career: 'Frontend Developer',
    salaryMin: 75,
    salaryMax: 130,
    demand: [
      { name: 'React', demandScore: 92, trendPct: 3 },
      { name: 'TypeScript', demandScore: 89, trendPct: 11 },
      { name: 'Next.js', demandScore: 80, trendPct: 14 },
    ],
  },
  {
    career: 'Full-Stack Developer',
    salaryMin: 85,
    salaryMax: 150,
    demand: [
      { name: 'Next.js', demandScore: 80, trendPct: 14 },
      { name: 'MongoDB', demandScore: 70, trendPct: -2 },
      { name: 'Node.js', demandScore: 78, trendPct: 4 },
    ],
  },
  {
    career: 'DevOps Engineer',
    salaryMin: 100,
    salaryMax: 165,
    demand: [
      { name: 'Kubernetes', demandScore: 91, trendPct: 12 },
      { name: 'Terraform', demandScore: 84, trendPct: 10 },
      { name: 'CI/CD', demandScore: 87, trendPct: 7 },
    ],
  },
  {
    career: 'Cloud Engineer',
    salaryMin: 95,
    salaryMax: 160,
    demand: [
      { name: 'AWS', demandScore: 93, trendPct: 8 },
      { name: 'GCP', demandScore: 74, trendPct: 13 },
      { name: 'Azure', demandScore: 76, trendPct: 9 },
    ],
  },
  {
    career: 'Data Engineer',
    salaryMin: 95,
    salaryMax: 160,
    demand: [
      { name: 'SQL', demandScore: 94, trendPct: 5 },
      { name: 'Spark', demandScore: 79, trendPct: 3 },
      { name: 'Airflow', demandScore: 72, trendPct: 15 },
    ],
  },
  {
    career: 'Data Scientist',
    salaryMin: 90,
    salaryMax: 155,
    demand: [
      { name: 'Python', demandScore: 95, trendPct: 18 },
      { name: 'scikit-learn', demandScore: 68, trendPct: 2 },
      { name: 'SQL', demandScore: 94, trendPct: 5 },
    ],
  },
  {
    career: 'Machine Learning Engineer',
    salaryMin: 115,
    salaryMax: 200,
    demand: [
      { name: 'PyTorch', demandScore: 90, trendPct: 24 },
      { name: 'MLOps', demandScore: 81, trendPct: 27 },
      { name: 'Kubernetes', demandScore: 91, trendPct: 12 },
    ],
  },
  {
    career: 'Mobile Developer',
    salaryMin: 80,
    salaryMax: 140,
    demand: [
      { name: 'React Native', demandScore: 71, trendPct: 1 },
      { name: 'Swift', demandScore: 66, trendPct: -4 },
      { name: 'Flutter', demandScore: 69, trendPct: 6 },
    ],
  },
  {
    career: 'Site Reliability Engineer',
    salaryMin: 105,
    salaryMax: 175,
    demand: [
      { name: 'Prometheus', demandScore: 77, trendPct: 10 },
      { name: 'Linux', demandScore: 90, trendPct: 2 },
      { name: 'Go', demandScore: 83, trendPct: 16 },
    ],
  },
  {
    career: 'Cybersecurity Engineer',
    salaryMin: 100,
    salaryMax: 170,
    demand: [
      { name: 'Linux', demandScore: 90, trendPct: 2 },
      { name: 'Cryptography', demandScore: 64, trendPct: 12 },
      { name: 'Bash', demandScore: 70, trendPct: 1 },
    ],
  },
]
