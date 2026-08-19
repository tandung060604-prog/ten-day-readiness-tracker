type Props = {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ProgressRing({ value, size = 120, strokeWidth = 9, label = '/100' }: Props) {
  const r = (size - strokeWidth * 2) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, value))
  const offset = c * (1 - clamped / 100)

  // Dynamic color depending on score
  let ringColor = 'var(--primary)'
  if (clamped < 50) ringColor = 'var(--danger)'
  else if (clamped < 75) ringColor = 'var(--warn)'

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="ring" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-bg"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-value"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="ring-number">
        <strong>{clamped}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
