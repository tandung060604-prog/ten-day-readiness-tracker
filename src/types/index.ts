export type MealType = 'breakfast' | 'snack' | 'lunch' | 'pre-workout' | 'dinner' | 'other'

export type FoodItem = {
  id: string
  name: string
  amount?: number
  unit?: string
  category?: 'protein' | 'carb' | 'vegetable' | 'fruit' | 'dairy' | 'fat' | 'drink' | 'other'
}

export type MealEntry = {
  id: string
  day: number
  mealType: MealType
  time: string
  foods: FoodItem[]
  notes?: string
  photoIds?: string[]
  estimatedProtein?: number
  estimatedCarbs?: number
}

export type SleepEntry = {
  bedtime: string
  wakeTime: string
  nightHours: number
  napMinutes?: number
  quality: number
}

export type WorkoutLog = {
  title: string
  completed: boolean
  durationMinutes?: number
  notes?: string
}

export type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

export type DailyLog = {
  dayNumber: number
  dateLabel: string
  sleep?: SleepEntry
  meals: MealEntry[]
  hydrationMl: number
  workout?: WorkoutLog
  mobilityCompleted: boolean
  kegelCompleted: boolean
  breathingMinutes: number
  energy?: number
  mood?: number
  stress?: number
  soreness?: number
  journal?: string
  checklist: ChecklistItem[]
}

export type AppSettings = {
  title: string
  privacyMode: boolean
  theme: 'dark' | 'light'
  wakeTime: string
  bedtimeTarget: string
  workStart: string
  workEnd: string
  lunchTime: string
  napWindow: string
  workoutStart: string
  waterTargetMl: number
  currentDay: number
}

export type Exercise = {
  name: string
  prescription: string
  instructions: string[]
}

export type TrainingDay = {
  day: number
  title: string
  subtitle: string
  exercises: Exercise[]
  notes: string[]
}
