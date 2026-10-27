import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <div className="mt-8 space-y-4 text-[var(--muted)] leading-relaxed">
        <p>
          I&apos;m Hytham Defrawy, a software engineer with about five years of
          experience shipping web products end to end.
        </p>
        <p>
          I care about clear architecture, thoughtful UX, and maintainable
          TypeScript across the stack — React on the front, Node and PostgreSQL
          on the back.
        </p>
        <p className="text-sm italic">
          More bio, photo, and resume links will be added in a later iteration.
        </p>
      </div>
    </div>
  );
}
