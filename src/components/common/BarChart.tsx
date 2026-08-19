type BarData = {
  label: string
  value: number
  max: number
  unit?: string
  color?: string
}

type Props = {
  data: BarData[]
  title?: string
}

export function BarChart({ data }: Props) {
  return (
    <div className="bar-chart">
      {data.map((d) => {
        const percent = Math.min(100, Math.max(0, (d.value / (d.max || 1)) * 100))
        return (
          <div className="bar-row" key={d.label}>
            <span className="bar-label">{d.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${percent}%`,
                  background: d.color || undefined
                }}
              />
            </div>
            <b className="bar-val">
              {d.value}
              {d.unit && <small style={{ fontSize: '9px', marginLeft: '2px', opacity: 0.8 }}>{d.unit}</small>}
            </b>
          </div>
        )
      })}
    </div>
  )
}
