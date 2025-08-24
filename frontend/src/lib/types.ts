// Shared DTOs with the backend

export type QueryRequest = {
  sql: string;
  params?: Record<string, unknown>;
  limit?: number | null;
};

export type QueryResponse = {
  trace_id: string;
  meta: {
    columns: string[];
    row_count: number;
    duration_ms: number;
    survey?: string;
    usage?: Record<string, unknown>;
    suppression?: { k: number; suppressed_cells: number };
  };
  data: Record<string, unknown>[];
  page?: { next_cursor?: string } | null;
};

export type DatasetsResponse = {
  surveys: { survey: string; title?: string; table?: string }[];
};

export type SchemaResponse = {
  survey: string;
  title?: string;
  table: string;
  variables: Record<string, { label?: string; type?: string; values?: Record<string, string> }>;
  policies?: unknown;
  allowlist_filters?: string[];
};
