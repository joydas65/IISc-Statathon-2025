import { useEffect, useState } from "react";
import { getDatasets, getSchema } from "../lib/api";
import type { SchemaResponse } from "../lib/types";

/**
 * Datasets page
 * - Lists surveys from /datasets and shows selected schema
 */
export default function Datasets() {
  const [surveys, setSurveys] = useState<{ survey: string; title?: string; table?: string }[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [schema, setSchema] = useState<SchemaResponse | null>(null);

  useEffect(() => {
    (async () => {
      const ds = await getDatasets();
      setSurveys(ds.surveys ?? []);
      if (ds.surveys?.length) setSel(ds.surveys[0].survey);
    })();
  }, []);

  useEffect(() => {
    if (!sel) return;
    getSchema(sel).then(setSchema);
  }, [sel]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm">Survey</label>
        <select className="border rounded px-2 py-1 text-sm" value={sel ?? ""} onChange={(e) => setSel(e.target.value)}>
          {surveys.map((s) => (
            <option key={s.survey} value={s.survey}>
              {s.title || s.survey}
            </option>
          ))}
        </select>
      </div>

      {schema ? (
        <div className="border rounded">
          <div className="px-3 py-2 border-b bg-gray-50 text-sm">
            {schema.title ?? schema.survey} — table: <span className="font-mono">{schema.table}</span>
          </div>
          <div className="p-3">
            <table className="text-sm border-collapse w-full">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Column</th>
                  <th className="border px-2 py-1 text-left">Label</th>
                  <th className="border px-2 py-1 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(schema.variables).map(([name, meta]) => (
                  <tr key={name}>
                    <td className="border px-2 py-1 font-mono">{name}</td>
                    <td className="border px-2 py-1">{meta.label ?? ""}</td>
                    <td className="border px-2 py-1">{meta.type ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Select a survey…</div>
      )}
    </div>
  );
}
