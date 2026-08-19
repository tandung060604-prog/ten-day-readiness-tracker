import type { DailyLog } from '../../types'
import { getDayAdvice } from '../../utils/readiness'

type Props = {
  log: DailyLog
  day: number
}

export function AdviceCard({ log, day }: Props) {
  const tips = getDayAdvice(log, day)

  return (
    <div className="tip-list">
      {tips.map((t, i) => (
        <div className="tip" key={i}>
          <span className="tip-icon">✦</span>
          <p>{t}</p>
        </div>
      ))}
    </div>
  )
}
