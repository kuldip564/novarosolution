// Same origin as the site. The session cookie is read by the Next.js admin guard, so the
// browser must not call the API host directly or the cookie is stored on the wrong site.
export const apiBase = "";

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const isFormData = init?.body instanceof FormData;

  return fetch(`${apiBase}${path}`, {
    ...init,
    credentials: "include",
    headers: isFormData
      ? { ...init?.headers }
      : {
          "Content-Type": "application/json",
          ...init?.headers,
        },
  });
}
