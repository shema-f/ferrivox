import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "../../utils/random";

const GLOBE_RADIUS = 13;

// Convert lat/lon to 3D point on sphere
function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Kigali: -1.94°N, 30.06°E — and some world cities
const CITIES = [
  { name: "KIGALI", lat: -1.94, lon: 30.06, color: "#00ffcc", size: 0.5, home: true },
  { name: "NAIROBI", lat: -1.28, lon: 36.82, color: "#00d4ff", size: 0.28 },
  { name: "LAGOS", lat: 6.52, lon: 3.38, color: "#00d4ff", size: 0.28 },
  { name: "LONDON", lat: 51.5, lon: -0.12, color: "#00d4ff", size: 0.28 },
  { name: "PARIS", lat: 48.85, lon: 2.35, color: "#00d4ff", size: 0.28 },
  { name: "NEW_YORK", lat: 40.71, lon: -74.0, color: "#00d4ff", size: 0.28 },
  { name: "DUBAI", lat: 25.2, lon: 55.27, color: "#00d4ff", size: 0.28 },
  { name: "SINGAPORE", lat: 1.35, lon: 103.82, color: "#00d4ff", size: 0.28 },
  { name: "TOKYO", lat: 35.69, lon: 139.69, color: "#00d4ff", size: 0.28 },
  { name: "SAO_PAULO", lat: -23.55, lon: -46.63, color: "#00d4ff", size: 0.28 },
  { name: "JOHANNESBURG", lat: -26.2, lon: 28.04, color: "#00d4ff", size: 0.28 },
  { name: "MUMBAI", lat: 19.08, lon: 72.88, color: "#00d4ff", size: 0.28 },
];

function GlobeSphere() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0018;
    }
  });

  // Lat/lon wireframe geometry
  const wireGeom = useMemo(() => {
    const lines: number[] = [];
    const R = GLOBE_RADIUS + 0.1;

    // Latitude parallels
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = R * Math.sin((lat * Math.PI) / 180);
      const r = R * Math.cos((lat * Math.PI) / 180);
      for (let lon = 0; lon < 360; lon += 3) {
        const a = (lon * Math.PI) / 180;
        const b = ((lon + 3) * Math.PI) / 180;
        lines.push(r * Math.cos(a), y, r * Math.sin(a));
        lines.push(r * Math.cos(b), y, r * Math.sin(b));
      }
    }

    // Longitude meridians
    for (let lon = 0; lon < 360; lon += 30) {
      const a = (lon * Math.PI) / 180;
      for (let lat = -88; lat < 90; lat += 3) {
        const la = (lat * Math.PI) / 180;
        const lb = ((lat + 3) * Math.PI) / 180;
        const r1 = R * Math.cos(la);
        const r2 = R * Math.cos(lb);
        lines.push(r1 * Math.cos(a), R * Math.sin(la), r1 * Math.sin(a));
        lines.push(r2 * Math.cos(a), R * Math.sin(lb), r2 * Math.sin(a));
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lines), 3)
    );
    return g;
  }, []);

  const cityData = useMemo(() =>
    CITIES.map((c) => ({
      ...c,
      pos: latLonToVec3(c.lat, c.lon, GLOBE_RADIUS),
    })), []);

  // Arcs from Kigali to other cities
  const arcGeom = useMemo(() => {
    const lines: number[] = [];
    const home = latLonToVec3(-1.94, 30.06, GLOBE_RADIUS);

    cityData.slice(1).forEach((city) => {
      const mid = home.clone().lerp(city.pos, 0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.35);
      // Quadratic bezier: 20 segments
      for (let t = 0; t < 1; t += 0.05) {
        const p1 = quadBezier(home, mid, city.pos, t);
        const p2 = quadBezier(home, mid, city.pos, t + 0.05);
        lines.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lines), 3)
    );
    return g;
  }, [cityData]);

  const arcRef = useRef<THREE.LineSegments>(null);
  useFrame((state) => {
    if (!arcRef.current) return;
    const mat = arcRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Globe core */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 24]} />
        <meshStandardMaterial
          color="#030d1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#001833"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Wire grid */}
      <lineSegments geometry={wireGeom}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </lineSegments>

      {/* Network arcs */}
      <lineSegments ref={arcRef} geometry={arcGeom}>
        <lineBasicMaterial color="#00ffcc" transparent opacity={0.5} />
      </lineSegments>

      {/* City dots */}
      {cityData.map((city, i) => (
        <CityDot key={i} pos={city.pos} color={city.color} size={city.size} name={city.name} home={!!city.home} />
      ))}
    </group>
  );
}

function quadBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const one_t = 1 - t;
  return new THREE.Vector3(
    one_t * one_t * p0.x + 2 * one_t * t * p1.x + t * t * p2.x,
    one_t * one_t * p0.y + 2 * one_t * t * p1.y + t * t * p2.y,
    one_t * one_t * p0.z + 2 * one_t * t * p1.z + t * t * p2.z
  );
}

function CityDot({
  pos,
  color,
  size,
  name,
  home,
}: {
  pos: THREE.Vector3;
  color: string;
  size: number;
  name: string;
  home?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = home
      ? 2 + Math.sin(state.clock.elapsedTime * 3) * 1
      : 0.8 + Math.sin(state.clock.elapsedTime * 1.5 + pos.x) * 0.4;

    if (home && ringRef.current) {
      const scale = 1 + ((state.clock.elapsedTime * 1.5) % 1) * 3;
      ringRef.current.scale.setScalar(scale);
      const rm = ringRef.current.material as THREE.MeshStandardMaterial;
      rm.opacity = Math.max(0, 0.6 - ((state.clock.elapsedTime * 1.5) % 1) * 0.6);
    }
  });

  return (
    <group position={pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      {home && (
        <mesh ref={ringRef}>
          <ringGeometry args={[size * 1.2, size * 1.8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function GlobalNetwork({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <GlobeSphere />

      {/* Title */}
      <Text
        position={[0, 20, 0]}
        fontSize={1.8}
        color="#00ffcc"
        anchorX="center"
        letterSpacing={0.3}
      >
        GLOBAL NETWORK
      </Text>
      <Text
        position={[0, 17.5, 0]}
        fontSize={0.7}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.12}
      >
        BUILT FROM AFRICA. ENGINEERED FOR THE WORLD.
      </Text>

      {/* Kigali label */}
      <Text
        position={[0, -17, 0]}
        fontSize={0.6}
        color="#00ffcc"
        anchorX="center"
        letterSpacing={0.2}
      >
        01.94°S, 30.06°E — KIGALI, RWANDA
      </Text>

      {/* Ambient particles */}
      <GlobalParticles />

      {/* Lighting */}
      <ambientLight color="#001a20" intensity={0.6} />
      <pointLight
        position={[0, 25, 20]}
        color="#00ffcc"
        intensity={60}
        distance={80}
        decay={2}
      />
      <pointLight
        position={[-20, 0, 0]}
        color="#00d4ff"
        intensity={20}
        distance={50}
        decay={2}
      />
      <pointLight
        position={[20, 0, 20]}
        color="#00d4ff"
        intensity={15}
        distance={40}
        decay={2}
      />
    </group>
  );
}

function GlobalParticles() {
  const count = 1500;
  const { geom, velocities } = useMemo(() => {
    const rng = seededRandom(99999);
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 18 + rng() * 20;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      velocities[i * 3] = (rng() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (rng() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (rng() - 0.5) * 0.02;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, velocities };
  }, []);

  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      const len = Math.sqrt(
        pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2
      );
      if (len > 40 || len < 17) {
        velocities[i * 3] *= -1;
        velocities[i * 3 + 1] *= -1;
        velocities[i * 3 + 2] *= -1;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.06}
        color="#00d4ff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}
