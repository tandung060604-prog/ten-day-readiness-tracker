import { useMemo, useState } from 'react'
import { triggerConfetti } from '../../utils/confetti'
import { triggerHaptic } from '../../utils/haptics'
import { useGameState } from '../../context/GameStateContext'
import { createDailyChallenges, getDailyChallengeProgress, getLocalDateKey } from '../../domain/challenges/dailyChallenge'
import type { DailyLog } from '../../types'

interface DailyChallengeCardProps { log: DailyLog; waterTargetMl: number }

export function DailyChallengeCard({ log, waterTargetMl }: DailyChallengeCardProps) {
  const { state, claimDailyChallenge } = useGameState()
  const [message, setMessage] = useState<string | null>(null)
  const dateKey = getLocalDateKey()
  const challenges = useMemo(() => createDailyChallenges(dateKey, waterTargetMl).map(challenge => getDailyChallengeProgress(challenge, log, state.dailyChallengeClaims?.[dateKey])), [dateKey, log, state.dailyChallengeClaims, waterTargetMl])
  const completedCount = challenges.filter(challenge => challenge.completed).length

  const handleClaim = (challenge: typeof challenges[number]) => {
    const result = claimDailyChallenge(dateKey, challenge, challenge.completed)
    if (!result.success) return
    triggerHaptic('success'); triggerConfetti(); setMessage(result.summary ?? 'Đã nhận phần thưởng')
    window.setTimeout(() => setMessage(null), 1800)
  }

  return (
    <section className="daily-challenge-card card" aria-labelledby="daily-challenge-title">
      <div className="section-head"><div><small>THỬ THÁCH HÔM NAY · {dateKey}</small><h3 id="daily-challenge-title">Ba việc nhỏ, thêm Tim &amp; Xu</h3></div><span className="completion-badge">{completedCount}/{challenges.length}</span></div>
      <div className="daily-challenge-list">
        {challenges.map(challenge => <div key={challenge.id} className={`daily-challenge-row ${challenge.claimed ? 'claimed' : challenge.completed ? 'ready' : ''}`}>
          <div className="daily-challenge-icon">{challenge.metric === 'hydration' ? '💧' : challenge.metric === 'workout' ? '✦' : challenge.metric === 'sleep' ? '☾' : '♥'}</div>
          <div className="daily-challenge-copy"><strong>{challenge.title}</strong><span>{challenge.description}</span><small>{Math.min(challenge.current, challenge.target).toLocaleString('vi-VN')} / {challenge.target.toLocaleString('vi-VN')} · +{challenge.reward.hearts ?? 0} Tim · +{challenge.reward.coins ?? 0} Xu</small></div>
          {challenge.claimed ? <span className="daily-challenge-status">Đã nhận ✓</span> : challenge.completed ? <button className="daily-challenge-claim" onClick={() => handleClaim(challenge)}>Nhận</button> : <span className="daily-challenge-status">Đang làm</span>}
        </div>)}
      </div>
      {message && <p className="daily-challenge-feedback" role="status">{message}</p>}
    </section>
  )
}
