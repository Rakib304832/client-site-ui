const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "https://server-site-ruby.vercel.app";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Small wrapper around fetch that always sends the auth cookie, sends JSON
 * bodies, and turns server error messages into throwable ApiErrors.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const backendPath = path.startsWith("/") ? path : `/${path}`;
  const routePath = backendPath.replace(/^\/api(?=\/|$)/, "");

  const response = await fetch(`/api/backend${routePath}`, {
    ...rest,
    credentials: "same-origin",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}
