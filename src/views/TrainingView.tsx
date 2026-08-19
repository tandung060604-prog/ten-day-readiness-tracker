import { BreathingTimer } from '../components/BreathingTimer'
import { KegelTimer } from '../components/features/KegelTimer'
import { trainingPlan } from '../data/plan'
import type { DailyLog, Exercise } from '../types'

type Props = {
  day: number
  plan: typeof trainingPlan[number]
  log: DailyLog
  toggleWorkout: () => void
  updateLog: (fn: (l: DailyLog) => DailyLog) => void
  onExercise: (e: Exercise) => void
}

export function TrainingView({
  day,
  plan,
  log,
  toggleWorkout,
  updateLog,
  onExercise
}: Props) {
  const isWorkoutDone = !!log.workout?.completed

  return (
    <div className="view-container animate-fade-in">
      {/* Training Hero */}
      <section className="training-hero">
        <div className="training-hero-left">
          <span className="pill">NGÀY {day} · KẾ HOẠCH TẬP</span>
          <h2>{plan.title}</h2>
          <p>{plan.subtitle}</p>
        </div>
        <button
          className={isWorkoutDone ? 'success compact-hero-btn' : 'primary compact-hero-btn'}
          onClick={toggleWorkout}
        >
          {isWorkoutDone ? '✓ Buổi tập đã hoàn thành' : 'Đánh dấu hoàn thành'}
        </button>
      </section>

      {/* Exercise Session List */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>DANH SÁCH BÀI TẬP</small>
            <h3>Chi tiết các động tác trong buổi</h3>
          </div>
          <span className="soft-badge">{plan.exercises.length} Động tác</span>
        </div>

        <div className="training-list">
          {plan.exercises.map((e, i) => (
            <button
              key={e.name}
              className="training-item-btn"
              onClick={() => onExercise(e)}
            >
              <span className="training-item-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="training-item-main">
                <strong>{e.name}</strong>
                <small>{e.prescription}</small>
              </div>
              <span className="training-item-cta">Kỹ thuật & Hướng dẫn ›</span>
            </button>
          ))}
        </div>

        {plan.notes.length > 0 && (
          <div className="note-box">
            {plan.notes.map((n, idx) => (
              <span key={idx}>• {n}</span>
            ))}
          </div>
        )}
      </section>

      {/* Pelvic Floor / Kegel & Breathing */}
      <div className="grid-2">
        <KegelTimer
          isCompleted={log.kegelCompleted}
          onToggleComplete={() => updateLog((l) => ({ ...l, kegelCompleted: !l.kegelCompleted }))}
        />

        <div className="flex-col gap-3">
          <section className="card">
            <div className="section-head">
              <div>
                <small>MOBILITY & STRETCHING</small>
                <h3>Giãn cơ & Khớp Háng</h3>
              </div>
              <button
                className={`status-pill-btn ${log.mobilityCompleted ? 'completed' : ''}`}
                onClick={() => updateLog((l) => ({ ...l, mobilityCompleted: !l.mobilityCompleted }))}
              >
                {log.mobilityCompleted ? '✓ Đã tập' : 'Đánh dấu xong'}
              </button>
            </div>
            <p className="muted-text">
              Thực hiện 10–15 phút giãn cơ: 90/90 Hip Stretch, Deep Squat Hold, Cat-Cow và Pigeon Pose để giải phóng áp lực hông.
            </p>
          </section>

          <BreathingTimer
            onMinutes={(m) => updateLog((l) => ({ ...l, breathingMinutes: (l.breathingMinutes || 0) + m }))}
          />
        </div>
      </div>
    </div>
  )
}
