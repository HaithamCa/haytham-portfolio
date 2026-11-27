import Link from "next/link";
import type { Project } from "@/content/projects/types";
import { ProjectThumbnail } from "@/components/project-thumbnail";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg">
      {/* Browser Window Mockup Thumbnail */}
      <ProjectThumbnail
        project={project}
        variant="card"
        detailHref={`/projects/${project.slug}`}
      />

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-lg font-semibold tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {project.title}
            </Link>
          </h3>
          {project.stars !== undefined && project.stars > 0 && (
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
              <svg
                className="h-3.5 w-3.5 text-[var(--accent)]"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{project.stars}</span>
            </div>
          )}
        </div>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">
          {project.summary}
        </p>

        {/* Stack Pills */}
        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/* Footer Action Links */}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs font-medium">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
          >
            <span>Case study</span>
            <span aria-hidden="true">→</span>
          </Link>

          <div className="flex items-center gap-3">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Live demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
