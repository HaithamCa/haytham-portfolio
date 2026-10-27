import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
      <p className="mt-4 text-[var(--muted)]">
        Work history and highlights will be listed here — aligned with the
        resume for recruiters and hiring managers.
      </p>
      <ul className="mt-12 space-y-8">
        <li className="rounded-lg border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
          Placeholder — roles, dates, and impact bullets coming soon.
        </li>
      </ul>
    </div>
  );
}
