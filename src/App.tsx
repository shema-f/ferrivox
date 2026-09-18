import { lazy, Suspense, useState, useEffect } from "react"

import UIOverlay from "./components/UIOverlay"

import AdminPage from "./components/AdminPage"

import { SCENE_ORDER, type SceneId } from "./types"

/** Read the initial scene from ?scene=<id> (deep-link / shareable URLs). */
function initialScene(): SceneId {
  const param = new URLSearchParams(window.location.search).get("scene")

  return SCENE_ORDER.includes(param as SceneId) ? (param as SceneId) : "hq"
}

// The 3D layer (three.js + R3F + drei + postprocessing + gsap) is the
// heaviest part of the app by far. Loading it lazily keeps the initial
// bundle small so the UI shell paints immediately while the scene loads.
const Scene3D = lazy(() => import("./components/Scene3D"))

/** Minimal loader shown while the 3D chunk is being fetched. */
function SceneLoader() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "#050810",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "2px solid rgba(59, 130, 246, 0.2)",
          borderTopColor: "#3b82f6",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <span
        className="font-mono"
        style={{
          color: "rgba(148, 163, 184, 0.6)",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        Initializing HQ
      </span>
    </div>
  )
}

export default function App() {
  const [sceneId, setSceneId] = useState<SceneId>(initialScene)

  // Check if we're on the admin page
  const isAdmin =
    window.location.hash === "#/admin" || window.location.pathname === "/admin"

  useEffect(() => {
    const handleHashChange = () => {
      // Force re-render when hash changes
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Admin page — no 3D scene
  if (isAdmin) {
    return <AdminPage />
  }

  // Normal site
  return (
    <div
      style={{
        position: "relative",

        width: "100%",

        height: "100%",

        background: "#050810",

        overflow: "hidden",
      }}
    >
      <Suspense fallback={<SceneLoader />}>
        <Scene3D sceneId={sceneId} />
      </Suspense>
      <UIOverlay sceneId={sceneId} onNavigate={setSceneId} />
    </div>
  )
}
