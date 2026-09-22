import { useEffect, useState } from "react"

import AdminPage from "./components/AdminPage"

import CorpSite from "./components/CorpSite"
import TeamPage from "./components/TeamPage"

/** Admin console stays reachable at #/admin (and /admin). */
function isAdminRoute() {
  return (
    window.location.hash.startsWith("#/admin") ||
    window.location.pathname === "/admin"
  )
}

function isTeamRoute() {
  return (
    window.location.hash.startsWith("#/team") ||
    window.location.pathname === "/team"
  )
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  // Re-render when the hash changes so #/team links work from anywhere.
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)

    window.addEventListener("hashchange", onHashChange)

    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  // Hash anchors (#divisions) are handled by the browser, not routing.
  void hash

  if (isAdminRoute()) {
    return <AdminPage />
  }

  if (isTeamRoute()) {
    return <TeamPage />
  }

  return <CorpSite />
}
