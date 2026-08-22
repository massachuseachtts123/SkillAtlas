"use client"

import { Badge } from "@/components/ui/badge"
import { JOB_LISTINGS, type JobListing } from "@/lib/jobs"
import { Briefcase, GraduationCap, MapPin } from "lucide-react"

// Demo listings from app/lib/jobs.ts — all companies fictional.
export default function JobsSection() {
  return (
    <section id="jobs" className="border-b border-border px-6 py-8 scroll-mt-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Jobs &amp; internships</h2>
          <Badge variant="secondary">demo data</Badge>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          Mock listings tied to the career paths above. Companies are fictional — demo only.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {JOB_LISTINGS.map((job) => (
            <JobCard key={`${job.company}-${job.title}`} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}

function JobCard({ job }: { job: JobListing }) {
  return (
    <article className="bg-card/50 backdrop-blur rounded-xl border border-border p-4 shadow-elevation transition-all duration-200 hover:shadow-elevation-hover hover:border-ring/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
        </div>
        <Badge variant={job.type === "Internship" ? "secondary" : "default"} className="shrink-0 gap-1">
          {job.type === "Internship" ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
          {job.type}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {job.location}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.skills.map((s) => (
          <span key={s} className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[11px] text-foreground">
            {s}
          </span>
        ))}
      </div>
    </article>
  )
}
