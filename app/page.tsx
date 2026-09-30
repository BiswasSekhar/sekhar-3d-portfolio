"use client";

import { useEffect, useRef, useState } from "react";
import { Asterisk, Moon, Sun, Code2, Cuboid, MousePointer2, RotateCcw, Download, Sparkles, Layers, PenTool, ChevronDown, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Character from "./components/Character";

const projects = [
  { title: "Orbit", category: "Product design · Development", type: "A quieter space for your day.", className: "orbit", description: "A concept workspace that puts daily priorities first. A focused dashboard, clear task hierarchy, and a little room to breathe.", details: ["A personal overview with everything in one place", "A simple, accessible task flow", "Responsive layouts for work on the go"] },
  { title: "Forma", category: "Creative development · Web design", type: "A new perspective on the everyday.", className: "forma", description: "A concept digital gallery exploring how type, color, and interaction can make a small collection feel special.", details: ["An editorial collection with expressive typography", "Soft motion that responds to interaction", "A flexible design system across screen sizes"] }
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState("portrait");
  const [project, setProject] = useState<number | null>(null);
  const [motion, setMotion] = useState(true);
  const [reset, setReset] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const selected = project === null ? null : projects[project];

  useEffect(() => {
    const preference = localStorage.getItem("sekhar-theme");
    setDark(preference ? preference === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);
  const toggleTheme = () => { localStorage.setItem("sekhar-theme", dark ? "light" : "dark"); setDark(!dark); };
  useEffect(() => {
    const node = stage.current;
    if (!node || !motion) return;
    let frame = 0, targetX = 0, targetY = 0, x = 0, y = 0;
    const pointer = (event: PointerEvent) => {
      const bounds = node.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
    };
    const leave = () => { targetX = 0; targetY = 0; };
    const tick = () => {
      x += (targetX - x) * .09; y += (targetY - y) * .09;
      node.style.setProperty("--rx", `${-y * 6}deg`);
      node.style.setProperty("--ry", `${x * 11}deg`);
      node.style.setProperty("--mx", `${x * 9}px`);
      node.style.setProperty("--my", `${y * 6}px`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", pointer); window.addEventListener("blur", leave); document.addEventListener("pointerleave", leave);
    tick();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", pointer); window.removeEventListener("blur", leave); document.removeEventListener("pointerleave", leave); node.style.cssText = ""; };
  }, [motion, reset]);

  return (
    <main className="portfolio">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="navigation">
        <a className="brand" href="#" aria-label="Sekhar home"><Asterisk size={31} strokeWidth={2.5} /><span>sekhar<span className="brand-dot">.</span></span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#playground">Playground</a></nav>
        <button className="theme-button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
      </header>

      <section id="main" className="hero rounded-panel">
        <div className="hero-copy">
          <span className="intro-pill"><span className="mini-star">✳</span> A little code. A lot of curiosity.</span>
          <h1>Ideas into<br />experiences.</h1>
          <p className="hero-intro">Hey, I’m Sekhar <span aria-hidden="true">✌️</span></p>
          <p className="hero-description">A creative developer connecting thoughtful<br className="desktop-break" /> design with things that just feel right.</p>
          <a className="primary-button" href="#work">Explore my work <Layers size={17} /></a>
          <div className="hero-note"><span className="note-line" /> Made with a human touch.</div>
        </div>
        <div className="character-area" ref={stage} id="playground">
          <div className="character-halo" aria-hidden="true" />
          <span className="floating-label label-code"><Code2 size={17} /> Developer</span>
          <span className="floating-label label-design"><Sparkles size={17} /> Curious by nature</span>
          <Tabs value={view} onValueChange={setView} className="character-tabs">
            <TabsContent value="portrait" className="character-stage"><img className="character-portrait" src="/character.png" alt="Sekhar’s smiling character, with curly black hair and a light blue shirt" draggable={false} /></TabsContent>
            <TabsContent value="model" className="character-stage"><Character dark={dark} motion={motion} reset={reset} /></TabsContent>
            <div className="character-controls"><TabsList aria-label="Character view" className="view-tabs"><TabsTrigger value="portrait">Portrait</TabsTrigger><TabsTrigger value="model"><Cuboid size={15} /> 3D model</TabsTrigger></TabsList><button className="reset-button" aria-label="Reset character position" onClick={() => setReset(reset + 1)}><RotateCcw size={16} /></button></div>
          </Tabs>
          <span className="interaction-note"><MousePointer2 size={13} /> {motion ? (view === "model" ? "Move your cursor or drag to look around" : "Move your cursor. I’m following along.") : "Motion paused"}</span>
        </div>
        <div className="hero-bottom"><span>Creative developer & digital explorer</span><a href="#work" aria-label="Scroll to selected work"><ChevronDown size={19} /></a><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? "Pause motion" : "Enable motion"}</button></div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading"><div><span className="section-kicker">A few things I’ve imagined</span><h2>Selected explorations<span>.</span></h2></div><span className="section-aside">Design meets development.</span></div>
        <div className="projects-grid">
          {projects.map((item, index) => <button className={`project-card ${item.className}`} key={item.title} onClick={() => setProject(index)} aria-label={`Explore ${item.title} concept project`}>
            <div className="project-visual">
              {index === 0 ? <div className="orbit-preview"><div className="preview-sidebar"><div className="orbit-brand"><Asterisk size={17} /> orbit</div><span className="active-mini">Overview</span><span>My tasks</span><span>Projects</span><span>Notes</span><div className="sidebar-bottom">Your space.<br />Your pace.</div></div><div className="preview-dashboard"><div className="preview-greeting">Good morning, Sekhar <span>☀</span></div><p>Make room for your best work.</p><div className="preview-stat-row"><div>Today’s focus<strong>03</strong><span>A little progress, every day</span></div><div className="mini-chart"><span style={{height:"35%"}} /><span style={{height:"58%"}} /><span style={{height:"46%"}} /><span style={{height:"73%"}} /><span style={{height:"65%"}} /><span style={{height:"93%"}} /></div></div><div className="mini-task"><span className="task-check">✓</span> Refine the little details <span>Design</span></div><div className="mini-task"><span className="task-circle" /> Bring the idea to life <span>Build</span></div></div></div> : <div className="forma-preview"><div className="forma-nav"><span>forma®</span><span>Objects & ideas</span><span>2026</span></div><div className="forma-type">Less,<br /><span>but better.</span></div><div className="forma-bottom"><span>A collection of thoughtful things.</span><div className="forma-colors"><i /><i /><i /></div></div></div>}
              <span className="project-open"><ExternalLink size={18} /></span>
            </div>
            <div className="project-caption"><div><h3>{item.title}</h3><p>{item.category}</p></div><span>{item.type}</span></div>
          </button>)}
        </div>
      </section>

      <section className="about-grid" id="about">
        <article className="about-card rounded-panel"><span className="section-kicker">The person behind the pixels</span><h2>A builder.<br />An explorer.<br />Always curious.</h2><p>I enjoy the space where design and technology overlap. Turning a rough idea into something you can see, feel, and interact with is my favorite part.</p><p>My approach is simple: care about the details, stay open to possibilities, and make the experience feel effortless.</p><span className="signature">Sekhar</span></article>
        <div className="about-side"><article className="toolbox-card rounded-panel"><div className="card-title"><Code2 size={22} /><h3>My creative toolkit</h3></div><p>From the first sketch to the final interaction.</p><div className="tool-pills"><span><Code2 size={15} /> React</span><span><Code2 size={15} /> TypeScript</span><span><Cuboid size={15} /> Three.js</span><span><PenTool size={15} /> Figma</span><span><Layers size={15} /> CSS</span><span><Sparkles size={15} /> Motion</span></div></article><article className="play-card rounded-panel"><div className="play-card-icon"><Cuboid size={29} /></div><div><h3>A little dimension.</h3><p>Meet my digital alter ego.<br />Built for a bit of play.</p></div><a href="#playground" className="outline-button" onClick={() => setView("model")}>Try the 3D model</a><a href="/sekhar-avatar.glb" download className="download-link"><Download size={14} /> Download model</a></article></div>
      </section>
      <footer className="footer"><a href="#" className="brand"><Asterisk size={23} /> sekhar.</a><p>Thoughtfully designed. Playfully built.</p><span>© {new Date().getFullYear()} Sekhar</span></footer>
      <Dialog open={project !== null} onOpenChange={(open) => !open && setProject(null)}><DialogContent className="project-dialog"><span className="dialog-pill">Concept exploration</span><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription><div className="dialog-details">{selected?.details.map(detail => <p key={detail}><Sparkles size={16} />{detail}</p>)}</div><p className="dialog-note">An illustrative portfolio project. Replace this with your own project and case study.</p></DialogContent></Dialog>
    </main>
  );
}
