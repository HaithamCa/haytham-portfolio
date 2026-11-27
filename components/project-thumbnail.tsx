"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/content/projects/types";

type ProjectThumbnailProps = {
  project: Project;
  variant?: "card" | "hero";
  detailHref?: string;
};

type WindowState = "normal" | "closed" | "minimized" | "expanded";

function getLiveLinkScreenshotUrl(liveUrl: string): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=1280&h=800`;
}

function formatDisplayUrl(project: Project): string {
  const raw = project.href || project.repoUrl;
  if (!raw) return `projects/${project.slug}`;
  try {
    const parsed = new URL(raw);
    const cleanPath = parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname}${cleanPath}`;
  } catch {
    return raw.replace(/^https?:\/\//, "");
  }
}

export function ProjectThumbnail({
  project,
  variant = "card",
  detailHref,
}: ProjectThumbnailProps) {
  // Ordered image fallback chain:
  // 1. Live project link screenshot (if project.href exists)
  // 2. README / repository picture (project.readmeImage or project.image)
  // 3. Styled const project = { ... } fallback canvas
  const candidateImages = useMemo(() => {
    const candidates: string[] = [];
    if (project.href) {
      candidates.push(getLiveLinkScreenshotUrl(project.href));
    }
    if (project.readmeImage && !candidates.includes(project.readmeImage)) {
      candidates.push(project.readmeImage);
    }
    if (project.image && !candidates.includes(project.image)) {
      candidates.push(project.image);
    }
    return candidates;
  }, [project.href, project.readmeImage, project.image]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [windowState, setWindowState] = useState<WindowState>("normal");
  const [modalMode, setModalMode] = useState<"live" | "preview">(
    project.href ? "live" : "preview"
  );

  // Measure viewport container width to scale live desktop iframe (1280x800) into 16:10 card
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [iframeScale, setIframeScale] = useState(0.35);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !project.href) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setIframeScale(width / 1280);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [project.href, windowState]);

  const currentImageSrc = candidateImages[candidateIndex];
  const showImage = Boolean(currentImageSrc);
  const displayUrl = formatDisplayUrl(project);
  const isHero = variant === "hero";
  const caseStudyHref = detailHref || `/projects/${project.slug}`;

  useEffect(() => {
    if (windowState !== "expanded") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWindowState("normal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [windowState]);

  const handleCloseButton = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setWindowState((prev) => (prev === "closed" ? "normal" : "closed"));
  };

  const handleMinimizeButton = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setWindowState((prev) => (prev === "minimized" ? "normal" : "minimized"));
  };

  const handleZoomButton = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (windowState === "minimized" || windowState === "closed") {
      setWindowState("normal");
    } else {
      setModalMode(project.href ? "live" : "preview");
      setWindowState("expanded");
    }
  };

  const viewportPreviewContent = project.href ? (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <iframe
        src={project.href}
        title={`${project.title} live preview`}
        loading={isHero ? "eager" : "lazy"}
        tabIndex={-1}
        style={{
          width: "1280px",
          height: "800px",
          transform: `scale(${iframeScale})`,
          transformOrigin: "top left",
        }}
        className="pointer-events-none border-0 bg-white transition-transform duration-500 ease-out"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  ) : showImage ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentImageSrc}
        src={currentImageSrc}
        alt={`${project.title} interface preview`}
        loading={isHero ? "eager" : "lazy"}
        onError={() => setCandidateIndex((prev) => prev + 1)}
        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </>
  ) : (
    /* Refined Technical Fallback Preview Canvas */
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5 sm:p-6">
      {/* Subtle Architectural Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(var(--muted) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-15 blur-2xl"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />

      {/* Top Row: Language & Slug */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-xs text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          {project.language || project.stack[0] || "Full-Stack"}
        </span>
        <span className="font-mono text-[11px] text-[var(--muted)] opacity-75">
          /{project.slug}
        </span>
      </div>

      {/* Center/Bottom: Styled Code / Architecture Card */}
      <div className="relative z-10 my-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="font-mono text-[11px] text-[var(--accent)]">
          const project = &#123;
        </div>
        <div className="mt-1 pl-3 font-sans text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">
          &quot;{project.title}&quot;
        </div>
        {project.stack.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 pl-3">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="mt-1 font-mono text-[11px] text-[var(--accent)]">
          &#125;;
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>Interactive case study</span>
        <span className="font-medium text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-0.5">
          Explore →
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`overflow-hidden border-[var(--border)] bg-[var(--background)] ${
          isHero ? "rounded-xl border shadow-sm" : "border-b"
        }`}
      >
        {/* Browser Window Chrome Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
          {/* Interactive macOS Traffic Lights */}
          <div className="group/dots flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCloseButton}
              title={
                windowState === "closed"
                  ? "Restore preview"
                  : "Close window for quick actions"
              }
              aria-label={
                windowState === "closed"
                  ? "Restore preview"
                  : "Close window for recommended actions"
              }
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F56] text-[#4D0000] transition-transform active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
            >
              <svg
                viewBox="0 0 12 12"
                className="h-2 w-2 opacity-0 transition-opacity duration-150 group-hover/dots:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleMinimizeButton}
              title={
                windowState === "minimized"
                  ? "Restore window"
                  : "Minimize window"
              }
              aria-label={
                windowState === "minimized"
                  ? "Restore window"
                  : "Minimize window"
              }
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#FFBD2E] text-[#5A3000] transition-transform active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
            >
              <svg
                viewBox="0 0 12 12"
                className="h-2 w-2 opacity-0 transition-opacity duration-150 group-hover/dots:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2.5 6h7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleZoomButton}
              title={
                windowState === "minimized" || windowState === "closed"
                  ? "Restore window"
                  : "Expand preview window"
              }
              aria-label={
                windowState === "minimized" || windowState === "closed"
                  ? "Restore window"
                  : "Expand preview window"
              }
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#27C93F] text-[#003D00] transition-transform active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
            >
              <svg
                viewBox="0 0 12 12"
                className="h-2 w-2 opacity-0 transition-opacity duration-150 group-hover/dots:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.5 5.5v-3h3M9.5 6.5v3h-3" />
              </svg>
            </button>
          </div>

          {/* Address Bar Pill */}
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              title={`Open ${project.href} in a new tab`}
              className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <span className="truncate">{displayUrl}</span>
              <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 font-sans text-[10px] font-medium text-emerald-400">
                LIVE ↗
              </span>
            </a>
          ) : (
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]">
              <span className="truncate">{displayUrl}</span>
            </div>
          )}
        </div>

        {/* Window Body Based on macOS Window State */}
        {windowState === "minimized" ? (
          <div className="flex items-center justify-between bg-[var(--background)] px-4 py-2.5 text-xs text-[var(--muted)]">
            <span className="font-mono text-[11px]">
              Window minimized — {project.title}
            </span>
            <button
              type="button"
              onClick={handleMinimizeButton}
              className="rounded border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Restore window
            </button>
          </div>
        ) : windowState === "closed" ? (
          /* macOS Recommended Actions Launcher when Red Close Button is clicked */
          <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center bg-[var(--background)] p-5 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(var(--muted) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-xs rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-lg backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Recommended Actions
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {project.title}
              </p>

              <div className="mt-3.5 flex flex-col gap-2">
                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <span>Open Live Application</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                  >
                    <span>View Source on GitHub</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}

                {!isHero && (
                  <Link
                    href={caseStudyHref}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                  >
                    <span>Read Case Study</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleCloseButton}
                  className="mt-1 inline-flex w-full items-center justify-center gap-1 text-[11px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  <span aria-hidden="true">↺</span>
                  <span>Reopen Preview</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Viewport Area */
          <div
            ref={viewportRef}
            className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--background)]"
          >
            {detailHref && !isHero ? (
              <Link
                href={detailHref}
                tabIndex={-1}
                aria-label={`View ${project.title} case study`}
                className="block h-full w-full focus:outline-none"
              >
                {viewportPreviewContent}
              </Link>
            ) : (
              viewportPreviewContent
            )}
          </div>
        )}
      </div>

      {/* Expanded Fullscreen macOS Window (Green Traffic Light Button) */}
      {windowState === "expanded" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex h-dvh w-screen flex-col overflow-hidden bg-[var(--background)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} fullscreen window preview`}
          >
            {/* Fullscreen macOS Chrome Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="group/modal-dots flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWindowState("normal")}
                    title="Close fullscreen window"
                    aria-label="Close fullscreen window"
                    className="flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F56] text-[#4D0000]"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2 w-2 opacity-0 transition-opacity group-hover/modal-dots:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWindowState("minimized")}
                    title="Minimize window"
                    aria-label="Minimize window"
                    className="flex h-3 w-3 items-center justify-center rounded-full bg-[#FFBD2E] text-[#5A3000]"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2 w-2 opacity-0 transition-opacity group-hover/modal-dots:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 6h7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWindowState("normal")}
                    title="Exit fullscreen"
                    aria-label="Exit fullscreen"
                    className="flex h-3 w-3 items-center justify-center rounded-full bg-[#27C93F] text-[#003D00]"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2 w-2 opacity-0 transition-opacity group-hover/modal-dots:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5.5 2.5v3h-3M6.5 9.5v-3h3" />
                    </svg>
                  </button>
                </div>

                <span className="font-mono text-xs text-[var(--muted)]">
                  {displayUrl}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {project.href && (
                  <div className="flex rounded-md border border-[var(--border)] bg-[var(--background)] p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setModalMode("live")}
                      className={`rounded px-2.5 py-1 font-medium transition-colors ${
                        modalMode === "live"
                          ? "bg-[var(--surface)] text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Live App
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMode("preview")}
                      className={`rounded px-2.5 py-1 font-medium transition-colors ${
                        modalMode === "preview"
                          ? "bg-[var(--surface)] text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Screenshot
                    </button>
                  </div>
                )}

                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Open in New Tab ↗
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                  >
                    GitHub ↗
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setWindowState("normal")}
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Exit Fullscreen (Esc)
                </button>
              </div>
            </div>

            {/* Fullscreen Content Area */}
            <div className="relative flex-1 overflow-auto bg-[var(--background)]">
              {project.href && modalMode === "live" ? (
                <iframe
                  src={project.href}
                  title={`${project.title} live interactive preview`}
                  className="h-full w-full border-0 bg-white"
                />
              ) : showImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentImageSrc}
                  src={currentImageSrc}
                  alt={`${project.title} fullscreen preview`}
                  onError={() => setCandidateIndex((prev) => prev + 1)}
                  className="mx-auto h-full w-full object-contain bg-[var(--background)]"
                />
              ) : (
                <div className="relative h-full w-full">
                  {viewportPreviewContent}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
