import type { QueryResponse } from "../lib/types";

/**
 * JsonView
 * - Pretty prints the whole QueryResponse
 */
type Props = { resp: QueryResponse };

export default function JsonView({ resp }: Props) {
  return (
    <pre className="text-xs bg-gray-50 rounded p-2 overflow-auto">
      {JSON.stringify(resp, null, 2)}
    </pre>
  );
}
