import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-[var(--muted)]">
        Have a question, project idea, or opportunity you&apos;d like to discuss?
        Reach out directly via email or connect with me on LinkedIn and GitHub.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {/* Email */}
        <li>
          <a
            href="mailto:hythamdefrawy@gmail.com"
            className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <span
                className="text-xs text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Email
              </p>
              <p className="mt-1 truncate text-xs text-[var(--muted)] group-hover:text-[var(--accent)]">
                hythamdefrawy@gmail.com
              </p>
            </div>
          </a>
        </li>

        {/* LinkedIn */}
        <li>
          <a
            href="https://www.linkedin.com/in/hytham-defrawy"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                </svg>
              </span>
              <span
                className="text-xs text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                LinkedIn
              </p>
              <p className="mt-1 truncate text-xs text-[var(--muted)] group-hover:text-[var(--accent)]">
                linkedin.com/in/hytham-defrawy
              </p>
            </div>
          </a>
        </li>

        {/* GitHub */}
        <li>
          <a
            href="https://github.com/HaithamCa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                  />
                </svg>
              </span>
              <span
                className="text-xs text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                GitHub
              </p>
              <p className="mt-1 truncate text-xs text-[var(--muted)] group-hover:text-[var(--accent)]">
                github.com/HaithamCa
              </p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
