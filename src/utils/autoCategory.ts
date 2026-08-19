import type { FoodItem } from '../types'

const PROTEIN_KEYWORDS = [
  'gà', 'ức gà', 'cá', 'cá hồi', 'cá ngừ', 'bò', 'thịt bò', 'thịt heo', 'thịt nạc', 'trứng', 'tôm', 'mực',
  'đậu phụ', 'đậu hũ', 'whey', 'protein', 'chicken', 'fish', 'salmon', 'beef', 'egg', 'shrimp', 'tofu', 'pork'
]

const CARB_KEYWORDS = [
  'cơm', 'gạo', 'gạo lứt', 'khoai', 'khoai lang', 'khoai tây', 'bánh mì', 'oats', 'yến mạch', 'bún', 'phở',
  'miến', 'mì', 'pasta', 'ngô', 'bắp', 'rice', 'potato', 'bread', 'oatmeal', 'noodle', 'corn'
]

const VEG_KEYWORDS = [
  'rau', 'cải', 'cải chíp', 'bông cải', 'súp lơ', 'xà lách', 'cà chua', 'dưa leo', 'dưa chuột', 'ớt chuông',
  'cà rốt', 'nấm', 'bí', 'mồng tơi', 'muống', 'salad', 'spinach', 'broccoli', 'cucumber', 'tomato', 'carrot', 'mushroom'
]

const FRUIT_KEYWORDS = [
  'chuối', 'táo', 'cam', 'quýt', 'bưởi', 'dưa hấu', 'dâu', 'bơ', 'kiwi', 'nho', 'việt quất',
  'banana', 'apple', 'orange', 'watermelon', 'berry', 'strawberry', 'avocado'
]

const DAIRY_KEYWORDS = [
  'sữa', 'sữa chua', 'phô mai', 'yogurt', 'milk', 'cheese', 'sữa tươi', 'sữa hạt'
]

const DRINK_KEYWORDS = [
  'nước ép', 'nước cam', 'sinh tố', 'smoothie', 'cà phê', 'coffee', 'trà', 'tea', 'nước dừa'
]

export function detectFoodCategory(name: string): NonNullable<FoodItem['category']> {
  const lower = name.toLowerCase()
  if (PROTEIN_KEYWORDS.some(k => lower.includes(k))) return 'protein'
  if (CARB_KEYWORDS.some(k => lower.includes(k))) return 'carb'
  if (VEG_KEYWORDS.some(k => lower.includes(k))) return 'vegetable'
  if (FRUIT_KEYWORDS.some(k => lower.includes(k))) return 'fruit'
  if (DAIRY_KEYWORDS.some(k => lower.includes(k))) return 'dairy'
  if (DRINK_KEYWORDS.some(k => lower.includes(k))) return 'drink'
  return 'other'
}

export function parseFoodInput(input: string): FoodItem[] {
  if (!input.trim()) return []
  return input
    .split(/[,;\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map((name, i) => ({
      id: `f-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      category: detectFoodCategory(name)
    }))
}
