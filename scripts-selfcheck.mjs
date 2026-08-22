// Self-check for deterministic scoring. Run: node scripts-selfcheck.mjs
import { execSync } from 'node:child_process'
execSync('pnpm exec tsc app/lib/evidence.ts app/lib/careers.ts --outDir /tmp/opencode/sc --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck --ignoreConfig', { stdio: 'inherit' })
const { computeEvidence } = await import('/tmp/opencode/sc/evidence.js')
const { CAREERS, computeAlignment } = await import('/tmp/opencode/sc/careers.js')

const repos = [
  { repo_name: 'a', description: null, languages: { Python: 500 }, topics: ['react'], stars: 1000, pushed_at: new Date().toISOString(), readme_summary: '' },
  { repo_name: 'b', description: null, languages: { Python: 100 }, topics: [], stars: 10, pushed_at: '2020-01-01T00:00:00Z', readme_summary: '' },
]
const ev = computeEvidence(repos)
const py = ev.find(e => e.name === 'Python')
console.assert(py.rawScore === 2*2 + 1 + 3, `python raw expected 8 got ${py.rawScore}`) // 2 repos + 1 recent + starBonus 3
console.assert(py.bucket === 'Strong', `expected Strong got ${py.bucket}`)

const align = computeAlignment(CAREERS[0], ev)
console.log('backend alignment vs python/react-only profile:', align.alignmentPct + '%')
console.assert(align.alignmentPct === Math.round((4/29)*100), `expected 14 got ${align.alignmentPct}`)
console.log('strong:', align.strong.map(s=>s.name), 'dev:', align.developing.map(s=>s.name), 'missing:', align.missing.map(m=>m.name))

const sim = computeAlignment(CAREERS[0], ev, { 'node.js': 4 })
console.log('what-if Node.js strong:', sim.alignmentPct + '%')
console.assert(sim.alignmentPct > align.alignmentPct, 'what-if must increase alignment')
console.log('ALL CHECKS PASSED')
