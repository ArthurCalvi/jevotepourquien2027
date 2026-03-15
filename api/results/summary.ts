import {
  type PublicResultsSummary,
  validatePublicResultsSummary,
} from '../../src/lib/resultsPersistence'
import { sendJson, type ApiRequest, type ApiResponse } from '../_lib/http'
import { isAllowedOrigin } from '../_lib/security'
import { isSupabaseRpcError, supabaseRpc } from '../_lib/supabase'

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
) {
  if (!isAllowedOrigin(request)) {
    return sendJson(response, 403, {
      error: 'Origine non autorisée.',
    })
  }

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, {
      error: 'Méthode non autorisée.',
    })
  }

  try {
    const summary = validatePublicResultsSummary(
      await supabaseRpc<PublicResultsSummary>('get_quiz_public_summary'),
    )

    return sendJson(
      response,
      200,
      summary,
      'public, s-maxage=300, stale-while-revalidate=3600',
    )
  } catch (error) {
    if (isSupabaseRpcError(error)) {
      return sendJson(response, 502, {
        error: 'Impossible de charger les tendances pour le moment.',
      })
    }

    return sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue.',
    })
  }
}
