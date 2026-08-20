import type { BuildingUpgradeDefinition } from './types'

export const BUILDING_UPGRADE_REGISTRY: Record<string, BuildingUpgradeDefinition> = {
  // ─── 1. NGÔI NHÀ NHỎ (HOME) ───
  home: {
    buildingId: 'home',
    buildingName: 'Ngôi Nhà Nhỏ (Cozy Cottage)',
    tiers: {
      1: {
        tier: 1,
        tierName: 'Nhà Gỗ Ấm Áp',
        description: 'Căn nhà nhỏ xinh xắn với lò sưởi và chiếc sofa đôi êm ái.',
        visualVariantId: 'home_tier_1',
        unlockedPerks: ['Sofa Check-In Cơ Bản', 'Nhật Ký Tình Yêu'],
        dialogueCheer: {
          character: 'chiikawa',
          text: 'Waaah! Căn nhà gỗ của chúng mình thật bình yên~ 🌸'
        },
        costToReach: { coins: 0, hearts: 0, stars: 0, requiredMaterials: [] }
      },
      2: {
        tier: 2,
        tierName: 'Vườn Hoa & Ban Công Đón Nắng',
        description: 'Mở rộng khu vườn hoa anh đào, ban công ngắm sao và bàn trà ngoài trời.',
        visualVariantId: 'home_tier_2',
        unlockedPerks: ['+25% Tim từ Sofa Check-in', 'Ban Công Ngắm Sao', 'Chăm Sóc Vườn Hoa'],
        dialogueCheer: {
          character: 'usagi',
          text: 'YA-HAAA! Ban công rộng rãi có thể ngắm cả dải ngân hà rồi! 🌿⭐'
        },
        costToReach: {
          coins: 250,
          hearts: 100,
          stars: 5,
          requiredMaterials: [
            { itemId: 'item_sakura_wood', quantity: 4 },
            { itemId: 'item_home_blueprint', quantity: 1 }
          ]
        }
      },
      3: {
        tier: 3,
        tierName: 'Biệt Thự Tình Yêu Vĩnh Cửu',
        description: 'Dinh thự hoàng gia với hào quang lấp lánh và khu vườn ánh sáng kỳ ảo.',
        visualVariantId: 'home_tier_3',
        unlockedPerks: ['+50% Tim toàn bộ hoạt động', 'Hào Quang Hoàng Kim', 'Mở Khóa Album Kỷ Niệm 100 Năm'],
        dialogueCheer: {
          character: 'both',
          text: 'Tổ ấm viên mãn trọn đời của chúng mình đã hoàn thành lộng lẫy! 🏡✨💖'
        },
        costToReach: {
          coins: 600,
          hearts: 250,
          stars: 15,
          requiredMaterials: [
            { itemId: 'item_sakura_wood', quantity: 10 },
            { itemId: 'item_granite_stone', quantity: 6 },
            { itemId: 'item_gold_nails', quantity: 4 }
          ]
        }
      }
    }
  },

  // ─── 2. QUẢNG TRƯỜNG NHIỆM VỤ (QUEST SQUARE) ───
  quest_square: {
    buildingId: 'quest_square',
    buildingName: 'Quảng Trường Nhiệm Vụ (Town Square)',
    tiers: {
      1: {
        tier: 1,
        tierName: 'Bảng Gỗ Làng',
        description: 'Bảng thông báo gỗ mộc mạc nhận nhiệm vụ mỗi ngày.',
        visualVariantId: 'quest_square_tier_1',
        unlockedPerks: ['Nhiệm Vụ Hàng Ngày Cơ Bản'],
        dialogueCheer: { character: 'chiikawa', text: 'Cùng nhau hoàn thành nhiệm vụ mỗi ngày nha! ⚔️' },
        costToReach: { coins: 0, hearts: 0, stars: 0, requiredMaterials: [] }
      },
      2: {
        tier: 2,
        tierName: 'Quảng Trường Cờ Hoa',
        description: 'Lát đá granite sang trọng và giăng đèn lồng lễ hội rực rỡ.',
        visualVariantId: 'quest_square_tier_2',
        unlockedPerks: ['Mở Khóa Nhiệm Vụ Tuần Đặc Biệt', '+20% Xu Thưởng'],
        dialogueCheer: { character: 'usagi', text: 'URAAA! Quảng trường rộn ràng tiếng nhạc lễ hội! 🎪🎉' },
        costToReach: {
          coins: 300,
          hearts: 120,
          stars: 8,
          requiredMaterials: [
            { itemId: 'item_granite_stone', quantity: 6 },
            { itemId: 'item_gold_nails', quantity: 2 }
          ]
        }
      },
      3: {
        tier: 3,
        tierName: 'Đại Quảng Trường Hoàng Gia',
        description: 'Đài danh vọng trung tâm với tháp đồng hồ mạ vàng.',
        visualVariantId: 'quest_square_tier_3',
        unlockedPerks: ['Nhiệm Vụ Huyền Thoại Cặp Đôi', '+50% Xu & XP Thưởng'],
        dialogueCheer: { character: 'both', text: 'Nơi vinh danh hành trình tình yêu vĩ đại của hai bạn! 👑✨' },
        costToReach: {
          coins: 700,
          hearts: 300,
          stars: 20,
          requiredMaterials: [
            { itemId: 'item_town_crest', quantity: 1 },
            { itemId: 'item_granite_stone', quantity: 12 }
          ]
        }
      }
    }
  },

  // ─── 3. KHU CHỢ NHỎ & TIỆM BÁNH (MARKET) ───
  market: {
    buildingId: 'market',
    buildingName: 'Khu Chợ Nhỏ (Little Market)',
    tiers: {
      1: {
        tier: 1,
        tierName: 'Quầy Hàng Rau Củ',
        description: 'Sạp hàng nhỏ bán nguyên liệu cơ bản.',
        visualVariantId: 'market_tier_1',
        unlockedPerks: ['Mua Bán Vật Liệu Cơ Bản'],
        dialogueCheer: { character: 'chiikawa', text: 'Rau củ tươi ngon mỗi sáng sớm nè! 🥬' },
        costToReach: { coins: 0, hearts: 0, stars: 0, requiredMaterials: [] }
      },
      2: {
        tier: 2,
        tierName: 'Tiệm Bánh & Nông Sản Tươi',
        description: 'Mở thêm lò nướng bánh ngọt thơm lừng và quầy trái cây nhiệt đới.',
        visualVariantId: 'market_tier_2',
        unlockedPerks: ['Tiệm Bánh Ngọt', 'Mua Bổ Trợ Giải Đố (Búa Phép)'],
        dialogueCheer: { character: 'usagi', text: 'Mogu-mogu! Bánh dâu tây mới ra lò thơm phức! 🍓🥐' },
        costToReach: {
          coins: 200,
          hearts: 80,
          stars: 6,
          requiredMaterials: [
            { itemId: 'item_sakura_wood', quantity: 4 },
            { itemId: 'item_wheat_flour', quantity: 2 }
          ]
        }
      },
      3: {
        tier: 3,
        tierName: 'Đại Trung Tâm Thương Mại Đôi',
        description: 'Phố thương mại sầm uất với đủ mọi đặc sản và quà lưu niệm Nha Trang.',
        visualVariantId: 'market_tier_3',
        unlockedPerks: ['Giảm 20% Giá Mua Vật Phẩm', 'Mua Cà Rốt Thêm Lượt'],
        dialogueCheer: { character: 'both', text: 'Thiên đường mua sắm của hai bạn đã mở cửa! 🛍️✨' },
        costToReach: {
          coins: 500,
          hearts: 200,
          stars: 18,
          requiredMaterials: [
            { itemId: 'item_gold_nails', quantity: 6 },
            { itemId: 'item_granite_stone', quantity: 8 }
          ]
        }
      }
    }
  }
}

export function getBuildingUpgradeConfig(buildingId: string): BuildingUpgradeDefinition | undefined {
  return BUILDING_UPGRADE_REGISTRY[buildingId]
}
