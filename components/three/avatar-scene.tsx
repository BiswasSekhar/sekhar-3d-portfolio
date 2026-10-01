"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, useProgress } from "@react-three/drei";
import { ACESFilmicToneMapping, Box3, Group, MathUtils, Vector3, type Object3D } from "three";
import { useTheme } from "next-themes";
import { useCompactViewport, usePageVisible } from "@/hooks/use-motion";
import { portfolio } from "@/lib/portfolio";
import { Landscape } from "./landscape";

type SceneProps = { motion: boolean; showAvatar: boolean; reset: number };
type Aim = RefObject<{ x: number; y: number }>;
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="model-status" role="status">The 3D scene couldn’t load. Choose Portrait below.</div> : this.props.children;
  }
}
function StudioEnvironment() {
  return <Environment resolution={64} frames={1} environmentIntensity={.7}>
    <Lightformer form="rect" intensity={2.2} color="#fff8f0" position={[-3, 4, 5]} scale={[5, 4, 1]} target={[0, 1, 0]} />
    <Lightformer form="rect" intensity={1.2} color="#dbe9ff" position={[4, 2, 1]} scale={[3, 5, 1]} target={[0, 1, 0]} />
    <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 4, -4]} scale={[4, 2, 1]} target={[0, 1, 0]} />
  </Environment>;
}
function SceneCamera() {
  const compact = useThree(state => state.size.width < 600);
  const camera = useThree(state => state.camera);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { camera.lookAt(0, compact ? 1.6 : 1.3, 0); invalidate(); }, [camera, compact, invalidate]);
  return null;
}
function useScenePointer(area: RefObject<HTMLDivElement | null>, motion: boolean, reset: number) {
  const aim = useRef({ x: 0, y: 0 });
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!motion || event.pointerType === "touch") return;
      const node = area.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      aim.current.x = MathUtils.clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2), -1, 1);
      aim.current.y = MathUtils.clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2), -1, 1);
      invalidate();
    };
    const leave = () => { aim.current = { x: 0, y: 0 }; invalidate(); };
    leave();
    if (!motion) return;
    window.addEventListener("pointermove", move);
    window.addEventListener("blur", leave);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", leave);
      document.removeEventListener("pointerleave", leave);
    };
  }, [motion, invalidate, area, reset]);
  return aim;
}
function World({ motion, dark, aim, compact, onToggleTheme }: { motion: boolean; dark: boolean; aim: Aim; compact: boolean; onToggleTheme: () => void }) {
  const world = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  useFrame((_, dt) => {
    if (!world.current) return;
    const x = motion ? aim.current.y * .025 : 0, y = motion ? aim.current.x * .045 : 0;
    world.current.rotation.x = MathUtils.damp(world.current.rotation.x, x, 5, dt);
    world.current.rotation.y = MathUtils.damp(world.current.rotation.y, y, 5, dt);
    if (Math.abs(world.current.rotation.x - x) + Math.abs(world.current.rotation.y - y) > .0006) invalidate();
  });
  return <group ref={world}><Landscape dark={dark} motion={motion} compact={compact} onToggleTheme={onToggleTheme} /></group>;
}
function Avatar({ motion, yaw, aim, compact }: { motion: boolean; yaw: number; aim: Aim; compact: boolean }) {
  const { scene } = useGLTF(portfolio.avatarUrl, false);
  const viewportWidth = useThree(state => state.viewport.width);
  const instance = useMemo(() => {
    const object = scene.clone(true);
    const bounds = new Box3().setFromObject(object);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const height = compact ? Math.min(2.6, viewportWidth * .60 * size.y / size.x) : 2.65;
    const scale = height / size.y;
    object.scale.setScalar(scale);
    object.position.set(-center.x * scale, -bounds.min.y * scale + .48, -center.z * scale);
    return object;
  }, [scene, compact, viewportWidth]);
  const body = useRef<Group>(null);
  const head = useRef<Object3D | null>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { head.current = instance.getObjectByName("Head") ?? null; }, [instance]);
  useEffect(() => { invalidate(); }, [yaw, invalidate]);
  useFrame((_, dt) => {
    if (!body.current) return;
    const desired = yaw + (motion ? aim.current.x * .18 : 0);
    body.current.rotation.y = MathUtils.damp(body.current.rotation.y, desired, 7, dt);
    let drift = Math.abs(body.current.rotation.y - desired);
    if (head.current) {
      const x = motion ? aim.current.y * .07 : 0, y = motion ? aim.current.x * .10 : 0;
      head.current.rotation.x = MathUtils.damp(head.current.rotation.x, x, 8, dt);
      head.current.rotation.y = MathUtils.damp(head.current.rotation.y, y, 8, dt);
      drift += Math.abs(head.current.rotation.x - x) + Math.abs(head.current.rotation.y - y);
    }
    if (drift > .0008) invalidate();
  });
  return <group ref={body}><primitive object={instance} dispose={null} /></group>;
}
function SceneContent({ motion, dark, area, reset, showAvatar, yaw, onToggleTheme }: SceneProps & { dark: boolean; area: RefObject<HTMLDivElement | null>; yaw: number; onToggleTheme: () => void }) {
  const aim = useScenePointer(area, motion, reset);
  const compact = useThree(state => state.size.width < 600);
  return <>
    <World motion={motion} dark={dark} aim={aim} compact={compact} onToggleTheme={onToggleTheme} />
    <Suspense fallback={null}>{showAvatar && <Avatar motion={motion} yaw={yaw} aim={aim} compact={compact} />}</Suspense>
  </>;
}

export default function AvatarScene({ motion, showAvatar, reset }: SceneProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const area = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const [inView, setInView] = useState(true);
  const [rotation, setRotation] = useState({ reset, yaw: 0 });
  const yaw = rotation.reset === reset ? rotation.yaw : 0;
  const pageVisible = usePageVisible();
  const compactViewport = useCompactViewport();
  const { active } = useProgress();
  useEffect(() => {
    if (!area.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "60px" });
    observer.observe(area.current);
    return () => observer.disconnect();
  }, []);
  const visible = inView && pageVisible;
  return <div className="model-frame" ref={area} tabIndex={0} role="group"
    aria-label="Interactive landscape and character. Move your cursor to explore. Drag horizontally or use arrow keys to turn the character. Press Home to reset. Click the sun or moon to switch the scene."
    onKeyDown={event => {
      if (!motion) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setRotation({reset, yaw: yaw + (event.key === "ArrowLeft" ? -.22 : .22)}); }
      if (event.key === "Home") { event.preventDefault(); setRotation({reset, yaw: 0}); }
    }}
    onPointerDown={event => {
      if (motion && showAvatar && event.button === 0 && event.target instanceof HTMLCanvasElement) {
        drag.current = { x: event.clientX, yaw };
      }
    }}
    onPointerMove={event => { if (motion && drag.current) setRotation({reset, yaw: drag.current.yaw + (event.clientX - drag.current.x) * .008}); }}
    onPointerUp={() => { drag.current = null; }}
    onPointerLeave={() => { drag.current = null; }}
    onPointerCancel={() => { drag.current = null; }}>
    <SceneBoundary><Canvas className="model-canvas" frameloop={visible ? "demand" : "never"} dpr={[1, compactViewport ? 1.1 : 1.4]}
      camera={{ position: [0, 1.60, 7.9], fov: 30, near: .1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      fallback={<div className="model-status">3D is unavailable on this device. Choose Portrait below.</div>}>
      <SceneCamera />
      <ambientLight intensity={dark ? .35 : .6} />
      <directionalLight position={[-3, 4, 5]} intensity={dark ? 1.5 : 2.1} color={dark ? "#c8ddff" : "#fff3e6"} />
      <directionalLight position={[4, 2, 3]} intensity={dark ? .65 : .5} color="#c7e1ff" />
      <directionalLight position={[2, 4, -3]} intensity={dark ? 2.3 : 1.4} color="#edf3ff" />
      <StudioEnvironment />
      <SceneContent motion={motion && visible} dark={dark} area={area} reset={reset} showAvatar={showAvatar} yaw={yaw} onToggleTheme={() => setTheme(dark ? "light" : "dark")} />
    </Canvas></SceneBoundary>
    {active && <div className="model-status" role="status">Growing a little world…</div>}
  </div>;
}
