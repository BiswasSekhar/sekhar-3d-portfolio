"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowUpRight, Cuboid, MousePointer2, RotateCcw, Moon, Sun, Pause, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { useReducedMotion, usePointerParallax } from "@/hooks/use-motion";
import { portfolio } from "@/lib/portfolio";

const AvatarScene = dynamic(() => import("@/components/three/avatar-scene"), {
  ssr: false,
  loading: () => <div className="model-status" role="status">Preparing a little world…</div>,
});
const subscribeMount = () => () => {};

export function Hero() {
  const [view, setView] = useState("model");
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [reset, setReset] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeMount, () => true, () => false);
  const prefersReducedMotion = useReducedMotion();
  const motion = motionOverride ?? !prefersReducedMotion;
  const stage = useRef<HTMLDivElement>(null);
  usePointerParallax(stage, motion && view === "portrait", reset);
  const dark = mounted && resolvedTheme === "dark";

  return <section id="main" className="hero rounded-panel landscape-hero" aria-labelledby="hero-title">
    <h1 id="hero-title" className="hero-name" aria-label={`${portfolio.name} — ${portfolio.title}`}>{portfolio.name}</h1>
    <div className="scene-topline">
      <span className="intro-pill"><span className="mini-star">✳</span> A little code. A lot of curiosity.</span>
      <button className="scene-weather" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch scene to day" : "Switch scene to night"}>
        {dark ? <Moon size={15} /> : <Sun size={15} />} <span>{dark ? "After hours" : "A brighter perspective"}</span>
      </button>
    </div>
    <div className="hero-scenery" id="playground">
      <AvatarScene reset={reset} motion={motion} showAvatar={view === "model"} />
      {view === "portrait" && <div className="portrait-layer" ref={stage}><Image className="scene-portrait" src="/character.png" width={1024} height={1536} alt={`${portfolio.name}’s smiling character, with curly black hair`} sizes="(max-width: 600px) 75vw, 32vw" draggable={false} loading="eager" /></div>}
    </div>
    <div className="scene-caption">
      <div className="hero-copy">
        <span className="scene-eyebrow">CREATIVE DEVELOPER & DIGITAL EXPLORER</span>
        <p className="hero-intro">Ideas into <br /><span>experiences.</span></p>
        <p className="hero-description">Thoughtful design. Playful code.<br />A little world of possibilities.</p>
        <a className="primary-button" href="#work">Explore my work <ArrowUpRight size={17} /></a>
      </div>
      <div className="scene-controls">
        <span className="interaction-note"><MousePointer2 size={13} /> {motion ? (view === "model" ? "Drag or swipe to turn" : "Move to explore the landscape") : "A moment of stillness"}</span>
        <div className="character-controls">
          <div className="view-tabs" role="group" aria-label="Character view">
            <button aria-pressed={view === "portrait"} onClick={() => setView("portrait")}>Portrait</button>
            <button aria-pressed={view === "model"} onClick={() => setView("model")}><Cuboid size={14} /> 3D model</button>
          </div>
          <button className="reset-button" aria-label="Reset scene position" onClick={() => setReset(value => value + 1)}><RotateCcw size={15} /></button>
          <button className="reset-button" aria-label={motion ? "Pause motion" : "Enable motion"} aria-pressed={!motion} onClick={() => setMotionOverride(!motion)}>{motion ? <Pause size={15} /> : <Play size={15} />}</button>
        </div>
        <span className="scene-footnote">A little curiosity goes a long way.</span>
      </div>
    </div>
  </section>;
}
