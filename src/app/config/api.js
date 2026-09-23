export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is missing in .env.local. Restart the admin server.");
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    body: options.body,
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) throw new Error(data?.message || `API request failed (${response.status}). Check the deployed backend route.`);
  if (!data) throw new Error("The API returned HTML instead of JSON. Check NEXT_PUBLIC_API_URL and deployed backend routes.");
  return data;
}