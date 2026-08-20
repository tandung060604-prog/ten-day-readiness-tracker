import type { GameState } from './types'
import type { LocationId } from '../../game/types'

export function createDefaultBuildings(): GameState['buildings'] {
  const buildingIds: LocationId[] = [
    'home',
    'quests',
    'gym',
    'water',
    'sleep',
    'journal',
    'album',
    'market',
    'restaurant',
    'airport',
    'beach',
    'hospital',
    'settings'
  ]

  const records = {} as GameState['buildings']

  buildingIds.forEach((id) => {
    records[id] = {
      buildingId: id,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      unlockedFeatures: [`${id}_basic_tier`],
      decorations: []
    }
  })

  return records
}

export function createDefaultQuests(): GameState['quests'] {
  return [
    {
      id: 'q_daily_water',
      title: 'Dinh Dưỡng Nước Lành',
      description: 'Uống đủ 2,000ml nước và điện giải trong ngày',
      category: 'daily',
      icon: '💧',
      targetCount: 2000,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewards: {
        hearts: 25,
        stars: 10,
        coins: 30,
        xp: 40,
        bondXp: 15,
        items: [{ itemId: 'strawberries', quantity: 2 }]
      }
    },
    {
      id: 'q_daily_workout',
      title: 'Chiến Binh Rèn Luyện',
      description: 'Hoàn thành bài tập thể lực hoặc đẩy tạ hôm nay',
      category: 'daily',
      icon: '🏋️',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewards: {
        hearts: 40,
        stars: 20,
        coins: 50,
        xp: 60,
        bondXp: 25,
        items: [{ itemId: 'morning_coffee', quantity: 1 }]
      }
    },
    {
      id: 'q_daily_sleep',
      title: 'Giấc Ngủ Ngọt Ngào',
      description: 'Ngủ đủ chu kỳ 90 phút và ghi nhật ký giấc ngủ',
      category: 'daily',
      icon: '🌙',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewards: {
        hearts: 30,
        stars: 15,
        coins: 35,
        xp: 50,
        bondXp: 20,
        items: [{ itemId: 'lavender_oil', quantity: 1 }]
      }
    },
    {
      id: 'q_couple_journal',
      title: 'Lời Nhắn Yêu Thương',
      description: 'Viết một dòng cảm xúc hoặc lời nhắn gửi đến người thương',
      category: 'couple',
      icon: '💌',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewards: {
        hearts: 50,
        stars: 25,
        coins: 40,
        xp: 75,
        bondXp: 50,
        items: [{ itemId: 'secret_letter', quantity: 1 }]
      }
    },
    {
      id: 'q_story_beach_pack',
      title: 'Chuẩn Bị Đi Biển',
      description: 'Kiểm tra đầy đủ checklist đồ dùng mang đi Nha Trang',
      category: 'story',
      icon: '🏖️',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewards: {
        hearts: 100,
        stars: 50,
        coins: 150,
        xp: 120,
        bondXp: 80,
        items: [{ itemId: 'flight_ticket', quantity: 1 }, { itemId: 'beach_seashell', quantity: 3 }]
      }
    }
  ]
}

export function createDefaultAdventure(): GameState['activeAdventure'] {
  return {
    id: 'nhatrang_readiness_10d',
    title: 'Hành Trình 10 Ngày Sẵn Sàng Đi Biển',
    description: 'Chuyến phiêu lưu rèn luyện phong độ, thắt chặt tình cảm chuẩn bị cho kỳ nghỉ biển Nha Trang.',
    coverIcon: '🌊',
    startDate: '2026-08-17',
    endDate: '2026-08-27',
    currentChapterId: 'ch_1',
    completed: false,
    chapters: [
      {
        id: 'ch_1',
        chapterNumber: 1,
        title: 'Khởi Đầu Quyết Tâm',
        description: 'Bắt đầu ngày 1 rèn luyện thể lực và uống đủ nước.',
        completed: false,
        unlocked: true,
        rewards: { hearts: 50, stars: 20, coins: 50, xp: 50 }
      },
      {
        id: 'ch_2',
        chapterNumber: 2,
        title: 'Nhịp Điệu Tổ Ấm',
        description: 'Cùng nhau chuẩn bị bữa ăn dinh dưỡng sạch.',
        completed: false,
        unlocked: false,
        requiredLevel: 2,
        rewards: { hearts: 60, stars: 25, coins: 60, xp: 60 }
      },
      {
        id: 'ch_3',
        chapterNumber: 3,
        title: 'Vượt Qua Thử Thách',
        description: 'Duy trì chuỗi phong độ đỉnh cao liên tục.',
        completed: false,
        unlocked: false,
        requiredLevel: 3,
        rewards: { hearts: 80, stars: 30, coins: 80, xp: 80 }
      },
      {
        id: 'ch_4',
        chapterNumber: 4,
        title: 'Sóng Biển Vẫy Gọi',
        description: 'Lên lịch trình tour 3 đảo và Queen Ann Sky Lounge.',
        completed: false,
        unlocked: false,
        requiredLevel: 4,
        rewards: { hearts: 100, stars: 40, coins: 100, xp: 100 }
      },
      {
        id: 'ch_5',
        chapterNumber: 5,
        title: 'Cất Cánh Bay Đến Nha Trang',
        description: 'Hoàn thành trọn vẹn 10 ngày sẵn sàng đỉnh cao!',
        completed: false,
        unlocked: false,
        requiredLevel: 5,
        rewards: {
          hearts: 300,
          stars: 150,
          coins: 500,
          xp: 500,
          bondXp: 300,
          items: [{ itemId: 'golden_couple_crown', quantity: 1 }]
        }
      }
    ],
    rewards: {
      hearts: 500,
      stars: 300,
      coins: 1000,
      xp: 1000,
      bondXp: 500,
      items: [{ itemId: 'golden_couple_crown', quantity: 1 }]
    }
  }
}

export function createDefaultGameState(): GameState {
  return {
    version: 1,
    progression: {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      bondLevel: 1,
      bondXp: 0,
      bondXpToNextLevel: 100,
      totalActivitiesCompleted: 0
    },
    currencies: {
      hearts: 150,
      stars: 50,
      coins: 200
    },
    inventory: [
      { itemId: 'strawberries', quantity: 5, acquiredAt: new Date().toISOString() },
      { itemId: 'fresh_milk', quantity: 3, acquiredAt: new Date().toISOString() },
      { itemId: 'ginger_tea', quantity: 2, acquiredAt: new Date().toISOString() },
      { itemId: 'pine_wood', quantity: 10, acquiredAt: new Date().toISOString() }
    ],
    buildings: createDefaultBuildings(),
    quests: createDefaultQuests(),
    activeAdventure: createDefaultAdventure(),
    updatedAt: new Date().toISOString()
  }
}
