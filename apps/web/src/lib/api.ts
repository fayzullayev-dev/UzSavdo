export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Xatolik yuz berdi");
  }

  return data;
}
