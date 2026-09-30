"use client";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

export default function Character({ dark, motion, reset }: {dark:boolean;motion:boolean;reset:number}) {
  const host = useRef<HTMLDivElement>(null);
  const theme = useRef(dark);
  const [status, setStatus] = useState("Loading character…");
  useEffect(() => { theme.current = dark; }, [dark]);
  useEffect(() => {
    let disposed = false, cleanup = () => {};
    const element = host.current;
    if (!element) return;
    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:"low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.domElement.setAttribute("aria-label", "Interactive 3D character. Move your cursor or drag to rotate.");
        renderer.domElement.setAttribute("role", "img");
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, .1, 50);
        camera.position.set(0,1.38,7.0); camera.lookAt(0,1.38,0);
        const ambient = new THREE.HemisphereLight(0xe8f1ff,0x907764,2.1); scene.add(ambient);
        const key = new THREE.DirectionalLight(0xffe9d4,3.0); key.position.set(-3,5,5); scene.add(key);
        const fill = new THREE.DirectionalLight(0xc6ddff,2.0); fill.position.set(4,2,3); scene.add(fill);
        const rim = new THREE.DirectionalLight(0xe6f2ff,2.8); rim.position.set(2,4,-3); scene.add(rim);
        let model:Group|undefined, frame=0, targetX=0, targetY=0, dragStart=0, dragBase=0, dragYaw=0, dragging=false, visible=true;
        const resize = () => { const {width,height}=element.getBoundingClientRect(); renderer.setSize(width,height); camera.aspect=width/height; camera.updateProjectionMatrix(); };
        const observer = new ResizeObserver(resize); observer.observe(element); resize();
        const loader = new GLTFLoader();
        loader.load("/sekhar-avatar.glb", gltf => { if(disposed) { gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}}); return; } model=gltf.scene; scene.add(model); setStatus(""); }, undefined, () => setStatus("The model could not load. Try the portrait view."));
        const move = (e:PointerEvent) => {
          if(!motion) return;
          const b=element.getBoundingClientRect();
          targetX=Math.max(-1,Math.min(1,(e.clientX-b.left-b.width/2)/(b.width/2)));
          targetY=Math.max(-1,Math.min(1,(e.clientY-b.top-b.height/2)/(b.height/2)));
          if(dragging) dragYaw=dragBase+(e.clientX-dragStart)*.009;
        };
        const down = (e:PointerEvent) => { if(!motion) return; dragging=true; dragStart=e.clientX; dragBase=dragYaw; renderer.domElement.setPointerCapture(e.pointerId); };
        const up = () => { dragging=false; };
        const visibility = () => { visible=!document.hidden; };
        const io = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&!document.hidden;}); io.observe(element);
        window.addEventListener("pointermove",move); renderer.domElement.addEventListener("pointerdown",down); renderer.domElement.addEventListener("pointerup",up); renderer.domElement.addEventListener("pointercancel",up); document.addEventListener("visibilitychange",visibility);
        const tick=()=> { frame=requestAnimationFrame(tick); if(!visible) return; if(model){model.rotation.y+=(dragYaw+targetX*.3-model.rotation.y)*.075; const head=model.getObjectByName("Head"); if(head){head.rotation.x+=(-targetY*.10-head.rotation.x)*.07;head.rotation.y+=(targetX*.12-head.rotation.y)*.07;}} rim.intensity=theme.current?3.5:2.8; renderer.render(scene,camera); };tick();
        cleanup=()=> { cancelAnimationFrame(frame); observer.disconnect(); io.disconnect(); window.removeEventListener("pointermove",move); renderer.domElement.removeEventListener("pointerdown",down); renderer.domElement.removeEventListener("pointerup",up); renderer.domElement.removeEventListener("pointercancel",up); document.removeEventListener("visibilitychange",visibility); scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove(); };
      } catch { if(!disposed) setStatus("3D is unavailable here. Try the portrait view."); }
    })();
    return () => {disposed=true;cleanup();};
  }, [motion,reset]);
  return <div className="model-frame"><div className="model-canvas" ref={host} />{status && <span className="model-status" role="status">{status}</span>}</div>;
}
