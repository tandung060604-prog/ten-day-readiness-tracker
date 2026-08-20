import type { DialogueContext, DialogueLine } from './types'

const DIALOGUE_DATABASE: Record<string, DialogueLine[]> = {
  // ─── Chiikawa Dialogues (Gentle, Caring, Memory-Focused) ───
  'chiikawa:morning': [
    {
      id: 'chk_morn_1',
      text: 'Chào buổi sáng sớm mai! Chúc {partnerName} và anh một ngày thật bình yên và tràn đầy tiếng cười! 🌸',
      speaker: 'chiikawa',
      emotion: 'joyful',
      soundCue: 'squeak',
      animation: 'happy'
    }
  ],
  'chiikawa:night': [
    {
      id: 'chk_night_1',
      text: 'Trời đã khuya rồi... Hai bạn nhớ đi ngủ sớm để giữ gìn sức khỏe nhé! Chúc ngủ ngon~ 💤',
      speaker: 'chiikawa',
      emotion: 'sleepy',
      soundCue: 'squeak',
      animation: 'sleeping'
    }
  ],
  'chiikawa:sofa_checkin': [
    {
      id: 'chk_sofa_1',
      text: 'Ngồi bên nhau thế này thật là ấm áp quá đi! Hôm nay là ngày thứ {relationshipDays} rồi đó! 💖',
      speaker: 'chiikawa',
      emotion: 'loving',
      soundCue: 'squeak',
      animation: 'happy'
    }
  ],
  'chiikawa:hydration_done': [
    {
      id: 'chk_water_1',
      text: 'Hoan hô! Em đã uống đủ nước ngọt lành hôm nay rồi, làn da sẽ căng mịn lắm đây! ✨',
      speaker: 'chiikawa',
      emotion: 'joyful',
      soundCue: 'cheer',
      animation: 'celebrating'
    }
  ],
  'chiikawa:workout_done': [
    {
      id: 'chk_workout_1',
      text: 'Tập luyện xong rồi nè! Bé Chiikawa mang khăn mềm và nước ấm tới cho bạn đây! 🍵',
      speaker: 'chiikawa',
      emotion: 'comforting',
      soundCue: 'squeak',
      animation: 'happy'
    }
  ],
  'chiikawa:letter_sent': [
    {
      id: 'chk_letter_1',
      text: 'Thư tình đã được cất cẩn thận vào hòm thư rồi, ngọt ngào quá đi thui! 💌',
      speaker: 'chiikawa',
      emotion: 'loving',
      soundCue: 'squeak',
      animation: 'happy'
    }
  ],
  'chiikawa:miracle_ready': [
    {
      id: 'chk_miracle_1',
      text: 'Thanh Năng Lượng Đôi đã đầy ắp tình yêu rồi! Sẵn sàng tạo nên Phép Màu Tình Yêu chưa? ✨',
      speaker: 'chiikawa',
      emotion: 'joyful',
      soundCue: 'cheer',
      animation: 'celebrating'
    }
  ],
  'chiikawa:idle_random': [
    {
      id: 'chk_idle_1',
      text: 'Mỗi ngày trôi qua cùng {partnerName} đều là một ngày hạnh phúc trong Little Days! 🌷',
      speaker: 'chiikawa',
      emotion: 'joyful',
      soundCue: 'squeak',
      animation: 'happy'
    }
  ],

  // ─── Usagi Dialogues (High Energy, Bold, Action-Focused) ───
  'usagi:morning': [
    {
      id: 'usg_morn_1',
      text: 'YAAA-HAAA! Bật dậy nào, ngày mới rực lửa đã tới rồi, cùng nhau bứt phá thôi! ⚡',
      speaker: 'usagi',
      emotion: 'motivated',
      soundCue: 'yaha',
      animation: 'running'
    }
  ],
  'usagi:night': [
    {
      id: 'usg_night_1',
      text: 'Uraaa... Đặt điện thoại xuống và ngủ thật say để mai còn nạp năng lượng chạy nhảy nào! 🌙',
      speaker: 'usagi',
      emotion: 'sleepy',
      soundCue: 'yaha',
      animation: 'sleeping'
    }
  ],
  'usagi:sofa_checkin': [
    {
      id: 'usg_sofa_1',
      text: 'Yaha! Sofa êm quá, check-in ngay nhận Tim và Xu để nâng cấp thị trấn nào! 🔥',
      speaker: 'usagi',
      emotion: 'playful',
      soundCue: 'yaha',
      animation: 'happy'
    }
  ],
  'usagi:hydration_done': [
    {
      id: 'usg_water_1',
      text: 'Ura-ura! Nạp đủ nước rồi, tràn trề sức sống như suối ngọc luôn! 🌊',
      speaker: 'usagi',
      emotion: 'motivated',
      soundCue: 'yaha',
      animation: 'celebrating'
    }
  ],
  'usagi:workout_done': [
    {
      id: 'usg_workout_1',
      text: 'YAAA-HAAA! Đẩy tạ xong đỉnh chóp luôn! Cơ bắp săn chắc chuẩn bị quẩy biển Nha Trang! 💪🏖️',
      speaker: 'usagi',
      emotion: 'motivated',
      soundCue: 'yaha',
      animation: 'victory'
    }
  ],
  'usagi:letter_sent': [
    {
      id: 'usg_letter_1',
      text: 'Bắn thư tình siêu tốc tới trái tim {partnerName}! Cực kỳ ngọt ngào! 🚀💌',
      speaker: 'usagi',
      emotion: 'playful',
      soundCue: 'yaha',
      animation: 'happy'
    }
  ],
  'usagi:miracle_ready': [
    {
      id: 'usg_miracle_1',
      text: 'URAAAA! Năng lượng tình yêu bùng cháy 100%! Bấm kích hoạt Phép Màu ngay và luôn! 🌟⚡',
      speaker: 'usagi',
      emotion: 'motivated',
      soundCue: 'yaha',
      animation: 'celebrating'
    }
  ],
  'usagi:idle_random': [
    {
      id: 'usg_idle_1',
      text: 'Pululululu~ Usagi luôn sẵn sàng đồng hành cùng {partnerName} trên mọi hành trình! 🥕✨',
      speaker: 'usagi',
      emotion: 'playful',
      soundCue: 'yaha',
      animation: 'happy'
    }
  ]
}

/**
 * Selects a context-aware dialogue line for the mascot companion.
 */
export function getContextualDialogue(context: DialogueContext): DialogueLine {
  const key = `${context.character}:${context.trigger}`
  const fallbackKey = `${context.character}:idle_random`

  const list = DIALOGUE_DATABASE[key] || DIALOGUE_DATABASE[fallbackKey] || DIALOGUE_DATABASE['chiikawa:idle_random']
  const selected = list[Math.floor(Math.random() * list.length)]

  // Interpolate placeholders
  const partner = context.partnerName || 'người ấy'
  const days = String(context.relationshipDays ?? 100)

  const text = selected.text
    .replace(/{partnerName}/g, partner)
    .replace(/{relationshipDays}/g, days)

  return {
    ...selected,
    text
  }
}
