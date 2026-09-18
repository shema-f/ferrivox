import { useRef, useMemo, useEffect } from "react"

import { useFrame } from "@react-three/fiber"

import { Text, Stars } from "@react-three/drei"

import * as THREE from "three"

import { seededRandom } from "../../utils/random"

function CityBackground() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const count = 260

  useEffect(() => {
    if (!meshRef.current) return

    const rng = seededRandom(54321)

    const dummy = new THREE.Object3D()

    let placed = 0

    while (placed < count) {
      const x = (rng() - 0.5) * 380

      const z = (rng() - 0.5) * 380

      if (Math.sqrt(x * x + z * z) < 38) continue

      const h = rng() * 32 + 2

      const w = rng() * 5 + 1.5

      const d = rng() * 5 + 1.5

      dummy.position.set(x, h / 2 - 0.1, z)

      dummy.scale.set(w, h, d)

      dummy.updateMatrix()

      meshRef.current.setMatrixAt(placed, dummy.matrix)

      placed++
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial
        color="#060c1a"
        metalness={0.85}
        roughness={0.25}
        emissive="#001020"
        emissiveIntensity={0.15}
      />
    </instancedMesh>
  )
}

function CityWindowLights() {
  const count = 400

  const geom = useMemo(() => {
    const rng = seededRandom(77777)

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let x: number, z: number

      do {
        x = (rng() - 0.5) * 360

        z = (rng() - 0.5) * 360
      } while (Math.sqrt(x * x + z * z) < 40)

      positions[i * 3] = x

      positions[i * 3 + 1] = rng() * 30 + 1

      positions[i * 3 + 2] = z
    }

    const g = new THREE.BufferGeometry()

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    return g
  }, [])

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.18}
        color="#00d4ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

function CityParticles() {
  const count = 5000

  const { geom, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)

    const speeds = new Float32Array(count)

    const rng = seededRandom(11111)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 350

      positions[i * 3 + 1] = rng() * 70

      positions[i * 3 + 2] = (rng() - 0.5) * 350

      speeds[i] = 0.015 + rng() * 0.04
    }

    const g = new THREE.BufferGeometry()

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    return { geom: g, speeds }
  }, [])

  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i]

      if (pos[i * 3 + 1] > 70) pos[i * 3 + 1] = 0
    }

    geom.attributes.position.needsUpdate = true
  })

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  )
}

function WindowPanel({
  x,

  y,

  intensity,

  speed,

  idx,
}: {
  x: number

  y: number

  intensity: number

  speed: number

  idx: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return

    const t = state.clock.elapsedTime

    const mat = ref.current.material as THREE.MeshStandardMaterial

    const flicker = Math.sin(t * speed + idx * 2.3)

    mat.emissiveIntensity = flicker > 0.85 ? intensity * 0.2 : intensity
  })

  return (
    <mesh ref={ref} position={[x, y, 0]}>
      <planeGeometry args={[1.3, 0.85]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={intensity}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function HQBuilding() {
  const windows = useMemo(() => {
    const rng = seededRandom(33333)

    const wins: Array<{
      x: number

      y: number

      intensity: number

      speed: number
    }> = []

    for (let floor = 0; floor < 20; floor++) {
      for (let col = 0; col < 3; col++) {
        if (rng() > 0.28) {
          wins.push({
            x: (col - 1) * 2.1,

            y: 5.5 + floor * 1.95,

            intensity: 0.45 + rng() * 0.75,

            speed: 0.4 + rng() * 2.5,
          })
        }
      }
    }

    return wins
  }, [])

  return (
    <group>
      {/* Approach ring lights on ground */}
      {[10, 18, 28].map((r, i) => (
        <mesh key={i} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.15, r, 80]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.6 - i * 0.15}
            transparent
            opacity={0.55 - i * 0.12}
          />
        </mesh>
      ))}

      {/* Base podium */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[22, 2.4, 16]} />
        <meshStandardMaterial
          color="#050c1c"
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      {/* Podium glow top */}
      <mesh position={[0, 2.42, 0]}>
        <boxGeometry args={[22.2, 0.1, 16.2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-9, 6.5, 0]}>
        <boxGeometry args={[8, 11, 12]} />
        <meshStandardMaterial
          color="#050c1c"
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[-9, 12.1, 0]}>
        <boxGeometry args={[8.2, 0.1, 12.2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[9, 6.5, 0]}>
        <boxGeometry args={[8, 11, 12]} />
        <meshStandardMaterial
          color="#050c1c"
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[9, 12.1, 0]}>
        <boxGeometry args={[8.2, 0.1, 12.2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Main tower */}
      <mesh position={[0, 23, 0]}>
        <boxGeometry args={[9, 42, 8]} />
        <meshStandardMaterial
          color="#050c1c"
          metalness={0.96}
          roughness={0.04}
        />
      </mesh>

      {/* Tower vertical glowing edges */}
      {([
        [-4.55, -4.05],

        [-4.55, 4.05],

        [4.55, -4.05],

        [4.55, 4.05],
      ] as [number, number][])

        .map(([x, z], i) => (
          <mesh key={i} position={[x, 23, z]}>
            <boxGeometry args={[0.14, 42, 0.14]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={3.5}
            />
          </mesh>
        ))}

      {/* Tower horizontal bands */}
      {[8, 16, 26, 36, 42].map((y, i) => (
        <mesh key={i} position={[0, y + 2, 0]}>
          <boxGeometry args={[9.2, 0.14, 8.2]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}

      {/* Windows — front face */}
      <group position={[0, 0, 4.07]}>
        {windows.map((w, i) => (
          <WindowPanel
            key={i}
            x={w.x}
            y={w.y}
            intensity={w.intensity}
            speed={w.speed}
            idx={i}
          />
        ))}
      </group>

      {/* Upper spire */}
      <mesh position={[0, 46, 0]}>
        <boxGeometry args={[5, 8, 5]} />
        <meshStandardMaterial
          color="#050c1c"
          metalness={0.96}
          roughness={0.04}
        />
      </mesh>
      <mesh position={[0, 50.1, 0]}>
        <boxGeometry args={[5.2, 0.14, 5.2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 56, 0]}>
        <cylinderGeometry args={[0.06, 0.25, 10, 8]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Beacon */}
      <BeaconLight />

      {/* Logo text */}
      <Text
        position={[0, 36, 4.2]}
        fontSize={1.8}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.4}
        font="/fonts/HYWenHei.woff2"
      >
        FERRIVOX
      </Text>

      {/* Tagline below logo */}
      <Text
        position={[0, 33.5, 4.2]}
        fontSize={0.55}
        color="#7a8fa6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        IRON WILL, INFINITE DREAMS
      </Text>
    </group>
  )
}

function BeaconLight() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return

    const mat = ref.current.material as THREE.MeshStandardMaterial

    mat.emissiveIntensity =
      Math.max(0, Math.sin(state.clock.elapsedTime * 2.5)) * 5
  })

  return (
    <mesh ref={ref} position={[0, 62, 0]}>
      <sphereGeometry args={[0.35, 8, 8]} />
      <meshStandardMaterial
        color="#ff3366"
        emissive="#ff3366"
        emissiveIntensity={3}
      />
    </mesh>
  )
}

export default function HQScene({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <Stars
        radius={300}
        depth={60}
        count={6000}
        factor={3}
        saturation={0.3}
        fade
      />
      <CityBackground />
      <CityWindowLights />
      <CityParticles />
      <HQBuilding />

      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#030608" metalness={0.5} roughness={0.7} />
      </mesh>

      {/* Grid */}
      <gridHelper
        args={[500, 100, "#001a2e", "#001220"]}
        position={[0, 0.01, 0]}
      />

      {/* Scene lighting */}
      <ambientLight color="#050e1a" intensity={0.4} />
      <pointLight
        position={[0, 3, 0]}
        color="#00d4ff"
        intensity={30}
        distance={50}
        decay={2}
      />
      <pointLight
        position={[-9, 13, 5]}
        color="#00d4ff"
        intensity={8}
        distance={25}
        decay={2}
      />
      <pointLight
        position={[9, 13, 5]}
        color="#00d4ff"
        intensity={8}
        distance={25}
        decay={2}
      />
      <spotLight
        position={[0, 80, 35]}
        color="#3066ff"
        intensity={400}
        distance={150}
        angle={0.28}
        penumbra={0.6}
        decay={1.5}
      />
      <pointLight
        position={[0, 55, 0]}
        color="#00d4ff"
        intensity={15}
        distance={40}
        decay={2}
      />
    </group>
  )
}
