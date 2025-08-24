import AuthPicker from "./AuthPicker";

type Props = {
  token: string;
  onTokenChange: (v: string) => void;
  onRun: () => void;
  running?: boolean;
  usage?: { rows?: number; queries?: number; bytes?: number } | null;
};

export default function Header({ token, onTokenChange, onRun, running, usage }: Props) {
  return (
    <div className="border-b bg-white px-4 py-3 flex flex-wrap items-center gap-3">
      <AuthPicker value={token} onChange={onTokenChange} />
      <button
        onClick={onRun}
        disabled={!!running}
        className="btn btn-primary"
        title="Run (Ctrl/Cmd + Enter)"
      >
        {running ? "Running…" : "Run"}
      </button>
      <div className="flex-1" />
      {usage && (
        <div className="text-xs text-gray-600">
          rows={usage.rows ?? 0} • queries={usage.queries ?? 0}
        </div>
      )}
    </div>
  );
}
