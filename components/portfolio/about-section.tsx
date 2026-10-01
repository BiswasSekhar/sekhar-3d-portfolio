import { Code2, Cuboid, PenTool, Layers, Sparkles, Download } from "lucide-react";
import { portfolio } from "@/lib/portfolio";

export function AboutSection() { return (
      <section className="about-grid" id="about">
        <article className="about-card rounded-panel"><span className="section-kicker">The person behind the pixels</span><h2>A builder.<br />An explorer.<br />Always curious.</h2><p>I enjoy the space where design and technology overlap. Turning a rough idea into something you can see, feel, and interact with is my favorite part.</p><p>My approach is simple: care about the details, stay open to possibilities, and make the experience feel effortless.</p><span className="signature">{portfolio.name}</span></article>
        <div className="about-side"><article className="toolbox-card rounded-panel"><div className="card-title"><Code2 size={22} /><h3>My creative toolkit</h3></div><p>From the first sketch to the final interaction.</p><div className="tool-pills"><span><Code2 size={15} /> React</span><span><Code2 size={15} /> TypeScript</span><span><Cuboid size={15} /> Three.js</span><span><PenTool size={15} /> Figma</span><span><Layers size={15} /> CSS</span><span><Sparkles size={15} /> Motion</span></div></article><article className="play-card rounded-panel"><div className="play-card-icon"><Cuboid size={29} /></div><div><h3>A little dimension.</h3><p>Meet my digital alter ego.<br />Built for a bit of play.</p></div><a href="#playground" className="outline-button">Try the 3D model</a><a href={portfolio.avatarUrl} download className="download-link"><Download size={14} /> Download model</a></article></div>
      </section>
); }
