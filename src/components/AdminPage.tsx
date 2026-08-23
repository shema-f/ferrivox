import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../lib/supabase";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  confirmed: boolean;
}

// Simple admin password — change this to something secure
const ADMIN_PASSWORD = "ferrivox-admin-2024";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, confirmed: 0, thisWeek: 0 });

  const fetchSubscribers = async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError("Supabase not configured. Add your credentials to .env");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error: fetchError } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (fetchError) {
        setError(`Error: ${fetchError.message}`);
      } else {
        setSubscribers(data || []);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setStats({
          total: data?.length || 0,
          confirmed: data?.filter((s) => s.confirmed).length || 0,
          thisWeek: data?.filter((s) => new Date(s.subscribed_at) > weekAgo).length || 0,
        });
      }
    } catch {
      setError("Failed to fetch subscribers");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchSubscribers();
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleDelete = async (id: string) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.from("subscribers").delete().eq("id", id);
      if (!error) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch {
      setError("Failed to delete subscriber");
    }
  };

  const exportCSV = () => {
    const csv = ["Email,Subscribed At,Confirmed"]
      .concat(
        subscribers.map(
          (s) => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.confirmed}`
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ferrivox-subscribers.csv";
    a.click();
  };

  // ── Login Screen ──
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
            <h1 className="text-xl font-bold text-white mb-1">Ferrivox Admin</h1>
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
    );
  }

  // ── Admin Dashboard ──
  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ background: "#050810", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriber Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage newsletter subscribers and view analytics
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{ color: "#94a3b8", border: "1px solid rgba(100,116,139,0.3)" }}
          >
            Export CSV
          </button>
          <button
            onClick={fetchSubscribers}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{ color: "#fff", background: "#3b82f6" }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Subscribers", value: stats.total, color: "#3b82f6" },
          { label: "Confirmed", value: stats.confirmed, color: "#34d399" },
          { label: "This Week", value: stats.thisWeek, color: "#a78bfa" },
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

      {/* Subscribers Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(10, 14, 23, 0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white">All Subscribers</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Loading...</div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-400">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No subscribers yet. Configure Supabase to start collecting signups.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
                        onClick={() => handleDelete(sub.id)}
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
    </div>
  );
}
