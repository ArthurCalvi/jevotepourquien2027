import {
  type PublicResultsSummary,
  validatePublicResultsSummary,
  validateSubmissionPayload,
} from '../../src/lib/resultsPersistence'
import { getJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http'
import { isResultsStoreRpcError, resultsStoreRpc } from '../_lib/resultsStore'
import { getClientIp, getUserAgent, hashIdentifier, isAllowedOrigin } from '../_lib/security'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Une erreur inattendue est survenue.'
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

  const contentLength = Number(request.headers['content-length'] ?? 0)

  if (Number.isFinite(contentLength) && contentLength > 64_000) {
    return sendJson(response, 413, {
      error: 'Payload trop volumineux.',
    })
  }

  try {
    const body = getJsonBody(request)

    if (typeof body !== 'object' || body === null || !('payload' in body)) {
      return sendJson(response, 400, {
        error: 'Payload manquant.',
      })
    }

    const payload = validateSubmissionPayload(body.payload)
    const salt = process.env.RATE_LIMIT_SALT

    if (!salt) {
      throw new Error('Missing RATE_LIMIT_SALT.')
    }

    const saveResult = await resultsStoreRpc<{ submissionId: string }>('save_quiz_submission', {
      submission: payload,
      answers: payload.responses,
      future_answers: payload.futureResponses,
      result_run_token_hash: hashIdentifier(payload.resultRunId, salt),
      request_ip_hash: hashIdentifier(getClientIp(request), salt),
      request_user_agent_hash: hashIdentifier(getUserAgent(request), salt),
    })

    const summary = validatePublicResultsSummary(
      await resultsStoreRpc<PublicResultsSummary>('get_quiz_public_summary'),
    )

    return sendJson(response, 200, {
      submissionId: saveResult.submissionId,
      summary,
    })
  } catch (error) {
    if (isResultsStoreRpcError(error)) {
      const payload =
        typeof error.payload === 'object' && error.payload !== null ? error.payload : null
      const message =
        payload && 'message' in payload && typeof payload.message === 'string'
          ? payload.message
          : 'Results store request failed.'

      if (message === 'rate_limit_exceeded') {
        return sendJson(response, 429, {
          error: 'Trop de sauvegardes depuis cette connexion. Réessayez plus tard.',
        })
      }

      if (message === 'duplicate_run_save') {
        return sendJson(response, 409, {
          error: 'Ces résultats ont déjà été sauvegardés pour cette session.',
        })
      }

      return sendJson(response, 502, {
        error: 'La base a refusé la sauvegarde.',
      })
    }

    return sendJson(response, 400, {
      error: getErrorMessage(error),
    })
  }
}
