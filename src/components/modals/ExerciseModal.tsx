import { Modal } from '../common/Modal'
import type { Exercise } from '../../types'

type Props = {
  exercise: Exercise | null
  onClose: () => void
}

export function ExerciseModal({ exercise, onClose }: Props) {
  if (!exercise) return null

  return (
    <Modal title={exercise.name} subtitle="Hướng dẫn kỹ thuật & Prescriptions" onClose={onClose}>
      <div className="exercise-detail-view">
        <div className="prescription-badge">
          <span>Khối lượng / Reps:</span>
          <strong>{exercise.prescription}</strong>
        </div>

        <div className="exercise-steps-box">
          <h4>Các bước thực hiện chuẩn:</h4>
          <ol className="exercise-steps-list">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="exercise-safety-note">
          <span>💡 Lưu ý an toàn:</span> Luôn kiểm soát chuyển động trong toàn bộ biên độ, giữ hơi thở đều đặn và không nín thở.
        </div>

        <button className="primary full mt-3" onClick={onClose}>
          Đã hiểu kỹ thuật
        </button>
      </div>
    </Modal>
  )
}
