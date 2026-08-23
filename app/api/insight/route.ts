import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Gemini only (single provider). gemini-2.0-flash is on Gemini's free tier,
// which has its own rate limits (requests per minute / per day) — a 429 is
// returned to the client as 'llm-rate-limited' so the UI can degrade the same
// way it does for a missing key. The app never blocks on this endpoint.
const MODEL = 'gemini-2.0-flash'

const PROMPT = `You are a career coach analyzing a GitHub profile's computed evidence.
Given structured JSON (career target, alignment %, strong/developing/missing techs, top evidence),
write exactly 2-3 sentences: what stands out, the biggest gap, and the highest-leverage next skill.
Only use facts present in the input. Plain prose, no markdown.`

export async function POST(request: Request) {
  const token = process.env.GEMINI_API_KEY
  if (!token) {
    return NextResponse.json({ error: 'no-llm-key' }, { status: 503 })
  }

  const payload = await request.json()

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT }] },
          contents: [{ parts: [{ text: JSON.stringify(payload) }] }],
          generationConfig: { temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(15000),
      }
    )
    if (res.status === 429 || res.status === 403) {
      return NextResponse.json({ error: 'llm-rate-limited' }, { status: 429 })
    }
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ success: true, insight: text.trim() })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'insight-failed' },
      { status: 502 }
    )
  }
}
