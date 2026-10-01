# Biswas — an interactive 3D portfolio

A standard Next.js App Router application, ready for GitHub and Vercel. The hero pairs an interactive 3D head with large, flat HTML text behind it. Rounded trees, rolling hills, and a winding road create a miniature blue-and-green landscape. Dark mode changes the world to night with a moon, stars, blue foliage, and glowing roadside lamps.

Private source repository: [BiswasSekhar/sekhar-3d-portfolio](https://github.com/BiswasSekhar/sekhar-3d-portfolio).

## Stack

- Next.js 16, React 19, strict TypeScript
- Three.js, React Three Fiber, and Drei for actual 3D geometry
- Tailwind CSS 4 and custom design tokens for generous rounded panels and pill controls
- next-themes for a saved light/dark preference
- Server-rendered portfolio content and statically generated project pages

No API keys, database, or paid 3D service is needed.

## Run locally

Use Node.js 22.13 or later; `.nvmrc` selects Node 22.

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js, normally http://localhost:3000.

```sh
npm run check      # TypeScript, ESLint, production build
npm run start      # Serve the completed production build
npm run model:build # Regenerate the local GLB
```

## Make it yours

| File | What to change |
| --- | --- |
| `lib/portfolio.ts` | Name, title, projects, contact links, and model URL |
| `components/portfolio/hero.tsx` | Introduction and scene controls |
| `components/portfolio/about-section.tsx` | Biography and toolkit |
| `app/globals.css` | Colors, typography, spacing, and corner radii |
| `components/three/landscape.tsx` | Trees, hills, road, and sky |
| `components/three/avatar-scene.tsx` | Camera, lighting, cursor response, and character rotation |
| `scripts/generate-avatar.mjs` | Local character geometry and materials |

Orbit and Forma are explicitly labeled concept projects. The biography and toolkit are starter copy. Replace them with your own work and details. Blank contact fields stay hidden until you fill them in.

## Interactions

- Move the mouse for gentle scene parallax and head tracking.
- Drag horizontally to turn the actual 3D character. Touch scrolling remains available.
- Focus the scene and use Left/Right arrows to rotate; Home resets the character.
- Hover trees for a gentle canopy response.
- Click the sun/moon or the accessible scene button to switch day/night. The header theme switch does the same.
- Choose Portrait to use the reference-matched transparent illustration.
- Reset restores the scene. Pause motion disables cursor tracking, dragging, and tree animation.

The canvas renders on demand and suspends drawing while off-screen or when the page is hidden. It honors `prefers-reduced-motion`. Phones get a closer camera framing, fewer trees, and a pixel ratio capped at 1.1; desktop caps it at 1.4. Controls remain at least 40 pixels tall on phones. Reset updates the existing scene instead of recreating the WebGL context.

The title uses ordinary HTML, so it remains sharp at every rendering resolution and needs no 3D font or text geometry. The landscape can appear while the head loads. WebGL failure leaves the Portrait control available.

## Character assets

`public/models/biswas-head-v3.glb` is a real local procedural head mesh with swept curls, strand ridges, shaped cheeks, and an open smile. It includes no body, neck, or clothing. It is a stylized approximation of the reference, not an exact reconstructed or fully rigged mesh. Replacing it with a sculpted GLB later only requires updating `avatarUrl` and checking its framing.

The head asset is about 1.4 MB, compared with 3.7 MB for the previous full character: 62% smaller, with about 64% fewer triangles. Static surfaces are merged by material to reduce draw calls. The star field uses one points object. These are measured asset and geometry reductions; mobile frame rate and Core Web Vitals have not been measured on a physical phone.

`public/character.png` is a transparent raster portrait generated with the built-in imagegen tool from the supplied turnaround. The original image includes the blue shirt and white pants; CSS crops the portrait to the face in this layout. This view responds with perspective movement; the 3D model view uses the GLB. The raster is requested only when Portrait is selected.

The landscape is actual geometry created in code. All active scene assets are local. Previous full-body GLBs and the unused Helvetiker font remain as source backups; the app does not load them.

## Upload to GitHub

From this directory, if using a new checkout:

```sh
git init
git add .
git commit -m "Build interactive 3D portfolio"
git branch -M main
gh repo create biswas-3d-portfolio --private --source=. --remote=origin --push
```

This workspace uses the `github` remote for the new repository, with the app at its root. The older hosting remote remains as `origin`. To upload subsequent edits from this branch:

```sh
git add .
git commit -m "Update portfolio"
git push github HEAD:main
```

`.gitignore` excludes environment files, build output, local tooling, and Vercel credentials. GitHub Actions runs `npm run check` for pushes and pull requests.

## Deploy to Vercel

**Git integration:** Import the GitHub repository at [Vercel New Project](https://vercel.com/new). Use the Next.js framework preset and Node 22. If the repository contains the app in a subfolder, select `portfolio` as the Root Directory; if the app files are at the repository root, leave it at `.`. Install and build commands are already in `vercel.json`. No environment variables are required.

**CLI:** From the app directory:

```sh
npx vercel login
npx vercel              # Preview deployment
npx vercel --prod       # Production deployment
```

The local Vercel CLI must be logged in before deployment. A successful local build does not itself publish the app. For the platform's current commands, see the official [Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs) and [deploy command reference](https://vercel.com/docs/cli/deploy).
