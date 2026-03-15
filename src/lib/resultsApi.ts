import {
  type PublicResultsSummary,
  type SubmissionPayload,
  validatePublicResultsSummary,
} from './resultsPersistence'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(path, {
      credentials: 'same-origin',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
  } catch {
    throw new ApiError('La connexion a échoué. Réessayez dans un instant.', 0)
  }

  let payload: unknown = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : 'Une erreur inattendue est survenue.'

    throw new ApiError(message, response.status)
  }

  return payload as T
}

export async function fetchPublicResultsSummary(): Promise<PublicResultsSummary> {
  const payload = await requestJson<unknown>('/api/results/summary', {
    method: 'GET',
  })

  return validatePublicResultsSummary(payload)
}

export async function trackAnonymousResultView(resultRunId: string): Promise<void> {
  await requestJson('/api/results/view', {
    method: 'POST',
    body: JSON.stringify({ resultRunId }),
  })
}

export async function saveAnonymousResults(payload: SubmissionPayload): Promise<{
  submissionId: string
  summary: PublicResultsSummary
}> {
  const response = await requestJson<unknown>('/api/results/save', {
    method: 'POST',
    body: JSON.stringify({ payload }),
  })

  if (
    typeof response !== 'object' ||
    response === null ||
    !('submissionId' in response) ||
    typeof response.submissionId !== 'string' ||
    !('summary' in response)
  ) {
    throw new ApiError('Réponse serveur invalide.', 500)
  }

  return {
    submissionId: response.submissionId,
    summary: validatePublicResultsSummary(response.summary),
  }
}
