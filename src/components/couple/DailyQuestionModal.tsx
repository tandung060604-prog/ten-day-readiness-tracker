import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { getTodayQuestion } from '../../domain/couple/coupleFeatures'
import { coupleStorage } from '../../domain/couple/coupleStorage'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { AnsweredQuestion } from '../../domain/couple/coupleFeatures'

interface DailyQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onAnswerSaved?: (heartsEarned: number) => void
}

export function DailyQuestionModal({
  isOpen,
  onClose,
  onAnswerSaved
}: DailyQuestionModalProps) {
  const todayQ = getTodayQuestion()
  const [answerText, setAnswerText] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [existingAnswer, setExistingAnswer] = useState<AnsweredQuestion | null>(null)

  useEffect(() => {
    if (isOpen) {
      const answers = coupleStorage.loadAnsweredQuestions()
      const saved = answers[todayQ.id]
      if (saved) {
        setExistingAnswer(saved)
        setAnswerText(saved.user1Answer)
        setIsSaved(true)
      } else {
        setExistingAnswer(null)
        setAnswerText('')
        setIsSaved(false)
      }
    }
  }, [isOpen, todayQ.id])

  if (!isOpen) return null

  const handleSave = () => {
    if (!answerText.trim()) return
    audioSystem.playClick('pop')

    const newRecord: AnsweredQuestion = {
      questionId: todayQ.id,
      answeredAt: new Date().toISOString(),
      user1Answer: answerText.trim(),
      isFavorite: existingAnswer?.isFavorite || false
    }

    coupleStorage.saveAnsweredQuestion(newRecord)
    setIsSaved(true)
    setExistingAnswer(newRecord)

    if (!existingAnswer) {
      triggerConfetti()
      onAnswerSaved?.(15)
    }
  }

  return (
    <Modal title="Câu Hỏi Tình Yêu Hôm Nay (Daily Question)" onClose={onClose}>
      <div className="daily-question-modal-container">
        {/* Question Header Card */}
        <div className="question-header-card">
          <div className="question-mascot-row">
            <ChiikawaSVG character="chiikawa" size={44} />
            <div className="question-number-pill">Câu hỏi #{todayQ.id}</div>
          </div>
          <h3 className="question-prompt-text">"{todayQ.prompt}"</h3>
        </div>

        {/* Answer Input Area */}
        <div className="question-input-section">
          <label className="input-label">✍️ Câu trả lời của bạn gửi đến người thương:</label>
          <textarea
            className="question-textarea"
            rows={4}
            placeholder="Chia sẻ những suy nghĩ chân thật và ngọt ngào nhất của bạn tại đây..."
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
          />
        </div>

        {isSaved && (
          <div className="saved-answer-toast animate-bounce-gentle">
            <span>💖 Đã lưu câu trả lời vào Sổ Kỷ Niệm (+15 Tim)!</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="question-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Đóng
          </button>
          <button
            className={`save-answer-btn ${answerText.trim() ? 'ready' : 'disabled'}`}
            onClick={handleSave}
            disabled={!answerText.trim()}
          >
            {isSaved ? '💾 Cập Nhật' : '💌 Gửi Câu Trả Lời (+15 Tim)'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
