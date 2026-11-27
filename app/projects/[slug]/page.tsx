import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { ProjectThumbnail } from "@/components/project-thumbnail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <p className="mt-4 text-lg text-[var(--muted)]">{project.summary}</p>
          </div>
          {project.stars !== undefined && project.stars > 0 && (
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <svg
                className="h-5 w-5 text-[var(--accent)]"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-lg font-semibold">{project.stars}</span>
            </div>
          )}
        </div>
      </header>

      <div className="mt-8">
        <ProjectThumbnail project={project} variant="hero" />
      </div>

      <div className="prose prose-invert mt-10 max-w-none">
        <p className="leading-relaxed text-[var(--foreground)]">
          {project.description}
        </p>
      </div>

      {project.stack.length > 0 && (
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
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Live demo ↗
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--surface-hover)]"
          >
            View repository ↗
          </a>
        )}
      </div>
    </div>
  );
}
