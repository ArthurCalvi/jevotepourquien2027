import { futureQuestions, partyProfiles, questions, type Stance } from '../data/content.js'
import type { MapPosition, MatchResult, PriorityMap, ResponseMap } from './scoring.js'

export const submissionSchemaVersion = '2026-03-15'

export interface SubmissionAnswer {
  questionId: string
  stance: Stance
  isPriority: boolean
}

export interface FutureSubmissionAnswer {
  questionId: string
  stance: Stance
  scenarioId: string
}

export interface SubmissionPayload {
  version: string
  resultRunId: string
  answeredCount: number
  priorityCount: number
  selectedPartyId: string
  topPartyId: string
  topPartyScore: number
  userMapPosition: MapPosition
  matchScores: Array<{
    partyId: string
    score: number
  }>
  responses: SubmissionAnswer[]
  futureResponses: FutureSubmissionAnswer[]
}

export interface PublicResultsSummary {
  generatedAt: string
  totalResultViews: number
  savedResultsCount: number
  saveRate: number | null
  totalSubmissions: number
  averageTopScore: number | null
  averageAnsweredCount: number | null
  averageEconomicX: number | null
  averageOpennessY: number | null
  topPartyDistribution: Array<{
    partyId: string
    count: number
    share: number
  }>
  futureScenarioDistribution: Array<{
    questionId: string
    total: number
    scenarios: Array<{
      scenarioId: string
      count: number
      share: number
    }>
  }>
}

const stanceValues = new Set<number>([-2, -1, 0, 1, 2])
const partyIdSet = new Set(partyProfiles.map((party) => party.id))
const questionIdSet = new Set(questions.map((question) => question.id))
const futureQuestionIdSet = new Set(futureQuestions.map((question) => question.id))
const futureScenarioIdByQuestionId = new Map<string, Set<string>>(
  futureQuestions.map((question) => [
    question.id,
    new Set(question.scenarios.map((scenario) => scenario.id)),
  ]),
)

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function assertIntegerInRange(
  value: unknown,
  min: number,
  max: number,
  label: string,
): asserts value is number {
  assert(typeof value === 'number' && Number.isInteger(value), `${label} must be an integer.`)
  assert(value >= min && value <= max, `${label} must be between ${min} and ${max}.`)
}

function assertNullableNumber(value: unknown, label: string): asserts value is number | null {
  assert(value === null || typeof value === 'number', `${label} must be a number or null.`)
}

function assertStringLength(
  value: unknown,
  min: number,
  max: number,
  label: string,
): asserts value is string {
  assert(typeof value === 'string', `${label} must be a string.`)
  assert(value.length >= min && value.length <= max, `${label} length is invalid.`)
}

function validateMapPosition(input: unknown): MapPosition {
  assert(isPlainObject(input), 'userMapPosition must be an object.')
  assertIntegerInRange(input.x, -100, 100, 'userMapPosition.x')
  assertIntegerInRange(input.y, -100, 100, 'userMapPosition.y')
  assertIntegerInRange(input.coverage, 0, 100, 'userMapPosition.coverage')

  return {
    x: input.x,
    y: input.y,
    coverage: input.coverage,
  }
}

function validateResponseList(input: unknown, answeredCount: number): SubmissionAnswer[] {
  assert(Array.isArray(input), 'responses must be an array.')

  const seenIds = new Set<string>()
  const responses = input.map((entry) => {
    assert(isPlainObject(entry), 'Each response must be an object.')
    assert(typeof entry.questionId === 'string', 'response.questionId must be a string.')
    assert(questionIdSet.has(entry.questionId), `Unknown questionId "${entry.questionId}".`)
    assert(!seenIds.has(entry.questionId), `Duplicate response for "${entry.questionId}".`)
    seenIds.add(entry.questionId)
    assert(stanceValues.has(entry.stance as number), 'response.stance must be a valid stance.')
    assert(typeof entry.isPriority === 'boolean', 'response.isPriority must be a boolean.')

    return {
      questionId: entry.questionId,
      stance: entry.stance as Stance,
      isPriority: entry.isPriority,
    }
  })

  assert(
    responses.length === answeredCount,
    'responses length must match answeredCount.',
  )

  return responses
}

function validateFutureResponseList(input: unknown): FutureSubmissionAnswer[] {
  assert(Array.isArray(input), 'futureResponses must be an array.')

  const seenIds = new Set<string>()
  return input.map((entry) => {
    assert(isPlainObject(entry), 'Each future response must be an object.')
    assert(typeof entry.questionId === 'string', 'futureResponse.questionId must be a string.')
    assert(
      futureQuestionIdSet.has(entry.questionId),
      `Unknown future questionId "${entry.questionId}".`,
    )
    assert(!seenIds.has(entry.questionId), `Duplicate future response for "${entry.questionId}".`)
    seenIds.add(entry.questionId)
    assert(stanceValues.has(entry.stance as number), 'futureResponse.stance must be a valid stance.')
    assert(typeof entry.scenarioId === 'string', 'futureResponse.scenarioId must be a string.')
    assert(
      futureScenarioIdByQuestionId.get(entry.questionId)?.has(entry.scenarioId),
      `Unknown scenarioId "${entry.scenarioId}" for question "${entry.questionId}".`,
    )

    return {
      questionId: entry.questionId,
      stance: entry.stance as Stance,
      scenarioId: entry.scenarioId,
    }
  })
}

function validateMatchScores(input: unknown): SubmissionPayload['matchScores'] {
  assert(Array.isArray(input), 'matchScores must be an array.')
  assert(input.length > 0, 'matchScores must not be empty.')

  const seenIds = new Set<string>()
  return input.map((entry) => {
    assert(isPlainObject(entry), 'Each match score must be an object.')
    assert(typeof entry.partyId === 'string', 'matchScore.partyId must be a string.')
    assert(partyIdSet.has(entry.partyId), `Unknown partyId "${entry.partyId}".`)
    assert(!seenIds.has(entry.partyId), `Duplicate match score for "${entry.partyId}".`)
    seenIds.add(entry.partyId)
    assertIntegerInRange(entry.score, 0, 100, 'matchScore.score')

    return {
      partyId: entry.partyId,
      score: entry.score,
    }
  })
}

export function buildSubmissionPayload(input: {
  resultRunId: string
  answeredCount: number
  responses: ResponseMap
  priorities: PriorityMap
  matches: MatchResult[]
  selectedPartyId: string
  userMapPosition: MapPosition
  futureResponses: Record<string, Stance | null>
  futureScenarioChoices: Record<string, string | null>
}): SubmissionPayload {
  const topMatch = input.matches[0]

  if (!topMatch) {
    throw new Error('Cannot build a submission payload without computed matches.')
  }

  const responses = questions.flatMap((question) => {
    const stance = input.responses[question.id]

    if (stance === null) {
      return []
    }

    return [
      {
        questionId: question.id,
        stance,
        isPriority: input.priorities[question.id] ?? false,
      },
    ]
  })

  const futureResponses = futureQuestions.flatMap((question) => {
    const stance = input.futureResponses[question.id]
    const scenarioId = input.futureScenarioChoices[question.id]

    if (stance === null || scenarioId === null) {
      return []
    }

    return [
      {
        questionId: question.id,
        stance,
        scenarioId,
      },
    ]
  })

  return {
    version: submissionSchemaVersion,
    resultRunId: input.resultRunId,
    answeredCount: input.answeredCount,
    priorityCount: questions.filter((question) => input.priorities[question.id]).length,
    selectedPartyId: input.selectedPartyId,
    topPartyId: topMatch.party.id,
    topPartyScore: topMatch.score,
    userMapPosition: input.userMapPosition,
    matchScores: input.matches.map((match) => ({
      partyId: match.party.id,
      score: match.score,
    })),
    responses,
    futureResponses,
  }
}

export function validateSubmissionPayload(input: unknown): SubmissionPayload {
  assert(isPlainObject(input), 'Submission payload must be an object.')
  assert(input.version === submissionSchemaVersion, 'Unsupported submission payload version.')
  assertStringLength(input.resultRunId, 20, 120, 'resultRunId')
  assertIntegerInRange(input.answeredCount, 10, questions.length, 'answeredCount')
  assertIntegerInRange(input.priorityCount, 0, questions.length, 'priorityCount')
  assert(typeof input.selectedPartyId === 'string', 'selectedPartyId must be a string.')
  assert(partyIdSet.has(input.selectedPartyId), 'selectedPartyId is invalid.')
  assert(typeof input.topPartyId === 'string', 'topPartyId must be a string.')
  assert(partyIdSet.has(input.topPartyId), 'topPartyId is invalid.')
  assertIntegerInRange(input.topPartyScore, 0, 100, 'topPartyScore')

  return {
    version: submissionSchemaVersion,
    resultRunId: input.resultRunId,
    answeredCount: input.answeredCount,
    priorityCount: input.priorityCount,
    selectedPartyId: input.selectedPartyId,
    topPartyId: input.topPartyId,
    topPartyScore: input.topPartyScore,
    userMapPosition: validateMapPosition(input.userMapPosition),
    matchScores: validateMatchScores(input.matchScores),
    responses: validateResponseList(input.responses, input.answeredCount),
    futureResponses: validateFutureResponseList(input.futureResponses),
  }
}

export function validatePublicResultsSummary(input: unknown): PublicResultsSummary {
  assert(isPlainObject(input), 'Summary payload must be an object.')
  assert(typeof input.generatedAt === 'string', 'generatedAt must be a string.')
  assertIntegerInRange(input.totalResultViews, 0, Number.MAX_SAFE_INTEGER, 'totalResultViews')
  assertIntegerInRange(input.savedResultsCount, 0, Number.MAX_SAFE_INTEGER, 'savedResultsCount')
  assertNullableNumber(input.saveRate, 'saveRate')
  assertIntegerInRange(input.totalSubmissions, 0, Number.MAX_SAFE_INTEGER, 'totalSubmissions')
  assertNullableNumber(input.averageTopScore, 'averageTopScore')
  assertNullableNumber(input.averageAnsweredCount, 'averageAnsweredCount')
  assertNullableNumber(input.averageEconomicX, 'averageEconomicX')
  assertNullableNumber(input.averageOpennessY, 'averageOpennessY')
  assert(Array.isArray(input.topPartyDistribution), 'topPartyDistribution must be an array.')
  assert(
    Array.isArray(input.futureScenarioDistribution),
    'futureScenarioDistribution must be an array.',
  )

  return {
    generatedAt: input.generatedAt,
    totalResultViews: input.totalResultViews,
    savedResultsCount: input.savedResultsCount,
    saveRate: input.saveRate,
    totalSubmissions: input.totalSubmissions,
    averageTopScore: input.averageTopScore,
    averageAnsweredCount: input.averageAnsweredCount,
    averageEconomicX: input.averageEconomicX,
    averageOpennessY: input.averageOpennessY,
    topPartyDistribution: input.topPartyDistribution.map((entry) => {
      assert(isPlainObject(entry), 'Each party distribution entry must be an object.')
      assert(typeof entry.partyId === 'string', 'partyId must be a string.')
      assert(partyIdSet.has(entry.partyId), 'partyId is invalid.')
      assertIntegerInRange(entry.count, 0, Number.MAX_SAFE_INTEGER, 'partyDistribution.count')
      assert(typeof entry.share === 'number', 'partyDistribution.share must be a number.')

      return {
        partyId: entry.partyId,
        count: entry.count,
        share: entry.share,
      }
    }),
    futureScenarioDistribution: input.futureScenarioDistribution.map((entry) => {
      assert(isPlainObject(entry), 'Each future distribution entry must be an object.')
      assert(typeof entry.questionId === 'string', 'future questionId must be a string.')
      assert(futureQuestionIdSet.has(entry.questionId), 'future questionId is invalid.')
      assertIntegerInRange(entry.total, 0, Number.MAX_SAFE_INTEGER, 'futureDistribution.total')
      assert(Array.isArray(entry.scenarios), 'futureDistribution.scenarios must be an array.')

      const questionId = entry.questionId

      return {
        questionId,
        total: entry.total,
        scenarios: entry.scenarios.map((scenario) => {
          assert(isPlainObject(scenario), 'Each scenario distribution entry must be an object.')
          assert(typeof scenario.scenarioId === 'string', 'scenarioId must be a string.')
          assert(
            futureScenarioIdByQuestionId.get(questionId)?.has(scenario.scenarioId),
            'scenarioId is invalid.',
          )
          assertIntegerInRange(
            scenario.count,
            0,
            Number.MAX_SAFE_INTEGER,
            'scenarioDistribution.count',
          )
          assert(typeof scenario.share === 'number', 'scenarioDistribution.share must be a number.')

          return {
            scenarioId: scenario.scenarioId,
            count: scenario.count,
            share: scenario.share,
          }
        }),
      }
    }),
  }
}
