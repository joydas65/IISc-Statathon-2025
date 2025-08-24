import { useMemo } from "react";
import type { QueryResponse } from "../lib/types";

/**
 * ResultsGrid
 * - Renders a basic table from QueryResponse
 * - Includes JSON/CSV export buttons
 */
type Props = {
  resp: QueryResponse;
};

export default function ResultsGrid({ resp }: Props) {
  const cols = resp.meta.columns ?? inferColumns(resp);
  const csv = useMemo(() => toCSV(cols, resp.data), [cols, resp.data]);

  return (
    <div className="overflow-auto">
      <div className="text-xs text-gray-600 mb-2">
        {resp.meta.row_count} rows • {resp.meta.duration_ms} ms
      </div>

      <table className="text-sm border-collapse">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className="border px-2 py-1 text-left bg-gray-50">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resp.data.map((row, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c} className="border px-2 py-1">
                  {String(row[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex gap-2">
        <button
          className="border rounded px-2 py-1 text-sm"
          onClick={() => download("query_result.json", JSON.stringify(resp, null, 2), "application/json")}
        >
          Download JSON
        </button>
        <button
          className="border rounded px-2 py-1 text-sm"
          onClick={() => download("query_result.csv", csv, "text/csv")}
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}

function inferColumns(resp: QueryResponse) {
  // Fallback in case backend doesn't provide columns (it does in our API)
  const first = resp.data[0];
  return first ? Object.keys(first) : [];
}

function toCSV(columns: string[], rows: Record<string, unknown>[]) {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }
  const header = columns.map(esc).join(",");
  const body = rows.map((r) => columns.map((c) => esc(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
