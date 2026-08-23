import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "../../utils/random";

function NetworkNode({
  position,
  isProtected,
  idx,
}: {
  position: THREE.Vector3;
  isProtected: boolean;
  idx: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const t = state.clock.elapsedTime;
    mat.emissiveIntensity = 0.5 + Math.sin(t * 1.5 + idx * 0.7) * 0.35;
  });

  const color = isProtected ? "#00d4ff" : "#7a8fa6";
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.35, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function ThreatNode({
  startPos,
  targetPos,
  speed,
  idx,
}: {
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  speed: number;
  idx: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random());

  useFrame((state) => {
    if (!ref.current) return;
    progress.current = (progress.current + speed * 0.004) % 1;
    const pos = startPos.clone().lerp(targetPos, progress.current);
    ref.current.position.copy(pos);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 6 + idx) * 0.5;
  });

  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[0.28, 8, 8]} />
      <meshStandardMaterial
        color="#ff3366"
        emissive="#ff3366"
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

function NetworkEdges({ nodes }: { nodes: THREE.Vector3[] }) {
  const geom = useMemo(() => {
    const lines: number[] = [];
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i >= j) return;
        if (a.distanceTo(b) < 10) {
          lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lines), 3)
    );
    return g;
  }, [nodes]);

  const lineRef = useRef<THREE.LineSegments>(null);
  useFrame((state) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  return (
    <lineSegments ref={lineRef} geometry={geom}>
      <lineBasicMaterial
        color="#00d4ff"
        transparent
        opacity={0.35}
      />
    </lineSegments>
  );
}

function ShieldSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 1.2) * 0.06;
    ref.current.scale.set(scale, scale, scale);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.07 + Math.sin(t * 1.2) * 0.04;
  });

  return (
    <mesh ref={ref} position={[0, 6, 0]}>
      <sphereGeometry args={[14, 32, 32]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.08}
        wireframe={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function ShieldWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x += 0.001;
  });

  return (
    <mesh ref={ref} position={[0, 6, 0]}>
      <sphereGeometry args={[14.2, 20, 12]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.12}
        wireframe
      />
    </mesh>
  );
}

function ServerRack({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 2.5, z]}>
      <mesh>
        <boxGeometry args={[2, 5, 1]} />
        <meshStandardMaterial
          color="#060c1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, -2 + i * 0.72, 0.51]}>
          <boxGeometry args={[1.7, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SecurityFloor({
  position,
}: {
  position: [number, number, number];
}) {
  const { nodes, threats } = useMemo(() => {
    const rng = seededRandom(31415);
    const nodes = Array.from(
      { length: 28 },
      () =>
        new THREE.Vector3(
          (rng() - 0.5) * 22,
          rng() * 10 + 1,
          (rng() - 0.5) * 16
        )
    );

    const center = new THREE.Vector3(0, 6, 0);
    const threats = Array.from({ length: 5 }, (_, i) => ({
      startPos: new THREE.Vector3(
        Math.cos((i / 5) * Math.PI * 2) * 30,
        2 + i * 1.5,
        Math.sin((i / 5) * Math.PI * 2) * 30
      ),
      targetPos: center.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 8
        )
      ),
      speed: 0.3 + i * 0.08,
    }));

    return { nodes, threats };
  }, []);

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial
          color="#080304"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      <gridHelper
        args={[80, 40, "#2a0010", "#150008"]}
        position={[0, 0, 0]}
      />

      {/* Server racks */}
      {[
        [-20, -12], [-20, 0], [-20, 12],
        [20, -12],  [20, 0],  [20, 12],
      ].map(([x, z], i) => (
        <ServerRack key={i} x={x} z={z} />
      ))}

      {/* Network visualization */}
      <NetworkEdges nodes={nodes} />
      {nodes.map((n, i) => (
        <NetworkNode
          key={i}
          position={n}
          isProtected={i < 20}
          idx={i}
        />
      ))}

      {/* Shield */}
      <ShieldSphere />
      <ShieldWireframe />

      {/* Threat nodes */}
      {threats.map((t, i) => (
        <ThreatNode key={i} {...t} idx={i} />
      ))}

      {/* Labels */}
      <Text
        position={[-14, 17, 0]}
        fontSize={1.3}
        color="#ff3366"
        anchorX="center"
        letterSpacing={0.2}
      >
        DETECT
      </Text>
      <Text
        position={[0, 17, 0]}
        fontSize={1.3}
        color="#00d4ff"
        anchorX="center"
        letterSpacing={0.2}
      >
        PROTECT
      </Text>
      <Text
        position={[14, 17, 0]}
        fontSize={1.3}
        color="#ff3366"
        anchorX="center"
        letterSpacing={0.2}
      >
        RESPOND
      </Text>
      <Text
        position={[-7, 17, 0]}
        fontSize={1.5}
        color="#7a8fa6"
        anchorX="center"
      >
        →
      </Text>
      <Text
        position={[7, 17, 0]}
        fontSize={1.5}
        color="#7a8fa6"
        anchorX="center"
      >
        →
      </Text>

      {/* Lighting */}
      <ambientLight color="#1a0008" intensity={0.5} />
      <pointLight
        position={[0, 15, 0]}
        color="#00d4ff"
        intensity={35}
        distance={50}
        decay={2}
      />
      <pointLight
        position={[0, 6, 0]}
        color="#ff3366"
        intensity={12}
        distance={25}
        decay={2}
      />
      <pointLight
        position={[-20, 5, 0]}
        color="#00d4ff"
        intensity={8}
        distance={20}
        decay={2}
      />
    </group>
  );
}
