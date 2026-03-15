class SupabaseRpcError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    super('Supabase RPC request failed.')
    this.name = 'SupabaseRpcError'
    this.status = status
    this.payload = payload
  }
}

function getConfig() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase server credentials.')
  }

  return { url, serviceKey }
}

function getAuthHeaders(serviceKey: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    apikey: serviceKey,
  }

  if (!serviceKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${serviceKey}`
  }

  return headers
}

export async function supabaseRpc<T>(
  functionName: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const { url, serviceKey } = getConfig()
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: getAuthHeaders(serviceKey),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new SupabaseRpcError(response.status, payload)
  }

  return payload as T
}

export function isSupabaseRpcError(error: unknown): error is SupabaseRpcError {
  return error instanceof SupabaseRpcError
}
