const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { signal, credentials: "include" })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${path} failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}
