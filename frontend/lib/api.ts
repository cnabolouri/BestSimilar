const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

function buildApiUrl(path: string) {
  try {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const base = API_BASE_URL.replace(/\/$/, "");
    const suffix = path.replace(/^\//, "");

    return `${base}/${suffix}`;
  } catch (error) {
    throw new Error(`Invalid API URL for path '${path}': ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`${options.method ?? "GET"} ${url} failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw new Error(`Fetch failed for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = buildApiUrl(path);
  return fetchJson<T>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = buildApiUrl(path);
  return fetchJson<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}