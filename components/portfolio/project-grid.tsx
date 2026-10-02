import Link from "next/link";
import { ArrowUpRight, Check, FileText, Layers, Play, ScanText, Sparkles, Wallet } from "lucide-react";
import { projects } from "@/lib/portfolio";
import { Character } from "./character";
import { DepthScene } from "./depth-scene";

function ProjectVisual({ kind }: { kind: string }) {
  return <DepthScene className={`project-stage ${kind}-stage`}>
    {kind === "panam" && <>
      <div className="product-floor depth-surface" />
      <div className="panam-phone depth-surface"><div className="device-camera" /><div className="product-brand"><Wallet size={17} /> panam</div><span className="screen-label">A clearer picture.</span><strong className="phone-title">Your money,<br />at a glance.</strong><div className="expense-chart"><i /><i /><i /><i /><i /></div><div className="import-notice"><Check size={12} /> Statement imported</div><div className="phone-expenses"><span>Everyday spending</span><span><i /> Food & coffee</span><span><i /> Travel & transport</span></div></div>
      <Character pose="laptop" className="project-character" sizes="(max-width: 600px) 42vw, 210px" />
      <div className="product-chip depth-surface"><Sparkles size={13} /> A little help from AI</div>
    </>}
    {kind === "rekha" && <>
      <div className="document-back depth-surface" />
      <div className="document-front depth-surface"><div className="document-header"><FileText size={17} /><span>rekha</span><span>PDF</span></div><strong>Less busywork.<br />More understanding.</strong><div className="document-lines"><i /><i /><i /><i /></div><div className="document-highlight">A good idea, in any language.</div><div className="document-lines short"><i /><i /></div></div>
      <div className="ocr-chip depth-surface"><ScanText size={19} /><span>Read. Translate.<br /><strong>Understand.</strong></span></div>
      <div className="summary-chip depth-surface"><Sparkles size={14} /> The useful bits, summarized.</div>
    </>}
    {kind === "streamsync" && <>
      <div className="watch-window depth-surface"><div className="window-toolbar"><span className="window-dots"><i /><i /><i /></span><span>StreamSync</span><span className="sync-status">In sync</span></div><div className="watch-screen"><span className="movie-orbit" /><span className="movie-orbit second" /><strong>A movie.<br />The same moment.</strong><span className="watch-play"><Play size={17} fill="currentColor" /></span></div><div className="watch-progress"><i /><span>Watching together</span><span>● ● ●</span></div></div>
      <div className="watch-chat depth-surface"><span>Room chat</span><p>Ready when you are.</p><div><Check size={12} /> Let’s press play.</div></div>
    </>}
    {kind === "cairn" && <>
      <div className="cairn-back depth-surface"><Layers size={16} /> A little clarity.</div>
      <div className="cairn-board depth-surface"><div className="document-header"><Layers size={17} /><span>cairn</span><Sparkles size={14} /></div><strong>Good work<br />starts with a plan.</strong><div className="plan-task"><span className="task-check"><Check size={10} /></span> Find the starting point</div><div className="plan-task"><span className="task-circle" /> Build something useful</div><div className="plan-task"><span className="task-circle" /> Make time to reflect</div><div className="plan-footer">Plan. Build. Review.</div></div>
      <div className="review-chip depth-surface"><Sparkles size={15} /><span>Your week,<br /><strong>in perspective.</strong></span></div>
    </>}
  </DepthScene>;
}

export function ProjectGrid() {
  return <section className="work-section section-space" id="work" aria-labelledby="work-title">
    <div className="section-heading work-heading"><div><p className="section-label">Selected work</p><h2 id="work-title">Useful ideas,<br />brought to life.</h2></div><div className="work-introduction"><p>From making sense of expenses to bringing people together. A few things I’ve built.</p><Character pose="point" className="heading-character" sizes="130px" /></div></div>
    <div className="projects-grid">{projects.filter(project => project.featured).map(project => <Link className={`project-card ${project.className}`} key={project.slug} href={`/projects/${project.slug}`}>
      <ProjectVisual kind={project.className} />
      <div className="project-caption"><div><span className="project-category">{project.category}</span><h3>{project.title} <span>{project.type}</span></h3><p>{project.description}</p><div className="project-tech">{project.technologies.slice(0, 3).join(" / ")}</div></div><span className="project-open"><ArrowUpRight size={20} /></span></div>
    </Link>)}</div>
    <div className="other-work"><h3>And a few more rabbit holes.</h3><div>{projects.filter(project => !project.featured).map(project => <Link key={project.slug} href={`/projects/${project.slug}`}><span>{project.title}<small>{project.type}</small></span><ArrowUpRight size={18} /></Link>)}</div></div>
  </section>;
}
