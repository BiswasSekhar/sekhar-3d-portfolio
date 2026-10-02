import { ArrowUpRight, Braces, MapPin, Sparkles } from "lucide-react";
import { portfolio, skillGroups } from "@/lib/portfolio";
import { Character } from "./character";
import { DepthScene } from "./depth-scene";

export function AboutSection() {
  return <>
    <section className="about-section section-space" id="about" aria-labelledby="about-title">
      <DepthScene className="about-stage">
        <div className="about-slab depth-surface"><span className="engraved-word">curious.</span><span className="surface-caption">There’s always something new to learn.</span></div>
        <Character pose="sitting" className="about-character" sizes="(max-width: 600px) 65vw, 310px" />
        <div className="location-chip depth-surface"><MapPin size={15} /> Kochi, Kerala</div>
        <div className="curiosity-token depth-surface"><Braces size={22} /></div>
      </DepthScene>
      <div className="about-copy"><p className="section-label">A little about me</p><h2 id="about-title">A curious mind.<br />A builder at heart.</h2><p>I’m a full-stack developer from Kochi, Kerala. I like taking an idea all the way from the first interface to the services that make it work.</p><p>My work spans educational software, games, mobile apps, and AI-assisted learning. At Comini Learning, I help build the tools behind everyday learning experiences.</p><a className="text-button" href={portfolio.github} target="_blank" rel="noopener noreferrer">See what I’m building <ArrowUpRight size={16} /></a><div className="about-signature">Biswas Sekhar<span>A little code. A lot of curiosity.</span></div></div>
    </section>
    <section className="toolkit-section section-space" aria-labelledby="toolkit-title">
      <div className="section-heading toolkit-heading"><div><p className="section-label">My toolkit</p><h2 id="toolkit-title">From the first sketch<br />to the last little detail.</h2></div><Character pose="thumbsUp" className="toolkit-character" sizes="140px" /></div>
      <div className="toolkit-grid">{skillGroups.map((group, index) => <article className="toolkit-card" key={group.title}><div className="toolkit-icon">{index === 0 ? <Braces size={23} /> : index === 1 ? <span>{"{ }"}</span> : <Sparkles size={23} />}</div><h3>{group.title}</h3><p>{group.description}</p><div className="tool-pills">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div>
      <div className="coffee-note"><Character pose="coffee" className="coffee-character" sizes="80px" /><p>Always learning. Usually with a coffee.<span>Java, C++, SQL, and a good foundation in object-oriented programming round out my toolkit.</span></p></div>
    </section>
  </>;
}
