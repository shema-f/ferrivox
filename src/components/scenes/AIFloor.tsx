import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const LAYER_SIZES = [6, 10, 10, 10, 6, 4];
const LAYER_SPACING = 5.5;
const NODE_RADIUS = 0.3;

interface NodeData {
  pos: THREE.Vector3;
  layer: number;
  idx: number;
}

function NeuralNode({ node, activationOffset }: { node: NodeData; activationOffset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const wave = Math.sin(t * 1.8 + activationOffset) * 0.5 + 0.5;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + wave * 1.4;
    const s = 1 + wave * 0.25;
    ref.current.scale.setScalar(s);
  });

  const layerColors = [
    "#ffd700", "#00d4ff", "#7b4fff", "#00ffcc", "#00d4ff", "#ffd700",
  ];
  const color = layerColors[node.layer] || "#00d4ff";

  return (
    <mesh ref={ref} position={node.pos}>
      <sphereGeometry args={[NODE_RADIUS, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

function NeuralEdges({ nodes }: { nodes: NodeData[] }) {
  const { geom } = useMemo(() => {
    const lines: number[] = [];

    // Connect consecutive layers
    const byLayer: NodeData[][] = LAYER_SIZES.map((_, l) =>
      nodes.filter((n) => n.layer === l)
    );

    byLayer.forEach((layerNodes, li) => {
      if (li >= byLayer.length - 1) return;
      const nextLayer = byLayer[li + 1];
      layerNodes.forEach((a) => {
        nextLayer.forEach((b) => {
          lines.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
        });
      });
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lines), 3)
    );
    return { geom: g };
  }, [nodes]);

  const ref = useRef<THREE.LineSegments>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.2} />
    </lineSegments>
  );
}

function ActivationPulse({ nodes }: { nodes: NodeData[] }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const layerIdx = useRef(0);
  const lastSwitch = useRef(0);

  const layerCenters = useMemo(() => {
    return LAYER_SIZES.map((_, l) => {
      const layerNodes = nodes.filter((n) => n.layer === l);
      const center = new THREE.Vector3();
      layerNodes.forEach((n) => center.add(n.pos));
      center.divideScalar(layerNodes.length);
      return center;
    });
  }, [nodes]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = state.clock.elapsedTime;
    if (t - lastSwitch.current > 0.5) {
      layerIdx.current = (layerIdx.current + 1) % LAYER_SIZES.length;
      lastSwitch.current = t;
    }
    const center = layerCenters[layerIdx.current];
    pulseRef.current.position.copy(center);
    const scale = 2 + Math.sin((t - lastSwitch.current) * Math.PI * 2) * 1.5;
    pulseRef.current.scale.setScalar(Math.max(0.1, scale));
    const mat = pulseRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.max(0, 0.3 - (t - lastSwitch.current) * 0.5);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={1}
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

const NODE_LABELS = ["DATA", "PROCESS", "LEARNING", "MEMORY", "PREDICT", "DECISION"];

export default function AIFloor({
  position,
}: {
  position: [number, number, number];
}) {
  const nodes: NodeData[] = useMemo(() => {
    const result: NodeData[] = [];
    const totalWidth = (LAYER_SIZES.length - 1) * LAYER_SPACING;

    LAYER_SIZES.forEach((count, li) => {
      const x = li * LAYER_SPACING - totalWidth / 2;
      Array.from({ length: count }, (_, ni) => {
        const y = (ni - (count - 1) / 2) * 2.2 + 8;
        result.push({
          pos: new THREE.Vector3(x, y, 0),
          layer: li,
          idx: ni,
        });
      });
    });

    return result;
  }, []);

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial
          color="#050810"
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      <gridHelper
        args={[80, 40, "#1a1500", "#0a0800"]}
        position={[0, 0, 0]}
      />

      {/* Neural network */}
      <NeuralEdges nodes={nodes} />
      {nodes.map((n, i) => (
        <NeuralNode key={i} node={n} activationOffset={i * 0.4} />
      ))}
      <ActivationPulse nodes={nodes} />

      {/* Layer labels */}
      {LAYER_SIZES.map((_, li) => {
        const x = li * LAYER_SPACING - ((LAYER_SIZES.length - 1) * LAYER_SPACING) / 2;
        return (
          <Text
            key={li}
            position={[x, 16.5, 0]}
            fontSize={0.55}
            color="#ffd700"
            anchorX="center"
            letterSpacing={0.12}
          >
            {NODE_LABELS[li]}
          </Text>
        );
      })}

      {/* Title */}
      <Text
        position={[0, 20, 0]}
        fontSize={1.8}
        color="#ffd700"
        anchorX="center"
        letterSpacing={0.3}
      >
        AI SYSTEMS
      </Text>
      <Text
        position={[0, 17.8, 0]}
        fontSize={0.6}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.1}
      >
        AUTOMATION · WORKFLOWS · INTELLIGENCE
      </Text>

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Lighting */}
      <ambientLight color="#1a1400" intensity={0.5} />
      <pointLight
        position={[0, 20, 5]}
        color="#ffd700"
        intensity={45}
        distance={60}
        decay={2}
      />
      <pointLight
        position={[0, 8, 5]}
        color="#ffd700"
        intensity={18}
        distance={30}
        decay={2}
      />
      <pointLight
        position={[-14, 8, 0]}
        color="#00d4ff"
        intensity={8}
        distance={20}
        decay={2}
      />
    </group>
  );
}

function AmbientParticles() {
  const count = 800;
  const { geom, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      speeds[i] = 0.008 + Math.random() * 0.012;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, speeds };
  }, []);

  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      if (pos[i * 3 + 1] > 20) pos[i * 3 + 1] = 0;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.06}
        color="#ffd700"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}
