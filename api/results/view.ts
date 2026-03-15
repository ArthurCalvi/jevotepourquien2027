import { getJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http.js'
import { isResultsStoreRpcError, resultsStoreRpc } from '../_lib/resultsStore.js'
import { getClientIp, getUserAgent, hashIdentifier, isAllowedOrigin } from '../_lib/security.js'

function isValidResultRunId(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 20 && value.length <= 120
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
) {
  if (!isAllowedOrigin(request)) {
    return sendJson(response, 403, {
      error: 'Origine non autorisée.',
    })
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, {
      error: 'Méthode non autorisée.',
    })
  }

  try {
    const body = getJsonBody(request)

    if (typeof body !== 'object' || body === null || !('resultRunId' in body)) {
      return sendJson(response, 400, {
        error: 'resultRunId manquant.',
      })
    }

    if (!isValidResultRunId(body.resultRunId)) {
      return sendJson(response, 400, {
        error: 'resultRunId invalide.',
      })
    }

    const salt = process.env.RATE_LIMIT_SALT

    if (!salt) {
      throw new Error('Missing RATE_LIMIT_SALT.')
    }

    await resultsStoreRpc('register_quiz_result_view', {
      result_run_token_hash: hashIdentifier(body.resultRunId, salt),
      request_ip_hash: hashIdentifier(getClientIp(request), salt),
      request_user_agent_hash: hashIdentifier(getUserAgent(request), salt),
    })

    return sendJson(response, 200, { tracked: true })
  } catch (error) {
    if (isResultsStoreRpcError(error)) {
      const payload =
        typeof error.payload === 'object' && error.payload !== null ? error.payload : null
      const message =
        payload && 'message' in payload && typeof payload.message === 'string'
          ? payload.message
          : 'Results store request failed.'

      if (message === 'view_rate_limit_exceeded') {
        return sendJson(response, 429, {
          error: 'Trop de consultations depuis cette connexion. Réessayez plus tard.',
        })
      }

      return sendJson(response, 502, {
        error: 'La base a refusé l’enregistrement de consultation.',
      })
    }

    return sendJson(response, 400, {
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue.',
    })
  }
}
