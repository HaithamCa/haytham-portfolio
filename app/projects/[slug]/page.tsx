import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/projects"
        className="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← All projects
      </Link>
      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{project.summary}</p>
      </header>
      <div className="prose prose-invert mt-10 max-w-none">
        <p className="leading-relaxed text-[var(--foreground)]">
          {project.description}
        </p>
        <p className="mt-8 text-sm text-[var(--muted)]">
          Full case study content coming soon.
        </p>
      </div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-sm"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-4">
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Live demo
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Repository
          </a>
        )}
      </div>
    </div>
  );
}
