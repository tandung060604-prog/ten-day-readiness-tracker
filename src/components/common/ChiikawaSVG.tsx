import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  character: ChiikawaCharacter
  size?: number
  className?: string
}

export function ChiikawaSVG({ character, size = 64, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`chiikawa-vector-model ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* Soft Shadow */}
      <ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,0.18)" />

      {/* ================= 1. CHIIKAWA (ちいかわ - Bé Mầm Trắng Tai Tròn) ================= */}
      {character === 'chiikawa' && (
        <g className="chiikawa-real-model">
          {/* Round White Ears */}
          <circle cx="36" cy="30" r="14" fill="#ffffff" stroke="#2b2d42" strokeWidth="3.5" />
          <circle cx="36" cy="30" r="7" fill="#ffccd5" />
          <circle cx="84" cy="30" r="14" fill="#ffffff" stroke="#2b2d42" strokeWidth="3.5" />
          <circle cx="84" cy="30" r="7" fill="#ffccd5" />

          {/* Chubby Head & Body */}
          <rect x="22" y="32" width="76" height="72" rx="38" fill="#ffffff" stroke="#2b2d42" strokeWidth="3.5" />

          {/* Sparkly Big Cute Eyes */}
          <ellipse cx="44" cy="58" rx="6" ry="8" fill="#2b2d42" />
          <circle cx="42" cy="55" r="2.5" fill="#ffffff" />
          <ellipse cx="76" cy="58" rx="6" ry="8" fill="#2b2d42" />
          <circle cx="74" cy="55" r="2.5" fill="#ffffff" />

          {/* Signature Pink Blush */}
          <ellipse cx="33" cy="68" rx="7" ry="4" fill="#ff8da1" opacity="0.65" />
          <line x1="30" y1="68" x2="36" y2="68" stroke="#ff4d6d" strokeWidth="1.5" />
          <ellipse cx="87" cy="68" rx="7" ry="4" fill="#ff8da1" opacity="0.65" />
          <line x1="84" y1="68" x2="90" y2="68" stroke="#ff4d6d" strokeWidth="1.5" />

          {/* Shy Mouth & Nose */}
          <ellipse cx="60" cy="63" rx="2.5" ry="1.5" fill="#2b2d42" />
          <path d="M 54 68 Q 60 73 66 68" fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round" />

          {/* Tiny Hands Holding Heart */}
          <ellipse cx="40" cy="85" rx="7" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="80" cy="85" rx="7" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
          <path d="M 60 82 C 55 76, 48 82, 60 92 C 72 82, 65 76, 60 82 Z" fill="#ff6d79" />

          {/* Cute Feet */}
          <ellipse cx="42" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="78" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
        </g>
      )}

      {/* ================= 2. HACHIWARE (ハチワレ - Mèo Tai Xanh Phân Cột) ================= */}
      {character === 'hachiware' && (
        <g className="hachiware-real-model">
          {/* Pointy Cat Ears */}
          <polygon points="28,40 18,16 46,26" fill="#67b7ff" stroke="#2b2d42" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="27,34 23,22 38,28" fill="#ffccd5" />
          <polygon points="92,40 102,16 74,26" fill="#67b7ff" stroke="#2b2d42" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="93,34 97,22 82,28" fill="#ffccd5" />

          {/* Head & Body */}
          <rect x="22" y="30" width="76" height="74" rx="38" fill="#ffffff" stroke="#2b2d42" strokeWidth="3.5" />

          {/* Signature Blue Hair Cap Pattern (Hachi Pattern) */}
          <path
            d="M 24 54 C 24 34, 40 30, 60 48 C 80 30, 96 34, 96 54 C 96 36, 82 30, 60 30 C 38 30, 24 36, 24 54 Z"
            fill="#67b7ff"
          />

          {/* Curious Cheerful Eyes */}
          <ellipse cx="43" cy="60" rx="5.5" ry="7.5" fill="#2b2d42" />
          <circle cx="41" cy="57" r="2.2" fill="#ffffff" />
          <ellipse cx="77" cy="60" rx="5.5" ry="7.5" fill="#2b2d42" />
          <circle cx="75" cy="57" r="2.2" fill="#ffffff" />

          {/* Pink Cheeks */}
          <ellipse cx="32" cy="68" rx="6.5" ry="3.5" fill="#ff8da1" opacity="0.6" />
          <ellipse cx="88" cy="68" rx="6.5" ry="3.5" fill="#ff8da1" opacity="0.6" />

          {/* Cat 'ω' Smiling Mouth with Tiny Fang */}
          <path d="M 51 68 Q 56 73 60 69 Q 64 73 69 68" fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round" />
          <polygon points="59,69 62,74 64,69" fill="#ffffff" stroke="#2b2d42" strokeWidth="1" />

          {/* Cheerful Arms */}
          <ellipse cx="32" cy="82" rx="7" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="88" cy="82" rx="7" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />

          {/* Feet */}
          <ellipse cx="42" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="78" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#2b2d42" strokeWidth="3" />
        </g>
      )}

      {/* ================= 3. USAGI (うさぎ - Thỏ Vàng Năng Lượng Cao) ================= */}
      {character === 'usagi' && (
        <g className="usagi-real-model">
          {/* Long Yellow Bunny Ears */}
          <ellipse cx="40" cy="22" rx="9" ry="24" transform="rotate(-12 40 22)" fill="#ffd166" stroke="#2b2d42" strokeWidth="3.5" />
          <ellipse cx="40" cy="22" rx="4.5" ry="16" transform="rotate(-12 40 22)" fill="#ffccd5" />
          <ellipse cx="80" cy="22" rx="9" ry="24" transform="rotate(12 80 22)" fill="#ffd166" stroke="#2b2d42" strokeWidth="3.5" />
          <ellipse cx="80" cy="22" rx="4.5" ry="16" transform="rotate(12 80 22)" fill="#ffccd5" />

          {/* Body */}
          <rect x="24" y="38" width="72" height="68" rx="36" fill="#ffd166" stroke="#2b2d42" strokeWidth="3.5" />

          {/* Wild Energetic Eyes */}
          <ellipse cx="44" cy="62" rx="5.5" ry="7.5" fill="#2b2d42" />
          <circle cx="43" cy="59" r="2.2" fill="#ffffff" />
          <ellipse cx="76" cy="62" rx="5.5" ry="7.5" fill="#2b2d42" />
          <circle cx="75" cy="59" r="2.2" fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx="34" cy="70" rx="6.5" ry="3.5" fill="#ff9f1c" opacity="0.6" />
          <ellipse cx="86" cy="70" rx="6.5" ry="3.5" fill="#ff9f1c" opacity="0.6" />

          {/* Wide Open 'Ya-ha!' Mouth */}
          <path d="M 52 68 Q 60 80 68 68 Z" fill="#e63946" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="60" cy="74" rx="4" ry="2" fill="#ffccd5" />

          {/* Raising Arms 'Uraaa!' */}
          <ellipse cx="22" cy="60" rx="7" ry="9" transform="rotate(-30 22 60)" fill="#ffd166" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="98" cy="60" rx="7" ry="9" transform="rotate(30 98 60)" fill="#ffd166" stroke="#2b2d42" strokeWidth="3" />

          {/* Feet */}
          <ellipse cx="44" cy="104" rx="8" ry="6" fill="#ffd166" stroke="#2b2d42" strokeWidth="3" />
          <ellipse cx="76" cy="104" rx="8" ry="6" fill="#ffd166" stroke="#2b2d42" strokeWidth="3" />
        </g>
      )}

      {/* ================= 4. MOMONGA (モモンガ - Sóc Bay Lông Xù Tím) ================= */}
      {character === 'momonga' && (
        <g className="momonga-real-model">
          {/* Big Fluffy Ears */}
          <circle cx="30" cy="32" r="16" fill="#cdb4db" stroke="#2b2d42" strokeWidth="3.5" />
          <circle cx="30" cy="32" r="9" fill="#ffccd5" />
          <circle cx="90" cy="32" r="16" fill="#cdb4db" stroke="#2b2d42" strokeWidth="3.5" />
          <circle cx="90" cy="32" r="9" fill="#ffccd5" />

          {/* Fluffy Tail */}
          <path d="M 85 95 C 115 90, 118 45, 95 48 C 82 50, 85 75, 80 90 Z" fill="#cdb4db" stroke="#2b2d42" strokeWidth="3" />

          {/* White & Lavender Head/Body */}
          <rect x="24" y="34" width="72" height="70" rx="36" fill="#ffffff" stroke="#2b2d42" strokeWidth="3.5" />
          <path d="M 26 50 C 35 34, 85 34, 94 50 C 85 42, 35 42, 26 50 Z" fill="#cdb4db" />

          {/* Diva Big Sassy Eyes */}
          <ellipse cx="44" cy="60" rx="6.5" ry="8.5" fill="#4a4e69" />
          <circle cx="42" cy="57" r="2.8" fill="#ffffff" />
          <ellipse cx="76" cy="60" rx="6.5" ry="8.5" fill="#4a4e69" />
          <circle cx="74" cy="57" r="2.8" fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx="32" cy="68" rx="6.5" ry="3.5" fill="#ffb4a2" opacity="0.7" />
          <ellipse cx="88" cy="68" rx="6.5" ry="3.5" fill="#ffb4a2" opacity="0.7" />

          {/* Cute Little Pout */}
          <ellipse cx="60" cy="63" rx="2" ry="1.5" fill="#2b2d42" />
          <path d="M 54 68 Q 60 73 66 68" fill="none" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" />

          {/* Hands and Feet */}
          <ellipse cx="38" cy="86" rx="6" ry="5" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="82" cy="86" rx="6" ry="5" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="44" cy="103" rx="7" ry="5" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="76" cy="103" rx="7" ry="5" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
        </g>
      )}

      {/* ================= 5. KURIMANJU (くりまんじゅう - Rái Cá Trà Chiều) ================= */}
      {character === 'kurimanju' && (
        <g className="kurimanju-real-model">
          {/* Flat Top Chestnut Cap */}
          <path d="M 30 45 C 30 25, 90 25, 90 45 Z" fill="#9c6644" stroke="#2b2d42" strokeWidth="3.5" />

          {/* Round Ears */}
          <circle cx="28" cy="46" r="10" fill="#ddb892" stroke="#2b2d42" strokeWidth="3" />
          <circle cx="92" cy="46" r="10" fill="#ddb892" stroke="#2b2d42" strokeWidth="3" />

          {/* Body */}
          <rect x="26" y="38" width="68" height="66" rx="34" fill="#ddb892" stroke="#2b2d42" strokeWidth="3.5" />
          <ellipse cx="60" cy="80" rx="20" ry="18" fill="#ede0d4" />

          {/* Chill Relaxed Half-Closed Eyes */}
          <path d="M 38 60 Q 45 54 52 60" fill="none" stroke="#2b2d42" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 68 60 Q 75 54 82 60" fill="none" stroke="#2b2d42" strokeWidth="3.5" strokeLinecap="round" />

          {/* Satisfied 'Haaa~' Mouth */}
          <ellipse cx="60" cy="64" rx="3" ry="2" fill="#2b2d42" />
          <path d="M 52 70 Q 60 78 68 70" fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round" />

          {/* Hands holding Green Tea Cup */}
          <rect x="52" y="78" width="16" height="18" rx="4" fill="#40916c" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="60" cy="80" rx="6" ry="2" fill="#74c69d" />
          <ellipse cx="48" cy="86" rx="5" ry="5" fill="#ddb892" stroke="#2b2d42" strokeWidth="2" />
          <ellipse cx="72" cy="86" rx="5" ry="5" fill="#ddb892" stroke="#2b2d42" strokeWidth="2" />

          {/* Feet */}
          <ellipse cx="44" cy="103" rx="7" ry="5" fill="#ddb892" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="76" cy="103" rx="7" ry="5" fill="#ddb892" stroke="#2b2d42" strokeWidth="2.5" />
        </g>
      )}

      {/* ================= 6. RAKKO (ラッコ - Sư Phụ Kiếm Sĩ Dũng Mãnh) ================= */}
      {character === 'rakko' && (
        <g className="rakko-real-model">
          {/* Ears */}
          <circle cx="28" cy="38" r="10" fill="#e9edc9" stroke="#2b2d42" strokeWidth="3" />
          <circle cx="92" cy="38" r="10" fill="#e9edc9" stroke="#2b2d42" strokeWidth="3" />

          {/* Head & Body */}
          <rect x="24" y="32" width="72" height="72" rx="36" fill="#e9edc9" stroke="#2b2d42" strokeWidth="3.5" />
          <ellipse cx="60" cy="78" rx="22" ry="20" fill="#fefae0" />

          {/* Cool Heroic Scarf */}
          <path d="M 32 72 Q 60 84 88 72 L 94 80 Q 60 92 26 80 Z" fill="#e63946" stroke="#2b2d42" strokeWidth="2.5" />
          <polygon points="86,76 96,96 82,90" fill="#e63946" stroke="#2b2d42" strokeWidth="2" />

          {/* Cool Determined Eyes */}
          <ellipse cx="44" cy="56" rx="5" ry="6.5" fill="#2b2d42" />
          <circle cx="43" cy="54" r="1.8" fill="#ffffff" />
          <ellipse cx="76" cy="56" rx="5" ry="6.5" fill="#2b2d42" />
          <circle cx="75" cy="54" r="1.8" fill="#ffffff" />

          {/* Serious Hero Mouth */}
          <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#2b2d42" />
          <line x1="53" y1="67" x2="67" y2="67" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" />

          {/* Star Mark on Forehead */}
          <polygon points="60,40 62,45 67,45 63,48 65,53 60,50 55,53 57,48 53,45 58,45" fill="#ffd166" stroke="#2b2d42" strokeWidth="1" />

          {/* Feet */}
          <ellipse cx="44" cy="103" rx="7" ry="5" fill="#e9edc9" stroke="#2b2d42" strokeWidth="2.5" />
          <ellipse cx="76" cy="103" rx="7" ry="5" fill="#e9edc9" stroke="#2b2d42" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  )
}
