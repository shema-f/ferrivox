import { useEffect, useState } from "react"

import { supabase, isSupabaseConfigured } from "../lib/supabase"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")

  const [message, setMessage] = useState("")

  // Auto-clear success feedback so the footer row returns to normal height
  useEffect(() => {
    if (status !== "success") return

    const timer = setTimeout(() => {
      setStatus("idle")

      setMessage("")
    }, 4000)

    return () => clearTimeout(timer)
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")

      setMessage("Please enter a valid email.")

      return
    }

    if (!isSupabaseConfigured()) {
      setStatus("error")

      setMessage("Backend not configured. Add Supabase credentials to .env")

      return
    }

    setStatus("loading")

    try {
      const { error } = await supabase

        .from("subscribers")

        .insert([{ email, subscribed_at: new Date().toISOString() }])

      if (error) {
        if (error.code === "23505") {
          setStatus("success")

          setMessage("You are already subscribed!")
        } else {
          setStatus("error")

          setMessage("Something went wrong. Please try again.")
        }
      } else {
        setStatus("success")

        setMessage("Welcome aboard! Check your inbox for confirmation.")

        setEmail("")
      }
    } catch {
      setStatus("error")

      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 md:w-56 md:flex-none px-3 py-2 text-sm rounded-lg outline-none transition-all"
          style={{
            color: "#e2e8f0",

            background: "rgba(100, 116, 139, 0.1)",

            border: "1px solid rgba(100, 116, 139, 0.2)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(59, 130, 246, 0.5)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(100, 116, 139, 0.2)"
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
          style={status === "loading" ? { opacity: 0.6, cursor: "wait" } : undefined}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <div
          className="text-xs transition-all"
          style={{ color: status === "success" ? "#34d399" : "#f87171" }}
        >
          {message}
        </div>
      )}
    </div>
  )
}
