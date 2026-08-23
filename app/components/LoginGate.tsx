"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

// Demo gate, NOT real authentication. Hardcoded credentials + client-side
// check only — exists so the app isn't wide open for pulling a stranger's
// GitHub data without consent during demos. No backend auth, no sessions.
const DEMO_USER = "Demo-001"
const DEMO_PASS = "Demo@001"
const AUTH_KEY = "skillatlas-auth"

export default function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const userRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username === DEMO_USER && password === DEMO_PASS) {
      try { sessionStorage.setItem(AUTH_KEY, "1") } catch { /* private mode */ }
      onLogin()
    } else {
      setError("Invalid credentials. Use the demo login: Demo-001 / Demo@001")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070C] p-6 text-foreground">
      {/* Dot texture + soft glow, matching the deep navy / near-black reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">SkillAtlas</span>
          <p className="mt-1 text-xs text-muted-foreground">Map your skills. Navigate your future.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-elevation backdrop-blur-xl">
          <h1 className="text-xl font-bold tracking-tight text-balance">Welcome to SkillAtlas</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Build your technical identity. See where your career can go.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-user" className="block text-sm font-medium text-foreground/90">
                Username
              </label>
              <input
                id="login-user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={userRef}
                autoComplete="username"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/40 transition-shadow"
                placeholder="Demo-001"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="login-pass" className="block text-sm font-medium text-foreground/90">
                Password
              </label>
              <input
                id="login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/40 transition-shadow"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            {error && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        </div>

        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Demo credentials: <span className="font-mono-tech text-foreground/80">Demo-001</span> / <span className="font-mono-tech text-foreground/80">Demo@001</span> — this is a demo gate, not real authentication.
        </p>
      </div>
    </main>
  )
}
