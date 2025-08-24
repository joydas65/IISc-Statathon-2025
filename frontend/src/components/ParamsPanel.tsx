import { useMemo } from "react";

/**
 * ParamsPanel
 * - Detects :placeholders from current SQL (passed in)
 * - Renders simple inputs and returns param map via onChange
 */
type Props = {
  sql: string;
  params: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
};

export default function ParamsPanel({ sql, params, onChange }: Props) {
  const placeholders = useMemo(() => {
    const matches = [...sql.matchAll(/:(\w+)/g)].map((m) => m[1]);
    return Array.from(new Set(matches));
  }, [sql]);

  return (
    <div className="p-2 border-b">
      <div className="text-sm font-medium mb-1">Params</div>
      {placeholders.length === 0 && <div className="text-xs text-gray-500">No :params in SQL</div>}
      {placeholders.map((p) => (
        <div key={p} className="mt-1">
          <label className="text-xs mr-1">{p}</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={params[p] ?? ""}
            onChange={(e) => onChange({ ...params, [p]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
