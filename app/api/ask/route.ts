import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Ask AI - answers questions about the user's atlas. Gemini only (single
// provider), same free-tier pattern as /api/insight: missing key or 429 means
// the client falls back to the local deterministic answer engine.
const MODEL = 'gemini-2.0-flash'

const PROMPT = `You are SkillAtlas AI, a concise assistant that answers questions about a developer's skill profile, projects, learning journey, experience, achievements and career alignment.
You receive the user's question plus structured JSON context (profile, evidence per technology with strength buckets, projects, learning items, experiences, achievements, career alignment).
Rules:
- Answer ONLY from facts in the provided JSON. Never invent skills, projects or numbers.
- Be direct and conversational. 2-5 short sentences unless asked for detail.
- Plain prose, no markdown headings. You may use simple bullet lines separated by newlines.
- If the answer is not in the data, say so briefly and suggest what to connect (GitHub/LinkedIn integrations).`

export async function POST(request: Request) {
  const token = process.env.GEMINI_API_KEY
  if (!token) {
    return NextResponse.json({ error: 'no-llm-key' }, { status: 503 })
  }

  let body: { question?: string; context?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (!question) {
    return NextResponse.json({ error: 'missing-question' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT }] },
          contents: [{
            parts: [{ text: `Question: ${question}\n\nContext JSON:\n${JSON.stringify(body.context ?? {})}` }],
          }],
          generationConfig: { temperature: 0.4 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    )
    if (res.status === 429 || res.status === 403) {
      return NextResponse.json({ error: 'llm-rate-limited' }, { status: 429 })
    }
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (!text.trim()) throw new Error('empty-answer')
    return NextResponse.json({ success: true, answer: text.trim() })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'ask-failed' },
      { status: 502 }
    )
  }
}
