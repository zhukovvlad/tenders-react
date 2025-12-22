type FetchOptions = RequestInit & { _retried?: boolean };

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "X-CSRF-Token";
const AUTH_ERROR_HEADER = "X-Auth-Error";
const AUTH_EXPIRED = "access_token_expired";

function getCookie(name: string): string | null {
  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq === -1) continue;
    const k = p.slice(0, eq);
    if (k === name) return decodeURIComponent(p.slice(eq + 1));
  }
  return null;
}

function isUnsafeMethod(method?: string): boolean {
  const m = (method || "GET").toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

function applyCsrfHeader(headers: Headers, method: string): void {
  if (typeof window !== "undefined" && isUnsafeMethod(method)) {
    const csrf = getCookie(CSRF_COOKIE);
    if (csrf) headers.set(CSRF_HEADER, csrf);
  }
}

async function refreshSession(apiBaseUrl = ""): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
      signal: controller.signal,
    });
    return res.ok;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Session refresh timeout");
    }
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiFetch(
  path: string,
  init: FetchOptions = {},
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  const method = (init.method || "GET").toUpperCase();

  const finalInit: FetchOptions = {
    ...init,
    method,
    credentials: "include",
    headers,
  };

  applyCsrfHeader(headers, method);

  const res = await fetch(`${apiBaseUrl}${path}`, finalInit);

  if (
    res.status === 401 &&
    !finalInit._retried &&
    res.headers.get(AUTH_ERROR_HEADER) === AUTH_EXPIRED
  ) {
    const ok = await refreshSession(apiBaseUrl);
    if (!ok) return res;

    const retryHeaders = new Headers(finalInit.headers || {});
    const retryInit: FetchOptions = { ...finalInit, _retried: true, headers: retryHeaders };

    applyCsrfHeader(retryHeaders, method);

    return fetch(`${apiBaseUrl}${path}`, retryInit);
  }

  return res;
}
