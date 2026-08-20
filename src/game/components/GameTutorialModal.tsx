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
    text: 'Xin chào Haru & Mai Trang! Đây là Tổ Ấm của chúng mình — nơi đếm từng ngày yêu nhau từ 11/06/2026 và theo dõi điểm số sẵn sàng 10 ngày!',
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
    locationId: 'water',
    title: 'ĐÀI UỐNG NƯỚC',
    locationName: 'Đài Nước Tinh Khiết',
    x: 68.0,
    y: 15.0,
    character: 'hachiware',
    characterName: 'Hachiware',
    characterRole: 'Sứ Giả Bù Nước',
    text: 'Đài phun nước mát lạnh! Hãy uống đủ 2,000 - 2,500ml nước mỗi ngày để da dẻ hồng hào và tinh thần tỉnh táo nhé!',
    speechLine: 'Đài phun nước mát lạnh! Uống đủ hai nghìn đến hai nghìn năm trăm mililít nước mỗi ngày nhé!'
  },
  {
    step: 5,
    locationId: 'sleep',
    title: 'TRUNG TÂM GIẤC NGỦ',
    locationName: 'Thung Lũng Giấc Mơ',
    x: 38.5,
    y: 48.0,
    character: 'chiikawa',
    characterName: 'Kurimanju',
    characterRole: 'Thần Ngủ Yên Bình',
    text: 'Nhà giường mây phủ oải hương dưới ánh trăng dịu mát. Ngủ đủ 7-8 tiếng theo chu kỳ 90 phút để phục hồi tuyệt đối!',
    speechLine: 'Nhà giường mây phủ oải hương. Ngủ đủ bảy đến tám tiếng theo chu kỳ chín mươi phút để phục hồi tuyệt đối!'
  },
  {
    step: 6,
    locationId: 'journal',
    title: 'THƯ VIỆN NHẬT KÝ',
    locationName: 'Thư Viện Ký Ức',
    x: 31.5,
    y: 60.5,
    character: 'hachiware',
    characterName: 'Hachiware Học Giả',
    characterRole: 'Thủ Thư Ký Ức',
    text: 'Tòa thư viện lưu giữ từng dòng suy ngẫm, lời động viên và cảm xúc chân thật nhất của hai bạn mỗi ngày.',
    speechLine: 'Tòa thư viện lưu giữ từng dòng suy ngẫm và cảm xúc chân thật nhất của hai bạn!'
  },
  {
    step: 7,
    locationId: 'album',
    title: 'ALBUM KỶ NIỆM',
    locationName: 'Tiệm Ảnh Hẹn Hò',
    x: 64.5,
    y: 34.5,
    character: 'chiikawa',
    characterName: 'Chiikawa Nhiếp Ảnh',
    characterRole: 'Nhiếp Ảnh Gia Đáng Yêu',
    text: 'Tiệm ảnh lưu giữ trọn vẹn từng nụ cười, ánh mắt và những tấm ảnh Photobooth đáng nhớ nhất của hai đứa mình!',
    speechLine: 'Tiệm ảnh lưu giữ từng nụ cười, ánh mắt và những tấm ảnh Photobooth đáng nhớ nhất!'
  },
  {
    step: 8,
    locationId: 'market',
    title: 'CHỢ NHỎ DINH DƯỠNG',
    locationName: 'Khu Chợ Xanh',
    x: 56.5,
    y: 68.0,
    character: 'hachiware',
    characterName: 'Momonga',
    characterRole: 'Chuyên Gia Dinh Dưỡng',
    text: 'Chợ quê rực rỡ sắc màu! Theo dõi khẩu phần calo, cân đối đạm - xơ - tinh bột chuẩn chỉnh mỗi ngày.',
    speechLine: 'Chợ quê rực rỡ sắc màu! Theo dõi khẩu phần calo và cân đối đạm xơ tinh bột mỗi ngày.'
  },
  {
    step: 9,
    locationId: 'restaurant',
    title: 'NHÀ HÀNG HẸN HÒ',
    locationName: 'Tiệm Ăn Ánh Nến',
    x: 43.5,
    y: 68.0,
    character: 'chiikawa',
    characterName: 'Chiikawa & Usagi',
    characterRole: 'Bồi Bàn Lãng Mạn',
    text: 'Quán ăn lãng mạn với ánh nến lung linh! Lên lịch trình ăn tối & khám phá ẩm thực Nha Trang tại đây.',
    speechLine: 'Quán ăn lãng mạn với ánh nến lung linh! Lên lịch hẹn hò và khám phá ẩm thực Nha Trang tại đây.'
  },
  {
    step: 10,
    locationId: 'hospital',
    title: 'BỆNH VIỆN TÌNH YÊU',
    locationName: 'Bệnh Viện Tình Yêu (Chu Kỳ Flo)',
    x: 15.0,
    y: 48.0,
    character: 'usagi',
    characterName: 'Mai Trang & Bác Sĩ Chiikawa',
    characterRole: 'Sức Khỏe & Chu Kỳ Phái Đẹp',
    text: 'Bệnh Viện Tình Yêu — theo dõi chu kỳ kinh nguyệt chuẩn Flo App từ kỳ 29/07, cảnh báo ngày bay Nha Trang 27/08 và cẩm nang chăm sóc bạn gái cho Haru!',
    speechLine: 'Bệnh viện tình yêu, theo dõi chu kỳ kinh nguyệt chuẩn ứng dụng Flo từ ngày hai mươi chín tháng bảy và cẩm nang chăm sóc bạn gái của Haru!'
  },
  {
    step: 11,
    locationId: 'settings',
    title: 'TÒA THỊ CHÍNH',
    locationName: 'Quản Trị Hệ Thống',
    x: 53.5,
    y: 28.0,
    character: 'hachiware',
    characterName: 'Thị Trưởng Rakko',
    characterRole: 'Người Bảo Vệ Không Gian Riêng',
    text: 'Tòa Thị Chính — thiết lập mã PIN bảo mật, sao lưu dữ liệu, tùy chỉnh giao diện và cài đặt âm thanh tại đây!',
    speechLine: 'Tòa Thị Chính, thiết lập mã PIN bảo mật, sao lưu dữ liệu và tùy chỉnh giao diện tại đây!'
  },
  {
    step: 12,
    locationId: 'airport',
    title: 'SÂN BAY QUỐC TẾ',
    locationName: 'Đường Băng Mơ Ước',
    x: 89.0,
    y: 64.0,
    character: 'usagi',
    characterName: 'Cơ Trưởng Usagi',
    characterRole: 'Phi Công Cất Cánh',
    text: 'Sân Bay — đồng hồ đếm ngược từng ngày hướng về chuyến bay tới Nha Trang 27/08. Theo dõi quỹ MOMO du lịch!',
    speechLine: 'Sân bay, đồng hồ đếm ngược từng ngày hướng về chuyến bay tới Nha Trang ngày hai bảy tháng tám!'
  },
  {
    step: 13,
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

  // Notify parent to smoothly zoom in and center the camera on the building!
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
      {/* ── RUNNING COMPANION & DIALOGUE CARD AT BOTTOM ── */}
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
