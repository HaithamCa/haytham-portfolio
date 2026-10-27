import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-[var(--muted)]">
        The best way to reach me is via email or LinkedIn. Details will be
        added here soon.
      </p>
      <ul className="mt-10 space-y-4">
        <li>
          <span className="font-medium text-[var(--foreground)]">GitHub</span>
          <span className="text-[var(--muted)]"> — </span>
          <a
            href="https://github.com/haithamca"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/haithamca
          </a>
        </li>
      </ul>
    </div>
  );
}
