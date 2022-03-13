import { CONFIG } from "../config";

export async function fetchApi(path, { method = "get", body = null } = {}) {
  const response = await fetch(`${CONFIG.apiUrl}${path}`, {
    method,
    body: method !== "get" && body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (response.status !== 403) {
    // TODO: should log out if 403
  }

  return response;
}
