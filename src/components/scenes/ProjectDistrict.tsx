import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "../../utils/random";

const PROJECTS = [
  { name: "ISHAMI", sub: "3D Driving Simulation", color: "#00d4ff", x: -12, z: -8, h: 14 },
  { name: "DATAHUB", sub: "Data Intelligence", color: "#00ffcc", x: 6, z: -12, h: 18 },
  { name: "INFRACORE", sub: "Cloud Infrastructure", color: "#00d4ff", x: 16, z: 2, h: 10 },
  { name: "SECURENODE", sub: "Cybersecurity Suite", color: "#ff3366", x: 4, z: 8, h: 12 },
  { name: "NETPULSE", sub: "Network Intelligence", color: "#7b4fff", x: -6, z: 14, h: 16 },
  { name: "EDGECLOUD", sub: "Edge Computing", color: "#ffd700", x: -18, z: 2, h: 8 },
  { name: "SENTINEL", sub: "Threat Detection", color: "#ff3366", x: 12, z: -4, h: 20 },
  { name: "AISTUDIO", sub: "AI Development", color: "#ffd700", x: -8, z: -2, h: 22 },
];

function ProjectBuilding({
  name,
  sub,
  color,
  x,
  z,
  h,
}: {
  name: string;
  sub: string;
  color: string;
  x: number;
  z: number;
  h: number;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 1.2 + x) * 0.4;
  });

  const w = 4 + Math.abs(Math.sin(x * 0.3)) * 2;
  const d = 3 + Math.abs(Math.cos(z * 0.3)) * 2;

  return (
    <group position={[x, 0, z]}>
      {/* Building body */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#060c1a"
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Top glow */}
      <mesh ref={glowRef} position={[0, h + 0.07, 0]}>
        <boxGeometry args={[w + 0.2, 0.12, d + 0.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Edge strips */}
      {([[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]] as [number, number][]).map(
        ([ex, ez], i) => (
          <mesh key={i} position={[ex, h / 2, ez]}>
            <boxGeometry args={[0.1, h, 0.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
        )
      )}

      {/* Window dots (top view, abstract) */}
      {Array.from({ length: Math.floor(h / 2) }, (_, i) => (
        <mesh key={i} position={[0, i * 1.8 + 1, d / 2 + 0.05]}>
          <boxGeometry args={[w * 0.6, 0.3, 0.05]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Building label — floats above */}
      <Text
        position={[0, h + 2.2, 0]}
        fontSize={0.55}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {name}
      </Text>
      <Text
        position={[0, h + 1.4, 0]}
        fontSize={0.26}
        color="#7a8fa6"
        anchorX="center"
        anchorY="middle"
      >
        {sub}
      </Text>

      {/* Point light */}
      <pointLight
        position={[0, h + 1, 0]}
        color={color}
        intensity={3}
        distance={12}
        decay={2}
      />
    </group>
  );
}

function CityRoads() {
  const roads = [
    { x: 0, z: 0, w: 60, d: 0.6, ry: 0 },
    { x: 0, z: 0, w: 0.6, d: 60, ry: 0 },
    { x: -10, z: 5, w: 30, d: 0.6, ry: 0 },
    { x: 8, z: -8, w: 0.6, d: 24, ry: 0 },
  ];

  return (
    <>
      {roads.map((r, i) => (
        <mesh key={i} position={[r.x, 0.05, r.z]} rotation={[0, r.ry, 0]}>
          <boxGeometry args={[r.w, 0.05, r.d]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

function AmbientCityParticles() {
  const count = 600;
  const { geom, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const rng = seededRandom(24601);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 60;
      positions[i * 3 + 1] = rng() * 30;
      positions[i * 3 + 2] = (rng() - 0.5) * 60;
      speeds[i] = 0.01 + rng() * 0.02;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, speeds };
  }, []);

  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      if (pos[i * 3 + 1] > 30) pos[i * 3 + 1] = 0;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.08}
        color="#00d4ff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function ProjectDistrict({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#030608"
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      <gridHelper
        args={[100, 50, "#001a2e", "#000a15"]}
        position={[0, 0, 0]}
      />

      <CityRoads />
      <AmbientCityParticles />

      {PROJECTS.map((p, i) => (
        <ProjectBuilding key={i} {...p} />
      ))}

      {/* District title */}
      <Text
        position={[0, 35, 0]}
        fontSize={2.2}
        color="#00d4ff"
        anchorX="center"
        letterSpacing={0.35}
      >
        PROJECT DISTRICT
      </Text>
      <Text
        position={[0, 32, 0]}
        fontSize={0.75}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.15}
      >
        FERRIVOX PRODUCT ECOSYSTEM
      </Text>

      {/* Lighting */}
      <ambientLight color="#030810" intensity={0.6} />
      <pointLight
        position={[0, 40, 0]}
        color="#00d4ff"
        intensity={80}
        distance={120}
        decay={2}
      />
      <pointLight
        position={[-12, 25, -8]}
        color="#7b4fff"
        intensity={20}
        distance={40}
        decay={2}
      />
      <pointLight
        position={[12, 25, 8]}
        color="#00ffcc"
        intensity={20}
        distance={40}
        decay={2}
      />
    </group>
  );
}
