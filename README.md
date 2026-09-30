# Sekhar — creative developer portfolio

A portfolio with large rounded panels, pill controls, responsive project cards, and persistent light/dark themes.

## Run

```sh
npm ci
npm run dev
```

The development server prints its local URL. To build: `npm run build`.

## Character assets

- `public/character.png`: a transparent portrait generated with the built-in imagegen tool from the supplied turnaround. It matches the curls, tan skin, blue shirt, white pants, smile, and olive watch. The portrait uses smooth cursor-responsive perspective movement; this view is a raster image, not a 3D mesh.
- `public/sekhar-avatar.glb`: a real, unrigged procedural 3D approximation. The 3D model tab loads it with Three.js. It responds to cursor movement and supports dragging to rotate. Materials and lighting work in both themes. It is an approximation, not an exact reconstruction of the source image.
- `scripts/generate-avatar.mjs`: editable mesh-generation source. Run `node scripts/generate-avatar.mjs` to regenerate the GLB.

Portrait generation brief: "Match the supplied stylized 3D character: warm tan skin, large glossy black eyes, thick black curls, happy toothy smile, light blue rolled-sleeve button-down, chest pocket, white pants and olive watch. Front-facing, hands in pockets, upper-thigh framing, neutral studio light, genuinely transparent background, no text or grid."

## Customize

Change the name, introduction, project content, and about copy in `app/page.tsx`. Orbit and Forma are illustrative concept projects, not verified real work. The toolkit and biography are editable starter copy. Replace them with your own information before sharing professionally.

Theme and radius tokens are in `app/globals.css`. Outer panels use a 56px radius, cards use 30–36px, and controls use pill radii.

The 3D canvas is lazy-loaded, caps device pixel ratio, pauses drawing when off-screen or when the document is hidden, and disposes its renderer and geometry when closed. Motion honors the device's reduced-motion preference and can be paused with the visible control. Theme is saved locally on the visitor's device.

A private Sites publication is configured in `.openai/hosting.json`.
