import { useState, useEffect } from "react"

import { supabase, isSupabaseConfigured } from "../lib/supabase"

interface Subscriber {
  id: string

  email: string

  subscribed_at: string

  confirmed: boolean
}

interface ContactSubmission {
  id: string

  type: string

  company: string

  email: string

  message: string

  budget: string | null

  timeline: string | null

  submitted_at: string
}

interface ChatLog {
  id: string

  session_id: string

  role: string

  message: string

  confidence: string | null

  topic: string | null

  lead_data: Record<string, string> | null

  created_at: string
}

// Simple admin password — change this to something secure

const ADMIN_PASSWORD = "ferrivox-admin-2024"

type Tab = "subscribers" | "contacts" | "chats"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)

  const [password, setPassword] = useState("")

  const [activeTab, setActiveTab] = useState<Tab>("contacts")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  const [contacts, setContacts] = useState<ContactSubmission[]>([])

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([])

  const [stats, setStats] = useState({
    subscribers: 0,

    contacts: 0,

    chatSessions: 0,

    leads: 0,
  })

  const fetchAll = async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase not configured. Add your credentials to .env")

      return
    }

    setLoading(true)

    setError("")

    try {
      const [subRes, contactRes, chatRes] = await Promise.all([
        supabase
          .from("subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false }),

        supabase
          .from("contact_submissions")
          .select("*")
          .order("submitted_at", { ascending: false }),

        supabase
          .from("chat_logs")
          .select("*")
          .order("created_at", { ascending: false }),
      ])

      if (subRes.error) setError(`Subscribers: ${subRes.error.message}`)
      else setSubscribers(subRes.data || [])

      if (contactRes.error)
        setError((e) => e + ` Contacts: ${contactRes.error!.message}`)
      else setContacts(contactRes.data || [])

      if (chatRes.error)
        setError((e) => e + ` Chats: ${chatRes.error!.message}`)
      else setChatLogs(chatRes.data || [])

      // Compute stats

      const subs = subRes.data || []

      const cts = contactRes.data || []

      const chats = chatRes.data || []

      const uniqueSessions = new Set(chats.map((c) => c.session_id))

      const leads = chats.filter((c) => c.topic === "lead_qualification")

      setStats({
        subscribers: subs.length,

        contacts: cts.length,

        chatSessions: uniqueSessions.size,

        leads: leads.length,
      })
    } catch {
      setError("Failed to fetch data from Supabase")
    }

    setLoading(false)
  }

  useEffect(() => {
    if (authenticated) fetchAll()
  }, [authenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)

      setError("")
    } else {
      setError("Invalid password")
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!isSupabaseConfigured()) return

    const { error } = await supabase.from("subscribers").delete().eq("id", id)

    if (!error) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id))

      setStats((prev) => ({ ...prev, subscribers: prev.subscribers - 1 }))
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!isSupabaseConfigured()) return

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id)

    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== id))

      setStats((prev) => ({ ...prev, contacts: prev.contacts - 1 }))
    }
  }

  // Group chat logs by session

  const groupedChats = chatLogs.reduce<Record<string, ChatLog[]>>(
    (acc, log) => {
      if (!acc[log.session_id]) acc[log.session_id] = []

      acc[log.session_id].push(log)

      return acc
    },
    {},
  )

  // Login Screen

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050810", fontFamily: "Inter, sans-serif" }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 rounded-xl"
          style={{
            background: "rgba(10, 14, 23, 0.9)",

            border: "1px solid rgba(59, 130, 246, 0.2)",

            backdropFilter: "blur(20px)",
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white mb-1">
              Ferrivox Admin
            </h1>
            <p className="text-xs text-slate-500">Enter password to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 text-sm rounded-lg outline-none mb-4"
            style={{
              color: "#e2e8f0",

              background: "rgba(59, 130, 246, 0.05)",

              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          />
          {error && <div className="text-xs text-red-400 mb-3">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 text-sm font-semibold rounded-lg"
            style={{ color: "#fff", background: "#3b82f6" }}
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }

  // Admin Dashboard

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ background: "#050810", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Ferrivox Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Contact submissions, AI chat logs, and subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAll}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{ color: "#fff", background: "#3b82f6" }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Contact Submissions",
            value: stats.contacts,
            color: "#3b82f6",
          },

          { label: "AI Leads", value: stats.leads, color: "#a78bfa" },

          {
            label: "Chat Sessions",
            value: stats.chatSessions,
            color: "#34d399",
          },

          {
            label: "Newsletter Subs",
            value: stats.subscribers,
            color: "#fbbf24",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{
              background: "rgba(10, 14, 23, 0.8)",

              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              {stat.label}
            </div>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-lg"
        style={{
          background: "rgba(10, 14, 23, 0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { id: "contacts" as Tab, label: "Contact Submissions", icon: "📩" },

          { id: "chats" as Tab, label: "AI Chat Logs", icon: "🤖" },

          {
            id: "subscribers" as Tab,
            label: "Newsletter Subscribers",
            icon: "📧",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all"
            style={{
              color: activeTab === tab.id ? "#fff" : "#64748b",

              background:
                activeTab === tab.id
                  ? "rgba(59, 130, 246, 0.2)"
                  : "transparent",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 p-3 rounded-lg text-sm text-red-400"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <>
          {/* ── CONTACT SUBMISSIONS TAB ── */}
          {activeTab === "contacts" && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(10, 14, 23, 0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h2 className="text-sm font-semibold text-white">
                  People who want to get in touch for software building
                </h2>
              </div>
              {contacts.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No contact submissions yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Timeline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr
                          key={c.id}
                          className="transition-colors hover:bg-white/[0.02]"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <td className="px-6 py-4">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                color: "#60a5fa",
                                background: "rgba(59,130,246,0.1)",
                              }}
                            >
                              {c.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                            {c.company}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {c.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                            {c.message || "—"}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {c.budget || "—"}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {c.timeline || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(c.submitted_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteContact(c.id)}
                              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── AI CHAT LOGS TAB ── */}
          {activeTab === "chats" && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(10, 14, 23, 0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h2 className="text-sm font-semibold text-white">
                  All AI conversations (FERRI chatbot)
                </h2>
              </div>
              {Object.keys(groupedChats).length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No chat logs yet.
                </div>
              ) : (
                <div className="p-6 flex flex-col gap-6">
                  {Object.entries(groupedChats).map(([sessionId, logs]) => {
                    const leadLog = logs.find((l) => l.lead_data)

                    const firstMsg = logs[0]

                    return (
                      <div
                        key={sessionId}
                        className="rounded-lg p-4"
                        style={{
                          border: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                color: leadLog ? "#a78bfa" : "#94a3b8",
                                background: leadLog
                                  ? "rgba(167,139,250,0.1)"
                                  : "rgba(100,116,139,0.1)",
                              }}
                            >
                              {leadLog ? "🔶 LEAD" : "💬 Chat"}
                            </span>
                            <span className="text-xs text-slate-500">
                              Session: {sessionId.slice(0, 8)}...
                            </span>
                          </div>
                          <span className="text-xs text-slate-600">
                            {new Date(firstMsg.created_at).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        {/* Lead data */}
                        {leadLog && leadLog.lead_data && (
                          <div
                            className="mb-3 p-3 rounded-lg"
                            style={{
                              background: "rgba(167,139,250,0.06)",
                              border: "1px solid rgba(167,139,250,0.15)",
                            }}
                          >
                            <div className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wider">
                              Lead Qualification
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(leadLog.lead_data).map(
                                ([key, val]) =>
                                  val ? (
                                    <div key={key} className="text-xs">
                                      <span className="text-slate-500 capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}:{" "}
                                      </span>
                                      <span className="text-slate-300">
                                        {String(val)}
                                      </span>
                                    </div>
                                  ) : null,
                              )}
                            </div>
                          </div>
                        )}

                        {/* Messages */}
                        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className={`flex ${
                                log.role === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className="max-w-[80%] px-3 py-1.5 rounded-lg text-xs"
                                style={{
                                  background:
                                    log.role === "user"
                                      ? "rgba(59,130,246,0.2)"
                                      : "rgba(255,255,255,0.04)",

                                  color:
                                    log.role === "user" ? "#93c5fd" : "#94a3b8",
                                }}
                              >
                                <span className="font-semibold">
                                  {log.role === "user" ? "User" : "FERI"}:
                                </span>{" "}
                                {log.message.length > 200
                                  ? log.message.slice(0, 200) + "..."
                                  : log.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── SUBSCRIBERS TAB ── */}
          {activeTab === "subscribers" && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(10, 14, 23, 0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h2 className="text-sm font-semibold text-white">
                  Newsletter Subscribers
                </h2>
                <button
                  onClick={() => {
                    const csv = ["Email,Subscribed At,Confirmed"]

                      .concat(
                        subscribers.map(
                          (s) =>
                            `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.confirmed}`,
                        ),
                      )

                      .join("\n")

                    const blob = new Blob([csv], { type: "text/csv" })

                    const url = URL.createObjectURL(blob)

                    const a = document.createElement("a")

                    a.href = url

                    a.download = "ferrivox-subscribers.csv"

                    a.click()
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg"
                  style={{
                    color: "#94a3b8",
                    border: "1px solid rgba(100,116,139,0.3)",
                  }}
                >
                  Export CSV
                </button>
              </div>
              {subscribers.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No subscribers yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Subscribed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr
                          key={sub.id}
                          className="transition-colors hover:bg-white/[0.02]"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {sub.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(sub.subscribed_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                color: sub.confirmed ? "#34d399" : "#fbbf24",

                                background: sub.confirmed
                                  ? "rgba(52, 211, 153, 0.1)"
                                  : "rgba(251, 191, 36, 0.1)",
                              }}
                            >
                              {sub.confirmed ? "Confirmed" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
