import { useRef, useMemo } from "react"

import { useFrame } from "@react-three/fiber"

import { Text } from "@react-three/drei"

import * as THREE from "three"

function TerminalConsole() {
  const screenRef = useRef<THREE.Mesh>(null)

  const scanRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!screenRef.current) return

    const mat = screenRef.current.material as THREE.MeshStandardMaterial

    mat.emissiveIntensity =
      0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04

    if (scanRef.current) {
      // Scanline sweep

      const y = Math.sin(state.clock.elapsedTime * 0.8) * 4.5

      scanRef.current.position.y = y

      const sm = scanRef.current.material as THREE.MeshStandardMaterial

      sm.opacity =
        0.15 + Math.abs(Math.sin(state.clock.elapsedTime * 0.8)) * 0.1
    }
  })

  return (
    <group position={[0, 4, 0]}>
      {/* Console base */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[14, 1.5, 6]} />
        <meshStandardMaterial
          color="#040a14"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Main screen frame */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[14, 10, 0.3]} />
        <meshStandardMaterial color="#030810" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen border glow */}
      {[
        [0, 7.1, 0, 14.3, 0.12, 0.35],

        [0, -2.1, 0, 14.3, 0.12, 0.35],

        [-7.1, 2.5, 0, 0.12, 9.3, 0.35],

        [7.1, 2.5, 0, 0.12, 9.3, 0.35],
      ].map(([px, py, pz, sx, sy, sz], i) => (
        <mesh key={i} position={[px, py, pz]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}

      {/* Screen surface */}
      <mesh ref={screenRef} position={[0, 2.5, 0.17]}>
        <planeGeometry args={[13.5, 9.5]} />
        <meshStandardMaterial
          color="#001020"
          emissive="#00d4ff"
          emissiveIntensity={0.12}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Scanline */}
      <mesh ref={scanRef} position={[0, 0, 0.18]}>
        <planeGeometry args={[13.5, 0.15]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Screen text content */}
      <Text
        position={[0, 5.8, 0.25]}
        fontSize={0.55}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.2}
      >
        FERRIVOX COMMAND CENTER
      </Text>

      <Text
        position={[0, 4.6, 0.25]}
        fontSize={1.1}
        color="#00d4ff"
        anchorX="center"
        letterSpacing={0.3}
      >
        START A PROJECT
      </Text>

      <Text
        position={[0, 3.4, 0.25]}
        fontSize={0.45}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.1}
      >
        WHAT ARE YOU BUILDING?
      </Text>

      {/* Divider */}
      <mesh position={[0, 2.8, 0.25]}>
        <planeGeometry args={[10, 0.04]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Category options */}
      {[
        { label: "SOFTWARE", x: -4.5 },

        { label: "AI / ML", x: -1.5 },

        { label: "DATA", x: 1.5 },

        { label: "SECURITY", x: 4.5 },
      ].map((opt) => (
        <group key={opt.label} position={[opt.x, 1.8, 0.25]}>
          <mesh>
            <planeGeometry args={[2.4, 0.6]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.08}
              transparent
              opacity={0.15}
            />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.28}
            color="#00d4ff"
            anchorX="center"
            letterSpacing={0.1}
          >
            {opt.label}
          </Text>
        </group>
      ))}

      {/* Footer prompt */}
      <Text
        position={[0, 0.6, 0.25]}
        fontSize={0.35}
        color="#7a8fa6"
        anchorX="center"
        letterSpacing={0.08}
      >
        USE THE INTERFACE ABOVE TO SEND US A MESSAGE
      </Text>

      {/* Corner decorations */}
      <CornerBrackets />

      {/* Side panels */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 8.5, 2.5, 0]}>
          <mesh>
            <boxGeometry args={[2.5, 9, 0.2]} />
            <meshStandardMaterial
              color="#030810"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[0, -3.5 + i * 1.0, 0.12]}>
              <boxGeometry args={[1.8, 0.08, 0.01]} />
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={0.4}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function CornerBrackets() {
  const corners: [number, number, number, number][] = [
    [-6.5, 7, 0.2, Math.PI * 0],

    [6.5, 7, 0.2, Math.PI * 0.5],

    [6.5, -2, 0.2, Math.PI],

    [-6.5, -2, 0.2, Math.PI * 1.5],
  ]

  return (
    <>
      {corners.map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, 0, rot]}>
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[1, 0.1, 0.05]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.1, 1, 0.05]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

function CircuitFloor() {
  const lines = useMemo(() => {
    const segs: Array<[number, number, number, number]> = [
      [-20, -4, 20, -4],
      [-20, -8, 20, -8],
      [-20, -12, 20, -12],

      [-18, -4, -18, -15],
      [-10, -4, -10, -15],
      [0, -4, 0, -15],

      [10, -4, 10, -15],
      [18, -4, 18, -15],

      [-20, 4, -20, -4],
      [20, 4, 20, -4],
    ]

    return segs
  }, [])

  return (
    <>
      {lines.map(([x1, z1, x2, z2], i) => {
        const cx = (x1 + x2) / 2

        const cz = (z1 + z2) / 2

        const w = Math.abs(x2 - x1) || 0.06

        const d = Math.abs(z2 - z1) || 0.06

        return (
          <mesh
            key={i}
            position={[cx, 0.02, cz]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[w, d]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.25}
            />
          </mesh>
        )
      })}
    </>
  )
}

export default function CommandCenter({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#020508" metalness={0.7} roughness={0.4} />
      </mesh>
      <gridHelper args={[80, 40, "#001a2e", "#000d18"]} position={[0, 0, 0]} />
      <CircuitFloor />
      <TerminalConsole />

      {/* Lighting */}
      <ambientLight color="#000a14" intensity={0.4} />
      <pointLight
        position={[0, 15, 5]}
        color="#00d4ff"
        intensity={50}
        distance={60}
        decay={2}
      />
      <pointLight
        position={[0, 5, 0]}
        color="#00d4ff"
        intensity={20}
        distance={25}
        decay={2}
      />
      <spotLight
        position={[0, 40, 20]}
        color="#00d4ff"
        intensity={300}
        distance={80}
        angle={0.35}
        penumbra={0.6}
        decay={2}
      />
    </group>
  )
}
