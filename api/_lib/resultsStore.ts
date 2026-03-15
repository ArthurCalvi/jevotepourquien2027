class ResultsStoreRpcError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    super('Results store RPC request failed.')
    this.name = 'ResultsStoreRpcError'
    this.status = status
    this.payload = payload
  }
}

function getConfig() {
  const url = process.env.RESULTS_STORE_URL
  const secret = process.env.RESULTS_STORE_SECRET

  if (!url || !secret) {
    throw new Error('Missing results store server credentials.')
  }

  return { url, secret }
}

function getAuthHeaders(secret: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    apikey: secret,
  }

  if (!secret.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${secret}`
  }

  return headers
}

export async function resultsStoreRpc<T>(
  functionName: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const { url, secret } = getConfig()
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: getAuthHeaders(secret),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new ResultsStoreRpcError(response.status, payload)
  }

  return payload as T
}

export function isResultsStoreRpcError(error: unknown): error is ResultsStoreRpcError {
  return error instanceof ResultsStoreRpcError
}
