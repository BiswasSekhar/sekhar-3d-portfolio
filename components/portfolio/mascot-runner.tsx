"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

export function MascotRunner() {
  const [paused, setPaused] = useState(false);

  return <div className="windowbar-runway">
    <span className={`mascot-lane${paused ? " mascot-lane-paused" : ""}`} aria-hidden="true">
      <Image className="mascot-runner" src="/characters/11-running-mascot.png" alt="" width={1024} height={1536} sizes="28px" />
    </span>
    <button
      className="mascot-motion-control"
      type="button"
      aria-label={paused ? "Resume mascot animation" : "Pause mascot animation"}
      aria-pressed={paused}
      title={paused ? "Resume mascot animation" : "Pause mascot animation"}
      onClick={() => setPaused(value => !value)}
    >
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
    </button>
  </div>;
}
