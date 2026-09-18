import { useEffect, useState } from "react"

import { SCENE_LABELS, SCENE_ORDER, SCENE_TRANSITION_MS, type SceneId } from "../types"

interface SceneTransitionBarProps {
  sceneId: SceneId
}

/**
 * Thin progress bar docked under the header. Animates 0 → 100% over
 * SCENE_TRANSITION_MS whenever the scene changes, synced to the camera
 * tween in CameraRig. Includes a mono label showing the destination.
 */
export default function SceneTransitionBar({ sceneId }: SceneTransitionBarProps) {
  const [progress, setProgress] = useState(100)
  const [label, setLabel] = useState<SceneId | null>(null)

  useEffect(() => {
    setLabel(sceneId)
    setProgress(0)

    const start = performance.now()

    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start

      if (elapsed >= SCENE_TRANSITION_MS) {
        setProgress(100)

        return
      }

      setProgress(Math.min(100, (elapsed / SCENE_TRANSITION_MS) * 100))

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [sceneId])

  const transitioning = progress < 100

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[60]">
      {/* Progress track — sits flush against the bottom edge of the header */}
      <div
        style={{
          height: "2px",
          width: "100%",
          background: "rgba(59, 130, 246, 0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, rgba(59,130,246,0.35), #3b82f6, #00ffcc)",
            boxShadow: transitioning
              ? "0 0 12px rgba(59, 130, 246, 0.7), 0 0 24px rgba(59, 130, 246, 0.3)"
              : "none",
            opacity: transitioning ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      </div>

      {/* Destination label */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          opacity: transitioning ? 1 : 0,
          transform: transitioning ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div
          className="font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#93c5fd",
            background: "rgba(10, 14, 23, 0.85)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#3b82f6",
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.8)",
              animation: "blink 1s step-end infinite",
            }}
          />
          <span>
            {label ? SCENE_LABELS[label] : ""} — {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  )
}
