"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight, Braces, Check, Download, Pause, Play, Smartphone, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-motion";
import { portfolio } from "@/lib/portfolio";
import { Character } from "./character";
import { DepthScene } from "./depth-scene";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const motion = !paused && !reducedMotion;

  return <section id="main" className="studio-hero" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="hello-line"><span className="status-dot" /> From Kochi, with curiosity.</p>
      <h1 id="hero-title">Hi, I’m<br />Biswas Sekhar.</h1>
      <p className="hero-role">Full-stack developer. Everyday explorer.</p>
      <p className="hero-description">I build educational software, mobile apps, and AI experiences that make complicated things feel simple.</p>
      <div className="hero-actions">
        <a className="primary-button" href="#work">Meet my work <ArrowUpRight size={17} /></a>
        <a className="text-button" href={portfolio.resumeUrl} download><Download size={16} /> My resume</a>
      </div>
      <div className="hero-current"><span className="current-mark"><Braces size={19} /></span><div>Currently building at <strong>Comini Learning</strong><span>Ideas, interfaces, and the systems in between.</span></div></div>
    </div>
    <div className="hero-visual">
      <DepthScene className="hero-workspace" motion={motion}>
        <div className="hero-floor depth-surface" />
        <div className="hero-word depth-surface"><span className="engraved-word">build.</span><span className="surface-caption">A little idea. A whole lot of possibility.</span></div>
        <div className="code-window depth-surface">
          <div className="window-toolbar"><span className="window-dots"><i /><i /><i /></span><span>the next idea</span><Braces size={13} /></div>
          <div className="code-content"><span className="code-soft">const</span> idea = <span className="code-blue">curiosity</span>;<br /><br /><span className="code-blue">build</span>({"{"}<br /><span className="code-indent">care: <span className="code-green">true</span>,</span><br /><span className="code-indent">possibilities: <span className="code-soft">∞</span></span><br />{"}"});</div>
        </div>
        <div className="mini-device depth-surface"><div className="device-camera" /><Smartphone size={24} /><strong>On the go.</strong><span>Small screen.<br />Big possibilities.</span><div className="device-lines"><i /><i /><i /></div></div>
        <div className="ai-chip depth-surface"><Sparkles size={20} /><span>AI with<br /><strong>purpose.</strong></span></div>
        <Character pose="wave" className="hero-character" sizes="(max-width: 600px) 65vw, (max-width: 1000px) 360px, 340px" eager />
        <div className="hello-chip depth-surface"><Check size={14} /> Hello, world.</div>
      </DepthScene>
      <button className="motion-button" onClick={() => setPaused(value => !value)} disabled={reducedMotion} aria-pressed={paused || reducedMotion} aria-label={motion ? "Pause hero motion" : "Enable hero motion"}>{motion ? <Pause size={13} /> : <Play size={13} />}<span>{reducedMotion ? "Reduced motion" : paused ? "Motion paused" : "A little perspective"}</span></button>
    </div>
    <div className="hero-bottom"><span>Web, mobile, and everything in between.</span><a href="#work" aria-label="Scroll to selected work"><ArrowDown size={16} /></a></div>
  </section>;
}
