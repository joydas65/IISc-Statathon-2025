// src/pages/Playground.tsx
import { useCallback, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import SchemaSidebar from "../components/SchemaSidebar";
import SQLEditor from "../components/SQLEditor";
import ParamsPanel from "../components/ParamsPanel";
import ResultsGrid from "../components/ResultsGrid";
import JsonView from "../components/JsonView";
import ExampleQueries from "../components/ExampleQueries";
import SuppressionBadge from "../components/SuppressionBadge";
import { postQuery } from "../lib/api";
import type { QueryResponse } from "../lib/types";

/**
 * Playground
 * - Left: survey picker, example queries (click = insert + run), params, server limit
 * - Right: Monaco SQL editor (Ctrl/Cmd+Enter runs) and results (table + JSON)
 * - Header: auth dropdown + Run button
 */
export default function Playground() {
  // --- state ---
  const [token, setToken] = useState<string>("public:guest");
  const [sql, setSql] = useState<string>("SELECT * FROM blkA202223 LIMIT 5;");
  const [params, setParams] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState<number | null>(null);

  const [resp, setResp] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  // Results anchor (smooth scroll after run)
  const resultsRef = useRef<HTMLDivElement>(null);

  // Try to infer a table from the current SQL (for example queries UI)
  const tableName = useMemo(() => {
    const m = sql.match(/from\s+([A-Za-z0-9_]+)/i);
    return m ? m[1] : null;
  }, [sql]);

  // --- core actions ---
  const run = useCallback(
    async (overrideSql?: string) => {
      const sqlToRun = overrideSql ?? sql;
      setSql(sqlToRun);                // keep editor in sync even when a template triggers run
      setRunning(true);
      setError(null);
      try {
        const r = await postQuery({ sql: sqlToRun, params, limit }, token);
        setResp(r);
        // Make the UI feel alive: jump to results
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setRunning(false);
      }
    },
    [sql, params, limit, token]
  );

  // Insert helper for snippets
  const insertAtEnd = (current: string, snippet: string) => {
    const t = current.trim();
    const sep = t.length === 0 ? "" : t.endsWith(";") ? "\n" : ";\n";
    return `${current}${sep}${snippet}`;
  };

  // Convenience wrapper for buttons that supply a ready-made query
  const runWith = (q: string) => void run(q);

  // --- render ---
  return (
    <div className="h-full w-full flex flex-col">
      <Header token={token} onTokenChange={setToken} onRun={() => run()} running={running} usage={resp?.meta?.usage} />

      {/* Responsive shell: stacked on mobile, two panes on md+ */}
      <div className="flex-1 min-h-0 grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[340px_1fr]">
        {/* LEFT: schema + helpers */}
        <div className="min-h-0 bg-white border-r">
          <SchemaSidebar
            selectedSurvey={selectedSurvey}
            onSelectSurvey={setSelectedSurvey}
            onInsertSnippet={(s) => setSql((cur) => insertAtEnd(cur, s))}
            onRunQuery={runWith}
          />

          <div className="p-4 space-y-4 border-t md:border-0">
            {/* Examples (click = insert + run) */}
            <div className="card">
              <div className="card-header">Examples</div>
              <div className="card-body">
                <ExampleQueries table={tableName} onPick={(q) => setSql(q)} onRun={runWith} />
              </div>
            </div>

            {/* Params + server limit */}
            <div className="card">
              <div className="card-header">Parameters</div>
              <div className="card-body space-y-3">
                <ParamsPanel sql={sql} params={params} onChange={setParams} />
                <div>
                  <label className="text-sm block mb-1">Server limit (blank = default)</label>
                  <input
                    className="input"
                    type="number"
                    value={limit ?? ""}
                    onChange={(e) => setLimit(e.target.value === "" ? null : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: editor + results
            Ensure the editor always has real height so Monaco is editable. */}
        <div className="min-h-0 grid grid-rows-[minmax(420px,1fr)_minmax(260px,380px)] gap-4 p-4">
          {/* Editor card */}
          <div className="card overflow-hidden flex flex-col min-h-[420px]">
            <div className="card-header">SQL Editor</div>
            <div className="flex-1 min-h-[320px]">
              <SQLEditor value={sql} onChange={setSql} onRun={() => run()} />
            </div>
          </div>

          {/* Results card */}
          <div ref={resultsRef} className="card overflow-hidden">
            <div className="card-header flex items-center justify-between">
              <div>Results</div>
              <div className="flex items-center gap-3">
                {running && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
                    Running…
                  </div>
                )}
                {resp?.meta?.suppression && (
                  <span className="badge">
                    k={resp.meta.suppression.k} • suppressed={resp.meta.suppression.suppressed_cells}
                  </span>
                )}
              </div>
            </div>

            <div className="card-body space-y-3 overflow-auto">
              {error && <div className="text-red-600 text-sm break-words">{error}</div>}

              {resp ? (
                <>
                  <div className="overflow-auto">
                    <ResultsGrid resp={resp} />
                  </div>
                  <div className="overflow-auto">
                    <JsonView resp={resp} />
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">Run a query to see results…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
