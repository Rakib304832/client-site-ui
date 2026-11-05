import { API_URL } from "@/lib/api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyBackendRequest(
  request: Request,
  { params }: RouteContext,
) {
  const { path } = await params;
  const [resource] = path;
  const isRoot = path.length === 1;
  const isMineAlias = resource === "bookings" && path[1] === "mine";
  const isResourceId = path.length === 2 && path[1] !== "mine";
  const validEndpoint =
    resource === "studios"
      ? isRoot
        ? request.method === "GET" || request.method === "POST"
        : isResourceId &&
          ["GET", "PATCH", "DELETE"].includes(request.method)
      : resource === "bookings"
        ? isRoot
          ? request.method === "GET" || request.method === "POST"
          : isMineAlias
            ? request.method === "GET"
            : isResourceId && request.method === "PATCH"
        : false;

  if (
    !validEndpoint ||
    path.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return Response.json({ message: "API route not found." }, { status: 404 });
  }

  const backendUrl = new URL(
    `/api/${path.map((segment) => encodeURIComponent(segment)).join("/")}`,
    API_URL,
  );
  backendUrl.search = new URL(request.url).search;

  const headers = new Headers();
  for (const name of ["accept", "content-type", "cookie"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(backendUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    for (const name of ["content-type", "cache-control"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new Response(
      upstream.status === 204 || upstream.status === 304 ? null : upstream.body,
      {
      status: upstream.status,
      headers: responseHeaders,
      },
    );
  } catch (error) {
    console.error("Backend API request failed.", error);
    return Response.json(
      { message: "The studio service is currently unavailable." },
      { status: 502 },
    );
  }
}

export const GET = proxyBackendRequest;
export const POST = proxyBackendRequest;
export const PATCH = proxyBackendRequest;
export const DELETE = proxyBackendRequest;
