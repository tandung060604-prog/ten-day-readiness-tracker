import { useEffect, useState } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import { speakVietnamese } from '../../utils/vietnameseAudio'
import { GameIcon } from '../../components/common/GameIcons'
import type { LocationId } from '../types'

export interface TutorialStep {
  step: number
  locationId: LocationId
  title: string
  locationName: string
  x: number
  y: number
  character: 'hachiware' | 'chiikawa' | 'usagi'
  characterName: string
  characterRole: string
  text: string
  speechLine: string
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    step: 1,
    locationId: 'home',
    title: 'TỔ ẤM CỦA CHÚNG MÌNH',
    locationName: 'Nhà Của Chúng Mình',
    x: 35.5,
    y: 34.0,
    character: 'chiikawa',
    characterName: 'Haru (Chiikawa)',
    characterRole: 'Bé Giữ Lửa Tổ Ấm',
    text: 'Xin chào Haru & Mai Trang! Đây là Tổ Ấm của chúng mình — nơi đếm từng ngày yêu nhau từ ngày 11/06/2026 và theo dõi điểm số sẵn sàng 10 ngày!',
    speechLine: 'Xin chào Haru và Mai Trang! Đây là Tổ Ấm của chúng mình, nơi đếm số ngày yêu nhau và theo dõi điểm số sẵn sàng mười ngày!'
  },
  {
    step: 2,
    locationId: 'quests',
    title: 'BẢNG NHIỆM VỤ 10 NGÀY',
    locationName: 'Bảng Nhiệm Vụ Quests',
    x: 62.5,
    y: 48.5,
    character: 'hachiware',
    characterName: 'Hachiware',
    characterRole: 'Người Đồng Hành Lạc Quan',
    text: 'Tiếp theo là Bảng Nhiệm Vụ Quests — checklist 10 ngày chuẩn bị trang phục, tài chính quỹ du lịch và hành lý chu đáo đi biển Nha Trang!',
    speechLine: 'Tiếp theo là Bảng Nhiệm Vụ Quests, checklist mười ngày chuẩn bị trang phục, tài chính và hành lý đi biển Nha Trang!'
  },
  {
    step: 3,
    locationId: 'gym',
    title: 'NHÀ TẬP GYM THỂ LỰC',
    locationName: 'Nhà Tập Gym Thể Lực',
    x: 82.0,
    y: 39.0,
    character: 'chiikawa',
    characterName: 'Haru (Chiikawa)',
    characterRole: 'Chiến Binh Rèn Luyện',
    text: 'Cùng Haru rèn luyện thể lực, hít đất và đẩy tạ mỗi ngày tại Gym Dojo để có một sức khỏe dẻo dai và tràn đầy năng lượng nhé!',
    speechLine: 'Cùng Haru rèn luyện thể lực, hít đất và nâng tạ mỗi ngày để có sức khỏe dẻo dai tràn đầy năng lượng!'
  },
  {
    step: 4,
    locationId: 'beach',
    title: 'BÃI BIỂN NHA TRANG',
    locationName: 'Bãi Biển & Tour 3 Đảo',
    x: 67.0,
    y: 80.0,
    character: 'usagi',
    characterName: 'Mai Trang (Usagi)',
    characterRole: 'Khám Phá & Ẩm Thực',
    text: 'Khám phá Bãi Biển Nha Trang — xem lịch trình Tour 3 Đảo Hòn Mun, Mini Beach, Viện Hải Dương Học và những món hải sản ngon tuyệt!',
    speechLine: 'Khám phá Bãi Biển Nha Trang, xem lịch trình tour ba đảo Hòn Mun, Mini Beach và những món hải sản tuyệt ngon!'
  },
  {
    step: 5,
    locationId: 'journal',
    title: 'THƯ VIỆN KÝ ỨC',
    locationName: 'Thư Viện Ký Ức & Cảm Xúc',
    x: 31.5,
    y: 60.5,
    character: 'usagi',
    characterName: 'Mai Trang (Usagi)',
    characterRole: 'Người Ghi Ký Ức',
    text: 'Cuối cùng là Thư Viện Ký Ức — nơi Mai Trang lưu giữ những trang nhật ký cảm xúc, lời nhắn yêu thương ngọt ngào và những cột mốc đáng nhớ nhất!',
    speechLine: 'Cuối cùng là Thư Viện Ký Ức, nơi lưu giữ những dòng nhật ký tình yêu và những khoảnh khắc đẹp nhất của hai bạn!'
  }
]

type Props = {
  isOpen: boolean
  onClose: () => void
  onStepChange?: (step: TutorialStep) => void
}

export function GameTutorialModal({ isOpen, onClose, onStepChange }: Props) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0)

  const step = TUTORIAL_STEPS[currentStepIdx]

  // Notify parent to zoom in and focus camera on the building!
  useEffect(() => {
    if (isOpen && onStepChange) {
      onStepChange(step)
    }
  }, [isOpen, currentStepIdx, step, onStepChange])

  // Speak Vietnamese whenever step changes
  useEffect(() => {
    if (!isOpen) return

    speakVietnamese(step.speechLine, {
      charVoice: step.character,
      rate: 1.05,
      pitch: 1.2
    })
  }, [isOpen, currentStepIdx, step])

  if (!isOpen) return null

  const handleNext = () => {
    audioSystem.playClick('enter')
    if (currentStepIdx < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    audioSystem.playClick('soft')
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    audioSystem.playClick('pop')
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel()
    }
    onClose()
  }

  const handleReplayVoice = () => {
    speakVietnamese(step.speechLine, {
      charVoice: step.character,
      rate: 1.05,
      pitch: 1.2
    })
  }

  return (
    <div className="game-tutorial-overlay animate-fade-in">
      {/* ── 1. SPOTLIGHT HOLE (Dims entire screen, highlights only the current target location) ── */}
      <div
        className="tutorial-spotlight-hole"
        style={{
          left: `${step.x}%`,
          top: `${step.y}%`
        }}
      >
        {/* Step Number Badge directly above the building */}
        <div className="spotlight-step-badge animate-bounce-gentle">
          <span>{step.step}</span>
        </div>
        <div className="spotlight-pulse-ring" />
      </div>

      {/* ── 2. RUNNING COMPANION & DIALOGUE CARD ── */}
      <div className="tutorial-dialog-container animate-slide-up">
        {/* Step Progress Pills */}
        <div className="tutorial-step-dots">
          {TUTORIAL_STEPS.map((s, idx) => (
            <span
              key={s.step}
              className={`step-dot ${idx === currentStepIdx ? 'dot-active' : idx < currentStepIdx ? 'dot-done' : ''}`}
              onClick={() => setCurrentStepIdx(idx)}
            >
              {idx + 1}
            </span>
          ))}
        </div>

        {/* Character Card Box */}
        <div className="tutorial-speech-card">
          {/* Top Header */}
          <div className="tutorial-card-topbar">
            <div className="tutorial-avatar-pill">
              <ChiikawaSVG character={step.character} size={48} className="animate-bounce-gentle" />
              <div>
                <strong>{step.characterName}</strong>
                <small>{step.characterRole}</small>
              </div>
            </div>

            <div className="tutorial-step-indicator">
              <span>BƯỚC {step.step} / {TUTORIAL_STEPS.length}</span>
            </div>
          </div>

          {/* Location Title */}
          <div className="tutorial-location-tag">
            <span>📍 {step.title} · {step.locationName}</span>
          </div>

          {/* Speech Text */}
          <div className="tutorial-speech-text-wrap">
            <p className="tutorial-speech-p">{step.text}</p>
            <button
              className="tutorial-voice-btn"
              onClick={handleReplayVoice}
              title="Phát lại giọng nói tiếng Việt"
            >
              <GameIcon name="sound" size={16} />
              <span>Nghe lại</span>
            </button>
          </div>

          {/* Action Row Buttons */}
          <div className="tutorial-card-actions">
            <button className="tut-skip-btn" onClick={handleComplete}>
              Bỏ qua
            </button>

            <div className="tut-nav-btns">
              {currentStepIdx > 0 && (
                <button className="tut-prev-btn" onClick={handlePrev}>
                  ← Quay lại
                </button>
              )}
              <button className="tut-next-btn animate-pop" onClick={handleNext}>
                {currentStepIdx === TUTORIAL_STEPS.length - 1 ? 'Hoàn thành ✨' : 'Bước tiếp theo →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
