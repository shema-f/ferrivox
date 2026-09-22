import AdminPage from "./components/AdminPage"

import CorpSite from "./components/CorpSite"

/** Admin console stays reachable at #/admin (and /admin). */
function isAdminRoute() {
  return (
    window.location.hash.startsWith("#/admin") ||
    window.location.pathname === "/admin"
  )
}

export default function App() {
  if (isAdminRoute()) {
    return <AdminPage />
  }

  return <CorpSite />
}
