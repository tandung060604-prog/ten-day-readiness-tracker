type Props = {
  size?: number
  showText?: boolean
  subtitle?: string
}

export function AppLogo({ size = 44, showText = false, subtitle }: Props) {
  return (
    <div className="app-logo-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <div
        className="app-logo-icon"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.32),
          background: 'linear-gradient(135deg, #119e72 0%, #4ee1aa 50%, #64a5ff 100%)',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 4px 18px rgba(78, 225, 170, 0.35)',
          position: 'relative',
          flexShrink: 0
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Energy Pulse Ring */}
          <circle cx="50" cy="50" r="42" stroke="#052116" strokeWidth="6" strokeDasharray="12 6" opacity="0.45" />
          {/* Inner Badge Core */}
          <circle cx="50" cy="50" r="32" fill="#052116" />
          {/* Number 10 */}
          <text
            x="48"
            y="61"
            textAnchor="middle"
            fill="#4ee1aa"
            fontSize="34"
            fontWeight="900"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-1"
          >
            10
          </text>
          {/* Lightning / Sparkle Star */}
          <path
            d="M74 24 L78 34 L88 38 L78 42 L74 52 L70 42 L60 38 L70 34 Z"
            fill="#f6c96a"
          />
        </svg>
      </div>

      {showText && (
        <div className="app-logo-text">
          <strong style={{ display: 'block', fontSize: '15px', fontWeight: 800, lineHeight: 1.2 }}>
            10-Day Readiness
          </strong>
          {subtitle && (
            <small style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', marginTop: '2px' }}>
              {subtitle}
            </small>
          )}
        </div>
      )}
    </div>
  )
}
