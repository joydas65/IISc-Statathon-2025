import { useEffect, useMemo, useState } from "react";

/**
 * AuthPicker
 * - Preset role:user options + a "Custom…" choice that reveals an input
 * - Persists selection to localStorage ("statathon_token")
 * - Emits the token string (e.g., "public:guest")
 */
type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

const PRESETS = [
  { label: "Public (read-only)", value: "public:guest" },
  { label: "Researcher (extended caps)", value: "researcher:demo" },
  { label: "Admin (review)", value: "admin:demo" },
  { label: "Custom…", value: "__custom__" },
];

export default function AuthPicker({ value, onChange, className }: Props) {
  // decide which option is "selected" based on current value
  const isPreset = useMemo(() => PRESETS.some(p => p.value === value), [value]);
  const [selectValue, setSelectValue] = useState(isPreset ? value : "__custom__");
  const [custom, setCustom] = useState(isPreset ? "" : value);

  // load initial token from localStorage (once)
  useEffect(() => {
    const saved = localStorage.getItem("statathon_token");
    if (saved) onChange(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem("statathon_token", value);
  }, [value]);

  function handleSelect(v: string) {
    setSelectValue(v);
    if (v !== "__custom__") {
      onChange(v);
    } else if (custom) {
      onChange(custom);
    }
  }

  function handleCustomInput(v: string) {
    setCustom(v);
    if (selectValue === "__custom__") onChange(v);
  }

  return (
    <div className={className}>
      <label className="text-sm mr-2">Auth</label>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          className="select max-w-[240px]"
          aria-label="Auth role selection"
          value={selectValue}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {selectValue === "__custom__" && (
          <input
            className="input max-w-[260px]"
            placeholder="role:user (e.g., public:guest)"
            value={custom}
            onChange={(e) => handleCustomInput(e.target.value)}
          />
        )}
      </div>
      <div className="text-[11px] text-gray-500 mt-1">
        Sent as <span className="font-mono">Authorization: Bearer {value || "…"}</span>
      </div>
    </div>
  );
}
