/**
 * ExampleQueries
 * - Simple preset SQL list you can click to inject into the editor
 */
type Props = {
  table: string | null;
  onPick: (sql: string) => void;
  onRun: (sql: string) => void;
};

export default function ExampleQueries({ table, onPick, onRun }: Props) {
  const t = table ?? "blkA202223";

  const items: { label: string; sql: string }[] = [
    { label: "Top 5 rows", sql: `SELECT * FROM ${t} LIMIT 5;` },
    { label: "Count rows", sql: `SELECT COUNT(*) AS n FROM ${t};` },
    {
      label: "Group by state/sector",
      sql: `SELECT V8, V10, COUNT(*) AS n FROM ${t} GROUP BY 1,2 ORDER BY 1,2 LIMIT 50;`,
    },
  ];

  return (
    <div className="p-2 border-b">
      <div className="text-sm font-medium mb-1">Examples</div>
      <ul className="text-sm space-y-1">
        {items.map((it) => (
          <li key={it.label}>
            <button
                className="btn"
                onClick={() => { onPick(it.sql); onRun(it.sql); }}
            >
                {it.label}
            </button>
        </li>
        ))}
      </ul>
    </div>
  );
}
