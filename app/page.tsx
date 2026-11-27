import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

export default async function Home() {
  const featured = await getFeaturedProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Software Engineer
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Hytham Defrawy
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
          I build fast, accessible web applications with TypeScript, React, and
          Node.js — from polished UIs to reliable APIs and data layers.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            View projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Get in touch
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-20" aria-labelledby="featured-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="featured-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Featured work
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
