export interface MenstrualCycleSettings {
  lastPeriodStartDate: string // YYYY-MM-DD, default '2026-07-29'
  cycleLength: number // default 29 days
  periodDuration: number // default 5 days
  lutealPhaseDuration: number // default 14 days
}

export interface DayMenstrualLog {
  date: string // YYYY-MM-DD
  flow?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy'
  symptoms: string[] // ['cramps', 'headache', 'bloating', 'breast_tender', 'backache', 'fatigue', 'sweet_craving']
  moods: string[] // ['happy', 'calm', 'sensitive', 'irritated', 'need_hugs', 'romantic', 'tired']
  waterGlasses: number
  warmTeaCount: number
  tookSupplements: boolean
  note: string
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal'

export interface CyclePhaseInfo {
  phase: CyclePhase
  name: string
  subtitle: string
  color: string
  bgGlow: string
  icon: string
  dayInCycle: number
  totalCycleDays: number
  daysUntilNextPeriod: number
  nextPeriodDate: string
  ovulationDate: string
  pregnancyChance: 'Thấp' | 'Trung Bình' | 'Rất Cao (Dễ Thụ Thai)'
  bodyChanges: string[]
  maiTrangTips: string[]
  haruCareGuide: string[]
}

const STORAGE_SETTINGS_KEY = 'flo_menstrual_settings_v1'
const STORAGE_LOGS_KEY = 'flo_menstrual_logs_v1'

export const DEFAULT_CYCLE_SETTINGS: MenstrualCycleSettings = {
  lastPeriodStartDate: '2026-07-29',
  cycleLength: 29,
  periodDuration: 5,
  lutealPhaseDuration: 14
}

export function loadCycleSettings(): MenstrualCycleSettings {
  if (typeof window === 'undefined') return DEFAULT_CYCLE_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.debug('Error loading cycle settings:', e)
  }
  return DEFAULT_CYCLE_SETTINGS
}

export function saveCycleSettings(settings: MenstrualCycleSettings) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings))
}

export function loadDailyLogs(): Record<string, DayMenstrualLog> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.debug('Error loading daily logs:', e)
  }
  return {}
}

export function saveDailyLog(log: DayMenstrualLog) {
  if (typeof window === 'undefined') return
  const current = loadDailyLogs()
  current[log.date] = log
  localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(current))
}

// Format date helpers
export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatVNDate(str: string): string {
  const [y, m, d] = str.split('-').map(Number)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
}

/**
 * Calculates complete Flo-style Menstrual Cycle data for a given date
 */
export function calculateCycleInfo(
  targetDateStr: string = '2026-08-19',
  settings: MenstrualCycleSettings = DEFAULT_CYCLE_SETTINGS
): CyclePhaseInfo {
  const targetDate = parseDate(targetDateStr)
  const lastStartDate = parseDate(settings.lastPeriodStartDate)

  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.round((targetDate.getTime() - lastStartDate.getTime()) / msPerDay)

  // Modulo cycle days (1-indexed day of cycle: 1 to cycleLength)
  const rawCycleDay = diffDays >= 0 ? (diffDays % settings.cycleLength) + 1 : 1
  const dayInCycle = rawCycleDay

  // Calculated cycle anchors
  const currentCycleIndex = Math.floor(Math.max(0, diffDays) / settings.cycleLength)
  const currentCycleStart = new Date(lastStartDate.getTime() + currentCycleIndex * settings.cycleLength * msPerDay)
  const nextCycleStart = new Date(currentCycleStart.getTime() + settings.cycleLength * msPerDay)
  const ovulationDateObj = new Date(nextCycleStart.getTime() - settings.lutealPhaseDuration * msPerDay)

  const daysUntilNextPeriod = Math.max(0, Math.round((nextCycleStart.getTime() - targetDate.getTime()) / msPerDay))
  const nextPeriodDateStr = formatDateKey(nextCycleStart)
  const ovulationDateStr = formatDateKey(ovulationDateObj)

  // Ovulation Window (Fertile window: 5 days before ovulation up to ovulation day)
  const fertileStart = new Date(ovulationDateObj.getTime() - 5 * msPerDay)
  const fertileEnd = new Date(ovulationDateObj.getTime() + 1 * msPerDay)

  let phase: CyclePhase = 'luteal'
  let name = 'Giai Đoạn Hoàng Thể (Luteal / PMS)'
  let subtitle = 'Chuẩn bị bước vào kỳ kinh mới'
  let color = '#f59f00'
  let bgGlow = 'rgba(245, 159, 0, 0.2)'
  let icon = '🍵'
  let pregnancyChance: 'Thấp' | 'Trung Bình' | 'Rất Cao (Dễ Thụ Thai)' = 'Thấp'

  if (dayInCycle <= settings.periodDuration) {
    phase = 'menstrual'
    name = 'Kỳ Hành Kinh (Menstrual Phase)'
    subtitle = 'Cơ thể đang đào thải & thanh lọc'
    color = '#e03131'
    bgGlow = 'rgba(224, 49, 49, 0.25)'
    icon = '🩸'
    pregnancyChance = 'Thấp'
  } else if (targetDate >= fertileStart && targetDate <= fertileEnd) {
    phase = 'ovulation'
    name = 'Cửa Sổ Rụng Trứng (Ovulation Window)'
    subtitle = 'Năng lượng đỉnh cao & Nữ tính rạng rỡ'
    color = '#d6336c'
    bgGlow = 'rgba(214, 51, 108, 0.25)'
    icon = '🌸'
    pregnancyChance = targetDate.getTime() === ovulationDateObj.getTime() ? 'Rất Cao (Dễ Thụ Thai)' : 'Trung Bình'
  } else if (dayInCycle < settings.cycleLength - settings.lutealPhaseDuration) {
    phase = 'follicular'
    name = 'Giai Đoạn Nang Trứng (Follicular Phase)'
    subtitle = 'Tươi mới, tinh thần phấn chấn & sẵn sàng'
    color = '#20bf6b'
    bgGlow = 'rgba(32, 191, 107, 0.2)'
    icon = '🌱'
    pregnancyChance = 'Thấp'
  } else {
    phase = 'luteal'
    name = 'Giai Đoạn Hoàng Thể / PMS'
    subtitle = `Còn ${daysUntilNextPeriod} ngày nữa tới kỳ kinh (${formatVNDate(nextPeriodDateStr)})`
    color = '#f59f00'
    bgGlow = 'rgba(245, 159, 0, 0.22)'
    icon = '🍵'
    pregnancyChance = 'Thấp'
  }

  // Symptoms & Body Changes
  const bodyChanges = [
    phase === 'luteal' ? 'Hormone progesterone tăng cao khiến cơ thể dễ tích nước nhẹ' : 'Hormone cân bằng, làn da rạng rỡ',
    daysUntilNextPeriod <= 9 ? 'Có thể xuất hiện dấu hiệu mỏi lưng, căng ngực và thèm đồ ngọt' : 'Cơ thể nhẹ nhõm, vận động linh hoạt',
    'Nhiệt độ cơ thể duy trì mức 36.8°C - 37.0°C ổn định'
  ]

  // Advice for Mai Trang
  const maiTrangTips = [
    phase === 'luteal'
      ? 'Uống nhiều nước ấm (2.5L), bổ sung trà hoa cúc hoặc trà gừng mật ong.'
      : 'Thoải mái tập luyện yoga và duy trì chế độ ăn giàu rau xanh.',
    'Hạn chế đồ uống quá lạnh và thực phẩm quá nhiều muối để tránh đầy hơi.',
    `Chuyến đi Nha Trang 27/08 trùng ngày bắt đầu kỳ kinh — hãy chuẩn bị sẵn băng vệ sinh êm ái, quần lót cotton và đồ bơi tối màu!`
  ]

  // Care guide for Haru (Dũng)
  const haruCareGuide = [
    'Chủ động pha nước ấm, chuẩn bị trà gừng và đồ ngọt nhẹ (socola đen, pudding sữa) cho Mai Trang.',
    'Nhẹ nhàng massage lưng, xoa bụng dưới nếu bạn gái thấy mỏi hoặc khó chịu.',
    'Luôn lắng nghe, ân cần nhường nhịn và ôm Mai Trang thật nhiều trong những ngày nhạy cảm này!',
    'Nhớ mang theo túi sưởi mini và thuốc giảm đau bụng kinh trong vali đi Nha Trang 27/08.'
  ]

  return {
    phase,
    name,
    subtitle,
    color,
    bgGlow,
    icon,
    dayInCycle,
    totalCycleDays: settings.cycleLength,
    daysUntilNextPeriod,
    nextPeriodDate: nextPeriodDateStr,
    ovulationDate: ovulationDateStr,
    pregnancyChance,
    bodyChanges,
    maiTrangTips,
    haruCareGuide
  }
}

export interface CalendarDayInfo {
  dateStr: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isPeriod: boolean
  isPredictedPeriod: boolean
  isOvulation: boolean
  isFertile: boolean
  isNhaTrangFlight: boolean
  log?: DayMenstrualLog
}

export function getMonthlyCalendarGrid(
  year: number,
  month: number, // 0-indexed (0 = Jan, 7 = Aug)
  settings: MenstrualCycleSettings = DEFAULT_CYCLE_SETTINGS,
  dailyLogs: Record<string, DayMenstrualLog> = {}
): CalendarDayInfo[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate()

  const grid: CalendarDayInfo[] = []
  const msPerDay = 1000 * 60 * 60 * 24
  const lastStart = parseDate(settings.lastPeriodStartDate)

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i, 12)
    const dateStr = formatDateKey(d)
    grid.push(buildDayInfo(d, dateStr, false, lastStart, settings, dailyLogs))
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day, 12)
    const dateStr = formatDateKey(d)
    grid.push(buildDayInfo(d, dateStr, true, lastStart, settings, dailyLogs))
  }

  // Next month leading days (to complete 35 or 42 grid cells)
  const remaining = (7 - (grid.length % 7)) % 7
  for (let day = 1; day <= remaining; day++) {
    const d = new Date(year, month + 1, day, 12)
    const dateStr = formatDateKey(d)
    grid.push(buildDayInfo(d, dateStr, false, lastStart, settings, dailyLogs))
  }

  return grid
}

function buildDayInfo(
  d: Date,
  dateStr: string,
  isCurrentMonth: boolean,
  lastStart: Date,
  settings: MenstrualCycleSettings,
  dailyLogs: Record<string, DayMenstrualLog>
): CalendarDayInfo {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.round((d.getTime() - lastStart.getTime()) / msPerDay)

  let isPeriod = false
  let isPredictedPeriod = false
  let isOvulation = false
  let isFertile = false

  // Repeated cycle calculation
  const cycleDay = diffDays >= 0 ? diffDays % settings.cycleLength : (settings.cycleLength + (diffDays % settings.cycleLength)) % settings.cycleLength

  if (diffDays >= 0 && diffDays < settings.periodDuration) {
    isPeriod = true
  } else if (cycleDay < settings.periodDuration) {
    isPredictedPeriod = true
  }

  const ovulationCycleDay = settings.cycleLength - settings.lutealPhaseDuration
  if (cycleDay === ovulationCycleDay) {
    isOvulation = true
  } else if (cycleDay >= ovulationCycleDay - 5 && cycleDay <= ovulationCycleDay + 1) {
    isFertile = true
  }

  const isToday = dateStr === '2026-08-19'
  const isNhaTrangFlight = dateStr === '2026-08-27'

  return {
    dateStr,
    dayNumber: d.getDate(),
    isCurrentMonth,
    isToday,
    isPeriod,
    isPredictedPeriod,
    isOvulation,
    isFertile,
    isNhaTrangFlight,
    log: dailyLogs[dateStr]
  }
}
