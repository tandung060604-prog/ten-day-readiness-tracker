export interface DailyQuestion {
  id: number
  prompt: string
  category: 'memories' | 'dreams' | 'gratitude' | 'fun' | 'deep'
}

export interface AnsweredQuestion {
  questionId: number
  answeredAt: string
  user1Answer: string
  user2Answer?: string
  isFavorite: boolean
}

export interface LoveLetter {
  id: string
  sender: string
  recipient: string
  title: string
  content: string
  writtenAt: string
  isOpened: boolean
  isFavorite: boolean
}

export interface MemoryCapsule {
  id: string
  title: string
  content: string
  photoUrls?: string[]
  sealedAt: string
  unlockCondition: {
    type: 'specific_date' | 'days_elapsed' | 'anniversary' | 'birthday'
    targetDate?: string // ISO format YYYY-MM-DD
    requiredDays?: number
  }
  isOpened: boolean
}

export interface DateRouletteOption {
  id: string
  title: string
  category: 'romantic' | 'chill' | 'active' | 'budget' | 'food'
  description: string
  locationType: 'indoor' | 'outdoor' | 'any'
  estimatedCostVND: string
  icon: string
}

export interface BucketListItem {
  id: string
  title: string
  category: 'places' | 'food' | 'experiences' | 'gifts' | 'trips'
  isCompleted: boolean
  completedAt?: string
  photoUrl?: string
  notes?: string
}

export interface EndlessDailyQuest {
  id: string
  title: string
  icon: string
  rewardXP: number
  rewardHearts: number
  rewardCoins: number
  category: 'health' | 'love' | 'puzzle' | 'town'
}

// ─── 1. 30+ CURATED DAILY QUESTIONS ───
export const CURATED_DAILY_QUESTIONS: DailyQuestion[] = [
  { id: 1, prompt: 'Điều gì ở đối phương khiến bạn cảm thấy bình yên và được yêu thương nhất?', category: 'deep' },
  { id: 2, prompt: 'Kỷ niệm hẹn hò nào từ trước đến nay làm bạn mỉm cười mỗi khi nhớ lại?', category: 'memories' },
  { id: 3, prompt: 'Nếu cuối tuần này chúng mình có một ngày trọn vẹn bên nhau, bạn muốn làm gì nhất?', category: 'dreams' },
  { id: 4, prompt: 'Món ăn nào người ấy nấu hoặc chọn mà bạn thích nhất?', category: 'food' as any },
  { id: 5, prompt: 'Một thói quen nhỏ xíu đáng yêu của đối phương mà bạn rất trân trọng?', category: 'gratitude' },
  { id: 6, prompt: 'Bài hát nào nhắc bạn nhớ đến câu chuyện tình yêu của hai đứa mình?', category: 'memories' },
  { id: 7, prompt: 'Một mục tiêu chung trong năm nay mà bạn muốn hai đứa cùng nhau chinh phục?', category: 'dreams' },
  { id: 8, prompt: 'Lần gần đây nhất đối phương làm bạn cảm động là khi nào?', category: 'gratitude' },
  { id: 9, prompt: 'Nếu được đi du lịch bất kỳ đâu trên thế giới ngay ngày mai, bạn sẽ chọn nơi nào?', category: 'dreams' },
  { id: 10, prompt: 'Một câu nói ngọt ngào của người ấy làm bạn nhớ mãi không quên?', category: 'memories' },
  { id: 11, prompt: 'Khi cảm thấy mệt mỏi, hành động nào của người ấy giúp bạn hồi phục năng lượng nhanh nhất?', category: 'deep' },
  { id: 12, prompt: 'Chi tiết nào trong lần đầu tiên gặp mặt làm bạn ấn tượng nhất?', category: 'memories' },
  { id: 13, prompt: 'Ba từ bạn muốn dùng để miêu tả tình yêu của hai đứa mình hiện tại là gì?', category: 'deep' },
  { id: 14, prompt: 'Một bộ phim hoặc chuyến đi nào mà bạn muốn hai đứa cùng trải nghiệm lại?', category: 'fun' },
  { id: 15, prompt: 'Bạn cảm ơn đối phương nhiều nhất vì điều gì trong cuộc sống hàng ngày?', category: 'gratitude' },
  { id: 16, prompt: 'Nếu hai đứa cùng nhau mở một quán nhỏ ở thị trấn, bạn muốn quán đó bán gì?', category: 'fun' },
  { id: 17, prompt: 'Điều bất ngờ lãng mạn nhất mà bạn muốn nhận được trong tuần này là gì?', category: 'dreams' },
  { id: 18, prompt: 'Khoảnh khắc nào trong ngày bạn cảm thấy nhớ người ấy nhiều nhất?', category: 'deep' },
  { id: 19, prompt: 'Một bức ảnh đôi nào mà bạn thích nhất và muốn in ra treo phòng ngủ?', category: 'memories' },
  { id: 20, prompt: 'Lời động viên nào của người ấy đã tiếp thêm cho bạn nhiều sức mạnh nhất?', category: 'gratitude' },
  { id: 21, prompt: 'Một sở thích mới nào bạn muốn hai đứa cùng bắt đầu thử trong tháng tới?', category: 'dreams' },
  { id: 22, prompt: 'Nếu chọn một linh vật đại diện cho tình yêu của hai bạn, đó sẽ là bé nào?', category: 'fun' },
  { id: 23, prompt: 'Kỷ niệm đáng nhớ nhất trong chuyến đi Nha Trang hoặc chuyến du lịch gần nhất là gì?', category: 'memories' },
  { id: 24, prompt: 'Một món quà nhỏ giản dị mà làm bạn cảm thấy ấm áp vô cùng?', category: 'gratitude' },
  { id: 25, prompt: 'Hai đứa mình đã cùng nhau vượt qua thử thách nào làm bạn thấy tự hào nhất?', category: 'deep' },
  { id: 26, prompt: 'Một buổi tối hẹn hò lý tưởng tại nhà của bạn sẽ diễn ra như thế nào?', category: 'dreams' },
  { id: 27, prompt: 'Điều gì ở người ấy luôn làm bạn cảm thấy an tâm và tin tưởng tuyệt đối?', category: 'deep' },
  { id: 28, prompt: 'Nếu viết một bức thư tình gửi cho tương lai 5 năm nữa, bạn sẽ viết câu đầu tiên là gì?', category: 'dreams' },
  { id: 29, prompt: 'Một cái ôm hoặc cử chỉ ấm áp nào làm bạn thấy tan biến mọi áp lực?', category: 'gratitude' },
  { id: 30, prompt: 'Lời hứa chân thành nhất mà bạn muốn gửi tới người bạn đời của mình hôm nay là gì?', category: 'deep' }
]

export function getTodayQuestion(dayOfYear = new Date().getDate()): DailyQuestion {
  const index = (dayOfYear - 1) % CURATED_DAILY_QUESTIONS.length
  return CURATED_DAILY_QUESTIONS[index]
}

// ─── 2. DATE ROULETTE OPTIONS ───
export const DATE_ROULETTE_OPTIONS: DateRouletteOption[] = [
  {
    id: 'opt_candlelight_dinner',
    title: 'Bữa Tối Ánh Nến Lãng Mạn',
    category: 'romantic',
    description: 'Thưởng thức bít tết hoặc mì Ý bên ánh nến và rượu vang nhẹ.',
    locationType: 'indoor',
    estimatedCostVND: '300.000đ - 500.000đ',
    icon: '🕯️'
  },
  {
    id: 'opt_street_food_tour',
    title: 'Tour Ẩm Thực Đường Phố',
    category: 'food',
    description: 'Ăn ốc nóng, bánh tráng nướng và trà sữa trân châu vỉa hè.',
    locationType: 'outdoor',
    estimatedCostVND: '100.000đ - 200.000đ',
    icon: '🍢'
  },
  {
    id: 'opt_movie_night_home',
    title: 'Xem Phim Rạp Tại Gia',
    category: 'chill',
    description: 'Bật máy chiếu, chuẩn bị bắp rang bơ và xem bộ phim tình cảm yêu thích.',
    locationType: 'indoor',
    estimatedCostVND: '50.000đ',
    icon: '🎬'
  },
  {
    id: 'opt_sunset_walk',
    title: 'Dạo Phố Ngắm Hoàng Hôn',
    category: 'chill',
    description: 'Nắm tay nhau đi dạo công viên hoặc hồ nước khi chiều tà.',
    locationType: 'outdoor',
    estimatedCostVND: '0đ - 40.000đ',
    icon: '🌅'
  },
  {
    id: 'opt_boardgame_cafe',
    title: 'Hẹn Hò Cafe Boardgame',
    category: 'active',
    description: 'Cùng nhau chơi rút gỗ, mèo nổ hoặc giải đố trong quán cafe ấm cúng.',
    locationType: 'indoor',
    estimatedCostVND: '80.000đ - 150.000đ',
    icon: '🎲'
  },
  {
    id: 'opt_cook_together',
    title: 'Cùng Nhau Đi Chợ & Nấu Ăn',
    category: 'romantic',
    description: 'Cùng chuẩn bị bữa lẩu ấm cúng hoặc món ăn đặc biệt cho hai người.',
    locationType: 'indoor',
    estimatedCostVND: '150.000đ - 250.000đ',
    icon: '🍲'
  }
]

export function spinDateRoulette(
  category?: 'romantic' | 'chill' | 'active' | 'budget' | 'food',
  locationType?: 'indoor' | 'outdoor' | 'any'
): DateRouletteOption {
  let pool = DATE_ROULETTE_OPTIONS
  if (category) {
    pool = pool.filter(o => o.category === category)
    if (pool.length === 0) pool = DATE_ROULETTE_OPTIONS
  }
  if (locationType && locationType !== 'any') {
    pool = pool.filter(o => o.locationType === locationType || o.locationType === 'any')
    if (pool.length === 0) pool = DATE_ROULETTE_OPTIONS
  }
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

// ─── 3. MEMORY CAPSULE LOCK EVALUATION ───
export function isCapsuleUnlocked(
  capsule: MemoryCapsule,
  currentDate = new Date(),
  anniversaryDate?: Date,
  partnerBirthday?: Date
): { isUnlocked: boolean; reason: string } {
  if (capsule.isOpened) return { isUnlocked: true, reason: 'Đã mở khóa' }

  const sealedDate = new Date(capsule.sealedAt)
  const cond = capsule.unlockCondition

  if (cond.type === 'specific_date' && cond.targetDate) {
    const target = new Date(cond.targetDate)
    if (currentDate >= target) {
      return { isUnlocked: true, reason: 'Đã đến ngày mở khóa hẹn ước!' }
    }
    const daysLeft = Math.ceil((target.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
    return { isUnlocked: false, reason: `Còn ${daysLeft} ngày nữa để mở viên nang` }
  }

  if (cond.type === 'days_elapsed' && cond.requiredDays) {
    const diffDays = Math.floor((currentDate.getTime() - sealedDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays >= cond.requiredDays) {
      return { isUnlocked: true, reason: `Đã trôi qua đủ ${cond.requiredDays} ngày hẹn ước!` }
    }
    return { isUnlocked: false, reason: `Còn ${cond.requiredDays - diffDays} ngày nữa` }
  }

  if (cond.type === 'anniversary' && anniversaryDate) {
    const isSameDay =
      currentDate.getMonth() === anniversaryDate.getMonth() &&
      currentDate.getDate() === anniversaryDate.getDate()
    if (isSameDay) {
      return { isUnlocked: true, reason: 'Hôm nay là Ngày Kỷ Niệm Tình Yêu! 🎉' }
    }
    return { isUnlocked: false, reason: 'Mở khóa vào ngày kỷ niệm tình yêu hàng năm' }
  }

  if (cond.type === 'birthday' && partnerBirthday) {
    const isSameDay =
      currentDate.getMonth() === partnerBirthday.getMonth() &&
      currentDate.getDate() === partnerBirthday.getDate()
    if (isSameDay) {
      return { isUnlocked: true, reason: 'Hôm nay là Sinh Nhật Người Thương! 🎂' }
    }
    return { isUnlocked: false, reason: 'Mở khóa vào ngày sinh nhật' }
  }

  return { isUnlocked: false, reason: 'Đang khóa thời gian' }
}

// ─── 4. ANNIVERSARY & EVENT DETECTOR ───
export function detectSpecialEvents(
  currentDate = new Date(),
  relationshipStartDate?: string,
  user1Birthday?: string,
  user2Birthday?: string
): {
  isAnniversary: boolean
  isBirthday: boolean
  isHoliday: boolean
  holidayName?: string
  daysTogether?: number
  anniversaryYears?: number
} {
  const month = currentDate.getMonth() + 1 // 1-12
  const day = currentDate.getDate()

  // 1. Check Holidays
  let isHoliday = false
  let holidayName: string | undefined
  if (month === 2 && day === 14) {
    isHoliday = true
    holidayName = 'Ngày Lễ Tình Nhân (Valentine 💖)'
  } else if (month === 12 && (day === 24 || day === 25)) {
    isHoliday = true
    holidayName = 'Lễ Giáng Sinh An Lành (Christmas 🎄)'
  } else if (month === 1 && day === 1) {
    isHoliday = true
    holidayName = 'Chúc Mừng Năm Mới (New Year 🎆)'
  }

  // 2. Check Anniversary
  let isAnniversary = false
  let daysTogether: number | undefined
  let anniversaryYears: number | undefined

  if (relationshipStartDate) {
    const start = new Date(relationshipStartDate)
    const diffTime = Math.abs(currentDate.getTime() - start.getTime())
    daysTogether = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (currentDate.getMonth() === start.getMonth() && currentDate.getDate() === start.getDate()) {
      isAnniversary = true
      anniversaryYears = currentDate.getFullYear() - start.getFullYear()
    }
  }

  // 3. Check Birthdays
  let isBirthday = false
  if (user1Birthday) {
    const b1 = new Date(user1Birthday)
    if (currentDate.getMonth() === b1.getMonth() && currentDate.getDate() === b1.getDate()) {
      isBirthday = true
    }
  }
  if (user2Birthday) {
    const b2 = new Date(user2Birthday)
    if (currentDate.getMonth() === b2.getMonth() && currentDate.getDate() === b2.getDate()) {
      isBirthday = true
    }
  }

  return {
    isAnniversary,
    isBirthday,
    isHoliday,
    holidayName,
    daysTogether,
    anniversaryYears
  }
}

// ─── 5. ENDLESS ROTATING QUEST GENERATOR ───
export function generateEndlessDailyQuests(dateStr = new Date().toISOString().split('T')[0]): EndlessDailyQuest[] {
  return [
    {
      id: `endless_q_water_${dateStr}`,
      title: 'Nhắc người ấy uống đủ 2L nước hôm nay',
      icon: '💧',
      rewardXP: 60,
      rewardHearts: 30,
      rewardCoins: 40,
      category: 'health'
    },
    {
      id: `endless_q_sofa_${dateStr}`,
      title: 'Sofa Check-In: Kể nhau nghe 1 điều làm bạn vui',
      icon: '🛋️',
      rewardXP: 75,
      rewardHearts: 45,
      rewardCoins: 50,
      category: 'love'
    },
    {
      id: `endless_q_puzzle_${dateStr}`,
      title: 'Cùng nhau chơi 1 màn giải đố đạt 3 Sao',
      icon: '⭐',
      rewardXP: 90,
      rewardHearts: 35,
      rewardCoins: 60,
      category: 'puzzle'
    }
  ]
}
