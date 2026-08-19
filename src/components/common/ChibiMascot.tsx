import { useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'

export type MascotRole = 'healthy' | 'workout' | 'guide' | 'nutrition' | 'zen'

const MASCOT_QUOTES: Record<MascotRole, string[]> = {
  healthy: [
    '🥗 Dinh dưỡng sạch chiếm 70% tốc độ phục hồi đó bạn ơi!',
    '🥑 Thêm 1 đĩa rau xanh và 200g đạm sạch cho bữa trưa nhé!',
    '🥚 Đừng quên trứng và chuối - nguồn năng lượng vàng!',
    '😋 Ăn no 80% là bí quyết giữ sự tỉnh táo cả ngày!'
  ],
  workout: [
    '🏋️ Tập đúng form, giữ nhịp thở đều, không cần vội!',
    '🔥 10 ngày siết phong độ, vượt ngưỡng từng chút một!',
    '💪 Cơ bắp phát triển trong lúc bạn ngủ sâu và nghỉ ngơi!',
    '⚡ Đẩy thêm 1 rep nữa nào, bạn làm được mà!'
  ],
  guide: [
    '📋 Chào bạn! Cùng tích đủ checklist để rước pháo hoa nhé!',
    '✨ Bấm vào các thẻ bài tập để xem mô phỏng chuyển động!',
    '🔒 Nhớ vào Cài đặt để bật mã PIN và Face ID bảo mật nha!',
    '🌟 Lộ trình 10 ngày sẽ đưa bạn về đích xuất sắc nhất!'
  ],
  nutrition: [
    '💧 Uống từng ngụm nhỏ cách nhau 45 phút bạn nhé!',
    '🌊 Đạt mốc 2.5L nước hôm nay để thanh lọc cơ thể!',
    '🍋 Uống nước ấm vào buổi sáng giúp khởi động hệ tiêu hóa!',
    '💤 Hạn chế uống nhiều nước sau 21h để ngủ thật sâu giấc!'
  ],
  zen: [
    '🧘 Hít sâu 4 giây... Thở ra từ từ 6 giây... Thả lỏng vai nào!',
    '🍃 Thả lỏng cơ hàm và mắt, xua tan căng thẳng sau giờ làm!',
    '🌙 8 tiếng ngủ đêm là liều thuốc phục hồi mạnh mẽ nhất!',
    '🕊 Tâm trí tĩnh lặng - Cơ thể sẵn sàng cao độ!'
  ]
}

type Props = {
  role?: MascotRole
  size?: number
  showSpeechBubble?: boolean
  customSpeech?: string
  interactive?: boolean
  className?: string
}

export function ChibiMascot({
  role = 'guide',
  size = 140,
  showSpeechBubble = true,
  customSpeech,
  interactive = true,
  className = ''
}: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0)

  const quotes = MASCOT_QUOTES[role]
  const currentQuote = customSpeech || quotes[quoteIndex % quotes.length]

  const handleTap = () => {
    if (!interactive) return
    triggerHaptic('light')
    setQuoteIndex((prev) => prev + 1)
  }

  return (
    <div
      className={`chibi-mascot-wrap ${interactive ? 'interactive' : ''} ${className}`}
      onClick={handleTap}
      title={interactive ? 'Chạm vào bé Chibi để đổi câu thoại cổ vũ!' : undefined}
    >
      {showSpeechBubble && (
        <div className="chibi-speech-bubble animate-slide-up">
          <p>{currentQuote}</p>
          <span className="bubble-arrow" />
        </div>
      )}

      <div
        className={`chibi-character chibi-role-${role}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          className="chibi-svg animate-float"
        >
          {/* Shadow */}
          <ellipse cx="80" cy="148" rx="36" ry="7" fill="rgba(0,0,0,0.25)" className="chibi-shadow" />

          {/* ================= MASCOT 1: HEALTHY (Ăn uống Healthy) ================= */}
          {role === 'healthy' && (
            <g className="mascot-healthy-anim">
              {/* Chef Hat */}
              <ellipse cx="80" cy="36" rx="26" ry="18" fill="#ffffff" />
              <rect x="62" y="32" width="36" height="12" rx="4" fill="#f4f7f8" />
              {/* Head */}
              <circle cx="80" cy="65" r="32" fill="#ffe0bd" />
              {/* Hair */}
              <path d="M 50 60 Q 80 38 110 60 Q 95 46 65 48 Z" fill="#4a2e18" />
              {/* Blush cheeks */}
              <circle cx="62" cy="74" r="6" fill="#ff8da1" opacity="0.6" className="anim-blush" />
              <circle cx="98" cy="74" r="6" fill="#ff8da1" opacity="0.6" className="anim-blush" />
              {/* Big Sparkling Eyes */}
              <circle cx="68" cy="65" r="5" fill="#2d1d12" />
              <circle cx="70" cy="63" r="2" fill="#ffffff" />
              <circle cx="92" cy="65" r="5" fill="#2d1d12" />
              <circle cx="94" cy="63" r="2" fill="#ffffff" />
              {/* Happy Mouth */}
              <path d="M 74 76 Q 80 82 86 76" fill="none" stroke="#b33939" strokeWidth="2.5" strokeLinecap="round" />
              {/* Body / Apron */}
              <path d="M 60 95 Q 80 90 100 95 L 105 135 L 55 135 Z" fill="#4ee1aa" />
              <rect x="68" y="98" width="24" height="28" rx="4" fill="#ffffff" />
              {/* Salad Bowl in Hands */}
              <ellipse cx="80" cy="118" rx="20" ry="10" fill="#f6c96a" />
              <circle cx="75" cy="115" r="5" fill="#4ee1aa" /> {/* Avocado/Veg */}
              <circle cx="85" cy="114" r="4" fill="#ff6d79" /> {/* Tomato */}
              <circle cx="80" cy="112" r="4" fill="#ffffff" /> {/* Egg */}
              {/* Floating Heart */}
              <path
                d="M 120 45 C 120 38 112 36 110 42 C 108 36 100 38 100 45 C 100 52 110 58 110 58 C 110 58 120 52 120 45 Z"
                fill="#ff6d79"
                className="anim-floating-heart"
              />
            </g>
          )}

          {/* ================= MASCOT 2: WORKOUT (Đẩy Tạ / Gym) ================= */}
          {role === 'workout' && (
            <g className="mascot-workout-anim">
              {/* Head */}
              <circle cx="80" cy="68" r="32" fill="#ffe0bd" />
              {/* Hair */}
              <path d="M 48 64 Q 80 36 112 64 Q 96 46 64 48 Z" fill="#2c3e50" />
              {/* Red Sport Headband */}
              <path d="M 49 55 Q 80 46 111 55 L 110 63 Q 80 54 50 63 Z" fill="#ff6d79" />
              <circle cx="60" cy="58" r="4" fill="#ffffff" />
              {/* Determined Eyes */}
              <circle cx="68" cy="68" r="5" fill="#1a252f" />
              <circle cx="70" cy="66" r="2" fill="#ffffff" />
              <circle cx="92" cy="68" r="5" fill="#1a252f" />
              <circle cx="94" cy="66" r="2" fill="#ffffff" />
              {/* Confident Smile */}
              <path d="M 74 78 Q 80 84 86 78" fill="none" stroke="#1a252f" strokeWidth="2.5" strokeLinecap="round" />
              {/* Body & Tank top */}
              <path d="M 60 98 Q 80 94 100 98 L 104 135 L 56 135 Z" fill="#3498db" />
              {/* Lifting Barbell (Animated Up & Down) */}
              <g className="anim-barbell">
                {/* Bar */}
                <line x1="20" y1="40" x2="140" y2="40" stroke="#7f8c8d" strokeWidth="5" strokeLinecap="round" />
                {/* Weights */}
                <rect x="22" y="24" width="10" height="32" rx="3" fill="#34495e" />
                <rect x="128" y="24" width="10" height="32" rx="3" fill="#34495e" />
                {/* Arms raising */}
                <path d="M 58 100 L 40 45" stroke="#ffe0bd" strokeWidth="7" strokeLinecap="round" />
                <path d="M 102 100 L 120 45" stroke="#ffe0bd" strokeWidth="7" strokeLinecap="round" />
              </g>
              {/* Sweat Sparkle */}
              <path d="M 116 65 Q 120 62 118 69 Z" fill="#67b7ff" className="anim-sweat" />
            </g>
          )}

          {/* ================= MASCOT 3: GUIDE (Hướng Dẫn Sử Dụng) ================= */}
          {role === 'guide' && (
            <g className="mascot-guide-anim">
              {/* Head */}
              <circle cx="80" cy="65" r="32" fill="#ffe0bd" />
              {/* Cute Hair with Sprout Leaf */}
              <path d="M 48 62 Q 80 38 112 62 Q 95 46 65 48 Z" fill="#5c3818" />
              <path d="M 80 38 Q 82 22 92 24 Q 92 34 82 38" fill="#4ee1aa" /> {/* Sprout leaf */}
              {/* Glasses */}
              <circle cx="68" cy="65" r="9" fill="none" stroke="#f6c96a" strokeWidth="2.5" />
              <circle cx="92" cy="65" r="9" fill="none" stroke="#f6c96a" strokeWidth="2.5" />
              <line x1="77" y1="65" x2="83" y2="65" stroke="#f6c96a" strokeWidth="2.5" />
              {/* Eyes inside glasses */}
              <circle cx="68" cy="65" r="4" fill="#2d1d12" />
              <circle cx="92" cy="65" r="4" fill="#2d1d12" />
              {/* Waving Hand */}
              <circle cx="120" cy="75" r="7" fill="#ffe0bd" className="anim-waving-hand" />
              {/* Cute Smile */}
              <path d="M 75 76 Q 80 82 85 76" fill="none" stroke="#b33939" strokeWidth="2" strokeLinecap="round" />
              {/* Body */}
              <path d="M 60 95 Q 80 90 100 95 L 105 135 L 55 135 Z" fill="#64a5ff" />
              {/* 10-Day Checklist Board */}
              <rect x="42" y="98" width="28" height="36" rx="4" fill="#ffffff" stroke="#2c3e50" strokeWidth="2" />
              <line x1="47" y1="106" x2="65" y2="106" stroke="#4ee1aa" strokeWidth="2" />
              <line x1="47" y1="114" x2="65" y2="114" stroke="#4ee1aa" strokeWidth="2" />
              <line x1="47" y1="122" x2="60" y2="122" stroke="#4ee1aa" strokeWidth="2" />
            </g>
          )}

          {/* ================= MASCOT 4: NUTRITION & WATER (Tư Vấn Nước & Dinh Dưỡng) ================= */}
          {role === 'nutrition' && (
            <g className="mascot-nutrition-anim">
              {/* Head */}
              <circle cx="80" cy="65" r="32" fill="#ffe0bd" />
              {/* Hair with blue ribbon */}
              <path d="M 48 62 Q 80 38 112 62 Q 95 46 65 48 Z" fill="#6c5ce7" />
              {/* Winking eye & Happy eye */}
              <path d="M 64 65 Q 69 60 74 65" fill="none" stroke="#2d1d12" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="92" cy="64" r="5" fill="#2d1d12" />
              <circle cx="94" cy="62" r="2" fill="#ffffff" />
              {/* Blush */}
              <circle cx="62" cy="74" r="5" fill="#ff8da1" opacity="0.6" />
              <circle cx="98" cy="74" r="5" fill="#ff8da1" opacity="0.6" />
              {/* Open smile */}
              <path d="M 75 75 Q 80 83 85 75 Z" fill="#ff6d79" />
              {/* Body */}
              <path d="M 60 95 Q 80 90 100 95 L 105 135 L 55 135 Z" fill="#00cec9" />
              {/* Glowing Water Bottle in Hand */}
              <rect x="98" y="92" width="18" height="34" rx="4" fill="#67b7ff" className="anim-glow-bottle" />
              <rect x="103" y="86" width="8" height="6" rx="2" fill="#ffffff" />
              <path d="M 103 104 Q 107 98 111 104 T 115 104" fill="none" stroke="#ffffff" strokeWidth="2" />
              {/* Apple in other hand */}
              <circle cx="50" cy="115" r="9" fill="#ff6d79" />
              <path d="M 50 106 Q 52 102 55 103" fill="none" stroke="#4ee1aa" strokeWidth="2" />
            </g>
          )}

          {/* ================= MASCOT 5: ZEN (Thiền & Thở 4:6) ================= */}
          {role === 'zen' && (
            <g className="mascot-zen-anim">
              {/* Glowing Aura Ring */}
              <circle cx="80" cy="75" r="48" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" className="anim-aura" />
              {/* Head */}
              <circle cx="80" cy="65" r="30" fill="#ffe0bd" />
              {/* Hair with Topknot */}
              <path d="M 50 62 Q 80 38 110 62 Q 95 46 65 48 Z" fill="#2d3436" />
              <circle cx="80" cy="34" r="8" fill="#2d3436" />
              {/* Peaceful Closed Eyes */}
              <path d="M 64 66 Q 69 70 74 66" fill="none" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 86 66 Q 91 70 96 66" fill="none" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" />
              {/* Gentle Smile */}
              <path d="M 76 76 Q 80 80 84 76" fill="none" stroke="#2d3436" strokeWidth="2" strokeLinecap="round" />
              {/* Body Meditating (Cross-legged) */}
              <path d="M 60 92 Q 80 88 100 92 L 108 125 L 52 125 Z" fill="#55efc4" />
              {/* Folded Legs */}
              <ellipse cx="80" cy="126" rx="34" ry="12" fill="#00b894" />
              {/* Floating Cloud */}
              <path
                d="M 50 138 Q 65 128 80 134 Q 95 128 110 138 Q 120 148 105 152 Q 80 155 55 152 Q 40 146 50 138 Z"
                fill="#dfe6e9"
                opacity="0.85"
                className="anim-cloud"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
