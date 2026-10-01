import Link from "next/link";
import { Asterisk, ExternalLink } from "lucide-react";
import { projects } from "@/lib/portfolio";

export function ProjectGrid() { return (
      <section className="work-section" id="work">
        <div className="section-heading"><div><span className="section-kicker">A few things I’ve imagined</span><h2>Selected explorations<span>.</span></h2></div><span className="section-aside">Design meets development.</span></div>
        <div className="projects-grid">
          {projects.map((item, index) => <Link className={`project-card ${item.className}`} key={item.title} href={`/projects/${item.slug}`} aria-label={`Explore ${item.title} concept project`}>
            <div className="project-visual">
              {index === 0 ? <div className="orbit-preview"><div className="preview-sidebar"><div className="orbit-brand"><Asterisk size={17} /> orbit</div><span className="active-mini">Overview</span><span>My tasks</span><span>Projects</span><span>Notes</span><div className="sidebar-bottom">Your space.<br />Your pace.</div></div><div className="preview-dashboard"><div className="preview-greeting">Good morning, Sekhar <span>☀</span></div><p>Make room for your best work.</p><div className="preview-stat-row"><div>Today’s focus<strong>03</strong><span>A little progress, every day</span></div><div className="mini-chart"><span style={{height:"35%"}} /><span style={{height:"58%"}} /><span style={{height:"46%"}} /><span style={{height:"73%"}} /><span style={{height:"65%"}} /><span style={{height:"93%"}} /></div></div><div className="mini-task"><span className="task-check">✓</span> Refine the little details <span>Design</span></div><div className="mini-task"><span className="task-circle" /> Bring the idea to life <span>Build</span></div></div></div> : <div className="forma-preview"><div className="forma-nav"><span>forma®</span><span>Objects & ideas</span><span>2026</span></div><div className="forma-type">Less,<br /><span>but better.</span></div><div className="forma-bottom"><span>A collection of thoughtful things.</span><div className="forma-colors"><i /><i /><i /></div></div></div>}
              <span className="project-open"><ExternalLink size={18} /></span>
            </div>
            <div className="project-caption"><div><h3>{item.title}</h3><p>{item.category}</p></div><span>{item.type}</span></div>
          </Link>)}
        </div>
      </section>

); }
