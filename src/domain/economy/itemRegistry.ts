import type { GameItem, ItemCategory } from './types'

export const AUTHORITATIVE_ITEMS: GameItem[] = [
  // ─── 1. BUILDING MATERIALS ───
  {
    id: 'item_sakura_wood',
    name: 'Gỗ Hoa Anh Đào',
    category: 'building_materials',
    rarity: 'common',
    icon: '🪵',
    description: 'Những thanh gỗ thơm mùi hoa anh đào dùng để dựng khung nhà và bàn ghế.',
    sellPriceCoins: 10,
    buyPriceCoins: 25
  },
  {
    id: 'item_granite_stone',
    name: 'Đá Granite Trắng',
    category: 'building_materials',
    rarity: 'common',
    icon: '🪨',
    description: 'Khối đá granite chắc chắn dùng lát sân vườn và đài phun nước.',
    sellPriceCoins: 12,
    buyPriceCoins: 30
  },
  {
    id: 'item_gold_nails',
    name: 'Đinh Đồng Vàng',
    category: 'building_materials',
    rarity: 'uncommon',
    icon: '📌',
    description: 'Những chiếc đinh bền bỉ gia cố các công trình kiên cố.',
    sellPriceCoins: 20,
    buyPriceCoins: 50
  },
  {
    id: 'item_home_blueprint',
    name: 'Bản Vẽ Ngôi Nhà Hạnh Phúc',
    category: 'building_materials',
    rarity: 'rare',
    icon: '📜',
    description: 'Bản vẽ kiến trúc nâng cấp Ngôi Nhà Nhỏ lên Cấp 2 và Cấp 3.',
    sellPriceCoins: 100
  },
  {
    id: 'item_town_crest',
    name: 'Huy Hiệu Thị Trấn Little Days',
    category: 'building_materials',
    rarity: 'epic',
    icon: '🏵️',
    description: 'Huy hiệu danh giá chứng nhận đóng góp tái thiết toàn bộ thị trấn.',
    sellPriceCoins: 250
  },

  // ─── 2. INGREDIENTS ───
  {
    id: 'item_wheat_flour',
    name: 'Bột Mì Thượng Hạng',
    category: 'ingredients',
    rarity: 'common',
    icon: '🌾',
    description: 'Bột mì trắng mịn dùng nướng bánh ngọt và mì sợi.',
    sellPriceCoins: 8,
    buyPriceCoins: 20
  },
  {
    id: 'item_sakura_seed',
    name: 'Hạt Giống Hoa Sakura',
    category: 'ingredients',
    rarity: 'uncommon',
    icon: '🌱',
    description: 'Hạt giống hoa nở quanh năm tô điểm khu vườn đôi.',
    sellPriceCoins: 15,
    buyPriceCoins: 35
  },
  {
    id: 'item_strawberry',
    name: 'Dâu Tây Mọng Nước',
    category: 'ingredients',
    rarity: 'common',
    icon: '🍓',
    description: 'Những trái dâu tây đỏ mọng ngọt ngào.',
    sellPriceCoins: 10,
    buyPriceCoins: 25
  },
  {
    id: 'item_pure_spring_water',
    name: 'Nước Suối Tinh Khiết',
    category: 'ingredients',
    rarity: 'common',
    icon: '💧',
    description: 'Dòng nước suối khoáng tự nhiên phục hồi thể lực.',
    sellPriceCoins: 6,
    buyPriceCoins: 15
  },

  // ─── 3. DECORATIONS ───
  {
    id: 'item_hearth_lamp',
    name: 'Đèn Ngủ Lò Sưởi Ấm',
    category: 'decorations',
    rarity: 'uncommon',
    icon: '🏮',
    description: 'Chiếc đèn ngủ tỏa ánh sáng vàng ấm áp bên giường đôi.',
    sellPriceCoins: 40,
    buyPriceCoins: 100
  },
  {
    id: 'item_sakura_bonsai',
    name: 'Chậu Cây Bonsai Sakura',
    category: 'decorations',
    rarity: 'rare',
    icon: '🪴',
    description: 'Chậu cây bonsai xinh xắn đặt trên bàn trà phòng khách.',
    sellPriceCoins: 75,
    buyPriceCoins: 180
  },
  {
    id: 'item_windchime',
    name: 'Chuông Gió Thủy Tinh',
    category: 'decorations',
    rarity: 'uncommon',
    icon: '🎐',
    description: 'Chuông gió phát ra âm thanh trong trẻo mỗi khi gió thoảng qua.',
    sellPriceCoins: 35,
    buyPriceCoins: 90
  },

  // ─── 4. MEMORY COLLECTIBLES ───
  {
    id: 'item_polaroid_first_day',
    name: 'Ảnh Polaroid Ngày Đầu Tiên',
    category: 'memory_collectibles',
    rarity: 'rare',
    icon: '📸',
    description: 'Bức ảnh ghi lại nụ cười rạng rỡ của hai bạn trong ngày đầu gặp gỡ.'
  },
  {
    id: 'item_love_letter_bundle',
    name: 'Tập Thư Tình Gắn Kết',
    category: 'memory_collectibles',
    rarity: 'epic',
    icon: '💌',
    description: 'Những lá thư tay đong đầy tâm tư và lời hẹn ước trăm năm.'
  },

  // ─── 5. PUZZLE BOOSTERS ───
  {
    id: 'item_booster_hammer',
    name: 'Búa Phép Chiikawa',
    category: 'puzzle_boosters',
    rarity: 'uncommon',
    icon: '🔨',
    description: 'Đập tan bất kỳ 1 ô gạch hoặc hộp gỗ trên bảng giải đố.',
    buyPriceCoins: 60
  },
  {
    id: 'item_booster_moves',
    name: 'Cà Rốt Thêm 5 Lượt',
    category: 'puzzle_boosters',
    rarity: 'rare',
    icon: '🥕',
    description: 'Cộng thêm ngay 5 lượt đi trong màn chơi giải đố cam go.',
    buyPriceCoins: 100
  },

  // ─── 6. SOUVENIRS ───
  {
    id: 'item_hon_mun_coral_charm',
    name: 'Bùa San Hô Hòn Mun',
    category: 'souvenirs',
    rarity: 'rare',
    icon: '🪸',
    description: 'Móc khóa san hô xanh kỷ niệm chuyến lặn biển Nha Trang.'
  },
  {
    id: 'item_sunset_trophy',
    name: 'Cúp Hoàng Hôn Nha Trang',
    category: 'souvenirs',
    rarity: 'legendary',
    icon: '🏆',
    description: 'Chiếc cúp vàng vinh quang dành cho cặp đôi hoàn thành 30 Màn Chơi Chiến Dịch.'
  },

  // ─── 7. EVENT ITEMS ───
  {
    id: 'item_endless_couple_ring',
    name: 'Nhẫn Tình Yêu Vĩnh Cửu',
    category: 'event_items',
    rarity: 'legendary',
    icon: '💍',
    description: 'Kỷ vật thiêng liêng minh chứng tình yêu trường tồn qua năm tháng.'
  }
]

export const ITEM_LOOKUP: Record<string, GameItem> = AUTHORITATIVE_ITEMS.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as Record<string, GameItem>)

export function getItem(itemId: string): GameItem | undefined {
  return ITEM_LOOKUP[itemId]
}

export function getItemsByCategory(category: ItemCategory): GameItem[] {
  return AUTHORITATIVE_ITEMS.filter(item => item.category === category)
}
