import type { DailyLog } from '../types'

export type ReadinessBreakdown = {
  total: number
  sleepScore: number
  nutritionScore: number
  trainingScore: number
  hydrationScore: number
  recoveryScore: number
  moodScore: number
  avoidanceScore: number
}

export function computeReadinessBreakdown(log: DailyLog, waterTarget: number): ReadinessBreakdown {
  const sleepHours = log.sleep?.nightHours || 0
  const sleepScore = Math.min(100, (sleepHours / 8) * 100)

  const cats = new Set(log.meals.flatMap((m) => m.foods.map((f) => f.category)))
  const catPoints = [
    cats.has('protein'),
    cats.has('carb'),
    cats.has('vegetable'),
    cats.has('fruit') || cats.has('dairy')
  ].filter(Boolean).length
  const nutritionScore = Math.min(100, catPoints * 25)

  const trainingScore = log.workout?.completed ? 100 : 45
  const hydrationScore = Math.min(100, (log.hydrationMl / (waterTarget || 2500)) * 100)

  const mobilityPoints = log.mobilityCompleted ? 40 : 0
  const kegelPoints = log.kegelCompleted ? 20 : 0
  const breathingPoints = Math.min(40, (log.breathingMinutes || 0) * 8)
  const recoveryScore = Math.min(100, mobilityPoints + kegelPoints + breathingPoints)

  const energy = log.energy ?? 5
  const mood = log.mood ?? 5
  const stress = log.stress ?? 5
  const moodScore = Math.max(0, Math.min(100, ((energy + mood + (10 - stress)) / 3) * 10))

  const avoidanceScore = 100

  const total = Math.round(
    sleepScore * 0.25 +
    nutritionScore * 0.20 +
    trainingScore * 0.20 +
    hydrationScore * 0.10 +
    recoveryScore * 0.10 +
    moodScore * 0.10 +
    avoidanceScore * 0.05
  )

  return {
    total: Math.min(100, Math.max(0, total)),
    sleepScore: Math.round(sleepScore),
    nutritionScore: Math.round(nutritionScore),
    trainingScore: Math.round(trainingScore),
    hydrationScore: Math.round(hydrationScore),
    recoveryScore: Math.round(recoveryScore),
    moodScore: Math.round(moodScore),
    avoidanceScore
  }
}

export function readiness(log: DailyLog, waterTarget: number): number {
  return computeReadinessBreakdown(log, waterTarget).total
}

export function getDayAdvice(log: DailyLog, day: number): string[] {
  const tips: string[] = []
  const cats = new Set(log.meals.flatMap(m => m.foods.map(f => f.category)))

  if (!log.sleep) {
    tips.push('Chưa ghi nhận giấc ngủ: Hãy cập nhật thời gian ngủ để theo dõi khả năng phục hồi.')
  } else if (log.sleep.nightHours < 7) {
    tips.push('Ngủ dưới 7 giờ: Cơ thể cần hồi phục, ưu tiên nghỉ ngơi và đừng tăng cường độ tập.')
  } else if (log.sleep.nightHours >= 8) {
    tips.push('Đạt mục tiêu giấc ngủ (≥ 8h): Tối ưu tái tạo năng lượng và thần kinh. Duy trì nhịp này.')
  }

  if (log.workout?.completed && !cats.has('carb')) {
    tips.push('Sau tập chưa có carb rõ ràng: Bổ sung thêm cơm, khoai, yến mạch hoặc chuối để phục hồi glycogen.')
  }

  if (log.meals.length > 0 && !cats.has('vegetable')) {
    tips.push('Thiếu rau xanh trong các bữa: Thêm 150–250g rau củ để bổ sung chất xơ và vi chất.')
  }

  if ((log.stress || 0) >= 7) {
    tips.push('Mức độ stress cao (≥ 7/10): Dành 5–10 phút thực hiện bài thở 4:6 hoặc thư giãn cơ sâu.')
  }

  if (day >= 8) {
    tips.push('Giai đoạn Taper (Chuẩn bị về đích): Giảm bớt khối lượng tập nặng, tập trung dinh dưỡng và giấc ngủ tối đa.')
  }

  if (!tips.length) {
    tips.push('Bạn đang duy trì phong độ rất tốt! Giữ vững chế độ ăn lành mạnh, tập luyện đúng lịch và ngủ đủ giấc.')
  }

  return tips.slice(0, 3)
}

export function calculateChecklistCompletion(checklist: { done: boolean }[]): number {
  if (!checklist.length) return 0
  const doneCount = checklist.filter(c => c.done).length
  return Math.round((doneCount / checklist.length) * 100)
}
