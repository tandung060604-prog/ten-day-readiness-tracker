import type { InventoryItemDefinition } from './types'

export const ITEM_CATALOG: Record<string, InventoryItemDefinition> = {
  // ── 1. INGREDIENTS ──
  strawberries: {
    id: 'strawberries',
    name: 'Dâu Tây Đỏ Mọng',
    category: 'ingredients',
    rarity: 'common',
    icon: '🍓',
    description: 'Những quả dâu tây tươi ngọt được hái từ Nông trại Hạnh Phúc.',
    maxStack: 99,
    sellValue: 15,
    energyRestore: 5
  },
  fresh_milk: {
    id: 'fresh_milk',
    name: 'Sữa Tươi Thanh Trùng',
    category: 'ingredients',
    rarity: 'common',
    icon: '🥛',
    description: 'Sữa thơm béo ngậy bổ sung canxi và năng lượng cho ngày mới.',
    maxStack: 99,
    sellValue: 12,
    energyRestore: 8
  },
  wild_honey: {
    id: 'wild_honey',
    name: 'Mật Ong Rừng Hoa Cúc',
    category: 'ingredients',
    rarity: 'uncommon',
    icon: '🍯',
    description: 'Mật ong rừng tự nhiên ngọt dịu, hoàn hảo để pha trà giữ ấm cổ họng.',
    maxStack: 99,
    sellValue: 30,
    energyRestore: 12
  },
  organic_eggs: {
    id: 'organic_eggs',
    name: 'Trứng Gà Hữu Cơ',
    category: 'ingredients',
    rarity: 'common',
    icon: '🥚',
    description: 'Trứng tươi giàu protein cần thiết cho bữa ăn dinh dưỡng.',
    maxStack: 99,
    sellValue: 10,
    energyRestore: 6
  },
  matcha_powder: {
    id: 'matcha_powder',
    name: 'Bột Trà Xanh Uji Matcha',
    category: 'ingredients',
    rarity: 'rare',
    icon: '🍵',
    description: 'Bột matcha thượng hạng thơm ngát giúp tinh thần tập trung cao độ.',
    maxStack: 99,
    sellValue: 45,
    energyRestore: 15
  },

  // ── 2. FOOD ──
  strawberry_cake: {
    id: 'strawberry_cake',
    name: 'Bánh Kem Dâu Chiikawa',
    category: 'food',
    rarity: 'rare',
    icon: '🍰',
    description: 'Chiếc bánh kem dâu tây xốp mềm do chính tay hai bạn cùng làm.',
    maxStack: 20,
    sellValue: 120,
    energyRestore: 40,
    buffDescription: '+15% Tốc độ hồi năng lượng trong 30 phút'
  },
  warm_ramen: {
    id: 'warm_ramen',
    name: 'Tô Mì Ramen Nóng Hổi',
    category: 'food',
    rarity: 'uncommon',
    icon: '🍜',
    description: 'Nước dùng hầm xương ngọt lịm với trứng lòng đào và thịt xá xíu mềm tan.',
    maxStack: 20,
    sellValue: 80,
    energyRestore: 30
  },
  boba_tea: {
    id: 'boba_tea',
    name: 'Trà Sữa Trân Châu Đường Đen',
    category: 'food',
    rarity: 'common',
    icon: '🧋',
    description: 'Vị ngọt ngào 50% đường ít đá cực hợp cho buổi chiều hẹn hò.',
    maxStack: 20,
    sellValue: 50,
    energyRestore: 20
  },
  love_bento: {
    id: 'love_bento',
    name: 'Hộp Cơm Bento Tình Yêu',
    category: 'food',
    rarity: 'epic',
    icon: '🍱',
    description: 'Cơm nắm tạo hình Chiikawa và Usagi chan chứa tình cảm ngọt ngào.',
    maxStack: 10,
    sellValue: 200,
    energyRestore: 60,
    buffDescription: '+50 Điểm gắn kết Bond XP khi cùng nhau thưởng thức'
  },

  // ── 3. DECORATIONS ──
  cherry_pot: {
    id: 'cherry_pot',
    name: 'Chậu Cây Hoa Anh Đào Mini',
    category: 'decorations',
    rarity: 'rare',
    icon: '🌸',
    description: 'Cành hoa anh đào bung nở mang lại không khí mùa xuân cho tổ ấm.',
    maxStack: 10,
    sellValue: 150
  },
  fairy_lantern: {
    id: 'fairy_lantern',
    name: 'Đèn Lồng Đom Đóm Lung Linh',
    category: 'decorations',
    rarity: 'uncommon',
    icon: '🏮',
    description: 'Ánh sáng vàng ấm cúng thắp sáng lối đi vào ban đêm.',
    maxStack: 10,
    sellValue: 90
  },
  picnic_mat: {
    id: 'picnic_mat',
    name: 'Thảm Picnic Kẻ Caro Đỏ',
    category: 'decorations',
    rarity: 'common',
    icon: '🧺',
    description: 'Tấm thảm xinh xắn sẵn sàng cho những buổi ngắm hoàng hôn bên công viên.',
    maxStack: 5,
    sellValue: 60
  },

  // ── 4. MEMORIES ──
  flight_ticket: {
    id: 'flight_ticket',
    name: 'Cặp Vé Bay Đi Nha Trang',
    category: 'memories',
    rarity: 'legendary',
    icon: '✈️',
    description: 'Cặp vé chuyến bay 27/08 khởi hành đến thiên đường biển đảo Nha Trang.',
    maxStack: 1,
    sellValue: 500
  },
  polaroid_frame: {
    id: 'polaroid_frame',
    name: 'Khung Ảnh Polaroid Kỷ Niệm',
    category: 'memories',
    rarity: 'rare',
    icon: '📸',
    description: 'Khung ảnh lưu giữ nụ cười rạng rỡ của bạn gái trong buổi hẹn hò đầu tiên.',
    maxStack: 50,
    sellValue: 100
  },
  secret_letter: {
    id: 'secret_letter',
    name: 'Bức Thư Tay Bí Mật',
    category: 'memories',
    rarity: 'epic',
    icon: '💌',
    description: 'Lá thư viết tay gửi gắm những lời yêu thương chân thành nhất.',
    maxStack: 10,
    sellValue: 250
  },

  // ── 5. BOOSTERS ──
  ginger_tea: {
    id: 'ginger_tea',
    name: 'Trà Gừng Ấm Bụng',
    category: 'boosters',
    rarity: 'uncommon',
    icon: '🫖',
    description: 'Trà thảo mộc ấm áp giúp giảm đau bụng kinh và làm ấm cơ thể nhanh chóng.',
    maxStack: 50,
    sellValue: 40,
    energyRestore: 15,
    buffDescription: 'Giảm mệt mỏi và làm dịu cơn đau bụng dưới'
  },
  morning_coffee: {
    id: 'morning_coffee',
    name: 'Cà Phê Muối Năng Lượng',
    category: 'boosters',
    rarity: 'common',
    icon: '☕',
    description: 'Tách cà phê thơm nồng đánh thức mọi giác quan cho buổi sáng sẵn sàng.',
    maxStack: 50,
    sellValue: 35,
    energyRestore: 25,
    buffDescription: '+20% Hiệu suất rèn luyện thể lực trong 1 giờ'
  },
  lavender_oil: {
    id: 'lavender_oil',
    name: 'Tinh Dầu Oải Hương Ngủ Ngon',
    category: 'boosters',
    rarity: 'rare',
    icon: '🧴',
    description: 'Hương thơm oải hương thư thái ru bạn vào giấc ngủ sâu 90 phút trọn vẹn.',
    maxStack: 30,
    sellValue: 85,
    buffDescription: 'Tăng chất lượng điểm giấc ngủ Sleep Score thêm +10 điểm'
  },

  // ── 6. COLLECTIBLES ──
  chiikawa_badge: {
    id: 'chiikawa_badge',
    name: 'Huy Hiệu Chiến Binh Chiikawa',
    category: 'collectibles',
    rarity: 'rare',
    icon: '🎖️',
    description: 'Huy hiệu danh giá dành cho bạn nam kiên trì hoàn thành bài tập thể lực.',
    maxStack: 1,
    sellValue: 300
  },
  usagi_plushie: {
    id: 'usagi_plushie',
    name: 'Búp Bê Thỏ Usagi Bông',
    category: 'collectibles',
    rarity: 'epic',
    icon: '🐰',
    description: 'Búp bê lông xù kêu "Ya-haa!" mỗi khi được ôm vào lòng.',
    maxStack: 5,
    sellValue: 400
  },
  golden_couple_crown: {
    id: 'golden_couple_crown',
    name: 'Vương Miện Cặp Đôi Vàng',
    category: 'collectibles',
    rarity: 'legendary',
    icon: '👑',
    description: 'Biểu tượng tối cao chứng nhận tình yêu bền chặt qua mọi thử thách.',
    maxStack: 1,
    sellValue: 1000
  },

  // ── 7. SOUVENIRS ──
  beach_seashell: {
    id: 'beach_seashell',
    name: 'Vỏ Ốc Biển Hòn Mun',
    category: 'souvenirs',
    rarity: 'uncommon',
    icon: '🐚',
    description: 'Vỏ ốc óng ánh nhặt được bên bờ cát trắng vịnh Nha Trang.',
    maxStack: 99,
    sellValue: 50
  },
  pearl_keychain: {
    id: 'pearl_keychain',
    name: 'Móc Khóa Ngọc Trai Biển',
    category: 'souvenirs',
    rarity: 'rare',
    icon: '🔮',
    description: 'Viên ngọc trai sáng bóng đại diện cho tình yêu thuần khiết.',
    maxStack: 10,
    sellValue: 180
  },
  white_sand_bottle: {
    id: 'white_sand_bottle',
    name: 'Lọ Cát Trắng Mini Beach',
    category: 'souvenirs',
    rarity: 'uncommon',
    icon: '🏺',
    description: 'Lọ thủy tinh chứa cát mịn và sóng biển Nha Trang làm kỷ niệm.',
    maxStack: 20,
    sellValue: 70
  },

  // ── 8. MATERIALS ──
  pine_wood: {
    id: 'pine_wood',
    name: 'Gỗ Thông Thơm',
    category: 'materials',
    rarity: 'common',
    icon: '🪵',
    description: 'Thanh gỗ thông chất lượng cao dùng để nâng cấp các công trình trong thị trấn.',
    maxStack: 999,
    sellValue: 20
  },
  river_stone: {
    id: 'river_stone',
    name: 'Đá Cuội Suối Trong',
    category: 'materials',
    rarity: 'common',
    icon: '🪨',
    description: 'Đá cuội nhẵn mịn mài giũa tự nhiên để lát nền nhà và xây dựng đài phun nước.',
    maxStack: 999,
    sellValue: 18
  },
  golden_nails: {
    id: 'golden_nails',
    name: 'Đinh Vàng Gia Cố',
    category: 'materials',
    rarity: 'rare',
    icon: '🔩',
    description: 'Bộ đinh vít bằng hợp kim mạ vàng dùng cho các công trình cấp 3.',
    maxStack: 999,
    sellValue: 60
  }
}

export function getItemDefinition(itemId: string): InventoryItemDefinition {
  return (
    ITEM_CATALOG[itemId] || {
      id: itemId,
      name: `Vật phẩm #${itemId}`,
      category: 'materials',
      rarity: 'common',
      icon: '📦',
      description: 'Vật phẩm bí ẩn trong thị trấn Little Days.',
      maxStack: 99
    }
  )
}
