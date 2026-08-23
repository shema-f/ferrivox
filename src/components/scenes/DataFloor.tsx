import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "../../utils/random";

function DataParticleStream() {
  const count = 2200;
  const { geom, speeds, offsets } = useMemo(() => {
    const rng = seededRandom(8888);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 60 - 8;
      positions[i * 3 + 1] = rng() * 16 + 0.5;
      positions[i * 3 + 2] = (rng() - 0.5) * 22;
      speeds[i] = 0.06 + rng() * 0.1;
      offsets[i] = rng() * 60;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, speeds, offsets };
  }, []);

  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += speeds[i];
      if (pos[i * 3] > 30) pos[i * 3] = -30 - offsets[i] * 0.1;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.1}
        color="#00ffcc"
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

function ProcessingMachine({ x }: { x: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.02;
      ringRef.current.rotation.x += 0.01;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 3 + x) * 0.4;
    }
  });

  return (
    <group position={[x, 5, 0]}>
      {/* Core cylinder */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 10, 12]} />
        <meshStandardMaterial
          color="#060f1e"
          metalness={0.9}
          roughness={0.1}
          emissive="#001a2e"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Spinning ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.12, 8, 32]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Beam */}
      <mesh ref={beamRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 10, 6]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Glow rings */}
      {[-4, -2, 0, 2, 4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.18, 1.4, 32]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrganizedDataCubes() {
  return (
    <group position={[18, 1, 0]}>
      {Array.from({ length: 4 }, (_, col) =>
        Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 4 }, (_, layer) => (
            <mesh
              key={`${col}-${row}-${layer}`}
              position={[col * 2.2 - 3, row * 2.2, layer * 2.2 - 3]}
            >
              <boxGeometry args={[1.6, 1.6, 1.6]} />
              <meshStandardMaterial
                color="#001a30"
                metalness={0.9}
                roughness={0.1}
                emissive="#00ffcc"
                emissiveIntensity={0.25 + (col + row + layer) * 0.04}
              />
            </mesh>
          ))
        )
      )}
    </group>
  );
}


export default function DataFloor({
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
          color="#030810"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      <gridHelper args={[80, 40, "#00ffcc", "#001a15"]} position={[0, 0, 0]} />

      {/* Content */}
      <DataParticleStream />
      <ProcessingMachine x={-6} />
      <ProcessingMachine x={6} />
      <OrganizedDataCubes />

      {/* Text labels */}
      <Text
        position={[-22, 14, 0]}
        fontSize={1.4}
        color="#00ffcc"
        anchorX="center"
        letterSpacing={0.2}
      >
        RAW DATA
      </Text>
      <Text
        position={[0, 14, 0]}
        fontSize={1.4}
        color="#00ffcc"
        anchorX="center"
        letterSpacing={0.2}
      >
        ENGINEERING
      </Text>
      <Text
        position={[22, 14, 0]}
        fontSize={1.4}
        color="#00ffcc"
        anchorX="center"
        letterSpacing={0.2}
      >
        INTELLIGENCE
      </Text>

      {/* Arrow connectors */}
      <Text
        position={[-11, 14, 0]}
        fontSize={1.8}
        color="#7a8fa6"
        anchorX="center"
      >
        →
      </Text>
      <Text
        position={[11, 14, 0]}
        fontSize={1.8}
        color="#7a8fa6"
        anchorX="center"
      >
        →
      </Text>

      {/* Sub labels */}
      <Text
        position={[-22, 11.8, 0]}
        fontSize={0.55}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.1}
      >
        COLLECTION · ANNOTATION
      </Text>
      <Text
        position={[0, 11.8, 0]}
        fontSize={0.55}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.1}
      >
        CLEANING · STRUCTURING
      </Text>
      <Text
        position={[22, 11.8, 0]}
        fontSize={0.55}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.1}
      >
        MODELS · INSIGHTS · APIs
      </Text>

      {/* Lighting */}
      <ambientLight color="#001a15" intensity={0.5} />
      <pointLight
        position={[0, 15, 5]}
        color="#00ffcc"
        intensity={40}
        distance={60}
        decay={2}
      />
      <pointLight
        position={[-6, 8, 0]}
        color="#00ffcc"
        intensity={15}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[6, 8, 0]}
        color="#00ffcc"
        intensity={15}
        distance={20}
        decay={2}
      />
    </group>
  );
}
