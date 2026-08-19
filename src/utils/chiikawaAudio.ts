import { triggerHaptic } from './haptics'

export type ChiikawaCharacter = 'chiikawa' | 'hachiware' | 'usagi' | 'momonga' | 'kurimanju' | 'rakko'

export const CHIIKAWA_CHARACTERS: Record<
  ChiikawaCharacter,
  {
    name: string
    jpName: string
    title: string
    role: string
    color: string
    badgeBg: string
    borderColor: string
    avatarEmoji: string
    voicePhrases: string[]
    quotes: string[]
    soundType: 'squeak' | 'cheer' | 'yaha' | 'cute' | 'gulp' | 'cool'
  }
> = {
  chiikawa: {
    name: 'Chiikawa',
    jpName: 'ちいかわ',
    title: 'Bé Mầm Trắng Đáng Yêu',
    role: 'Theo Dõi Phục Hồi & Giấc Ngủ',
    color: '#ff8da1',
    badgeBg: 'rgba(255, 141, 161, 0.18)',
    borderColor: 'rgba(255, 141, 161, 0.4)',
    avatarEmoji: '🐹',
    voicePhrases: ['Waaah!', 'Yaa!', 'Funyaa~', 'E-he-he!'],
    quotes: ['Hôm nay Dũng & Em Yêu phải ngủ thật ngoan nhé~', 'Cố lên nà, tớ luôn ở đây ủng hộ 2 bạn!'],
    soundType: 'squeak'
  },
  hachiware: {
    name: 'Hachiware',
    jpName: 'ハチワレ',
    title: 'Mèo Tai Xanh Lạc Quan',
    role: 'Nước Uống & Thói Quen',
    color: '#67b7ff',
    badgeBg: 'rgba(103, 183, 255, 0.18)',
    borderColor: 'rgba(103, 183, 255, 0.4)',
    avatarEmoji: '🐱',
    voicePhrases: ['Nanto kanaare!', 'Ittari kitari!', 'Saa, ikuzo!'],
    quotes: ['Mọi chuyện rồi sẽ ổn thôi mà! (Nanto kanaare!)', 'Nhớ uống đủ nước để da dẻ tươi tắn nha!'],
    soundType: 'cheer'
  },
  usagi: {
    name: 'Usagi',
    jpName: 'うさぎ',
    title: 'Thỏ Vàng Năng Lượng Siêu Cấp',
    role: 'Tập Luyện & Đẩy Tạ',
    color: '#ffd166',
    badgeBg: 'rgba(255, 209, 102, 0.18)',
    borderColor: 'rgba(255, 209, 102, 0.4)',
    avatarEmoji: '🐰',
    voicePhrases: ['Uraaaa!', 'Ya-ha!', 'Pululululu~', 'Fuuuun!'],
    quotes: ['Ya-ha! Đẩy tạ hết mình chuẩn bị đi Nha Trang!', 'Ura! Không được lười biếng đâu đấy!'],
    soundType: 'yaha'
  },
  momonga: {
    name: 'Momonga',
    jpName: 'モモンガ',
    title: 'Sóc Bay Bông Xù Sang Chảnh',
    role: 'Dinh Dưỡng & Ăn Sạch',
    color: '#cdb4db',
    badgeBg: 'rgba(205, 180, 219, 0.18)',
    borderColor: 'rgba(205, 180, 219, 0.4)',
    avatarEmoji: '🐿️',
    voicePhrases: ['Homero!', 'Miite miite!', 'Mogumogu~'],
    quotes: ['Khen tôi đi! Hôm nay đã ăn uống healthy chưa?', 'Nhìn này, đĩa ăn này trông ngon tuyệt cú mèo!'],
    soundType: 'cute'
  },
  kurimanju: {
    name: 'Kurimanju',
    jpName: 'くりまんじゅう',
    title: 'Rái Cá Uống Trà Thư Giãn',
    role: 'Âm Thanh Ru Ngủ & Thư Thái',
    color: '#dfb15b',
    badgeBg: 'rgba(223, 177, 91, 0.18)',
    borderColor: 'rgba(223, 177, 91, 0.4)',
    avatarEmoji: '🦦',
    voicePhrases: ['Haaaa~', 'Gulp gulp!', 'Umai!'],
    quotes: ['Haaaa~ Uống một ngụm trà rồi thả lỏng đầu óc nào.', 'Ngủ sớm đi, ngày mai còn cả một bầu trời phía trước.'],
    soundType: 'gulp'
  },
  rakko: {
    name: 'Rakko',
    jpName: 'ラッコ',
    title: 'Sư Phụ Rái Cá Kiếm Sĩ',
    role: 'Lộ Trình 10 Ngày & Kỷ Luật',
    color: '#4ee1aa',
    badgeBg: 'rgba(78, 225, 170, 0.18)',
    borderColor: 'rgba(78, 225, 170, 0.4)',
    avatarEmoji: '⭐',
    voicePhrases: ['Daijoubu da!', 'Tsuitekoi!', 'Yoshi!'],
    quotes: ['Không sao cả, hãy kiên trì từng ngày một!', 'Chỉ cần giữ đúng kỷ luật, chuyến đi 27/08 sẽ hoàn hảo!'],
    soundType: 'cool'
  }
}

// Synthesize playful anime sound effects with Web Audio API
export function playChiikawaVoice(charKey: ChiikawaCharacter): string {
  triggerHaptic('medium')
  const char = CHIIKAWA_CHARACTERS[charKey]
  const phrase = char.voicePhrases[Math.floor(Math.random() * char.voicePhrases.length)]

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      const ctx = new AudioContextClass()
      if (ctx.state === 'suspended') ctx.resume()

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      switch (char.soundType) {
        case 'squeak': // High-pitched cute squeak for Chiikawa
          osc.type = 'sine'
          osc.frequency.setValueAtTime(600, now)
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12)
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.25)
          gain.gain.setValueAtTime(0.15, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
          osc.start(now)
          osc.stop(now + 0.25)
          break

        case 'yaha': // Fast chaotic bounce for Usagi (Ya-ha!)
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(450, now)
          osc.frequency.linearRampToValueAtTime(950, now + 0.08)
          osc.frequency.linearRampToValueAtTime(1400, now + 0.18)
          gain.gain.setValueAtTime(0.2, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
          osc.start(now)
          osc.stop(now + 0.22)
          break

        case 'cheer': // Uplifting double tone for Hachiware
          osc.type = 'sine'
          osc.frequency.setValueAtTime(523.25, now) // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16) // G5
          gain.gain.setValueAtTime(0.18, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
          osc.start(now)
          osc.stop(now + 0.28)
          break

        case 'cute': // Fluffy purr for Momonga
          osc.type = 'sine'
          osc.frequency.setValueAtTime(700, now)
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1)
          gain.gain.setValueAtTime(0.16, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
          osc.start(now)
          osc.stop(now + 0.2)
          break

        case 'gulp': // Deep satisfying pop for Kurimanju
          osc.type = 'sine'
          osc.frequency.setValueAtTime(320, now)
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.15)
          gain.gain.setValueAtTime(0.25, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
          osc.start(now)
          osc.stop(now + 0.25)
          break

        case 'cool': // Heroic fanfare chord for Rakko
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(440, now)
          osc.frequency.setValueAtTime(880, now + 0.1)
          gain.gain.setValueAtTime(0.15, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
          osc.start(now)
          osc.stop(now + 0.28)
          break
      }
    }
  } catch (e) {
    // AudioContext not supported
  }

  return phrase
}
