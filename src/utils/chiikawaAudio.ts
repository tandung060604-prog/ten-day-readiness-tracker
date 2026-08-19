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
    name: 'Haru (Chiikawa)',
    jpName: 'ちいかわ',
    title: 'Bé Mầm Trắng Đáng Yêu',
    role: 'Theo Dõi Phục Hồi & Giấc Ngủ',
    color: '#ff8da1',
    badgeBg: 'rgba(255, 141, 161, 0.18)',
    borderColor: 'rgba(255, 141, 161, 0.4)',
    avatarEmoji: '🐹',
    voicePhrases: ['Waaah! ✨', 'Yaa! 💖', 'Funyaa~ 🌸', 'E-he-he! 🥰', 'Haru ơi cố lên!'],
    quotes: ['Hôm nay Haru & Mai Trang phải ngủ thật ngoan nhé~', 'Cố lên nà, tớ luôn ở đây ủng hộ 2 bạn!'],
    soundType: 'squeak'
  },
  usagi: {
    name: 'Mai Trang (Usagi)',
    jpName: 'うさぎ',
    title: 'Thỏ Vàng Năng Lượng Siêu Cấp',
    role: 'Tập Luyện & Đẩy Tạ',
    color: '#ffd166',
    badgeBg: 'rgba(255, 209, 102, 0.18)',
    borderColor: 'rgba(255, 209, 102, 0.4)',
    avatarEmoji: '🐰',
    voicePhrases: ['Ya-haaa! ⚡', 'Uraaaa! 🚀', 'Pululululu~ 🥕', 'Fuuuun! ✨', 'Mai Trang sẵn sàng!'],
    quotes: ['Ya-ha! Đẩy tạ hết mình chuẩn bị đi Nha Trang!', 'Ura! Không được lười biếng đâu đấy!'],
    soundType: 'yaha'
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
    voicePhrases: ['Nanto kanaare! 🍀', 'Ittari kitari! 🎵', 'Saa, ikuzo! 🌟'],
    quotes: ['Mọi chuyện rồi sẽ ổn thôi mà! (Nanto kanaare!)', 'Nhớ uống đủ nước để da dẻ tươi tắn nha!'],
    soundType: 'cheer'
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
    voicePhrases: ['Homero! 👑', 'Miite miite! 🎀', 'Mogumogu~ 🍎'],
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
    voicePhrases: ['Haaaa~ 🍵', 'Gulp gulp! 🧋', 'Umai! 🍡'],
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
    voicePhrases: ['Daijoubu da! ⚔️', 'Tsuitekoi! 🛡️', 'Yoshi! 🏆'],
    quotes: ['Không sao cả, hãy kiên trì từng ngày một!', 'Chỉ cần giữ đúng kỷ luật, chuyến đi 27/08 sẽ hoàn hảo!'],
    soundType: 'cool'
  }
}

// Synthesize authentic playful anime voice audio effects with Web Audio API
export function playChiikawaVoice(charKey: ChiikawaCharacter): string {
  triggerHaptic('medium')
  const char = CHIIKAWA_CHARACTERS[charKey] || CHIIKAWA_CHARACTERS.chiikawa
  const phrase = char.voicePhrases[Math.floor(Math.random() * char.voicePhrases.length)]

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      const ctx = new AudioContextClass()
      if (ctx.state === 'suspended') ctx.resume()

      const now = ctx.currentTime

      switch (char.soundType) {
        case 'squeak': {
          // Chiikawa (Haru) - Dual-tone high-pitched chirp & cute giggle
          const osc1 = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gainNode = ctx.createGain()

          osc1.type = 'sine'
          osc2.type = 'triangle'

          // Main pitch ramp
          osc1.frequency.setValueAtTime(680, now)
          osc1.frequency.exponentialRampToValueAtTime(1450, now + 0.1)
          osc1.frequency.exponentialRampToValueAtTime(850, now + 0.22)
          osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.32)

          // Sub harmonic
          osc2.frequency.setValueAtTime(340, now)
          osc2.frequency.exponentialRampToValueAtTime(725, now + 0.1)
          osc2.frequency.exponentialRampToValueAtTime(425, now + 0.32)

          gainNode.gain.setValueAtTime(0.22, now)
          gainNode.gain.exponentialRampToValueAtTime(0.28, now + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

          osc1.connect(gainNode)
          osc2.connect(gainNode)
          gainNode.connect(ctx.destination)

          osc1.start(now)
          osc2.start(now)
          osc1.stop(now + 0.35)
          osc2.stop(now + 0.35)
          break
        }

        case 'yaha': {
          // Usagi (Mai Trang) - Triple chaotic "Ya-haaa! Uraaaa!" bounce
          const osc = ctx.createOscillator()
          const sub = ctx.createOscillator()
          const gainNode = ctx.createGain()

          osc.type = 'sawtooth'
          sub.type = 'sine'

          // Rapid frequency jumps (signature Usagi voice cadence)
          osc.frequency.setValueAtTime(520, now)
          osc.frequency.linearRampToValueAtTime(1150, now + 0.06)
          osc.frequency.linearRampToValueAtTime(750, now + 0.12)
          osc.frequency.linearRampToValueAtTime(1680, now + 0.22)
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.32)

          sub.frequency.setValueAtTime(260, now)
          sub.frequency.linearRampToValueAtTime(575, now + 0.12)

          gainNode.gain.setValueAtTime(0.22, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.34)

          // Filter for warm soft edge
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.setValueAtTime(2600, now)

          osc.connect(filter)
          sub.connect(filter)
          filter.connect(gainNode)
          gainNode.connect(ctx.destination)

          osc.start(now)
          sub.start(now)
          osc.stop(now + 0.34)
          sub.stop(now + 0.34)
          break
        }

        case 'cheer': {
          // Hachiware - Joyful ascending major triad (C5 -> E5 -> G5 -> C6)
          const notes = [523.25, 659.25, 783.99, 1046.5]
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, now + i * 0.07)
            gain.gain.setValueAtTime(0.18, now + i * 0.07)
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.14)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(now + i * 0.07)
            osc.stop(now + i * 0.07 + 0.14)
          })
          break
        }

        case 'cute': {
          // Momonga - Soft flute flutter
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(780, now)
          osc.frequency.exponentialRampToValueAtTime(1380, now + 0.12)
          osc.frequency.exponentialRampToValueAtTime(980, now + 0.25)
          gainNode.gain.setValueAtTime(0.18, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.28)
          break
        }

        case 'gulp': {
          // Kurimanju - Warm relaxing tea cup chime
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(440, now)
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.18)
          gainNode.gain.setValueAtTime(0.24, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.38)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.38)
          break
        }

        case 'cool': {
          // Rakko - Crisp sword victory chime
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(880, now)
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.06)
          gainNode.gain.setValueAtTime(0.22, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.32)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.32)
          break
        }
      }
    }
  } catch (err) {
    console.debug('Audio context not ready:', err)
  }

  return phrase
}
