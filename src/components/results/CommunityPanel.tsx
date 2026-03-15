import {
  futureQuestions,
  partyProfiles,
} from '../../data/content'
import {
  futureQuestionPresentations,
  futureThemeDisplayLabels,
} from '../../data/questionPresentation'
import type { PublicResultsSummary } from '../../lib/resultsPersistence'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface CommunityPanelProps {
  saveStatus: SaveStatus
  saveError: string | null
  summary: PublicResultsSummary | null
  isRefreshing: boolean
  onSave: () => void
  onRefresh: () => void
}

const compactNumberFormatter = new Intl.NumberFormat('fr-FR')
const decimalFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
})

const partyById = new Map(partyProfiles.map((party) => [party.id, party]))
const futureQuestionById = new Map(futureQuestions.map((question) => [question.id, question]))

function axisBarPercent(value: number | null) {
  if (value === null) {
    return 50
  }

  return Math.max(0, Math.min(100, Math.round((value + 100) / 2)))
}

function formatAverage(value: number | null, suffix = '') {
  if (value === null) {
    return 'N/A'
  }

  return `${decimalFormatter.format(value)}${suffix}`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function CommunityPanel({
  saveStatus,
  saveError,
  summary,
  isRefreshing,
  onSave,
  onRefresh,
}: CommunityPanelProps) {
  const leadingParty =
    summary?.topPartyDistribution[0] && partyById.get(summary.topPartyDistribution[0].partyId)
      ? {
          party: partyById.get(summary.topPartyDistribution[0].partyId)!,
          count: summary.topPartyDistribution[0].count,
          share: summary.topPartyDistribution[0].share,
        }
      : null

  return (
    <section className="community-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Contribution anonyme</p>
          <h3>Débloquer les résultats collectifs</h3>
          <p className="supporting-copy">
            Pour voir les résultats de l’ensemble des participants, vous devez accepter la
            sauvegarde anonymisée de votre résultat. Le serveur n’enregistre ni compte, ni
            email, ni texte libre: uniquement un instantané anonymisé utile aux statistiques
            collectives.
          </p>
        </div>

        <div className="community-actions">
          {saveStatus === 'saved' ? (
            <button
              type="button"
              className="secondary-button"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Actualisation...' : 'Actualiser les tendances'}
            </button>
          ) : (
            <button
              type="button"
              className="primary-button"
              onClick={onSave}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving'
                ? 'Sauvegarde en cours...'
                : 'Accepter et sauvegarder mes résultats anonymisés'}
            </button>
          )}
        </div>
      </div>

      {saveStatus !== 'saved' && (
        <div className="community-note">
          <p className="muted-small">
            Sans sauvegarde anonymisée, les statistiques collectives restent masquées. Votre
            contribution sert à alimenter le panel affiché en fin de parcours.
          </p>
        </div>
      )}

      {saveError && <p className="helper-text helper-text-error">{saveError}</p>}

      {saveStatus === 'saved' && summary && (
        <div className="community-stack">
          <div className="summary-stat-grid">
            <article className="summary-stat-card">
              <span className="summary-stat-label">Résultats affichés</span>
              <strong>{compactNumberFormatter.format(summary.totalResultViews)}</strong>
              <small>comparateurs terminés</small>
            </article>

            <article className="summary-stat-card">
              <span className="summary-stat-label">Résultats sauvegardés</span>
              <strong>{compactNumberFormatter.format(summary.savedResultsCount)}</strong>
              <small>instantanés anonymisés</small>
            </article>

            <article className="summary-stat-card">
              <span className="summary-stat-label">Taux de sauvegarde</span>
              <strong>{formatAverage(summary.saveRate, '%')}</strong>
              <small>parmi les résultats affichés</small>
            </article>

            <article className="summary-stat-card">
              <span className="summary-stat-label">Score moyen du top match</span>
              <strong>{formatAverage(summary.averageTopScore, '%')}</strong>
              <small>sur les résultats enregistrés</small>
            </article>

            <article className="summary-stat-card">
              <span className="summary-stat-label">Questions renseignées</span>
              <strong>{formatAverage(summary.averageAnsweredCount)}</strong>
              <small>moyenne par réponse</small>
            </article>

            <article className="summary-stat-card">
              <span className="summary-stat-label">Dernière mise à jour</span>
              <strong>{formatDate(summary.generatedAt)}</strong>
              <small>données agrégées</small>
            </article>
          </div>

          <div className="community-grid">
            <article className="profile-summary-card">
              <p className="eyebrow">Top match collectif</p>
              <h3>
                {leadingParty ? leadingParty.party.name : 'Pas encore de tendance consolidée'}
              </h3>
              <p>
                {leadingParty
                  ? `${leadingParty.party.shortName} arrive actuellement en tête sur ${decimalFormatter.format(leadingParty.share)} % des résultats sauvegardés.`
                  : 'Les premières tendances apparaîtront dès que plusieurs réponses auront été enregistrées.'}
              </p>

              <div className="profile-score-list">
                {summary.topPartyDistribution.map((entry) => {
                  const party = partyById.get(entry.partyId)

                  if (!party) {
                    return null
                  }

                  return (
                    <div key={entry.partyId} className="profile-score-row">
                      <span>{party.shortName}</span>
                      <div className="mini-bar">
                        <span
                          style={{
                            width: `${entry.share}%`,
                            background: party.color,
                          }}
                        />
                      </div>
                      <strong>{decimalFormatter.format(entry.share)}%</strong>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="profile-summary-card">
              <p className="eyebrow">Boussole collective</p>
              <h3>Position moyenne du panel</h3>
              <p>
                Ces deux axes résument la tendance moyenne des participants sur l’économie et
                l’ouverture.
              </p>

              <div className="profile-axis-stack">
                <div className="profile-axis-card">
                  <div className="profile-axis-header">
                    <strong>Économie</strong>
                    <span>{formatAverage(summary.averageEconomicX)}</span>
                  </div>
                  <div className="profile-axis-labels">
                    <span>Redistributif</span>
                    <span>Pro-marché</span>
                  </div>
                  <div className="profile-axis-bar">
                    <span style={{ left: `${axisBarPercent(summary.averageEconomicX)}%` }} />
                  </div>
                </div>

                <div className="profile-axis-card">
                  <div className="profile-axis-header">
                    <strong>Ouverture</strong>
                    <span>{formatAverage(summary.averageOpennessY)}</span>
                  </div>
                  <div className="profile-axis-labels">
                    <span>Souverainiste</span>
                    <span>Ouvert</span>
                  </div>
                  <div className="profile-axis-bar">
                    <span style={{ left: `${axisBarPercent(summary.averageOpennessY)}%` }} />
                  </div>
                </div>
              </div>
            </article>
          </div>

          {summary.futureScenarioDistribution.length > 0 && (
            <section className="future-community-section">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Module futur 2027</p>
                  <h3>Trajectoires les plus retenues</h3>
                </div>
              </div>

              <div className="future-community-grid">
                {summary.futureScenarioDistribution.map((entry) => {
                  const question = futureQuestionById.get(entry.questionId)

                  if (!question) {
                    return null
                  }

                  return (
                    <article key={entry.questionId} className="future-community-card">
                      <div className="future-answer-top">
                        <strong>{futureThemeDisplayLabels[question.theme]}</strong>
                        <span className="muted-small">
                          {compactNumberFormatter.format(entry.total)} réponses
                        </span>
                      </div>

                      <p>{futureQuestionPresentations[entry.questionId].statement}</p>

                      <div className="profile-score-list">
                        {entry.scenarios.map((scenarioEntry) => {
                          const scenario = question.scenarios.find(
                            (candidate) => candidate.id === scenarioEntry.scenarioId,
                          )

                          if (!scenario) {
                            return null
                          }

                          return (
                            <div key={scenario.id} className="profile-score-row">
                              <span>{scenario.label}</span>
                              <div className="mini-bar">
                                <span style={{ width: `${scenarioEntry.share}%` }} />
                              </div>
                              <strong>{decimalFormatter.format(scenarioEntry.share)}%</strong>
                            </div>
                          )
                        })}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  )
}
