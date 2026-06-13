export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

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
