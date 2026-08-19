import { useState } from 'react'
import { ProgressRing } from '../components/common/ProgressRing'
import { AdviceCard } from '../components/common/AdviceCard'
import { ChibiMascot } from '../components/common/ChibiMascot'
import { ChiikawaVoiceCard } from '../components/common/ChiikawaVoiceCard'
import { CoupleHeroCard } from '../components/couple/CoupleHeroCard'
import { NhaTrangTripCard } from '../components/couple/NhaTrangTripCard'
import { BreathingTimer } from '../components/BreathingTimer'
import { DeskBreakTracker } from '../components/features/DeskBreakTracker'
import { WaterTrackerCard } from '../components/features/WaterTrackerCard'
import { SleepTrackerPro } from '../components/features/SleepTrackerPro'
import { SleepModal } from '../components/modals/SleepModal'
import { triggerConfetti } from '../utils/confetti'
import { triggerHaptic } from '../utils/haptics'
import { deskBreaks, schedule, trainingPlan } from '../data/plan'
import type { AppSettings, DailyLog, Exercise, SleepEntry } from '../types'

type Props = {
  log: DailyLog
  plan: typeof trainingPlan[number]
  day: number
  score: number
  settings: AppSettings
  toggleChecklist: (id: string) => void
  addWater: (amount: number) => void
  toggleWorkout: () => void
  updateLog: (fn: (current: DailyLog) => DailyLog) => void
  setMetric: (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => void
  onExercise: (exercise: Exercise) => void
  onOpenAddMeal: () => void
}

export function TodayView({
  log,
  plan,
  day,
  score,
  settings,
  toggleChecklist,
  addWater,
  toggleWorkout,
  updateLog,
  setMetric,
  onExercise,
  onOpenAddMeal
}: Props) {
  const [showSleepModal, setShowSleepModal] = useState(false)
  const remaining = 10 - day

  const handleToggleChecklist = (id: string) => {
    const item = log.checklist.find(c => c.id === id)
    const doneCount = log.checklist.filter(c => c.done).length
    // If completing the last remaining item, trigger confetti & success haptic!
    if (item && !item.done && doneCount + 1 === log.checklist.length) {
      triggerConfetti()
      triggerHaptic('success')
    } else {
      triggerHaptic(item && !item.done ? 'medium' : 'light')
    }
    toggleChecklist(id)
  }

  const handleToggleBreak = (time: string) => {
    triggerHaptic('light')
    updateLog((l) => {
      const current = l.deskBreaksCompleted || []
      const next = current.includes(time)
        ? current.filter(t => t !== time)
        : [...current, time]
      return { ...l, deskBreaksCompleted: next }
    })
  }

  const handleAddWater = (amount: number) => {
    triggerHaptic('light')
    addWater(amount)
  }

  const handleToggleWorkout = () => {
    triggerHaptic('medium')
    toggleWorkout()
  }

  const handleSaveSleep = (sleep: SleepEntry) => {
    updateLog((l) => ({ ...l, sleep }))
  }

  return (
    <div className="view-container animate-fade-in">
      {/* Couple Hero Section: Love Days & Dũng Greeting */}
      <CoupleHeroCard />

      {/* Flight to Nha Trang 27/08 & MoMo Couple Fund */}
      <NhaTrangTripCard />

      {/* Chiikawa Companion Banner */}
      <ChiikawaVoiceCard
        character="chiikawa"
        customQuote="Bé Chiikawa cổ vũ Dũng & Em Yêu rèn luyện thể lực mỗi ngày! (Bấm để nghe tiếng kêu cute ✨)"
      />

      {/* Hero Banner */}
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="pill">NGÀY {day} / 10</span>
            <span className="soft-badge">
              {score >= 80 ? '🌟 Phong độ đỉnh cao' : score >= 60 ? '⚡ Đang hồi phục tốt' : '🌱 Cần thêm nghỉ ngơi'}
            </span>
          </div>
          <h2>{remaining > 0 ? `Còn ${remaining} ngày tới mục tiêu` : '🎉 Ngày Sẵn Sàng (Ready Day)'}</h2>
          <p className="hero-subtitle">Tích lũy năng lượng · Tối ưu giấc ngủ & dinh dưỡng · Về đích tự tin.</p>
          
          <div className="hero-meta">
            <span>⏰ Dậy: {settings.wakeTime}</span>
            <span>🏋 Tập luyện: {settings.workoutStart}</span>
            <span>🌙 Đi ngủ: {settings.bedtimeTarget}</span>
          </div>
        </div>

        <div className="hero-ring-container">
          <ProgressRing value={score} size={135} strokeWidth={10} />
          <span className="hero-ring-label">Readiness Score</span>
        </div>
      </section>

      {/* Checklist & Advice */}
      <div className="grid-2">
        <section className="card">
          <div className="section-head">
            <div>
              <small>DANH SÁCH MỤC TIÊU NGÀY {day}</small>
              <h3>Checklist Hàng Ngày</h3>
            </div>
            <span className="completion-badge">
              {log.checklist.filter((c) => c.done).length}/{log.checklist.length}
            </span>
          </div>
          <div className="checklist">
            {log.checklist.map((c) => (
              <label key={c.id} className={c.done ? 'done' : ''}>
                <input
                  type="checkbox"
                  checked={c.done}
                  onChange={() => handleToggleChecklist(c.id)}
                />
                <span className="checkmark">{c.done ? '✓' : ''}</span>
                <span className="checklist-text">{c.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="card advice-card-with-mascot">
          <div className="section-head">
            <div>
              <small>PHÂN TÍCH TỰ ĐỘNG</small>
              <h3>Lời khuyên hồi phục</h3>
            </div>
            <span className="soft-badge">AI Assistant</span>
          </div>
          <div className="advice-mascot-row">
            <ChibiMascot role="guide" size={88} showSpeechBubble={false} interactive={true} />
            <div className="advice-main-content">
              <AdviceCard log={log} day={day} />
            </div>
          </div>
        </section>
      </div>

      {/* Water Tracker Pro with Hachiware Character Theme */}
      <div style={{ marginBottom: '8px' }}>
        <ChiikawaVoiceCard
          character="hachiware"
          customQuote="Mèo Hachiware: Nhớ uống từng ngụm nhỏ nhe! Nanto kanaare~ (Bấm để nghe tiếng meo 🐱)"
        />
      </div>
      <WaterTrackerCard
        currentMl={log.hydrationMl}
        targetMl={settings.waterTargetMl}
        onAddWater={handleAddWater}
      />

      {/* Sleep Tracker Pro with Kurimanju Character Theme */}
      <div style={{ marginBottom: '8px' }}>
        <ChiikawaVoiceCard
          character="kurimanju"
          customQuote="Rái cá Kurimanju: Thư giãn với âm thanh ru ngủ rồi ngủ sớm nào~ Haaaa! 🦦"
        />
      </div>
      <SleepTrackerPro
        sleep={log.sleep}
        targetBedtime={settings.bedtimeTarget}
        targetWaketime={settings.wakeTime}
        onOpenSleepModal={() => setShowSleepModal(true)}
      />

      {/* Training Card with Usagi Character Theme */}
      <div style={{ marginBottom: '8px' }}>
        <ChiikawaVoiceCard
          character="usagi"
          customQuote="Thỏ Usagi: Uraaaa! Ya-ha! Tập luyện sung sức chuẩn bị bay Nha Trang! 🐰"
        />
      </div>
      <section className="metric-card training-card">
        <div className="metric-header">
          <small>TRAINING · TẬP LUYỆN</small>
          <span className={`status-tag ${log.workout?.completed ? 'done' : 'pending'}`}>
            {log.workout?.completed ? 'Hoàn thành' : 'Chưa tập'}
          </span>
        </div>
        <h3 className="workout-title">{plan.title}</h3>
        <p>{plan.subtitle}</p>
        <button
          className={log.workout?.completed ? 'success wide' : 'primary wide'}
          onClick={handleToggleWorkout}
        >
          {log.workout?.completed ? '✓ Đã hoàn thành bài tập' : 'Đánh dấu đã tập'}
        </button>
      </section>

      {/* Next Up Exercises */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>LỊCH TẬP HÔM NAY</small>
            <h3>{plan.title}</h3>
          </div>
          <span className="soft-badge">{plan.exercises.length} Bài tập</span>
        </div>
        <div className="exercise-grid">
          {plan.exercises.map((e) => (
            <button
              className="exercise-card"
              key={e.name}
              onClick={() => onExercise(e)}
            >
              <div>
                <strong>{e.name}</strong>
                <small>{e.prescription}</small>
              </div>
              <span className="exercise-arrow">›</span>
            </button>
          ))}
        </div>
      </section>

      {/* Rhythm & Desk Breaks */}
      <div className="grid-2">
        <section className="card">
          <div className="section-head">
            <div>
              <small>NHỊP SINH HỌC</small>
              <h3>Lịch trình trong ngày (Rhythm)</h3>
            </div>
          </div>
          <div className="timeline compact-timeline">
            {schedule.slice(3, 14).map(([time, label]) => (
              <div key={time}>
                <time>{time}</time>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <DeskBreakTracker
            breaks={deskBreaks}
            completedBreaks={log.deskBreaksCompleted || []}
            onToggleBreak={handleToggleBreak}
          />
        </section>
      </div>

      {/* Breathing Timer */}
      <BreathingTimer
        onMinutes={(m) => updateLog((l) => ({ ...l, breathingMinutes: (l.breathingMinutes || 0) + m }))}
      />

      {/* Check-in Feelings Sliders */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>DAILY CHECK-IN</small>
            <h3>Cảm nhận thể chất & tinh thần hôm nay</h3>
          </div>
        </div>
        <div className="slider-grid">
          <label>
            <span>
              Mức Năng Lượng (Energy) <b>{log.energy ?? 5}/10</b>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={log.energy ?? 5}
              onChange={(e) => setMetric('energy', Number(e.target.value))}
            />
          </label>

          <label>
            <span>
              Tâm Trạng (Mood) <b>{log.mood ?? 5}/10</b>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={log.mood ?? 5}
              onChange={(e) => setMetric('mood', Number(e.target.value))}
            />
          </label>

          <label>
            <span>
              Mức Độ Căng Thẳng (Stress) <b>{log.stress ?? 5}/10</b>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={log.stress ?? 5}
              onChange={(e) => setMetric('stress', Number(e.target.value))}
            />
          </label>

          <label>
            <span>
              Đau Mỏi Cơ (Soreness) <b>{log.soreness ?? 5}/10</b>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={log.soreness ?? 5}
              onChange={(e) => setMetric('soreness', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {/* Sleep Modal */}
      {showSleepModal && (
        <SleepModal
          initialSleep={log.sleep}
          onClose={() => setShowSleepModal(false)}
          onSave={handleSaveSleep}
        />
      )}
    </div>
  )
}
