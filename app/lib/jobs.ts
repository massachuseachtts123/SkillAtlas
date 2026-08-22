// Static mock job/internship listings for the demo. Not a real job board —
// companies are fictional and this data never leaves client-side rendering.
// Skills loosely mirror CAREERS entries in careers.ts.

export type JobListing = {
  title: string
  company: string
  type: 'Full-time' | 'Internship'
  location: string
  skills: string[]
}

export const JOB_LISTINGS: JobListing[] = [
  {
    title: 'Backend Developer',
    company: 'Nimbus Labs',
    type: 'Full-time',
    location: 'Remote',
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'AI Engineer',
    company: 'Cortexa AI',
    type: 'Full-time',
    location: 'San Francisco (hybrid)',
    skills: ['Python', 'PyTorch', 'OpenAI'],
  },
  {
    title: 'Frontend Developer',
    company: 'PixelForge Studio',
    type: 'Full-time',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Brightstack',
    type: 'Full-time',
    location: 'Austin, TX',
    skills: ['Next.js', 'MongoDB', 'Node.js'],
  },
  {
    title: 'DevOps Engineer',
    company: 'Kernelflow',
    type: 'Full-time',
    location: 'Remote (EU timezone)',
    skills: ['Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    title: 'Cloud Engineering Intern',
    company: 'Skyvault Systems',
    type: 'Internship',
    location: 'Remote',
    skills: ['AWS', 'Linux', 'Python'],
  },
  {
    title: 'Data Engineer',
    company: 'Datastream Co.',
    type: 'Full-time',
    location: 'New York, NY',
    skills: ['SQL', 'Spark', 'Airflow'],
  },
  {
    title: 'Data Science Intern',
    company: 'Insightlytics',
    type: 'Internship',
    location: 'Remote',
    skills: ['Python', 'Pandas', 'scikit-learn'],
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Neuronpath',
    type: 'Full-time',
    location: 'Berlin, DE',
    skills: ['PyTorch', 'MLOps', 'AWS'],
  },
  {
    title: 'Mobile Developer (React Native)',
    company: 'Appvoyant',
    type: 'Full-time',
    location: 'Remote',
    skills: ['React Native', 'TypeScript', 'Firebase'],
  },
  {
    title: 'Site Reliability Engineer',
    company: 'Uptimeworks',
    type: 'Full-time',
    location: 'Remote (global)',
    skills: ['Kubernetes', 'Prometheus', 'Go'],
  },
  {
    title: 'Security Engineering Intern',
    company: 'Ciphergrid',
    type: 'Internship',
    location: 'London, UK',
    skills: ['Linux', 'Python', 'Wireshark'],
  },
]
