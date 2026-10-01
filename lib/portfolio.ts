/** Edit this file to personalize your portfolio. Never put API secrets here. */
export const portfolio = {
  name: "Biswas",
  title: "Creative developer",
  description: "Thoughtful design, creative development, and a playful interactive 3D character.",
  avatarUrl: "/models/biswas-head-v3.glb",
  email: "",
  github: "",
  linkedin: "",
} as const;

export const projects = [
  {
    slug: "orbit", title: "Orbit", category: "Product design · Development", type: "A quieter space for your day.", className: "orbit",
    description: "A concept workspace that puts daily priorities first. A focused dashboard, clear task hierarchy, and a little room to breathe.",
    details: ["A personal overview with everything in one place", "A simple, accessible task flow", "Responsive layouts for work on the go"],
    problem: "Busy dashboards often turn a small daily plan into a wall of competing information. This concept makes the next useful action easy to find.",
    approach: "Start with the person’s daily focus. Keep navigation quiet, group related tasks, and use a simple visual hierarchy to show what matters now.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "forma", title: "Forma", category: "Creative development · Web design", type: "A new perspective on the everyday.", className: "forma",
    description: "A concept digital gallery exploring how type, color, and interaction can make a small collection feel special.",
    details: ["An editorial collection with expressive typography", "Soft motion that responds to interaction", "A flexible design system across screen sizes"],
    problem: "A small creative collection needs a clear point of view without burying the work in interface decoration.",
    approach: "Give typography and composition room to lead. Carry a small set of colors and shapes through every screen, then use interaction only where it helps exploration.",
    technologies: ["React", "CSS", "Responsive design"],
  },
] as const;
