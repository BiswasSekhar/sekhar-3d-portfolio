# Biswas Sekhar's portfolio

A Next.js portfolio built around transparent character illustrations, tactile CSS surfaces, and real content from Biswas's resume.

## Run locally

Use Node.js 22.13 or later.

```sh
npm ci
npm run dev
npm run check
```

`npm run check` runs TypeScript, ESLint, and the production build. The eight project detail pages are generated statically.

`npm run build:sites` produces a static export for the hosted portfolio.

## The depth method

`components/portfolio/depth-scene.tsx` provides a reusable perspective stage. The stage preserves 3D transforms; individual panels use rotation, depth, a short edge shadow, and inset highlights to look like physical objects. Labels, code, and miniature UI details are ordinary HTML children of their panels, so their perspective follows the object. Recessed type uses directional text shadows. Transparent PNG characters occupy the foreground, with separate panels behind and beside them.

This uses CSS and images. The landing page does not import Three.js, create a WebGL canvas, load GLBs, or offer model controls. Previous model files and their source remain as unused backups.

Pointer movement gently changes the stage's perspective. Listeners are scoped to the stage, touch scrolling stays native, and animation runs only while responding to a pointer. Reduced-motion settings and page visibility disable it. The hero has a motion switch. Layouts adapt to mobile without hiding the main content.

## Character placement

| Pose | Section |
| --- | --- |
| Wave | Introduction |
| Point | Selected work |
| Laptop | Panam project |
| Relaxed sitting | About |
| Thumbs up | Toolkit |
| Coffee | Learning note |
| Casual standing | Experience |
| Backpack | Education |
| Celebrate | Community and achievements |
| Open arms | Contact |

All ten original RGBA images are in `public/characters`; their alpha channels are preserved. Below-the-fold images load lazily.

`lib/portfolio.ts` contains public resume-based content, projects, contact links, and skills. `public/biswas-sekhar-resume.pdf` is the supplied resume, available through download links. The miniature project interfaces are illustrative compositions rather than product screenshots. The app does not invent project metrics, live links, or repository links.

## Key files

- `components/portfolio/hero.tsx`: introduction and layered workspace
- `components/portfolio/depth-scene.tsx`: reusable perspective wrapper
- `components/portfolio/character.tsx`: typed pose-to-image mapping
- `components/portfolio/project-grid.tsx`: projects and miniature product surfaces
- `components/portfolio/about-section.tsx`: biography and toolkit
- `components/portfolio/experience-section.tsx`: experience, education, and community
- `components/portfolio/contact-section.tsx`: contact and social links
- `app/globals.css`: materials, depth, themes, and responsive composition

No API keys or external image services are required. Light and dark modes are saved through next-themes.
