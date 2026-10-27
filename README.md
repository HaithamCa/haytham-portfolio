# haytham-portfolio

Personal portfolio for **Hytham Defrawy** — TypeScript, React, and Node.js.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- TypeScript
- Tailwind CSS v4
- ESLint

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project structure

| Path | Purpose |
|------|---------|
| `app/` | Routes and layouts (App Router) |
| `components/` | Header, footer, theme toggle |
| `content/projects/` | Project content and types |
| `lib/` | Theme helpers and project data accessors |

## Theme

- Default theme is **dark** on first visit.
- Preference is stored in `localStorage` under `portfolio-theme` (`dark` \| `light`).
- An inline script in the document head applies the saved theme before paint to avoid flash.

## License

Private — all rights reserved unless otherwise noted.
