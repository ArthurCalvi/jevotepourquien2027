import { type QuestionVisual } from '../../data/questionPresentation'

interface QuestionContextChartProps {
  visual: QuestionVisual
}

function formatValue(value: number, suffix = '') {
  const formatted =
    value % 1 === 0
      ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)
      : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value)

  return `${formatted}${suffix}`
}

export function QuestionContextChart({ visual }: QuestionContextChartProps) {
  if (visual.kind === 'bars') {
    const maxValue = Math.max(...visual.items.map((item) => item.value), 1)

    return (
      <section className="question-visual-card">
        <div className="question-visual-header">
          <div>
            <p className="eyebrow">Chiffres-clés</p>
            <h4>{visual.title}</h4>
          </div>
          <p className="muted-small">{visual.subtitle}</p>
        </div>

        <div className="question-bars-grid">
          {visual.items.map((item) => (
            <article key={item.label} className="question-bar-card">
              <div className="question-bar-top">
                <strong>{item.label}</strong>
                <span>{formatValue(item.value, item.suffix)}</span>
              </div>
              <div className="question-bar-track">
                <span style={{ width: `${(item.value / maxValue) * 100}%` }} />
              </div>
              <p>{item.note}</p>
            </article>
          ))}
        </div>

        <a href={visual.sourceUrl} target="_blank" rel="noreferrer" className="question-visual-source">
          {visual.sourceLabel}
        </a>
      </section>
    )
  }

  return (
    <section className="question-visual-card">
      <div className="question-visual-header">
        <div>
          <p className="eyebrow">Repères</p>
          <h4>{visual.title}</h4>
        </div>
        <p className="muted-small">{visual.subtitle}</p>
      </div>

      <div className="question-timeline">
        {visual.items.map((item) => (
          <article key={`${item.label}-${item.title}`} className="question-timeline-item">
            <span className="question-timeline-year">{item.label}</span>
            <div className="question-timeline-body">
              <strong>{item.title}</strong>
              <p>{item.note}</p>
            </div>
          </article>
        ))}
      </div>

      <a href={visual.sourceUrl} target="_blank" rel="noreferrer" className="question-visual-source">
        {visual.sourceLabel}
      </a>
    </section>
  )
}
