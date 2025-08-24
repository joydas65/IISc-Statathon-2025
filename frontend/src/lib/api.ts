import type { QueryRequest, QueryResponse, DatasetsResponse, SchemaResponse } from "./types";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/** Build headers in a separate step so TS sees a concrete Record<string,string>. */
function buildJsonHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function postQuery(body: QueryRequest, token?: string): Promise<QueryResponse> {
  const res = await fetch(`${API}/query`, {
    method: "POST",
    headers: buildJsonHeaders(token), // <- no union here
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    // bubble up API error messages when present
    throw new Error(json?.detail?.message || json?.detail || res.statusText);
  }
  return json as QueryResponse;
}

export async function getDatasets(): Promise<DatasetsResponse> {
  const res = await fetch(`${API}/datasets`, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as DatasetsResponse;
}

export async function getSchema(survey: string): Promise<SchemaResponse> {
  const res = await fetch(`${API}/schema/${survey}`, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as SchemaResponse;
}

export async function getUsage(token?: string): Promise<any> {
  const res = await fetch(`${API}/usage/me`, {
    headers: buildJsonHeaders(token), // same pattern here
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
