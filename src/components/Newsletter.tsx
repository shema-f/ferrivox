import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setMessage("Backend not configured. Add Supabase credentials to .env");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email, subscribed_at: new Date().toISOString() }]);

      if (error) {
        if (error.code === "23505") {
          setStatus("success");
          setMessage("You are already subscribed!");
        } else {
          setStatus("error");
          setMessage("Something went wrong. Please try again.");
        }
      } else {
        setStatus("success");
        setMessage("Welcome aboard! Check your inbox for confirmation.");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        Subscribe to our newsletter
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 text-sm rounded-lg outline-none transition-all"
          style={{
            color: "#e2e8f0",
            background: "rgba(100, 116, 139, 0.1)",
            border: "1px solid rgba(100, 116, 139, 0.2)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(100, 116, 139, 0.2)";
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          style={{
            color: "#ffffff",
            background: status === "loading" ? "rgba(59, 130, 246, 0.5)" : "#3b82f6",
          }}
          onMouseEnter={(e) => {
            if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#3b82f6";
          }}
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
      {!isSupabaseConfigured() && (
        <div className="text-xs text-amber-500/70">
          Backend not configured yet. See setup instructions below.
        </div>
      )}
    </div>
  );
}
