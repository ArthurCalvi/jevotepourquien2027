import {
  partyProfiles,
  questions,
  type PartyProfile,
  type Stance,
  type Theme,
} from '../data/content.js'

export type ResponseMap = Record<string, Stance | null>
export type PriorityMap = Record<string, boolean>
export type MatchQuestionDelta = {
  question: (typeof questions)[number]
  userValue: Stance
  partyValue: Stance
  distance: number
}

export interface MatchResult {
  party: PartyProfile
  score: number
  answeredCount: number
  themeScores: Record<Theme, number>
  topAgreements: MatchQuestionDelta[]
  topTensions: MatchQuestionDelta[]
}

export interface MapPosition {
  x: number
  y: number
  coverage: number
}

const maxDistancePerQuestion = 4

const economicAxis = [
  { id: 'restore_wealth_tax', direction: -1 },
  { id: 'labor_flexibility', direction: 1 },
  { id: 'more_deficit_for_services', direction: -1 },
  { id: 'retirement_62', direction: -1 },
] as const

const opennessAxis = [
  { id: 'eu_powers', direction: 1 },
  { id: 'regularize_workers', direction: 1 },
  { id: 'national_preference', direction: -1 },
  { id: 'restrict_legal_immigration', direction: -1 },
  { id: 'integrated_eu_defense', direction: 1 },
] as const

export function createBlankResponseMap(): ResponseMap {
  return Object.fromEntries(questions.map((question) => [question.id, null])) as ResponseMap
}

export function createBlankPriorityMap(): PriorityMap {
  return Object.fromEntries(questions.map((question) => [question.id, false])) as PriorityMap
}

export function countAnsweredResponses(responses: ResponseMap) {
  return questions.filter((question) => responses[question.id] !== null).length
}

export function computeMatches(
  responses: ResponseMap,
  priorities: PriorityMap,
): MatchResult[] {
  const answeredQuestions = questions.filter((question) => responses[question.id] !== null)

  if (answeredQuestions.length === 0) {
    return []
  }

  const totalWeight = answeredQuestions.reduce(
    (sum, question) => sum + (priorities[question.id] ? 2 : 1),
    0,
  )

  return partyProfiles
    .map((party) => {
      let totalDistance = 0

      const themeDistance = new Map<Theme, number>()
      const themeWeight = new Map<Theme, number>()
      const rankedDiffs = answeredQuestions.map((question) => {
        const userValue = responses[question.id] as Stance
        const partyValue = party.positions[question.id]
        const weight = priorities[question.id] ? 2 : 1
        const distance = Math.abs(userValue - partyValue)

        totalDistance += distance * weight

        themeDistance.set(question.theme, (themeDistance.get(question.theme) ?? 0) + distance * weight)
        themeWeight.set(question.theme, (themeWeight.get(question.theme) ?? 0) + weight)

        return { question, userValue, partyValue, distance }
      })

      const themeScores = Object.fromEntries(
        Array.from(themeWeight.entries()).map(([theme, weight]) => {
          const distance = themeDistance.get(theme) ?? 0
          const score = Math.round((1 - distance / (weight * maxDistancePerQuestion)) * 100)
          return [theme, score]
        }),
      ) as Record<Theme, number>

      const score = Math.round(
        (1 - totalDistance / (totalWeight * maxDistancePerQuestion)) * 100,
      )

      const topAgreements = rankedDiffs
        .slice()
        .sort((left, right) => left.distance - right.distance)
        .slice(0, 3)

      const topTensions = rankedDiffs
        .slice()
        .sort((left, right) => right.distance - left.distance)
        .slice(0, 3)

      return {
        party,
        score,
        answeredCount: answeredQuestions.length,
        themeScores,
        topAgreements,
        topTensions,
      }
    })
    .sort((left, right) => right.score - left.score || left.party.name.localeCompare(right.party.name))
}

function normalizeAxisValue(total: number, count: number) {
  if (count === 0) {
    return 0
  }

  return Math.round((total / count / 2) * 100)
}

export function computePartyMapPosition(party: PartyProfile): MapPosition {
  const economicTotal = economicAxis.reduce(
    (sum, axisQuestion) => sum + party.positions[axisQuestion.id] * axisQuestion.direction,
    0,
  )

  const opennessTotal = opennessAxis.reduce(
    (sum, axisQuestion) => sum + party.positions[axisQuestion.id] * axisQuestion.direction,
    0,
  )

  return {
    x: normalizeAxisValue(economicTotal, economicAxis.length),
    y: normalizeAxisValue(opennessTotal, opennessAxis.length),
    coverage: 100,
  }
}

export function computeUserMapPosition(responses: ResponseMap): MapPosition {
  let economicTotal = 0
  let economicCount = 0
  let opennessTotal = 0
  let opennessCount = 0

  for (const axisQuestion of economicAxis) {
    const value = responses[axisQuestion.id]

    if (value === null) {
      continue
    }

    economicTotal += value * axisQuestion.direction
    economicCount += 1
  }

  for (const axisQuestion of opennessAxis) {
    const value = responses[axisQuestion.id]

    if (value === null) {
      continue
    }

    opennessTotal += value * axisQuestion.direction
    opennessCount += 1
  }

  const answeredAxes = economicCount + opennessCount
  const totalAxes = economicAxis.length + opennessAxis.length

  return {
    x: normalizeAxisValue(economicTotal, economicCount),
    y: normalizeAxisValue(opennessTotal, opennessCount),
    coverage: Math.round((answeredAxes / totalAxes) * 100),
  }
}
