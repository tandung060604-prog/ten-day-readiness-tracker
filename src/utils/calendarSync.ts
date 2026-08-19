import { trainingPlan } from '../data/plan'
import type { AppSettings } from '../types'

/**
 * Generates an iCalendar (.ics) file content for 10-Day Readiness Protocol
 */
export function generateICalendar(settings: AppSettings): string {
  const now = new Date()
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//10-Day Readiness Protocol//VN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:10-Day Readiness Tracker',
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh'
  ]

  // Create 10-day training events
  for (let i = 0; i < 10; i++) {
    const plan = trainingPlan[i] || trainingPlan[0]
    const eventDate = new Date(now)
    eventDate.setDate(now.getDate() + i)

    // Workout time
    const [startH, startM] = settings.workoutStart.split(':').map(Number)
    const workoutStart = new Date(eventDate)
    workoutStart.setHours(startH || 18, startM || 0, 0, 0)
    const workoutEnd = new Date(workoutStart)
    workoutEnd.setMinutes(workoutEnd.getMinutes() + 45)

    const exerciseList = plan.exercises.map(e => `• ${e.name} (${e.prescription})`).join('\\n')

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:readiness-day-${i + 1}-${Date.now()}@readiness.app`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(workoutStart)}`,
      `DTEND:${formatDate(workoutEnd)}`,
      `SUMMARY:⚡ Ngày ${i + 1}/10: ${plan.title}`,
      `DESCRIPTION:Lộ trình Readiness 10 Ngày\\nBài tập:\\n${exerciseList}\\n\\nTheo dõi tại: https://tandung060604-prog.github.io/ten-day-readiness-tracker/`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Nhắc nhở: 15 phút nữa bắt đầu buổi tập Ngày ${i + 1}`,
      'END:VALARM',
      'END:VEVENT'
    )

    // Bedtime wind-down event
    const [bedH, bedM] = settings.bedtimeTarget.split(':').map(Number)
    const bedtime = new Date(eventDate)
    bedtime.setHours(bedH || 23, bedM || 0, 0, 0)
    const bedtimeEnd = new Date(bedtime)
    bedtimeEnd.setMinutes(bedtimeEnd.getMinutes() + 30)

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:readiness-bedtime-${i + 1}-${Date.now()}@readiness.app`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(bedtime)}`,
      `DTEND:${formatDate(bedtimeEnd)}`,
      `SUMMARY:🌙 Wind-down & Đi ngủ đúng giờ (Ngày ${i + 1})`,
      'DESCRIPTION:Tắt màn hình xanh, thực hiện bài thở 4:6 trong 5 phút và chuẩn bị vào giấc ngủ sâu 8 tiếng.',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Chuẩn bị đi ngủ trong 15 phút tới để tối ưu chu kỳ phục hồi thể lực.',
      'END:VALARM',
      'END:VEVENT'
    )
  }

  // Day 10 Grand Ready Day Milestone Event
  const readyDate = new Date(now)
  readyDate.setDate(now.getDate() + 9)
  readyDate.setHours(8, 0, 0, 0)
  const readyDateEnd = new Date(readyDate)
  readyDateEnd.setHours(20, 0, 0, 0)

  icsContent.push(
    'BEGIN:VEVENT',
    `UID:readiness-ready-day-${Date.now()}@readiness.app`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(readyDate)}`,
    `DTEND:${formatDate(readyDateEnd)}`,
    'SUMMARY:🌟 NGÀY SẴN SÀNG TOÀN DIỆN (READY DAY)!',
    'DESCRIPTION:Chúc mừng bạn đã hoàn thành trọn vẹn 10 Ngày Sẵn Sàng! Thể lực và tâm trí đã đạt phong độ đỉnh cao.',
    'STATUS:CONFIRMED',
    'END:VEVENT'
  )

  icsContent.push('END:VCALENDAR')
  return icsContent.join('\r\n')
}

export function downloadCalendarICS(settings: AppSettings) {
  const icsData = generateICalendar(settings)
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', '10-Day-Readiness-Schedule.ics')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
