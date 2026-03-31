# Project Guidelines

## Audience

The person working in this codebase is **not a developer**. When providing assistance:

- Explain *what* a change does and *why* it is needed before showing any code.
- Define technical terms the first time you use them (e.g., component, prop, route).
- Break multi-step tasks into clearly numbered steps.
- After making a change, describe how the user can verify it worked (e.g., "save the file, then refresh the browser at http://localhost:3000").
- Point out which file to open and where inside that file any relevant code lives.
- Avoid jargon-only answers; always pair technical shorthand with a plain-English explanation.

## Project Overview

This is a **Next.js** web application (a React-based framework for building websites) that lets users browse and filter Prometric certification exams. Key files:

- `data/exams.json` — the raw exam data displayed on the site
- `src/app/page.tsx` — the main page that users see
- `src/components/` — reusable building blocks (cards, filters, header, etc.)
- `src/types.ts` — TypeScript definitions describing the shape of the data

## Tech Stack

| Tool | What it does |
|------|--------------|
| Next.js 14 (App Router) | Framework that serves the website |
| React | Library for building UI components |
| TypeScript | JavaScript with type-checking to catch mistakes early |
| Tailwind CSS | Utility classes for styling elements directly in HTML/JSX |

## Build & Run

```bash
npm install   # Install dependencies (run once)
npm run dev   # Start the local development server at http://localhost:3000
```
