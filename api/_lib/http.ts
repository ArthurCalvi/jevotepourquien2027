export interface ApiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

export interface ApiResponse {
  status: (statusCode: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

export function getHeader(
  request: ApiRequest,
  name: string,
): string | null {
  const value = request.headers[name.toLowerCase()]

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export function getJsonBody(request: ApiRequest): unknown {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body)
  }

  return request.body
}

export function sendJson(
  response: ApiResponse,
  statusCode: number,
  body: unknown,
  cacheControl = 'no-store',
) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', cacheControl)
  response.status(statusCode).json(body)
}
