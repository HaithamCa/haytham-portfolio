import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Selected work and experiments. More case studies will be added as the
        portfolio grows.
      </p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <article
              className="flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {project.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
                {project.summary}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
