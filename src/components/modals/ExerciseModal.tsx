import { Modal } from '../common/Modal'
import { ExerciseMotionVisualizer } from '../features/ExerciseMotionVisualizer'
import type { Exercise } from '../../types'

type Props = {
  exercise: Exercise | null
  onClose: () => void
}

// Curated search & video links for exercises
const EXERCISE_VIDEO_MAP: Record<string, string> = {
  squat: 'https://www.youtube.com/results?search_query=how+to+bodyweight+squat+form',
  bridge: 'https://www.youtube.com/results?search_query=how+to+do+glute+bridge+proper+form',
  deadbug: 'https://www.youtube.com/results?search_query=how+to+do+deadbug+exercise',
  hip90: 'https://www.youtube.com/results?search_query=90+90+hip+mobility+stretch+technique',
  catcow: 'https://www.youtube.com/results?search_query=cat+cow+stretch+yoga+form',
  kegel: 'https://www.youtube.com/results?search_query=kegel+exercises+for+men+pelvic+floor',
  pigeon: 'https://www.youtube.com/results?search_query=pigeon+pose+stretch+tutorial'
}

export function ExerciseModal({ exercise, onClose }: Props) {
  if (!exercise) return null

  const nameLower = exercise.name.toLowerCase()
  let videoUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(exercise.name + ' proper form workout')
  if (nameLower.includes('squat')) videoUrl = EXERCISE_VIDEO_MAP.squat
  else if (nameLower.includes('bridge') || nameLower.includes('glute')) videoUrl = EXERCISE_VIDEO_MAP.bridge
  else if (nameLower.includes('deadbug') || nameLower.includes('dead bug')) videoUrl = EXERCISE_VIDEO_MAP.deadbug
  else if (nameLower.includes('90/90') || nameLower.includes('hip')) videoUrl = EXERCISE_VIDEO_MAP.hip90
  else if (nameLower.includes('cat') || nameLower.includes('cow')) videoUrl = EXERCISE_VIDEO_MAP.catcow
  else if (nameLower.includes('kegel') || nameLower.includes('sàn chậu')) videoUrl = EXERCISE_VIDEO_MAP.kegel
  else if (nameLower.includes('pigeon')) videoUrl = EXERCISE_VIDEO_MAP.pigeon

  return (
    <Modal title={exercise.name} subtitle="Mô phỏng chuyển động & Hướng dẫn kỹ thuật thực tế" onClose={onClose}>
      <div className="exercise-detail-view">
        {/* Visual motion simulation */}
        <ExerciseMotionVisualizer exerciseName={exercise.name} />

        {/* Video Tutorial Link Button */}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="real-video-btn"
          title="Mở video hướng dẫn động tác thực tế trên YouTube"
        >
          <span>▶️</span>
          <div>
            <strong>Xem Video hướng dẫn thực tế trên YouTube</strong>
            <small>Xem vận động viên hướng dẫn góc máy chuẩn</small>
          </div>
          <span className="arrow-icon">↗</span>
        </a>

        <div className="prescription-badge">
          <span>Khối lượng & Số Reps:</span>
          <strong>{exercise.prescription}</strong>
        </div>

        <div className="exercise-steps-box">
          <h4>Kỹ thuật thực hiện chuẩn từng bước:</h4>
          <ol className="exercise-steps-list">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="exercise-safety-note">
          <span>💡 Lưu ý an toàn:</span> Giữ nhịp thở đều (hít vào khi hạ xuống, thở ra khi phát lực đẩy lên). Không gồng cổ hay võng thắt lưng.
        </div>

        <button className="primary full mt-3" onClick={onClose}>
          Đã hiểu kỹ thuật & Sẵn sàng tập
        </button>
      </div>
    </Modal>
  )
}
