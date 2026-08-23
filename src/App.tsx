import { useState, useEffect } from "react";
import Scene3D from "./components/Scene3D";
import UIOverlay from "./components/UIOverlay";
import AdminPage from "./components/AdminPage";
import type { SceneId } from "./types";

export default function App() {
  const [sceneId, setSceneId] = useState<SceneId>("hq");

  // Check if we're on the admin page
  const isAdmin = window.location.hash === "#/admin" || window.location.pathname === "/admin";

  useEffect(() => {
    const handleHashChange = () => {
      // Force re-render when hash changes
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Admin page — no 3D scene
  if (isAdmin) {
    return <AdminPage />;
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
      <Scene3D sceneId={sceneId} />
      <UIOverlay sceneId={sceneId} onNavigate={setSceneId} />
    </div>
  );
}
