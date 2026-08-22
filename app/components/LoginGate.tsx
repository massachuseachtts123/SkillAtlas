"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
          <Zap className="h-5 w-5 text-primary" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">demo access</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-balance">Sign in to SkillAtlas</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Demo gate — keeps profile analysis behind a login so nobody&apos;s GitHub
          data gets pulled without consent.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-card/50 backdrop-blur rounded-xl border border-border p-6 shadow-elevation">
          <div className="space-y-1.5">
            <label htmlFor="login-user" className="block text-sm font-medium">
              Username
            </label>
            <input
              id="login-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={userRef}
              autoComplete="username"
              required
              className="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 transition-shadow"
              placeholder="Demo-001"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="login-pass" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 transition-shadow"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
          {error && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground text-center">
            Demo credentials: <span className="font-mono-tech text-foreground">Demo-001</span> / <span className="font-mono-tech text-foreground">Demo@001</span>
          </p>
        </form>
      </div>
    </main>
  )
}
