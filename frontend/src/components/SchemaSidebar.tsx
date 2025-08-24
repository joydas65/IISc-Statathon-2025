import { useEffect, useState } from "react";
import { getDatasets, getSchema } from "../lib/api";
import type { SchemaResponse } from "../lib/types";

type Props = {
  selectedSurvey: string | null;
  onSelectSurvey: (s: string) => void;
  onInsertSnippet: (sql: string) => void;
  onRunQuery: (sql: string) => void;
};

export default function SchemaSidebar({ selectedSurvey, onSelectSurvey, onInsertSnippet, onRunQuery }: Props) {
  const [surveys, setSurveys] = useState<{ survey: string; title?: string; table?: string }[]>([]);
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const ds = await getDatasets();
      setSurveys(ds.surveys ?? []);
      if (!selectedSurvey && ds.surveys?.length) onSelectSurvey(ds.surveys[0].survey);
    })();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!selectedSurvey) return;
    setLoading(true);
    getSchema(selectedSurvey).then(setSchema).finally(() => setLoading(false));
  }, [selectedSurvey]);

  return (
    <div className="h-full w-full md:w-[340px] border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <label className="text-xs font-semibold block mb-1">Survey</label>
        <select className="select" value={selectedSurvey ?? ""} onChange={(e) => onSelectSurvey(e.target.value)}>
          {surveys.map((s) => <option key={s.survey} value={s.survey}>{s.title || s.survey}</option>)}
        </select>
      </div>

      <div className="p-4 border-b flex gap-2">
        <button
            className="btn flex-1"
            onClick={() => {
                if (!schema) return;
                const q = `SELECT * FROM ${schema.table} LIMIT 100;`;
                onInsertSnippet(q);   // put it in the editor for transparency
                onRunQuery(q);        // run right away
            }}
        >
            SELECT * LIMIT 100
        </button>
        <button
            className="btn flex-1"
            onClick={() => {
                if (!schema) return;
                const q = `SELECT V8, V10, COUNT(*) AS n
                        FROM ${schema.table}
                        GROUP BY 1,2
                        ORDER BY 1,2
                        LIMIT 50;`;
                onInsertSnippet(q);
                onRunQuery(q);
            }}
        >
            Example aggregate
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="text-xs text-gray-600 mb-2">
          {loading ? "Loading schema…" : schema ? `${Object.keys(schema.variables).length} variables` : "—"}
        </div>

        {schema && (
          <div className="card">
            <div className="card-header">Columns</div>
            <div className="card-body">
              <ul className="space-y-1">
                {Object.entries(schema.variables).map(([name, meta]) => (
                  <li key={name} className="text-xs">
                    <button
                      className="underline text-blue-700"
                      onClick={() => onInsertSnippet(name)}
                      title={meta.label || name}
                    >
                      {name}
                    </button>
                    {meta.label && <span className="text-gray-600"> — {meta.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
