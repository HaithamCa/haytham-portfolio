import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";

export default function Home() {
  const featured = getFeaturedProjects();

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
          <h2
            id="featured-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Featured work
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
                >
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {project.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
