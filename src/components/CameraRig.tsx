import { useEffect, useRef } from "react"

import { useThree, useFrame } from "@react-three/fiber"

import * as THREE from "three"

import gsap from "gsap"

import { SCENE_CAMERAS, SCENE_TRANSITION_MS, type SceneId } from "../types"

interface CameraRigProps {
  sceneId: SceneId
}

export default function CameraRig({ sceneId }: CameraRigProps) {
  const { camera } = useThree()

  const lookTarget = useRef(new THREE.Vector3(0, 6, 0))

  const lookSmooth = useRef(new THREE.Vector3(0, 6, 0))

  useEffect(() => {
    const cam = SCENE_CAMERAS[sceneId]

    gsap.killTweensOf(camera.position)

    gsap.killTweensOf(lookTarget.current)

    const duration = SCENE_TRANSITION_MS / 1000

    gsap.to(camera.position, {
      x: cam.position[0],

      y: cam.position[1],

      z: cam.position[2],

      duration,

      ease: "power3.inOut",
    })

    gsap.to(lookTarget.current, {
      x: cam.target[0],

      y: cam.target[1],

      z: cam.target[2],

      duration,

      ease: "power3.inOut",
    })
  }, [sceneId, camera])

  useFrame(({ mouse }) => {
    // Smooth mouse parallax for look direction

    lookSmooth.current.lerp(lookTarget.current, 0.06)

    camera.lookAt(
      lookSmooth.current.x + mouse.x * 2.0,

      lookSmooth.current.y + mouse.y * 1.2,

      lookSmooth.current.z,
    )
  })

  return null
}
