// AI extraction - the ONLY module allowed to call an LLM.
// Deterministic data never passes through here.
// Fallback rule: any failure returns null -> caller shows raw GitHub data only.

export type ExtractionResult = {
  technologies: string[]
  capabilities: string[]
}

type RepoInput = {
  repo_name: string
  description: string | null
  readme_summary: string
}

const EXTRACTION_PROMPT = `You are a technology extractor. Given a GitHub repository description and README excerpt, extract the technologies used and capabilities demonstrated.

Rules:
- Only list technologies explicitly evidenced in the text. Do not guess from the repo name alone.
- Use canonical names ("Node.js" not "nodejs", "PostgreSQL" not "postgres").
- Capabilities are short phrases like "REST API design", "data visualization".

Respond with ONLY this JSON object, no markdown fences, no other text:
{"technologies": ["..."], "capabilities": ["..."]}`

// Hand-rolled validation instead of zod - one shape, one use.
function validateExtraction(raw: unknown): ExtractionResult | null {
  if (typeof raw !== 'object' || raw === null) return null
  const obj = raw as Record<string, unknown>
  const techs = obj.technologies
  const caps = obj.capabilities
  if (!Array.isArray(techs) || !Array.isArray(caps)) return null
  if (!techs.every((t) => typeof t === 'string' && t.length > 0)) return null
  if (!caps.every((c) => typeof c === 'string')) return null
  return { technologies: techs.slice(0, 20), capabilities: caps.slice(0, 10) }
}

function extractJson(text: string): unknown {
  // Strip markdown fences if model added them despite instructions
  const cleaned = text.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

async function callOpenAI(repo: RepoInput): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        {
          role: 'user',
          content: `Repo: ${repo.repo_name}\nDescription: ${repo.description ?? '(none)'}\nREADME excerpt: ${repo.readme_summary || '(none)'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function callGemini(repo: RepoInput): Promise<string> {
  const model = 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: EXTRACTION_PROMPT }] },
      contents: [
        {
          parts: [
            {
              text: `Repo: ${repo.repo_name}\nDescription: ${repo.description ?? '(none)'}\nREADME excerpt: ${repo.readme_summary || '(none)'}`,
            },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json', temperature: 0 },
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export function llmAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY)
}

// Returns null on ANY failure -> caller degrades to VERIFIED-only data.
export async function extractFromRepo(repo: RepoInput): Promise<ExtractionResult | null> {
  if (!llmAvailable()) return null
  try {
    const text =
      process.env.OPENAI_API_KEY
        ? await callOpenAI(repo)
        : await callGemini(repo)
    if (!text) return null
    return validateExtraction(extractJson(text))
  } catch {
    return null
  }
}
