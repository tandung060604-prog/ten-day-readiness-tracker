import type { LevelDefinition } from './types'

export const CANONICAL_PUZZLE_LEVELS: LevelDefinition[] = [
  // ─── Level 1: Tia Sáng Đầu Tiên (First Spark) ───
  {
    levelNumber: 1,
    title: 'Tia Sáng Đầu Tiên (First Spark)',
    subtitle: 'Làm quen với thế giới ghép nối các bạn nhỏ Chiikawa đáng yêu',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 20,
    starThresholds: [600, 1200, 1800],
    objectives: [
      {
        type: 'collect_tiles',
        tileType: 'chiikawa',
        targetCount: 15,
        currentCount: 0
      }
    ],
    companionIntro: {
      character: 'chiikawa',
      dialogue: 'Waaah! Ghép 3 bé Chiikawa mầm trắng thẳng hàng để thu thập nhé! Cố lên nà~ 🌸'
    },
    rewards: {
      stars: 1,
      coins: 50,
      xp: 50,
      hearts: 25
    }
  },

  // ─── Level 2: Ý Tưởng Của Usagi (Usagi's Big Idea) ───
  {
    levelNumber: 2,
    title: 'Ý Tưởng Của Usagi (Usagi Big Idea)',
    subtitle: 'Học cách tạo Tên Lửa Thần Tốc khi ghép 4 bé Usagi thẳng hàng!',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju'],
    maxMoves: 22,
    starThresholds: [800, 1600, 2400],
    objectives: [
      {
        type: 'collect_tiles',
        tileType: 'usagi',
        targetCount: 20,
        currentCount: 0
      },
      {
        type: 'activate_specials',
        targetCount: 1,
        currentCount: 0
      }
    ],
    companionIntro: {
      character: 'usagi',
      dialogue: 'YA-HAAA! Ghép 4 bé Usagi tạo Tên Lửa quét sạch cả hàng! Phóng thôi! 🚀⚡'
    },
    rewards: {
      stars: 1,
      coins: 75,
      xp: 75,
      hearts: 35
    }
  },

  // ─── Level 3: Lời Hẹn Ước Hoa Nở (Flower Promise) ───
  {
    levelNumber: 3,
    title: 'Lời Hẹn Ước Hoa Nở (Flower Promise)',
    subtitle: 'Phá vỡ các hộp gỗ chướng ngại vật để giải cứu bé Hachiware & các bạn!',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 25,
    starThresholds: [1200, 2400, 3600],
    objectives: [
      {
        type: 'collect_tiles',
        tileType: 'hachiware',
        targetCount: 25,
        currentCount: 0
      },
      {
        type: 'clear_blockers',
        blockerType: 'crate',
        targetCount: 6,
        currentCount: 0
      }
    ],
    companionIntro: {
      character: 'both',
      dialogue: 'Chiikawa & Usagi cùng kề vai sát cánh phá hộp gỗ và thu thập các bạn nhỏ! 🌸✨'
    },
    rewards: {
      stars: 1,
      coins: 100,
      xp: 100,
      hearts: 50,
      materials: [{ itemId: 'item_sakura_seed', quantity: 2 }]
    }
  }
]

export function getLevelDefinition(levelNumber: number): LevelDefinition | undefined {
  return CANONICAL_PUZZLE_LEVELS.find(l => l.levelNumber === levelNumber)
}
