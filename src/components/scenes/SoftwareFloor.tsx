import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "../../utils/random";

const SCREENS = [
  { label: "PLATFORM", sublabel: "Web Infrastructure", color: "#7b4fff", angle: -0.5, dist: 12 },
  { label: "DASHBOARD", sublabel: "Analytics UI", color: "#00d4ff", angle: -0.2, dist: 14 },
  { label: "MOBILE APP", sublabel: "iOS / Android", color: "#7b4fff", angle: 0.1, dist: 12 },
  { label: "API LAYER", sublabel: "REST · GraphQL", color: "#00d4ff", angle: 0.4, dist: 14 },
  { label: "WEB APP", sublabel: "React · Vue · Next", color: "#7b4fff", angle: -0.8, dist: 10 },
  { label: "SYSTEM", sublabel: "Backend · DevOps", color: "#00d4ff", angle: 0.7, dist: 10 },
];

function HoloScreen({
  label,
  sublabel,
  color,
  angle,
  dist,
  idx,
}: {
  label: string;
  sublabel: string;
  color: string;
  angle: number;
  dist: number;
  idx: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 5 + Math.sin(t * 0.6 + idx * 1.1) * 0.5;
  });

  const x = Math.sin(angle * Math.PI) * dist;
  const z = Math.cos(angle * Math.PI) * dist - 8;
  const rotY = -angle * Math.PI * 0.5;

  // Miniature UI lines inside the screen
  const uiLines = useMemo(() => {
    const rng = seededRandom(idx * 1234);
    return Array.from({ length: 12 }, (_, i) => ({
      y: -1.4 + i * 0.26,
      width: 0.4 + rng() * 1.0,
      x: -1.2 + rng() * 0.3,
    }));
  }, [idx]);

  return (
    <group ref={ref} position={[x, 5, z]} rotation={[0, rotY, 0]}>
      {/* Screen frame */}
      <mesh>
        <boxGeometry args={[3.6, 2.8, 0.06]} />
        <meshStandardMaterial
          color="#040a14"
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Screen border glow */}
      {[
        [0, 1.42, 0, 3.8, 0.06, 0.06],
        [0, -1.42, 0, 3.8, 0.06, 0.06],
        [-1.83, 0, 0, 0.06, 2.92, 0.06],
        [1.83, 0, 0, 0.06, 2.92, 0.06],
      ].map(([px, py, pz, sx, sy, sz], i) => (
        <mesh key={i} position={[px, py, pz]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}

      {/* Mini UI lines on screen */}
      <group position={[0, 0, 0.04]}>
        {uiLines.map((line, i) => (
          <mesh key={i} position={[line.x + line.width / 2 - 1.2, line.y, 0]}>
            <boxGeometry args={[line.width, 0.08, 0.01]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
        {/* Header bar */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[3.2, 0.22, 0.01]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Central chart placeholder */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[2.4, 1.0, 0.01]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>

      {/* Label above */}
      <Text
        position={[0, 1.9, 0.1]}
        fontSize={0.38}
        color={color}
        anchorX="center"
        letterSpacing={0.15}
      >
        {label}
      </Text>
      <Text
        position={[0, 1.58, 0.1]}
        fontSize={0.22}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.05}
      >
        {sublabel}
      </Text>

      {/* Point light from screen */}
      <pointLight
        color={color}
        intensity={4}
        distance={8}
        decay={2}
        position={[0, 0, 1]}
      />
    </group>
  );
}

function FloatingParticles() {
  const count = 1200;
  const geom = useMemo(() => {
    const rng = seededRandom(55555);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 50;
      positions[i * 3 + 1] = rng() * 20;
      positions[i * 3 + 2] = (rng() - 0.5) * 40;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    const pos = geom.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime * 0.2;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.008;
      if (pos[i * 3 + 1] > 20) pos[i * 3 + 1] = 0;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.06}
        color="#7b4fff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function SoftwareFloor({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial
          color="#050810"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      <gridHelper
        args={[80, 40, "#200a40", "#100520"]}
        position={[0, 0, 0]}
      />

      <FloatingParticles />

      {SCREENS.map((s, i) => (
        <HoloScreen key={i} {...s} idx={i} />
      ))}

      {/* Central title */}
      <Text
        position={[0, 16, -8]}
        fontSize={1.8}
        color="#7b4fff"
        anchorX="center"
        letterSpacing={0.3}
      >
        SOFTWARE
      </Text>
      <Text
        position={[0, 13.5, -8]}
        fontSize={0.65}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.12}
      >
        PLATFORMS · APPS · APIs · SYSTEMS
      </Text>

      {/* Lighting */}
      <ambientLight color="#10052a" intensity={0.5} />
      <pointLight
        position={[0, 18, 0]}
        color="#7b4fff"
        intensity={50}
        distance={60}
        decay={2}
      />
      <pointLight
        position={[0, 5, 10]}
        color="#00d4ff"
        intensity={20}
        distance={30}
        decay={2}
      />
    </group>
  );
}
