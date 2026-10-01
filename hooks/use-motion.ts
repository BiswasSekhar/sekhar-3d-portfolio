"use client";
import { useEffect, useSyncExternalStore, type RefObject } from "react";
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (callback:()=>void) => { const m=window.matchMedia(reducedQuery);m.addEventListener("change",callback);return()=>m.removeEventListener("change",callback); };
export function useReducedMotion() { return useSyncExternalStore(subscribeReduced,()=>window.matchMedia(reducedQuery).matches,()=>true); }
const subscribeVisibility = (callback:()=>void) => {document.addEventListener("visibilitychange",callback);return()=>document.removeEventListener("visibilitychange",callback);};
export function usePageVisible() { return useSyncExternalStore(subscribeVisibility,()=>!document.hidden,()=>true); }
const compactQuery = "(max-width: 800px)";
const subscribeCompact = (callback:()=>void) => { const m=window.matchMedia(compactQuery);m.addEventListener("change",callback);return()=>m.removeEventListener("change",callback); };
export function useCompactViewport() { return useSyncExternalStore(subscribeCompact,()=>window.matchMedia(compactQuery).matches,()=>true); }
export function usePointerParallax(ref:RefObject<HTMLDivElement|null>,enabled:boolean,reset:number) {
 useEffect(()=>{
  const node=ref.current;if(!node||!enabled)return;
  let frame=0,x=0,y=0,tx=0,ty=0;
  const tick=()=>{x+=(tx-x)*.09;y+=(ty-y)*.09;node.style.setProperty("--rx",`${-y*5}deg`);node.style.setProperty("--ry",`${x*8}deg`);node.style.setProperty("--mx",`${x*8}px`);node.style.setProperty("--my",`${y*5}px`);if(Math.abs(tx-x)+Math.abs(ty-y)>.002)frame=requestAnimationFrame(tick);else frame=0;};
  const request=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);};
  const move=(e:PointerEvent)=>{const b=node.getBoundingClientRect();tx=Math.max(-1,Math.min(1,(e.clientX-b.left-b.width/2)/(b.width/2)));ty=Math.max(-1,Math.min(1,(e.clientY-b.top-b.height/2)/(b.height/2)));request();};
  const leave=()=>{tx=0;ty=0;request();};
  window.addEventListener("pointermove",move);window.addEventListener("blur",leave);document.addEventListener("pointerleave",leave);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("pointermove",move);window.removeEventListener("blur",leave);document.removeEventListener("pointerleave",leave);for(const p of ["--rx","--ry","--mx","--my"])node.style.removeProperty(p);};
 },[ref,enabled,reset]);
}
