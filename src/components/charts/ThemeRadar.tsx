import { type Theme } from '../../data/content'
import { themeDescriptionsFr, themeDisplayLabels } from '../../data/questionPresentation'

interface ThemeRadarProps {
  scores: Record<Theme, number>
}

const shortThemeLabels: Record<Theme, string> = {
  Europe: 'Europe',
  'Ordre & societe': 'Société',
  Institutions: 'Institutions',
  'Economie & social': 'Éco-social',
  'Ecologie & energie': 'Écologie',
  International: 'International',
}

const width = 400
const height = 360
const centerX = width / 2
const centerY = height / 2
const radius = 118

function polarPoint(index: number, total: number, scale: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2

  return {
    x: centerX + Math.cos(angle) * scale,
    y: centerY + Math.sin(angle) * scale,
  }
}

function polygonPath(values: number[]) {
  return values
    .map((value, index) => {
      const point = polarPoint(index, values.length, (value / 100) * radius)
      return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    })
    .join(' ')
}

export function ThemeRadar({ scores }: ThemeRadarProps) {
  const entries = Object.entries(themeDescriptionsFr) as Array<[Theme, string]>
  const values = entries.map(([theme]) => scores[theme] ?? 0)

  return (
    <div className="visual-card">
      <div className="visual-card-header">
        <div>
          <p className="eyebrow">Radar</p>
          <h3>Compatibilité par thème</h3>
        </div>
        <p className="muted-small">
          Plus la surface est large, plus le profil sélectionné vous ressemble sur plusieurs dimensions.
        </p>
      </div>

      <div className="radar-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="radar-chart" aria-label="Radar de compatibilité par thème">
          {[25, 50, 75, 100].map((step) => (
            <polygon
              key={step}
              points={entries
                .map((_, index) => {
                  const point = polarPoint(index, entries.length, (step / 100) * radius)
                  return `${point.x},${point.y}`
                })
                .join(' ')}
              className="radar-ring"
            />
          ))}

          {entries.map(([theme], index) => {
            const outerPoint = polarPoint(index, entries.length, radius)
            const labelPoint = polarPoint(index, entries.length, radius + 28)

            return (
              <g key={theme}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  className="radar-axis"
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="radar-label"
                >
                  {shortThemeLabels[theme]}
                </text>
              </g>
            )
          })}

          <path d={`${polygonPath(values)} Z`} className="radar-area" />

          {values.map((value, index) => {
            const point = polarPoint(index, values.length, (value / 100) * radius)

            return <circle key={`${entries[index][0]}-${value}`} cx={point.x} cy={point.y} r={5} className="radar-node" />
          })}
        </svg>

        <div className="radar-scale">
          {[100, 75, 50, 25].map((mark) => (
            <span key={mark}>{mark}%</span>
          ))}
        </div>
      </div>

        <div className="radar-value-grid">
          {entries.map(([theme]) => (
            <div key={theme} className="radar-value-card">
              <strong>{scores[theme] ?? 0}%</strong>
              <span>{themeDisplayLabels[theme]}</span>
            </div>
          ))}
        </div>
    </div>
  )
}
