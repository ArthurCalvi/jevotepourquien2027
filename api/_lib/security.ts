import { createHash } from 'node:crypto'
import type { ApiRequest } from './http'
import { getHeader } from './http'

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, '')
}

export function isAllowedOrigin(request: ApiRequest) {
  const origin = getHeader(request, 'origin')

  if (!origin) {
    return true
  }

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((entry) => normalizeOrigin(entry.trim()))
    .filter(Boolean)

  if (allowedOrigins.length > 0) {
    return allowedOrigins.includes(normalizeOrigin(origin))
  }

  const host = getHeader(request, 'host')

  if (!host) {
    return true
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function getClientIp(request: ApiRequest) {
  const forwardedFor = getHeader(request, 'x-forwarded-for')

  if (!forwardedFor) {
    return 'unknown'
  }

  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}

export function getUserAgent(request: ApiRequest) {
  return getHeader(request, 'user-agent') ?? 'unknown'
}

export function hashIdentifier(value: string, salt: string) {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex')
}
