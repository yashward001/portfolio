# Yash Portfolio (Next.js 14)

Premium, production-grade portfolio for a CS student with strong engineering credibility.

## Visual Directions

1. **Minimal Editorial** (alternative): Typography-first, low-chroma palette, restrained motion.
2. **Futuristic Grid** (implemented default): Structured grid atmosphere, subtle animated signature background, sharp technical aesthetic.

## Stack

- Next.js 14+ (App Router) + TypeScript (strict)
- Tailwind CSS
- Framer Motion (with `prefers-reduced-motion` support)
- `next/image`
- `lucide-react`
- MDX content for projects + blog
- Zod for content schema validation
- ESLint + Prettier

## Getting Started (pnpm)

```bash
pnpm install
pnpm validate:content
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev               # local dev
pnpm build             # validates content then builds
pnpm start             # run production build
pnpm lint              # eslint
pnpm typecheck         # strict TS check
pnpm format            # prettier check
pnpm format:write      # prettier write
pnpm validate:content  # Zod validation of frontmatter
```

## Content Editing

All editable content is centralized in `/content`.

- Profile: `content/profile.ts`
- Projects: `content/projects/*.mdx`
- Blog posts: `content/posts/*.mdx`

### Add a New Project MDX

1. Create a file in `content/projects/your-project.mdx`.
2. Add frontmatter fields:

```yaml
---
title: "Project Title"
slug: "project-slug"
summary: "One-line high-value summary"
role: "Your role"
date: "2026-01-20"
tags: ["Systems", "Backend"]
stack: ["Go", "PostgreSQL"]
impactMetric: "40% faster processing"
featured: true
cover: "/images/your-cover.svg"
links:
  repo: "https://github.com/..."
  live: "https://..."
sortImpact: 85
---
```

3. Write sections in this order for best recruiting readability:
   - Problem
   - Constraints
   - Approach
   - Architecture
   - Results
   - What I'd Do Next
4. Run `pnpm validate:content`.

## Deployment

### Vercel (Primary)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Build command: `pnpm build`
4. Output: `.next` (auto)
5. Add optional analytics env vars if needed:
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

### Netlify (Alternative)

1. Connect GitHub repo in Netlify.
2. Build command: `pnpm build`
3. Publish directory: `.next`
4. Ensure Next.js runtime is enabled (Netlify Next adapter/runtime).

## Performance + Accessibility Notes

- Stable typography with `next/font`
- Explicit image dimensions to avoid CLS
- Keyboard-focus visible rings across interactive elements
- Motion reduced for users with `prefers-reduced-motion`
- Page-level metadata + OG images
- `sitemap.xml` + `robots.txt` via App Router metadata routes

## Launch Checklist

1. Replace placeholder identity/contact links in `content/profile.ts`.
2. Replace PDF at `public/resume/Yash-Patel-Resume.pdf`.
3. Replace demo GitHub/live links in `content/projects/*.mdx`.
4. Run `pnpm lint && pnpm typecheck && pnpm build`.
5. Verify Lighthouse on Home + Projects + one Project detail page.
6. Connect custom domain and verify social preview cards.

## Future Enhancements

1. Add end-to-end tests (Playwright) for key flows.
2. Add contact email delivery (Resend/Postmark) in server action.
3. Add project search and keyboard command palette.
4. Add RSS feed + JSON feed for blog.
5. Add per-project interactive architecture diagrams.
