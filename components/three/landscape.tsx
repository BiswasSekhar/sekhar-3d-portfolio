"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Group, MathUtils, Vector3 } from "three";
import { portfolio } from "@/lib/portfolio";

type LandscapeProps = { dark: boolean; motion: boolean; onToggleTheme: () => void };

function Tree({ position, scale = 1, dark, motion, variant = 0 }: {
  position: [number, number, number]; scale?: number; dark: boolean; motion: boolean; variant?: number;
}) {
  const canopy = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const invalidate = useThree(state => state.invalidate);
  useFrame((_, dt) => {
    if (!canopy.current) return;
    const target = hovered && motion ? -.12 : 0;
    canopy.current.rotation.z = MathUtils.damp(canopy.current.rotation.z, target, 6, dt);
    if (Math.abs(canopy.current.rotation.z - target) > .0005) invalidate();
  });
  const leaf = dark ? ["#235965", "#286775", "#3a7783"][variant % 3] : ["#63ad82", "#77be8f", "#459a7a"][variant % 3];
  return <group position={position} scale={scale}>
    <mesh position={[0, .35, 0]}>
      <cylinderGeometry args={[.045, .075, .8, 10]} />
      <meshStandardMaterial color={dark ? "#48707e" : "#92785c"} roughness={1} />
    </mesh>
    <group ref={canopy} position={[0, .55, 0]} onPointerOver={event => { event.stopPropagation(); setHovered(true); invalidate(); }} onPointerOut={() => { setHovered(false); invalidate(); }}>
      {[[0, .42, 0, .43, .62], [-.24, .23, .03, .32, .43], [.25, .31, -.03, .33, .48]].map(([x, y, z, w, h], i) =>
        <mesh key={i} position={[x, y, z]} scale={[w, h, w]}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshStandardMaterial color={leaf} roughness={.85} emissive={dark ? "#144654" : "#4a855c"} emissiveIntensity={hovered && motion ? .25 : .04} />
        </mesh>
      )}
    </group>
  </group>;
}

function Road({ dark }: { dark: boolean }) {
  const { road, stripe, lamps } = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(-6, -.23, 2), new Vector3(-3.3, -.22, .7),
      new Vector3(-2.3, -.20, -1.2), new Vector3(1.8, -.16, -3.6),
      new Vector3(2.25, -.18, -5.2), new Vector3(.8, -.25, -7),
    ]);
    function ribbon(width: number, offset = 0) {
      const vertices: number[] = [], indices: number[] = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100, p = curve.getPoint(t), tangent = curve.getTangent(t);
        const normal = new Vector3(-tangent.z, 0, tangent.x).normalize();
        for (const side of [-1, 1]) {
          const v = p.clone().addScaledVector(normal, width * side / 2);
          vertices.push(v.x, v.y + offset, v.z);
        }
        if (i < 100) { const n = i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices); geometry.computeVertexNormals();
      return geometry;
    }
    const lamps = [.28, .50, .72].map(t => {
      const p = curve.getPoint(t), tangent = curve.getTangent(t);
      return p.add(new Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(.40));
    });
    return { road: ribbon(.72), stripe: ribbon(.018, .012), lamps };
  }, []);
  useEffect(() => () => { road.dispose(); stripe.dispose(); }, [road, stripe]);
  return <group>
    <mesh geometry={road}>
      <meshStandardMaterial color={dark ? "#273e59" : "#98afbf"} roughness={1} side={2} />
    </mesh>
    <mesh geometry={stripe}>
      <meshStandardMaterial color={dark ? "#7593b0" : "#eef2e5"} roughness={1} side={2} />
    </mesh>
    {lamps.map((position, i) => <group key={i} position={position}>
      <mesh position={[0, .23, 0]}><cylinderGeometry args={[.012, .018, .5, 8]} /><meshStandardMaterial color={dark ? "#698397" : "#8196a2"} /></mesh>
      <mesh position={[0, .49, 0]}><sphereGeometry args={[.053, 12, 8]} /><meshStandardMaterial color="#fff2c9" emissive="#ffda89" emissiveIntensity={dark ? 3 : 0} toneMapped={false} /></mesh>
      {dark && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .025, 0]}><circleGeometry args={[.22, 24]} /><meshBasicMaterial color="#ffdca3" transparent opacity={.10} depthWrite={false} /></mesh>}
    </group>)}
  </group>;
}

function Cloud({ position, scale = 1, dark }: { position: [number, number, number]; scale?: number; dark: boolean }) {
  return <group position={position} scale={scale}>
    {[[-.25, 0, .24], [0, .08, .36], [.30, -.01, .23]].map(([x, y, size], i) =>
      <mesh key={i} position={[x, y, 0]} scale={[size * 1.35, size * .65, size * .52]}>
        <sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={dark ? "#3a527b" : "#f1faff"} roughness={1} />
      </mesh>
    )}
  </group>;
}

export function Landscape({ dark, motion, onToggleTheme }: LandscapeProps) {
  const width = useThree(state => state.viewport.width);
  const spread = Math.max(2.4, width * .48);
  const sky = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  const [celestialHovered, setCelestialHovered] = useState(false);
  const stars = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    x: (Math.sin(i * 127.1 + 8) * .5 + .5) * 2 - 1,
    y: 1.6 + (Math.sin(i * 311.7 + 2) * .5 + .5) * 2.8,
    scale: i % 4 === 0 ? .025 : .014,
  })), []);
  useFrame((_, dt) => {
    if (!sky.current) return;
    const target = celestialHovered && motion ? 1.13 : 1;
    sky.current.scale.setScalar(MathUtils.damp(sky.current.scale.x, target, 7, dt));
    if (Math.abs(sky.current.scale.x - target) > .001) invalidate();
  });
  return <group>
    <group position={[spread * .79, 3.68, -5]} ref={sky} onPointerOver={event => { event.stopPropagation(); setCelestialHovered(true); invalidate(); }} onPointerOut={() => { setCelestialHovered(false); invalidate(); }} onClick={onToggleTheme}>
      <mesh><sphereGeometry args={[.30, 32, 24]} /><meshBasicMaterial color={dark ? "#e4edff" : "#ffe5a0"} /></mesh>
      {dark && [[-.09, .08, .287, .042], [.10, -.09, .278, .061], [.07, .13, .267, .025]].map(([x, y, z, r], i) =>
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 12, 8]} /><meshBasicMaterial color="#bbcce8" /></mesh>
      )}
      <mesh><sphereGeometry args={[.40, 24, 16]} /><meshBasicMaterial color={dark ? "#b5d1ff" : "#fff3b5"} transparent opacity={.12} depthWrite={false} /></mesh>
    </group>
    {dark && stars.map((star, i) => <mesh key={i} position={[star.x * spread * 1.35, star.y, -6.5]}>
      <sphereGeometry args={[star.scale, 6, 4]} /><meshBasicMaterial color={i % 3 === 0 ? "#a5cbff" : "#e8f2ff"} />
    </mesh>)}
    <Cloud position={[-spread * .76, 2.95, -5]} scale={1.5} dark={dark} />
    <Cloud position={[spread * .44, 2.08, -5.5]} scale={.95} dark={dark} />
    <Cloud position={[-spread * .25, 3.7, -6]} scale={.75} dark={dark} />
    {[
      [-spread * .68, -.78, -5.8, spread * .9, 1.55, 2.8],
      [spread * .82, -.89, -5.2, spread * .78, 1.68, 2.8],
      [-spread * .30, -1.25, -3.8, spread * .82, 1.26, 2.4],
    ].map(([x, y, z, sx, sy, sz], i) => <mesh key={i} position={[x, y, z]} scale={[sx, sy, sz]}>
      <sphereGeometry args={[1, 40, 24]} /><meshStandardMaterial color={dark ? ["#214966", "#25556a", "#276568"][i] : ["#82b9a7", "#70b59d", "#58a68d"][i]} roughness={1} />
    </mesh>)}
    <mesh position={[0, -1.31, -1.5]} scale={[spread * 2.6, 1.02, 7]}>
      <sphereGeometry args={[1, 48, 24]} /><meshStandardMaterial color={dark ? "#214e5e" : "#71b995"} roughness={1} />
    </mesh>
    <Road dark={dark} />
    {[
      [-.90, -.34, -1.3, 1.18], [-.75, -.22, -2.5, .90], [-.99, -.25, -3.8, .76],
      [.82, -.35, -.9, 1.35], [.99, -.32, -2.3, .98], [.69, -.16, -3.7, .75],
      [-.43, .0, -5.8, .63], [.32, .07, -6.2, .53],
    ].map(([x, y, z, scale], i) => <Tree key={i} position={[x * spread, y, z]} scale={scale} dark={dark} motion={motion} variant={i} />)}
    <SuspendedName dark={dark} width={width} />
  </group>;
}

function SuspendedName({ dark, width }: { dark: boolean; width: number }) {
  // The title lives behind the head in world space, so the mesh handles occlusion.
  return <Center position={[0, 2.20, -1.65]} scale={Math.min(width / 6.5, 1.5)}>
    <Text3D font="/fonts/helvetiker_bold.typeface.json" size={.89} height={.17} curveSegments={8} bevelEnabled bevelSize={.014} bevelThickness={.012} bevelSegments={3}>
      {portfolio.name.toUpperCase()}
      <meshStandardMaterial attach="material-0" color={dark ? "#c0d9ff" : "#f4faff"} roughness={.45} />
      <meshStandardMaterial attach="material-1" color={dark ? "#456b96" : "#83acc8"} roughness={.55} />
    </Text3D>
  </Center>;
}
