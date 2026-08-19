import { triggerHaptic } from './haptics'
import { playChiikawaVoice } from './chiikawaAudio'
import type { ChiikawaCharacter } from './chiikawaAudio'

// Speaks Vietnamese text with Web Speech Synthesis API
export function speakVietnamese(
  text: string,
  options?: {
    charVoice?: ChiikawaCharacter
    onEnd?: () => void
    rate?: number
    pitch?: number
  }
) {
  triggerHaptic('light')

  // Play cute anime character sound effect first
  if (options?.charVoice) {
    playChiikawaVoice(options.charVoice)
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onEnd) options.onEnd()
    return
  }

  try {
    window.speechSynthesis.cancel() // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.rate = options?.rate ?? 1.05
    utterance.pitch = options?.pitch ?? 1.2

    // Look for Vietnamese voice in the system
    const voices = window.speechSynthesis.getVoices()
    const viVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('vi') ||
        v.lang.toLowerCase().includes('vn') ||
        v.name.toLowerCase().includes('vietnamese')
    )

    if (viVoice) {
      utterance.voice = viVoice
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd
    }

    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.debug('Speech synthesis error:', err)
    if (options?.onEnd) options.onEnd()
  }
}

// Pre-defined Vietnamese voice lines for all 12 buildings
export const BUILDING_VIETNAMESE_VOICES: Record<string, string> = {
  home: 'Nhà của chúng mình. Chào mừng Haru và Mai Trang về nhà! Nơi theo dõi số ngày yêu nhau và lộ trình mười ngày sẵn sàng.',
  sleep: 'Trung tâm giấc ngủ. Chúc bạn có một giấc ngủ ngon chín mươi phút và phục hồi năng lượng thật tốt!',
  journal: 'Thư viện ký ức. Nơi lưu giữ những dòng nhật ký cảm xúc, lời nhắn yêu thương và kỷ niệm đẹp của hai bạn.',
  restaurant: 'Nhà hàng hẹn hò. Cùng lên lịch bữa tối lãng mạn tại Queen Ann Sky Lounge.',
  market: 'Chợ nhỏ dinh dưỡng. Nơi chọn thực đơn ăn sạch, đủ dưỡng chất và bù nước mỗi ngày.',
  quests: 'Bảng nhiệm vụ mười ngày sẵn sàng. Checklist chuẩn bị trang phục, tài chính và đồ dùng đi biển Nha Trang.',
  album: 'Album kỷ niệm. Bộ sưu tập những khoảnh khắc ngọt ngào của Haru và Mai Trang.',
  settings: 'Tòa thị chính. Cài đặt hệ thống, quản lý dữ liệu và bảo mật mã pin.',
  gym: 'Nhà tập gym thể lực. Rèn luyện sức khỏe, hít đất và nâng tạ mỗi ngày cùng Haru.',
  water: 'Đài nước sinh mệnh. Nhắc nhở uống đủ hai nghìn năm trăm mi-li-lít nước mỗi ngày.',
  airport: 'Sân bay quốc tế. Đếm ngược tới chuyến bay khởi hành đi Nha Trang ngày hai mươi bảy tháng tám.',
  beach: 'Bãi biển Nha Trang. Khám phá tour ba đảo Hòn Mun, Mini Beach và lặn ngắm san hô.'
}
