"use client";

import { useRef, type ReactNode } from "react";
import { usePageVisible, usePointerParallax, useReducedMotion } from "@/hooks/use-motion";

/** Text and details are children of each tilted surface, inheriting its depth. */
export function DepthScene({ children, className = "", motion = true, decorative = true }: {
  children: ReactNode; className?: string; motion?: boolean; decorative?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const visible = usePageVisible();
  usePointerParallax(stage, motion && !reducedMotion && visible, 0);
  return <div ref={stage} className={`depth-scene ${className}`} aria-hidden={decorative || undefined}>
    <div className="depth-world">{children}</div>
  </div>;
}
