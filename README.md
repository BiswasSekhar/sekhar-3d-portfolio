# Sekhar — an interactive 3D portfolio

A standard Next.js App Router application, ready for GitHub and Vercel. The hero is a miniature blue-and-green landscape with an interactive character, rounded trees, rolling hills, a winding road, and an extruded title behind the character's head. Dark mode changes the world to night with a moon, stars, blue foliage, and glowing roadside lamps.

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
| `components/three/landscape.tsx` | Trees, hills, road, sky, and 3D title |
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

The canvas renders on demand, caps its pixel ratio, and suspends drawing while off-screen or when the page is hidden. It honors `prefers-reduced-motion`. A semantic heading and ordinary links remain available outside WebGL. WebGL failure leaves the Portrait control available.

## Character assets

`public/models/sekhar-v2.glb` is a real local procedural mesh with swept curls and strand ridges, shaped cheeks, an open smile, a blue button-down shirt, white trousers, and an olive watch. Its head can turn independently in the app. It is a stylized approximation of the reference, not an exact reconstructed or fully rigged mesh. Replacing it with a sculpted GLB later only requires updating `avatarUrl` and checking its framing.

`public/character.png` is a transparent raster portrait generated with the built-in imagegen tool from the supplied turnaround. Its brief was: match the tan skin, glossy dark eyes, black curls, toothy smile, light blue rolled-sleeve shirt, white pants, and olive watch; front-facing upper-thigh framing, neutral studio light, transparent background, no text or grid. This portrait view responds with perspective movement; the 3D model view uses the GLB.

The landscape and title are actual geometry created in code. All scene assets are local. The bundled Helvetiker font's license is preserved in `public/fonts/LICENSE`.

## Upload to GitHub

From this directory, if using a new checkout:

```sh
git init
git add .
git commit -m "Build interactive 3D portfolio"
git branch -M main
gh repo create sekhar-3d-portfolio --private --source=. --remote=origin --push
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
