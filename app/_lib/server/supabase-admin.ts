type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  prefer?: string;
};

export function getSupabaseAdminConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase admin environment is not configured.");
  }

  return { url: url.replace(/\/$/, ""), serviceKey };
}

export async function supabaseAdminRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { url, serviceKey } = getSupabaseAdminConfig();
  const response = await fetch(`${url}/rest/v1/${path.replace(/^\//, "")}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${details}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
