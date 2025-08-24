import { useEffect, useState } from "react";
import { getUsage } from "../lib/api";

/**
 * Usage page
 * - Displays counters from /usage/me for the current token (if provided)
 * - Input lets you pass the token just for this view
 */
export default function Usage() {
  const [token, setToken] = useState(localStorage.getItem("statathon_token") || "public:guest");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const u = await getUsage(token);
      setData(u);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm">Auth (role:user)</label>
        <input
          className="border rounded px-2 py-1 text-sm w-64"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="border rounded px-3 py-1.5 text-sm" onClick={load}>
          Refresh
        </button>
      </div>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      {data ? (
        <pre className="bg-gray-50 rounded p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div className="text-sm text-gray-500">No usage yet.</div>
      )}
    </div>
  );
}
