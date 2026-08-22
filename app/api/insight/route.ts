import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const PROMPT = `You are a career coach analyzing a GitHub profile's computed evidence.
Given structured JSON (career target, alignment %, strong/developing/missing techs, top evidence),
write exactly 2-3 sentences: what stands out, the biggest gap, and the highest-leverage next skill.
Only use facts present in the input. Plain prose, no markdown.`

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY
    ? { provider: 'openai', token: process.env.OPENAI_API_KEY }
    : process.env.GEMINI_API_KEY
      ? { provider: 'gemini', token: process.env.GEMINI_API_KEY }
      : null

  if (!key) {
    return NextResponse.json({ error: 'no-llm-key' }, { status: 503 })
  }

  const payload = await request.json()

  try {
    let text = ''
    if (key.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key.token}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: JSON.stringify(payload) }],
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) throw new Error(`OpenAI ${res.status}`)
      const data = await res.json()
      text = data.choices?.[0]?.message?.content ?? ''
    } else {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key.token}`,
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
      if (!res.ok) throw new Error(`Gemini ${res.status}`)
      const data = await res.json()
      text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    }
    return NextResponse.json({ success: true, insight: text.trim() })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'insight-failed' },
      { status: 502 }
    )
  }
}
