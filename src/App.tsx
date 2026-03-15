import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { PoliticalMap } from './components/charts/PoliticalMap'
import { QuestionContextChart } from './components/charts/QuestionContextChart'
import { ThemeRadar } from './components/charts/ThemeRadar'
import { CommunityPanel } from './components/results/CommunityPanel'
import {
  biasGuards,
  futureQuestions,
  methodologyAssumptions,
  partyProfiles,
  questions,
  researchFindings,
  responseOptions,
  sources,
  type GlossaryTerm,
  type Stance,
} from './data/content'
import {
  futureQuestionPresentations,
  futureThemeDisplayLabels,
  questionPresentations,
  themeDescriptionsFr,
  themeDisplayLabels,
} from './data/questionPresentation'
import {
  computeMatches,
  computePartyMapPosition,
  computeUserMapPosition,
  countAnsweredResponses,
  createBlankPriorityMap,
  createBlankResponseMap,
} from './lib/scoring'
import {
  ApiError,
  fetchPublicResultsSummary,
  saveAnonymousResults,
  trackAnonymousResultView,
} from './lib/resultsApi'
import { buildSubmissionPayload, type PublicResultsSummary } from './lib/resultsPersistence'

type Phase = 'intro' | 'quiz' | 'future' | 'results'
type QuestionMotion = 'idle' | 'enter' | 'exit'
type FutureResponseMap = Record<string, Stance | null>
type FutureScenarioChoiceMap = Record<string, string | null>

const sourceById = new Map(sources.map((source) => [source.id, source]))
const localizedResponseOptions = responseOptions.map((option) => {
  switch (option.value) {
    case -2:
      return { ...option, label: 'Opposition nette', shortLabel: 'Pas du tout' }
    case -1:
      return { ...option, label: 'Vous penchez contre', shortLabel: 'Plutôt non' }
    case 0:
      return { ...option, label: 'Vous nuancez ou hésitez', shortLabel: 'Mitigé' }
    case 1:
      return { ...option, label: 'Vous penchez pour', shortLabel: 'Plutôt oui' }
    case 2:
      return { ...option, label: 'Accord net', shortLabel: 'Tout à fait' }
    default:
      return option
  }
})
const answerPreviewDurationMs = 1050
const questionExitDurationMs = 220
const questionEnterDurationMs = 280

function createResultRunId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function createBlankFutureResponseMap(): FutureResponseMap {
  return Object.fromEntries(futureQuestions.map((question) => [question.id, null])) as FutureResponseMap
}

function createBlankFutureScenarioChoiceMap(): FutureScenarioChoiceMap {
  return Object.fromEntries(futureQuestions.map((question) => [question.id, null])) as FutureScenarioChoiceMap
}

function countCompletedFutureQuestions(
  responses: FutureResponseMap,
  scenarios: FutureScenarioChoiceMap,
) {
  return futureQuestions.filter(
    (question) => responses[question.id] !== null && scenarios[question.id] !== null,
  ).length
}

function describeScore(score: number) {
  if (score >= 80) {
    return 'Très forte proximité'
  }

  if (score >= 65) {
    return 'Proximité nette'
  }

  if (score >= 50) {
    return 'Affinité partielle'
  }

  return 'Distance importante'
}

function describeMapQuadrant(x: number, y: number) {
  const horizontal = x < -15 ? 'redistributif' : x > 15 ? 'pro-marché' : 'mixte'
  const vertical = y > 15 ? 'ouvert' : y < -15 ? 'souverainiste' : 'médian'

  return `${horizontal} / ${vertical}`
}

function describeEconomicProfile(x: number) {
  if (x <= -25) {
    return 'plutôt redistributif'
  }

  if (x >= 25) {
    return 'plutôt pro-marché'
  }

  return "plutôt mixte sur l'économie"
}

function describeOpennessProfile(y: number) {
  if (y >= 25) {
    return 'plutôt ouvert et intégrationniste'
  }

  if (y <= -25) {
    return 'plutôt souverainiste et restrictif'
  }

  return 'plutôt médian sur ouverture et souveraineté'
}

function axisBarPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round((value + 100) / 2)))
}

function describeStanceBadge(value: Stance) {
  if (value > 0) {
    return 'Pour'
  }

  if (value < 0) {
    return 'Contre'
  }

  return 'Nuance'
}

function describeStanceTone(value: Stance) {
  if (value > 0) {
    return 'for'
  }

  if (value < 0) {
    return 'against'
  }

  return 'mixed'
}

function renderGlossaryText(text: string, glossary: GlossaryTerm[]): ReactNode {
  if (glossary.length === 0) {
    return text
  }

  const sortedTerms = [...glossary].sort((left, right) => right.term.length - left.term.length)
  const segments: ReactNode[] = []
  const lowerText = text.toLowerCase()
  let cursor = 0

  while (cursor < text.length) {
    let nextMatch:
      | {
          index: number
          glossaryTerm: GlossaryTerm
        }
      | null = null

    for (const glossaryTerm of sortedTerms) {
      const index = lowerText.indexOf(glossaryTerm.term.toLowerCase(), cursor)

      if (index === -1) {
        continue
      }

      if (!nextMatch || index < nextMatch.index) {
        nextMatch = { index, glossaryTerm }
      }
    }

    if (!nextMatch) {
      segments.push(text.slice(cursor))
      break
    }

    if (nextMatch.index > cursor) {
      segments.push(text.slice(cursor, nextMatch.index))
    }

    const matchedText = text.slice(
      nextMatch.index,
      nextMatch.index + nextMatch.glossaryTerm.term.length,
    )

    segments.push(
      <span
        key={`${nextMatch.glossaryTerm.term}-${nextMatch.index}`}
        className="inline-term"
        tabIndex={0}
      >
        {matchedText}
        <span className="inline-term-tooltip" role="tooltip">
          {nextMatch.glossaryTerm.definition}
        </span>
      </span>,
    )

    cursor = nextMatch.index + nextMatch.glossaryTerm.term.length
  }

  return segments
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void
    }
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    setMatches(mediaQuery.matches)

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    legacyMediaQuery.addListener?.(handleChange)

    return () => {
      legacyMediaQuery.removeListener?.(handleChange)
    }
  }, [query])

  return matches
}

function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [responses, setResponses] = useState(createBlankResponseMap)
  const [priorities, setPriorities] = useState(createBlankPriorityMap)
  const [activeFutureQuestionIndex, setActiveFutureQuestionIndex] = useState(0)
  const [futureResponses, setFutureResponses] = useState(createBlankFutureResponseMap)
  const [futureScenarioChoices, setFutureScenarioChoices] = useState(createBlankFutureScenarioChoiceMap)
  const [selectedPartyId, setSelectedPartyId] = useState(partyProfiles[0].id)
  const [pendingAdvanceValue, setPendingAdvanceValue] = useState<Stance | null>(null)
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)
  const [questionMotion, setQuestionMotion] = useState<QuestionMotion>('idle')
  const [communitySaveStatus, setCommunitySaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [communitySaveError, setCommunitySaveError] = useState<string | null>(null)
  const [communitySummary, setCommunitySummary] = useState<PublicResultsSummary | null>(null)
  const [isCommunityRefreshing, setIsCommunityRefreshing] = useState(false)
  const [resultRunId, setResultRunId] = useState(createResultRunId)
  const [hasTrackedResultView, setHasTrackedResultView] = useState(false)

  const previewTimerRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)
  const enterTimerRef = useRef<number | null>(null)
  const matchesRef = useRef<ReturnType<typeof computeMatches>>([])

  const answeredCount = countAnsweredResponses(responses)
  const canComputeResults = answeredCount >= 10
  const matches = computeMatches(responses, priorities)
  const selectedMatch = matches.find((match) => match.party.id === selectedPartyId) ?? matches[0] ?? null
  const activeQuestion = questions[activeQuestionIndex]
  const currentValue = responses[activeQuestion.id]
  const activeFutureQuestion = futureQuestions[activeFutureQuestionIndex]
  const currentFutureValue = futureResponses[activeFutureQuestion.id]
  const currentFutureScenarioChoice = futureScenarioChoices[activeFutureQuestion.id]
  const activeQuestionPresentation = questionPresentations[activeQuestion.id]
  const activeFuturePresentation = futureQuestionPresentations[activeFutureQuestion.id]
  const completedFutureCount = countCompletedFutureQuestions(futureResponses, futureScenarioChoices)
  const selectedFutureSignals = futureQuestions
    .map((question) =>
      question.scenarios.find((scenario) => scenario.id === futureScenarioChoices[question.id]),
    )
    .filter((scenario): scenario is (typeof futureQuestions)[number]['scenarios'][number] => Boolean(scenario))
  const userMapPosition = computeUserMapPosition(responses)
  const economicProfile = describeEconomicProfile(userMapPosition.x)
  const opennessProfile = describeOpennessProfile(userMapPosition.y)
  const isFocusMode = phase === 'quiz' || phase === 'future'
  const isCompactQuestionLayout = useMediaQuery('(max-width: 860px)')
  const [isQuestionContextOpen, setIsQuestionContextOpen] = useState(false)

  useEffect(() => {
    matchesRef.current = matches
  }, [matches])

  useEffect(() => {
    return () => {
      if (previewTimerRef.current !== null) {
        window.clearTimeout(previewTimerRef.current)
      }
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current)
      }
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setCommunitySaveStatus('idle')
    setCommunitySaveError(null)
    setCommunitySummary(null)
    setIsCommunityRefreshing(false)
  }, [responses, priorities, futureResponses, futureScenarioChoices])

  useEffect(() => {
    if (phase !== 'results' || !canComputeResults || hasTrackedResultView) {
      return
    }

    let isCancelled = false
    setHasTrackedResultView(true)

    void trackAnonymousResultView(resultRunId).catch(() => {
      if (!isCancelled) {
        setHasTrackedResultView(false)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [canComputeResults, hasTrackedResultView, phase, resultRunId])

  useEffect(() => {
    if (!isCompactQuestionLayout) {
      setIsQuestionContextOpen(true)
      return
    }

    setIsQuestionContextOpen(false)
  }, [activeQuestionIndex, isCompactQuestionLayout])

  const clearAnimationTimers = () => {
    if (previewTimerRef.current !== null) {
      window.clearTimeout(previewTimerRef.current)
      previewTimerRef.current = null
    }
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current)
      exitTimerRef.current = null
    }
    if (enterTimerRef.current !== null) {
      window.clearTimeout(enterTimerRef.current)
      enterTimerRef.current = null
    }
  }

  const triggerEnterAnimation = () => {
    setQuestionMotion('enter')
    enterTimerRef.current = window.setTimeout(() => {
      setQuestionMotion('idle')
      setIsAnswerLocked(false)
    }, questionEnterDurationMs)
  }

  const goToResults = (force = false) => {
    clearAnimationTimers()
    setPendingAdvanceValue(null)
    setIsAnswerLocked(false)
    setQuestionMotion('idle')

    if (!force && !canComputeResults) {
      return
    }

    setPhase('results')

    if (matchesRef.current[0]) {
      setSelectedPartyId(matchesRef.current[0].party.id)
    }
  }

  const resetQuiz = () => {
    clearAnimationTimers()
    setPhase('intro')
    setActiveQuestionIndex(0)
    setResponses(createBlankResponseMap())
    setPriorities(createBlankPriorityMap())
    setActiveFutureQuestionIndex(0)
    setFutureResponses(createBlankFutureResponseMap())
    setFutureScenarioChoices(createBlankFutureScenarioChoiceMap())
    setSelectedPartyId(partyProfiles[0].id)
    setPendingAdvanceValue(null)
    setIsAnswerLocked(false)
    setQuestionMotion('idle')
    setCommunitySaveStatus('idle')
    setCommunitySaveError(null)
    setCommunitySummary(null)
    setIsCommunityRefreshing(false)
    setResultRunId(createResultRunId())
    setHasTrackedResultView(false)
  }

  const jumpToQuestion = (index: number) => {
    if (isAnswerLocked) {
      return
    }

    clearAnimationTimers()
    setActiveQuestionIndex(index)
    setPhase('quiz')
    setPendingAdvanceValue(null)
    triggerEnterAnimation()
  }

  const openFutureModule = () => {
    clearAnimationTimers()
    setPendingAdvanceValue(null)
    setIsAnswerLocked(false)
    setQuestionMotion('idle')
    setPhase('future')
  }

  const selectFutureResponse = (value: Stance) => {
    setFutureResponses((current) => ({
      ...current,
      [activeFutureQuestion.id]: value,
    }))
  }

  const selectFutureScenario = (scenarioId: string) => {
    setFutureScenarioChoices((current) => ({
      ...current,
      [activeFutureQuestion.id]: scenarioId,
    }))
  }

  const jumpToFutureQuestion = (index: number) => {
    setActiveFutureQuestionIndex(index)
    setPhase('future')
  }

  const advanceFutureQuestion = () => {
    const hasAnsweredStep = currentFutureValue !== null && currentFutureScenarioChoice !== null

    if (!hasAnsweredStep) {
      return
    }

    if (activeFutureQuestionIndex < futureQuestions.length - 1) {
      setActiveFutureQuestionIndex((current) => current + 1)
      return
    }

    setPhase('results')
  }

  const advanceQuestion = () => {
    if (isAnswerLocked) {
      return
    }

    if (activeQuestionIndex < questions.length - 1) {
      clearAnimationTimers()
      setActiveQuestionIndex(activeQuestionIndex + 1)
      triggerEnterAnimation()
      return
    }

    if (canComputeResults) {
      goToResults()
    }
  }

  const handleAnswer = (value: -2 | -1 | 0 | 1 | 2) => {
    if (isAnswerLocked) {
      return
    }

    const nextAnsweredCount = currentValue === null ? answeredCount + 1 : answeredCount
    const nextAction =
      activeQuestionIndex < questions.length - 1
        ? 'next'
        : nextAnsweredCount >= 10
          ? 'results'
          : 'stay'

    setResponses((current) => ({
      ...current,
      [activeQuestion.id]: value,
    }))
    setPendingAdvanceValue(value)
    setIsAnswerLocked(true)
    clearAnimationTimers()

    if (phase === 'intro') {
      setPhase('quiz')
    }

    previewTimerRef.current = window.setTimeout(() => {
      setQuestionMotion('exit')

      exitTimerRef.current = window.setTimeout(() => {
        setPendingAdvanceValue(null)

        if (nextAction === 'next') {
          setActiveQuestionIndex((current) => current + 1)
          triggerEnterAnimation()
          return
        }

        if (nextAction === 'results') {
          goToResults(true)
          return
        }

        setQuestionMotion('idle')
        setIsAnswerLocked(false)
      }, questionExitDurationMs)
    }, answerPreviewDurationMs)
  }

  const clearCurrentAnswer = () => {
    if (isAnswerLocked) {
      return
    }

    setResponses((current) => ({
      ...current,
      [activeQuestion.id]: null,
    }))
  }

  const togglePriority = () => {
    if (isAnswerLocked) {
      return
    }

    setPriorities((current) => ({
      ...current,
      [activeQuestion.id]: !current[activeQuestion.id],
    }))
  }

  const mapPoints: Array<{
    id: string
    label: string
    color: string
    x: number
    y: number
    isSelected?: boolean
    isUser?: boolean
  }> = matches.map((match) => {
    const position = computePartyMapPosition(match.party)

    return {
      id: match.party.id,
      label: match.party.shortName,
      color: match.party.color,
      x: position.x,
      y: position.y,
      isSelected: match.party.id === selectedPartyId,
    }
  })

  if (phase === 'results' && answeredCount > 0) {
    mapPoints.push({
      id: 'user',
      label: 'Vous',
      color: '#cc6842',
      x: userMapPosition.x,
      y: userMapPosition.y,
      isUser: true,
    })
  }

  const showGuideLayer = true
  const questionContextContent = showGuideLayer ? (
    <>
      <article className="question-context-overview">
        <div className="context-overview-block">
          <span className="guide-summary-label">En simple</span>
          <p>{activeQuestionPresentation.plainLanguage}</p>
        </div>

        <div className="context-overview-block">
          <span className="guide-summary-label">Le nœud du débat</span>
          <p>{activeQuestionPresentation.briefing.decisionFrame}</p>
          <small>{activeQuestionPresentation.example}</small>
        </div>
      </article>

      <section className="context-section-group">
        <p className="context-section-kicker">Pour situer le sujet</p>
        <div className="question-briefing-grid context-tiles-grid">
          <article className="guide-panel">
            <div className="guide-panel-header">
              <strong>Exemple récent</strong>
              <a
                href={activeQuestionPresentation.recentExample.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            </div>
            <p>{activeQuestionPresentation.recentExample.title}</p>
            <p>{activeQuestionPresentation.recentExample.context}</p>
            <p>{activeQuestionPresentation.recentExample.impact}</p>
          </article>

          <article className="guide-panel">
            <strong>Contexte actuel</strong>
            <p>{activeQuestionPresentation.briefing.currentState}</p>
          </article>
        </div>
      </section>

      <section className="context-section-group">
        <p className="context-section-kicker">Repères utiles</p>
        <div className="question-briefing-grid context-tiles-grid">
          <article className="guide-panel">
            <strong>Ce qui a déjà été tenté</strong>
            <p>{activeQuestionPresentation.briefing.previousPolicies}</p>
          </article>

          <article className="guide-panel">
            <strong>Pourquoi elle compte</strong>
            <p>{activeQuestionPresentation.whySelected}</p>
            <p>{activeQuestionPresentation.explainer}</p>
          </article>
        </div>
      </section>

      <section className="context-section-group">
        <p className="context-section-kicker">Données et repères</p>
        <QuestionContextChart visual={activeQuestionPresentation.briefing.visual} />
      </section>

      <section className="context-section-group">
        <p className="context-section-kicker">Pour aller plus loin</p>
        <article className="guide-panel">
          <ul className="source-link-list compact-sources">
            {activeQuestionPresentation.briefing.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  ) : null

  const handleSaveAnonymousResults = async () => {
    try {
      setCommunitySaveStatus('saving')
      setCommunitySaveError(null)

      const payload = buildSubmissionPayload({
        resultRunId,
        answeredCount,
        responses,
        priorities,
        matches,
        selectedPartyId,
        userMapPosition,
        futureResponses,
        futureScenarioChoices,
      })
      const result = await saveAnonymousResults(payload)

      setCommunitySummary(result.summary)
      setCommunitySaveStatus('saved')
    } catch (error) {
      setCommunitySaveStatus('error')
      setCommunitySaveError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Impossible de sauvegarder vos résultats pour le moment.',
      )
    }
  }

  const handleRefreshCommunitySummary = async () => {
    try {
      setIsCommunityRefreshing(true)
      setCommunitySaveError(null)
      setCommunitySummary(await fetchPublicResultsSummary())
    } catch (error) {
      setCommunitySaveError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Impossible de recharger les tendances pour le moment.',
      )
    } finally {
      setIsCommunityRefreshing(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">Comparateur de proximité politique</p>
          <h1>Je vote pour qui en 2027 ?</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={() => setPhase('quiz')}>
            Reprendre
          </button>
          <button type="button" className="primary-button" onClick={resetQuiz}>
            Réinitialiser
          </button>
        </div>
      </header>

      {phase === 'intro' && (
        <section className="hero-card">
          <div className="hero-copy">
            <div className="stats-row">
              <span className="stat-pill">8 profils majeurs</span>
              <span className="stat-pill">20 questions</span>
              <span className="stat-pill">Sources officielles au 8 mars 2026</span>
            </div>

            <p>
              Les programmes présidentiels 2027 ne sont pas encore publiés de manière
              comparable. Le site travaille donc sur des profils de partis et de blocs
              actuels, avec une architecture prête à accueillir des overlays candidats quand
              les candidatures seront documentées proprement.
            </p>
          </div>

          <div className="hero-aside">
            <p className="aside-label">Pourquoi ce format ?</p>
            <p>
              Les travaux sur les voting advice applications montrent que le biais vient
              souvent de mauvaises questions, d'un wording flou ou d'un algorithme opaque.
              Ici, tout est visible: questions fixes, sources officielles, distance de score
              simple, et résultats par thème.
            </p>
            <button type="button" className="primary-button" onClick={() => setPhase('quiz')}>
              Commencer le comparateur
            </button>
          </div>
        </section>
      )}

      <main className={`content-grid${isFocusMode ? ' is-focus-mode' : ''}`}>
        <section className="main-panel">
          {phase === 'intro' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Étape 1</p>
                  <h2>Le panel suivi</h2>
                </div>
                <button type="button" className="secondary-button" onClick={() => setPhase('quiz')}>
                  Aller au questionnaire
                </button>
              </div>

              <div className="party-grid">
                {partyProfiles.map((party) => (
                  <article
                    key={party.id}
                    className="party-card"
                    style={{ '--party-accent': party.color } as CSSProperties}
                  >
                    <div className="party-card-top">
                      <div className="party-tag-row">
                        <span className="party-dot" />
                        <p>{party.family}</p>
                      </div>
                      <span className="party-badge">{party.shortName}</span>
                    </div>
                    <h3>{party.name}</h3>
                    <p>{party.summary}</p>
                    <div className="party-note-row">
                      <span>{party.sourceIds.length} sources</span>
                      <span>{party.codingNotes.length} marqueurs</span>
                    </div>
                    <p className="muted-small">{party.currentFigures}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {phase === 'quiz' && (
            <div className="card quiz-shell">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Étape 2</p>
                  <h2>Questionnaire</h2>
                  <p className="supporting-copy">
                    Répondez sur une échelle de cinq positions. Une question peut être sautée.
                    Les questions marquées comme décisives comptent double.
                  </p>
                </div>
                <div className="progress-cluster">
                  <strong>
                    {answeredCount}/{questions.length}
                  </strong>
                  <span>réponses renseignées</span>
                </div>
              </div>

              <div className="progress-bar">
                <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
              </div>

              <div className="question-rail" aria-label="Navigation dans les questions">
                {questions.map((question, index) => {
                  const isAnswered = responses[question.id] !== null
                  const isActive = index === activeQuestionIndex

                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={`rail-button${isAnswered ? ' answered' : ''}${isActive ? ' active' : ''}`}
                      onClick={() => jumpToQuestion(index)}
                      aria-label={`Question ${index + 1}`}
                      disabled={isAnswerLocked}
                    >
                      <span>{index + 1}</span>
                    </button>
                  )
                })}
              </div>

              <article
                className={`question-card${questionMotion !== 'idle' ? ` is-${questionMotion}` : ''}${
                  isAnswerLocked ? ' is-answering' : ''
                }`}
              >
                <div className={`question-workspace${showGuideLayer ? '' : ' is-compact'}`}>
                  <div className="question-main-column">
                    <section className="question-prompt-panel">
                      <div className="question-head-row">
                        <div className="question-meta">
                          <span className="theme-chip">{themeDisplayLabels[activeQuestion.theme]}</span>
                          <span className="question-counter">
                            Question {activeQuestionIndex + 1} sur {questions.length}
                          </span>
                        </div>

                        <div className="question-inline-nav">
                          <button
                            type="button"
                            className="compact-nav-button"
                            onClick={() => jumpToQuestion(Math.max(0, activeQuestionIndex - 1))}
                            disabled={activeQuestionIndex === 0 || isAnswerLocked}
                          >
                            Précédente
                          </button>
                          <button
                            type="button"
                            className="compact-nav-button"
                            onClick={advanceQuestion}
                            disabled={isAnswerLocked}
                          >
                            Passer
                          </button>
                        </div>
                      </div>

                      <h3>
                        {renderGlossaryText(
                          activeQuestionPresentation.statement,
                          activeQuestionPresentation.glossary,
                        )}
                      </h3>

                      {showGuideLayer && activeQuestionPresentation.glossary.length > 0 && (
                        <p className="glossary-hint">
                          Définitions sur les mots soulignés.
                        </p>
                      )}
                    </section>

                    <section className="question-stage question-stage-response">
                      <div className="question-stage-heading">
                        <span className="question-stage-index">1</span>
                        <div>
                          <strong>Votre position</strong>
                          <p>Choisissez l’option la plus proche de votre intuition.</p>
                        </div>
                      </div>

                      <div className="answer-grid">
                        {localizedResponseOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`answer-button${currentValue === option.value ? ' selected' : ''}${
                              pendingAdvanceValue === option.value ? ' pending' : ''
                            }`}
                            onClick={() => handleAnswer(option.value)}
                            disabled={isAnswerLocked}
                          >
                            <span>{option.shortLabel}</span>
                            <small>{option.label}</small>
                          </button>
                        ))}
                      </div>
                    </section>

                    {showGuideLayer && (
                      <section className="question-stage question-stage-compare">
                        <div className="question-stage-heading">
                          <span className="question-stage-index">2</span>
                          <div>
                            <strong>Ce que chaque choix implique</strong>
                            <p>Deux lectures rapides pour tester ce que vous privilégiez vraiment.</p>
                          </div>
                        </div>

                        <div className="policy-compare-grid">
                          <article className="policy-column policy-column-for">
                            <div className="policy-column-header">
                              <span className="policy-column-kicker policy-column-kicker-for">Pour</span>
                              <strong>{activeQuestionPresentation.briefing.ifFor.label}</strong>
                            </div>
                            <div className="policy-list-block">
                              <h4>Ce que vous privilégiez</h4>
                              <ul className="bullet-list compact-bullets">
                                {activeQuestionPresentation.briefing.ifFor.gains.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="policy-list-block">
                              <h4>Ce que vous acceptez en retour</h4>
                              <ul className="bullet-list compact-bullets">
                                {activeQuestionPresentation.briefing.ifFor.risks.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          </article>

                          <article className="policy-column policy-column-against">
                            <div className="policy-column-header">
                              <span className="policy-column-kicker policy-column-kicker-against">Contre</span>
                              <strong>{activeQuestionPresentation.briefing.ifAgainst.label}</strong>
                            </div>
                            <div className="policy-list-block">
                              <h4>Ce que vous protégez</h4>
                              <ul className="bullet-list compact-bullets">
                                {activeQuestionPresentation.briefing.ifAgainst.gains.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="policy-list-block">
                              <h4>Ce que vous acceptez en retour</h4>
                              <ul className="bullet-list compact-bullets">
                                {activeQuestionPresentation.briefing.ifAgainst.risks.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          </article>
                        </div>
                      </section>
                    )}

                    <div className="question-notes">
                      <button
                        type="button"
                        className={`priority-toggle${priorities[activeQuestion.id] ? ' active' : ''}`}
                        onClick={togglePriority}
                      >
                        {priorities[activeQuestion.id] ? 'Question décisive' : 'Marquer comme décisive'}
                      </button>
                    </div>

                    <div className="question-actions">
                      <div className="inline-actions">
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={clearCurrentAnswer}
                          disabled={isAnswerLocked}
                        >
                          Effacer
                        </button>
                      </div>

                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => goToResults()}
                        disabled={!canComputeResults || isAnswerLocked}
                      >
                        Voir mes proximités
                      </button>
                    </div>

                    {!canComputeResults && (
                      <p className="helper-text">
                        Il faut au moins 10 réponses pour calculer un classement exploitable.
                      </p>
                    )}
                  </div>

                  {showGuideLayer && (
                    <aside className="question-context-column">
                      {isCompactQuestionLayout ? (
                        <details
                          className="question-context-disclosure"
                          open={isQuestionContextOpen}
                          onToggle={(event) => setIsQuestionContextOpen(event.currentTarget.open)}
                        >
                          <summary>
                            <div className="question-context-summary">
                              <span className="context-column-label">Contexte pour décider</span>
                              <span className="question-context-summary-text">
                                Exemples, repères et données pour situer cette question.
                              </span>
                            </div>
                          </summary>
                          <div className="question-context-scroll">{questionContextContent}</div>
                        </details>
                      ) : (
                        <>
                          <p className="context-column-label">Contexte pour décider</p>
                          <div className="question-context-scroll">{questionContextContent}</div>
                        </>
                      )}
                    </aside>
                  )}
                </div>
              </article>
            </div>
          )}

          {phase === 'future' && (
            <div className="card future-shell">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Étape 2 bis</p>
                  <h2>Module futur 2027</h2>
                  <p className="supporting-copy">
                    Cinq questions séparées du score principal, sur des enjeux encore peu fixés
                    dans les programmes. Chaque question est suivie de trajectoires anonymisées.
                  </p>
                </div>
                <div className="progress-cluster">
                  <strong>
                    {completedFutureCount}/{futureQuestions.length}
                  </strong>
                  <span>questions complètes</span>
                </div>
              </div>

              <div className="progress-bar">
                <span style={{ width: `${(completedFutureCount / futureQuestions.length) * 100}%` }} />
              </div>

              <div className="question-rail" aria-label="Navigation dans les questions futures">
                {futureQuestions.map((question, index) => {
                  const isAnswered =
                    futureResponses[question.id] !== null && futureScenarioChoices[question.id] !== null
                  const isActive = index === activeFutureQuestionIndex

                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={`rail-button${isAnswered ? ' answered' : ''}${isActive ? ' active' : ''}`}
                      onClick={() => jumpToFutureQuestion(index)}
                    >
                      <span>{index + 1}</span>
                    </button>
                  )
                })}
              </div>

              <article className="question-card future-question-card">
                <div className="question-meta">
                  <span className="theme-chip">
                    {futureThemeDisplayLabels[activeFutureQuestion.theme]}
                  </span>
                  <span className="muted-small">
                    Question {activeFutureQuestionIndex + 1} sur {futureQuestions.length}
                  </span>
                </div>

                <h3>
                  {renderGlossaryText(
                    activeFuturePresentation.statement,
                    activeFuturePresentation.glossary,
                  )}
                </h3>

                {showGuideLayer && activeFuturePresentation.glossary.length > 0 && (
                  <p className="glossary-hint">
                    Survolez ou touchez les mots soulignés pour voir une définition.
                  </p>
                )}

                {showGuideLayer && (
                  <section className="guide-section future-guide-section">
                    <article className="guide-summary-tile guide-summary-tile-accent">
                      <span className="guide-summary-label">En clair</span>
                      <p>{activeFuturePresentation.plainLanguage}</p>
                    </article>
                  </section>
                )}

                <div className="answer-grid future-answer-grid">
                  {localizedResponseOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`answer-button${currentFutureValue === option.value ? ' selected' : ''}`}
                      onClick={() => selectFutureResponse(option.value)}
                    >
                      <span>{option.shortLabel}</span>
                      <small>{option.label}</small>
                    </button>
                  ))}
                </div>

                <section className="future-scenario-panel">
                  <div className="future-scenario-header">
                    <div>
                      <p className="eyebrow">Policy Lab</p>
                      <h4>Quelle trajectoire vous semble la plus convaincante ?</h4>
                    </div>
                    <p className="muted-small">Propositions anonymisées, sans étiquette partisane.</p>
                  </div>

                  <div className="future-scenario-grid">
                    {activeFutureQuestion.scenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        className={`future-scenario-card${
                          currentFutureScenarioChoice === scenario.id ? ' active' : ''
                        }`}
                        onClick={() => selectFutureScenario(scenario.id)}
                      >
                        <span className="result-score-pill">{scenario.label}</span>
                        <h4>{scenario.title}</h4>
                        <p>{scenario.summary}</p>
                        <small>{scenario.rationale}</small>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="question-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => jumpToFutureQuestion(Math.max(0, activeFutureQuestionIndex - 1))}
                    disabled={activeFutureQuestionIndex === 0}
                  >
                    Question précédente
                  </button>

                  <div className="inline-actions">
                    <button type="button" className="ghost-button" onClick={() => setPhase('results')}>
                      Passer le module
                    </button>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={advanceFutureQuestion}
                    disabled={currentFutureValue === null || currentFutureScenarioChoice === null}
                  >
                    {activeFutureQuestionIndex < futureQuestions.length - 1
                      ? 'Question suivante'
                      : 'Revenir aux résultats'}
                  </button>
                </div>

                {(currentFutureValue === null || currentFutureScenarioChoice === null) && (
                  <p className="helper-text">
                    Choisissez votre position, puis la trajectoire anonymisée qui vous paraît la
                    plus convaincante.
                  </p>
                )}

                {showGuideLayer && (
                  <details className="guide-disclosure">
                    <summary>Comprendre le sujet et pourquoi il compte déjà</summary>
                    <div className="guide-disclosure-content">
                      <article className="guide-panel">
                        <strong>Ce que la question mesure</strong>
                        <p>{activeFuturePresentation.explainer}</p>
                      </article>

                      <article className="guide-panel">
                        <div className="guide-panel-header">
                          <strong>Pourquoi maintenant</strong>
                          <a href={activeFuturePresentation.sourceUrl} target="_blank" rel="noreferrer">
                            Source
                          </a>
                        </div>
                        <p>{activeFuturePresentation.whyNow}</p>
                        <p>{activeFuturePresentation.sourceLabel}</p>
                      </article>
                    </div>
                  </details>
                )}
              </article>
            </div>
          )}

          {phase === 'results' && selectedMatch && (
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Étape 3</p>
                  <h2>Vos proximités</h2>
                  <p className="supporting-copy">
                    Classement calculé sur {selectedMatch.answeredCount} réponses sur {questions.length}.
                    Les questions non répondues sont ignorées; les questions décisives comptent double.
                  </p>
                </div>
                <div className="result-summary">
                  <small>Top match actuel</small>
                  <strong>{selectedMatch.score}%</strong>
                  <span>{describeScore(selectedMatch.score)}</span>
                </div>
              </div>

              <div className="result-overview-grid">
                <article className="profile-summary-card">
                  <p className="eyebrow">Votre profil</p>
                  <h3>
                    {economicProfile} / {opennessProfile}
                  </h3>
                  <p>
                    Votre profil est calculé à partir de vos réponses, pas seulement de votre
                    meilleur match. Il résume où vous vous situez sur les deux axes du comparateur.
                  </p>

                  <div className="profile-axis-stack">
                    <div className="profile-axis-card">
                      <div className="profile-axis-header">
                        <strong>Économie</strong>
                        <span>{economicProfile}</span>
                      </div>
                      <div className="profile-axis-labels">
                        <span>Redistributif</span>
                        <span>Pro-marché</span>
                      </div>
                      <div className="profile-axis-bar">
                        <span style={{ left: `${axisBarPercent(userMapPosition.x)}%` }} />
                      </div>
                    </div>

                    <div className="profile-axis-card">
                      <div className="profile-axis-header">
                        <strong>Ouverture</strong>
                        <span>{opennessProfile}</span>
                      </div>
                      <div className="profile-axis-labels">
                        <span>Souverainiste</span>
                        <span>Ouvert</span>
                      </div>
                      <div className="profile-axis-bar">
                        <span style={{ left: `${axisBarPercent(userMapPosition.y)}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="muted-small">
                    Point sur la carte: {describeMapQuadrant(userMapPosition.x, userMapPosition.y)}.
                    Couverture des axes: {userMapPosition.coverage}%.
                  </p>
                </article>

                <article className="profile-summary-card">
                  <p className="eyebrow">Vos scores</p>
                  <h3>Répartition par parti</h3>
                  <p>
                    Vos proximités restent visibles pour tous les profils, afin de comparer votre
                    meilleur match avec vos seconds choix.
                  </p>

                  <div className="profile-score-list">
                    {matches.map((match) => (
                      <div key={match.party.id} className="profile-score-row">
                        <span>{match.party.shortName}</span>
                        <div className="mini-bar">
                          <span style={{ width: `${match.score}%` }} />
                        </div>
                        <strong>{match.score}%</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <section className="future-module-card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">Module futur 2027</p>
                    <h3>Boussole hors programmes</h3>
                    <p className="supporting-copy">
                      Ce module n'entre pas dans le score principal. Il sert à capter vos
                      arbitrages sur cinq sujets d'avenir encore mal figés dans les programmes.
                    </p>
                  </div>
                  <button type="button" className="secondary-button" onClick={openFutureModule}>
                    {completedFutureCount === 0
                      ? 'Commencer'
                      : completedFutureCount < futureQuestions.length
                        ? 'Continuer'
                        : 'Modifier'}
                  </button>
                </div>

                {completedFutureCount > 0 ? (
                  <>
                    <div className="future-signal-list">
                      {selectedFutureSignals.map((scenario) => (
                        <span key={scenario.id} className="future-signal-chip">
                          {scenario.signalLabel}
                        </span>
                      ))}
                    </div>

                    <div className="future-answer-list">
                      {futureQuestions.map((question) => {
                        const selectedScenario = question.scenarios.find(
                          (scenario) => scenario.id === futureScenarioChoices[question.id],
                        )
                        const selectedResponse = futureResponses[question.id]

                        if (!selectedScenario || selectedResponse === null) {
                          return null
                        }

                        return (
                          <article key={question.id} className="future-answer-card">
                            <div className="future-answer-top">
                              <strong>{futureThemeDisplayLabels[question.theme]}</strong>
                              <span
                                className={`stance-badge stance-badge-${describeStanceTone(selectedResponse)}`}
                              >
                                {describeStanceBadge(selectedResponse)}
                              </span>
                            </div>
                            <p>{futureQuestionPresentations[question.id].statement}</p>
                            <div className="agreement-badge-row">
                              <span className="future-signal-chip">{selectedScenario.label}</span>
                              <span className="stance-badge stance-badge-subtle stance-badge-mixed">
                                {selectedScenario.signalLabel}
                              </span>
                            </div>
                            <p className="muted-small">{selectedScenario.title}</p>
                          </article>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="muted-small">
                    Activez ce module pour ajouter une lecture plus prospective à vos résultats,
                    sans changer votre classement de proximité avec les partis.
                  </p>
                )}
              </section>

              <CommunityPanel
                saveStatus={communitySaveStatus}
                saveError={communitySaveError}
                summary={communitySummary}
                isRefreshing={isCommunityRefreshing}
                onSave={handleSaveAnonymousResults}
                onRefresh={handleRefreshCommunitySummary}
              />

              <div className="result-card-grid">
                {matches.map((match, index) => {
                  const mapPosition = computePartyMapPosition(match.party)

                  return (
                    <button
                      key={match.party.id}
                      type="button"
                      className={`result-party-card${selectedPartyId === match.party.id ? ' active' : ''}`}
                      onClick={() => setSelectedPartyId(match.party.id)}
                      style={{ '--party-accent': match.party.color } as CSSProperties}
                    >
                      <div className="result-party-top">
                        <span className="ranking-position">#{index + 1}</span>
                        <span className="result-score-pill">{match.score}%</span>
                      </div>
                      <h3>{match.party.shortName}</h3>
                      <p>{match.party.name}</p>
                      <div className="mini-bar">
                        <span style={{ width: `${match.score}%` }} />
                      </div>
                      <div className="result-card-meta">
                        <span>{match.party.family}</span>
                        <span>{describeMapQuadrant(mapPosition.x, mapPosition.y)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="visual-grid">
                <PoliticalMap points={mapPoints} />
                <ThemeRadar scores={selectedMatch.themeScores} />
              </div>

              <div className="results-layout">
                <article
                  className="detail-card"
                  style={{ '--party-accent': selectedMatch.party.color } as CSSProperties}
                >
                  <div className="detail-top">
                    <div>
                      <p className="eyebrow">Profil sélectionné</p>
                      <h3>{selectedMatch.party.name}</h3>
                      <p>{selectedMatch.party.summary}</p>
                    </div>
                    <div className="detail-score-badge">
                      <strong>{selectedMatch.score}%</strong>
                      <span>{describeScore(selectedMatch.score)}</span>
                    </div>
                  </div>

                  <div className="selected-profile-meta">
                    <p className="muted-small">{selectedMatch.party.currentFigures}</p>
                    <p className="muted-small">{selectedMatch.party.inclusionNote}</p>
                    <p className="muted-small">
                      Votre point sur la carte: {describeMapQuadrant(userMapPosition.x, userMapPosition.y)}.
                      Couverture des axes: {userMapPosition.coverage}%.
                    </p>
                  </div>

                  <section className="theme-score-grid">
                    {Object.entries(themeDescriptionsFr).map(([theme, description]) => (
                      <article key={theme} className="theme-score-card">
                        <div className="theme-score-top">
                          <strong>{themeDisplayLabels[theme as keyof typeof themeDisplayLabels]}</strong>
                          <span>{selectedMatch.themeScores[theme as keyof typeof selectedMatch.themeScores] ?? 0}%</span>
                        </div>
                        <div className="mini-bar">
                          <span
                            style={{
                              width: `${selectedMatch.themeScores[theme as keyof typeof selectedMatch.themeScores] ?? 0}%`,
                            }}
                          />
                        </div>
                        <p>{description}</p>
                      </article>
                    ))}
                  </section>

                  <div className="agreement-grid">
                    <section>
                      <h4>Vos convergences les plus fortes</h4>
                      <ul className="agreement-list">
                        {selectedMatch.topAgreements.map((entry) => (
                          <li key={entry.question.id} className="agreement-item">
                            <div className="agreement-badge-row">
                              <span
                                className={`stance-badge stance-badge-${describeStanceTone(entry.partyValue)}`}
                              >
                                {selectedMatch.party.shortName}: {describeStanceBadge(entry.partyValue)}
                              </span>
                              <span
                                className={`stance-badge stance-badge-subtle stance-badge-${describeStanceTone(entry.userValue)}`}
                              >
                                Vous: {describeStanceBadge(entry.userValue)}
                              </span>
                            </div>
                            <p>{questionPresentations[entry.question.id].statement}</p>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h4>Vos plus grands écarts</h4>
                      <ul className="agreement-list">
                        {selectedMatch.topTensions.map((entry) => (
                          <li key={entry.question.id} className="agreement-item">
                            <div className="agreement-badge-row">
                              <span
                                className={`stance-badge stance-badge-${describeStanceTone(entry.partyValue)}`}
                              >
                                {selectedMatch.party.shortName}: {describeStanceBadge(entry.partyValue)}
                              </span>
                              <span
                                className={`stance-badge stance-badge-subtle stance-badge-${describeStanceTone(entry.userValue)}`}
                              >
                                Vous: {describeStanceBadge(entry.userValue)}
                              </span>
                            </div>
                            <p>{questionPresentations[entry.question.id].statement}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <section className="source-panel">
                    <h4>Corpus ayant servi au codage</h4>
                    <ul className="source-link-list">
                      {selectedMatch.party.sourceIds.map((sourceId) => {
                        const source = sourceById.get(sourceId)

                        if (!source) {
                          return null
                        }

                        return (
                          <li key={source.id}>
                            <a href={source.url} target="_blank" rel="noreferrer">
                              {source.title}
                            </a>
                            <span>{source.note}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                </article>
              </div>

              <div className="question-actions">
                <button type="button" className="secondary-button" onClick={() => setPhase('quiz')}>
                  Revoir mes réponses
                </button>
                <button type="button" className="primary-button" onClick={resetQuiz}>
                  Recommencer le test
                </button>
              </div>
            </div>
          )}
        </section>

        {!isFocusMode && (
          <aside className="sidebar">
            <section className="card compact-card">
              <p className="eyebrow">Cadre de travail</p>
              <h2>Hypothèses</h2>
              <ul className="bullet-list">
                {methodologyAssumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ul>
            </section>

            <section className="card compact-card">
              <p className="eyebrow">Anti-biais</p>
              <h2>Garde-fous</h2>
              <ul className="bullet-list">
                {biasGuards.map((guard) => (
                  <li key={guard}>{guard}</li>
                ))}
              </ul>
            </section>

            <section className="card compact-card">
              <p className="eyebrow">Recherche VAA</p>
              <h2>Ce que disent les articles</h2>
              <div className="research-stack">
                {researchFindings.map((finding) => (
                  <article key={finding.id} className="research-card">
                    <div>
                      <strong>{finding.title}</strong>
                      <p>{finding.takeaway}</p>
                    </div>
                    <a href={finding.url} target="_blank" rel="noreferrer">
                      Ouvrir la source
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className="card compact-card">
              <p className="eyebrow">Corpus</p>
              <h2>Sources par profil</h2>
              <div className="details-stack">
                {partyProfiles.map((party) => (
                  <details key={party.id}>
                    <summary>{party.name}</summary>
                    <ul className="source-link-list">
                      {party.sourceIds.map((sourceId) => {
                        const source = sourceById.get(sourceId)

                        if (!source) {
                          return null
                        }

                        return (
                          <li key={source.id}>
                            <a href={source.url} target="_blank" rel="noreferrer">
                              {source.title}
                            </a>
                            <span>{source.note}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                ))}
              </div>
            </section>
          </aside>
        )}
      </main>

      <footer className="footer-note">
        Comparateur informatif. Il affiche une proximité avec des profils-programmes, pas une
        recommandation électorale personnalisée.
      </footer>
    </div>
  )
}

export default App
