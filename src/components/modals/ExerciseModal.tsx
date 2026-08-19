import { Modal } from '../common/Modal'
import { ExerciseMotionVisualizer } from '../features/ExerciseMotionVisualizer'
import type { Exercise } from '../../types'

type Props = {
  exercise: Exercise | null
  onClose: () => void
}

export function ExerciseModal({ exercise, onClose }: Props) {
  if (!exercise) return null

  return (
    <Modal title={exercise.name} subtitle="Mô phỏng chuyển động & Hướng dẫn kỹ thuật" onClose={onClose}>
      <div className="exercise-detail-view">
        {/* Visual motion simulation */}
        <ExerciseMotionVisualizer exerciseName={exercise.name} />

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
