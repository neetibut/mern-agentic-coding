const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Thin Fetch wrapper: always sends the auth cookie, sends/parses JSON, and
// throws an Error carrying the server's message on a non-2xx response.
async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    credentials: "include", // send/receive the httpOnly auth cookie
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. 204) — leave data null.
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path, body) => request(path, { method: "DELETE", body }),
};
