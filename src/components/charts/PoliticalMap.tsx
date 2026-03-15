interface PoliticalMapPoint {
  id: string
  label: string
  color: string
  x: number
  y: number
  isSelected?: boolean
  isUser?: boolean
}

interface PoliticalMapProps {
  points: PoliticalMapPoint[]
}

const width = 460
const height = 360
const padding = 52
const centerX = width / 2
const centerY = height / 2
const axisWidth = width / 2 - padding
const axisHeight = height / 2 - padding

function projectX(value: number) {
  return centerX + (value / 100) * axisWidth
}

function projectY(value: number) {
  return centerY - (value / 100) * axisHeight
}

function createDiamondPath(x: number, y: number, radius: number) {
  return `${x} ${y - radius} ${x + radius} ${y} ${x} ${y + radius} ${x - radius} ${y}`
}

export function PoliticalMap({ points }: PoliticalMapProps) {
  return (
    <div className="visual-card">
      <div className="visual-card-header">
        <div>
          <p className="eyebrow">Carte 2D</p>
          <h3>Votre position relative</h3>
        </div>
        <p className="muted-small">
          Axe horizontal: redistribution vers marché. Axe vertical: ouverture vers
          souveraineté-fermeture.
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="political-map" aria-label="Carte politique 2D">
        <rect x="0" y="0" width={width} height={height} rx="24" className="map-background" />

        {[-75, -50, -25, 25, 50, 75].map((step) => (
          <g key={step}>
            <line
              x1={padding}
              y1={projectY(step)}
              x2={width - padding}
              y2={projectY(step)}
              className="map-grid-line"
            />
            <line
              x1={projectX(step)}
              y1={padding}
              x2={projectX(step)}
              y2={height - padding}
              className="map-grid-line"
            />
          </g>
        ))}

        <line x1={padding} y1={centerY} x2={width - padding} y2={centerY} className="map-axis" />
        <line x1={centerX} y1={padding} x2={centerX} y2={height - padding} className="map-axis" />

        <text x={padding} y={centerY - 10} className="map-axis-label" textAnchor="start">
          Redistribution
        </text>
        <text x={width - padding} y={centerY - 10} className="map-axis-label" textAnchor="end">
          Marché
        </text>
        <text
          x={centerX + 12}
          y={padding + 10}
          className="map-axis-label"
          textAnchor="start"
        >
          Ouverture
        </text>
        <text
          x={centerX + 12}
          y={height - padding + 20}
          className="map-axis-label"
          textAnchor="start"
        >
          Souveraineté
        </text>

        {points.map((point) => {
          const x = projectX(point.x)
          const y = projectY(point.y)

          return (
            <g key={point.id}>
              {point.isSelected && (
                <circle cx={x} cy={y} r={18} className="map-highlight-ring" />
              )}

              {point.isUser ? (
                <polygon
                  points={createDiamondPath(x, y, 10)}
                  fill={point.color}
                  className="map-user-marker"
                />
              ) : (
                <circle cx={x} cy={y} r={7} fill={point.color} className="map-party-marker" />
              )}

              <text
                x={x}
                y={y - (point.isUser ? 16 : 14)}
                textAnchor="middle"
                className={`map-point-label${point.isSelected ? ' selected' : ''}${point.isUser ? ' user' : ''}`}
              >
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="map-legend">
        <span className="legend-chip">
          <span className="legend-swatch user" />
          Vous
        </span>
        {points
          .filter((point) => !point.isUser && point.isSelected)
          .map((point) => (
            <span key={point.id} className="legend-chip">
              <span className="legend-swatch" style={{ background: point.color }} />
              Profil sélectionné
            </span>
          ))}
      </div>
    </div>
  )
}
