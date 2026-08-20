import type { CharacterAbility } from './types'
import type { MascotCharacter } from '../couple/types'

export const COMPANION_ABILITIES: CharacterAbility[] = [
  // ─── Chiikawa Abilities (Support / Memory / Heart) ───
  {
    id: 'heart_shield',
    name: 'Khiên Trái Tim (Heart Shield)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '🛡️💖',
    description: 'Bảo vệ chuỗi thói quen và tạo lá chắn phục hồi năng lượng.',
    cooldownSeconds: 45,
    energyCost: 15,
    synergyEffect: 'Tăng 20% điểm khi kết hợp cùng Ya-Haaa Burst của Usagi.'
  },
  {
    id: 'memory_spark',
    name: 'Tia Sáng Kỷ Niệm (Memory Spark)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '✨📸',
    description: 'Gợi ý khoảnh khắc đẹp trong ngày và nhân đôi điểm Kỷ Niệm.',
    cooldownSeconds: 60,
    energyCost: 20,
    synergyEffect: 'Mở khóa một khung ảnh polaroid đặc biệt.'
  },
  {
    id: 'tiny_courage',
    name: 'Dũng Khí Bé Nhỏ (Tiny Courage)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '🌱💪',
    description: 'Tạo cơ hội vượt qua thử thách khó khăn và tăng 25% XP nhận được.',
    cooldownSeconds: 90,
    energyCost: 25
  },
  {
    id: 'memory_magnet',
    name: 'Nam Châm Ký Ức (Memory Magnet)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '🧲💌',
    description: 'Thu hút các mục tiêu kỷ niệm và cột mốc tình yêu lại gần hơn.',
    cooldownSeconds: 120,
    energyCost: 30
  },
  {
    id: 'flower_bloom',
    name: 'Hoa Nở Rực Rỡ (Flower Bloom)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '🌸🌷',
    description: 'Nở rộ hoa cỏ quanh thị trấn và tặng thêm +40 Tim tình yêu.',
    cooldownSeconds: 75,
    energyCost: 20
  },
  {
    id: 'cozy_time',
    name: 'Giờ Ấm Áp (Cozy Time)',
    character: 'chiikawa',
    archetype: 'support',
    icon: '🍵🛋️',
    description: 'Làm chậm bộ đếm thời gian và tạo không gian thư giãn tĩnh lặng.',
    cooldownSeconds: 60,
    energyCost: 15
  },

  // ─── Usagi Abilities (Energy / Chaos / Power) ───
  {
    id: 'yaha_burst',
    name: 'Bùng Nổ Ya-Haaa (Ya-Haaa Burst)',
    character: 'usagi',
    archetype: 'energy',
    icon: '⚡💥',
    description: 'Phóng luồng năng lượng siêu tốc hoàn thành tức thì một nhiệm vụ nhỏ.',
    cooldownSeconds: 40,
    energyCost: 15,
    synergyEffect: 'Kích hoạt combo siêu cấp nếu Chiikawa đang ở trạng thái Happy.'
  },
  {
    id: 'carrot_rocket',
    name: 'Tên Lửa Cà Rốt (Carrot Rocket)',
    character: 'usagi',
    archetype: 'energy',
    icon: '🥕🚀',
    description: 'Đột phá chướng ngại vật và tăng tốc chuẩn bị hành lý sân bay.',
    cooldownSeconds: 60,
    energyCost: 20
  },
  {
    id: 'ura_rush',
    name: 'Cuồng Nộ Uraaa (Ura Rush)',
    character: 'usagi',
    archetype: 'energy',
    icon: '🔥🐰',
    description: 'Nhân đôi số lượng Xu vàng nhận được từ mọi hoạt động trong 60 giây.',
    cooldownSeconds: 90,
    energyCost: 30
  },
  {
    id: 'bunny_jump',
    name: 'Cú Nhảy Thỏ Vàng (Bunny Jump)',
    character: 'usagi',
    archetype: 'energy',
    icon: '🐰✨',
    description: 'Hoán đổi vị trí và làm nổi bật ngay hoạt động quan trọng nhất hôm nay.',
    cooldownSeconds: 45,
    energyCost: 15
  },
  {
    id: 'crazy_merge',
    name: 'Hợp Nhất Siêu Cấp (Crazy Merge)',
    character: 'usagi',
    archetype: 'energy',
    icon: '🧪🍞',
    description: 'Tức tốc hoàn thiện một công thức món ăn đặc biệt tại Khu Chợ Nhỏ.',
    cooldownSeconds: 120,
    energyCost: 35
  },
  {
    id: 'golden_carrot',
    name: 'Cà Rốt Hoàng Kim (Golden Carrot)',
    character: 'usagi',
    archetype: 'energy',
    icon: '🥕👑',
    description: 'Wildcard toàn năng mang lại điểm thưởng cực đại trên bảng xếp hạng.',
    cooldownSeconds: 150,
    energyCost: 40
  }
]

/**
 * Returns all abilities registered for a given character.
 */
export function getAbilitiesByCharacter(character: MascotCharacter): CharacterAbility[] {
  return COMPANION_ABILITIES.filter(a => a.character === character)
}

/**
 * Finds ability definition by its unique identifier.
 */
export function getAbilityById(id: string): CharacterAbility | undefined {
  return COMPANION_ABILITIES.find(a => a.id === id)
}
