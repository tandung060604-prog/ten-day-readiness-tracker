import type { AppSettings, DailyLog, TrainingDay } from '../types'

const checklist = (labels: string[]) => labels.map((label, i) => ({ id: `c-${i}`, label, done: false }))

export const defaultSettings: AppSettings = {
  title: '10-Day Readiness',
  privacyMode: false,
  theme: 'dark',
  wakeTime: '07:45',
  bedtimeTarget: '23:30–23:45',
  workStart: '08:45',
  workEnd: '18:00',
  lunchTime: '12:30',
  napWindow: '13:15–13:45',
  workoutStart: '18:15',
  waterTargetMl: 2500,
  currentDay: 3,
}

const baseChecklist = [
  'Ăn đủ protein + carb trong ngày',
  'Ăn ít nhất 2 phần rau / trái cây',
  'Hoàn thành buổi tập hoặc recovery',
  'Mobility / breathing theo lịch',
  'Uống 2.0–2.5L nước',
  'Không rượu bia quá mức',
  'Bắt đầu wind-down lúc 23:15',
  'Ngủ trước 23:45',
]

export const seededLogs: DailyLog[] = [
  {
    dayNumber: 1,
    dateLabel: 'Day 1',
    sleep: { bedtime: '23:45', wakeTime: '07:45', nightHours: 8, napMinutes: 30, quality: 4 },
    meals: [
      {
        id: 'd1-dinner', day: 1, mealType: 'dinner', time: '20:30',
        foods: [
          { id: '1', name: 'Ức gà', amount: 250, unit: 'g', category: 'protein' },
          { id: '2', name: 'Đậu bắp', amount: 150, unit: 'g', category: 'vegetable' },
          { id: '3', name: 'Cà chua', amount: 1, unit: 'quả', category: 'vegetable' },
          { id: '4', name: 'Trứng luộc', amount: 2, unit: 'quả', category: 'protein' },
          { id: '5', name: 'Cơm', amount: 2, unit: 'bát', category: 'carb' },
        ],
      },
    ],
    hydrationMl: 2200,
    workout: { title: 'Full Body', completed: true, durationMinutes: 60 },
    mobilityCompleted: true,
    kegelCompleted: false,
    breathingMinutes: 5,
    energy: 8, mood: 8, stress: 3, soreness: 4,
    journal: 'Ngày đầu hoàn thành tốt. Ăn tối đủ đạm, carb và rau; ngủ đủ 8 tiếng.',
    checklist: baseChecklist.map((label, i) => ({ id: `d1-${i}`, label, done: true })),
  },
  {
    dayNumber: 2,
    dateLabel: 'Day 2',
    sleep: { bedtime: '23:45', wakeTime: '07:45', nightHours: 8, napMinutes: 30, quality: 4 },
    meals: [
      {
        id: 'd2-breakfast', day: 2, mealType: 'breakfast', time: '08:25',
        foods: [
          { id: '6', name: 'Chuối', amount: 1, unit: 'quả', category: 'fruit' },
          { id: '7', name: 'Cơm', amount: 0.5, unit: 'bát', category: 'carb' },
          { id: '8', name: 'Thịt / trứng', category: 'protein' },
          { id: '9', name: 'Cà chua', category: 'vegetable' },
          { id: '10', name: 'Dalat Milk không đường', amount: 180, unit: 'ml', category: 'dairy' },
        ],
      },
      {
        id: 'd2-pre', day: 2, mealType: 'pre-workout', time: '17:30',
        foods: [{ id: '11', name: 'Chuối', amount: 1, unit: 'quả', category: 'fruit' }],
      },
      {
        id: 'd2-dinner', day: 2, mealType: 'dinner', time: '20:30',
        foods: [
          { id: '12', name: 'Đùi gà', category: 'protein' },
          { id: '13', name: 'Cải chíp', category: 'vegetable' },
          { id: '14', name: 'Sườn nhỏ', amount: 2, unit: 'miếng', category: 'protein' },
        ],
      },
    ],
    hydrationMl: 2300,
    workout: { title: 'Zone 2 + Mobility + Kegel', completed: true, durationMinutes: 55 },
    mobilityCompleted: true,
    kegelCompleted: true,
    breathingMinutes: 5,
    energy: 8, mood: 8, stress: 3, soreness: 3,
    journal: 'Cardio Zone 2 hoàn thành tốt, mobility và Kegel theo lịch. Ngủ đủ 8 tiếng.',
    checklist: baseChecklist.map((label, i) => ({ id: `d2-${i}`, label, done: true })),
  },
  {
    dayNumber: 3,
    dateLabel: 'Day 3',
    meals: [
      {
        id: 'd3-morning', day: 3, mealType: 'snack', time: '09:30',
        foods: [
          { id: '15', name: 'TH true YOGURT không đường', amount: 1, unit: 'hũ', category: 'dairy' },
          { id: '16', name: 'Chuối', amount: 1, unit: 'quả', category: 'fruit' },
        ],
      },
      {
        id: 'd3-tea', day: 3, mealType: 'other', time: '10:30',
        foods: [
          { id: '17', name: 'Trà nhài Cozy', amount: 500, unit: 'ml', category: 'drink' },
          { id: '18', name: 'Đường tinh luyện', amount: 1, unit: 'gói', category: 'carb' },
        ],
        notes: '2 gói trà nhài + 1 gói đường',
      },
    ],
    hydrationMl: 800,
    workout: { title: 'Upper Body + Core', completed: false },
    mobilityCompleted: false,
    kegelCompleted: false,
    breathingMinutes: 0,
    energy: 8, mood: 8, stress: 3, soreness: 2,
    checklist: checklist(baseChecklist),
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    dayNumber: i + 4,
    dateLabel: `Day ${i + 4}`,
    meals: [], hydrationMl: 0,
    workout: { title: '', completed: false },
    mobilityCompleted: false, kegelCompleted: false, breathingMinutes: 0,
    checklist: checklist(baseChecklist),
  })),
]

const ex = (name: string, prescription: string, instructions: string[]): TrainingDay['exercises'][number] => ({ name, prescription, instructions })

export const trainingPlan: TrainingDay[] = [
  {
    day: 1, title: 'Full Body', subtitle: 'Build the base',
    exercises: [
      ex('Squat', '3 × 8', ['Chân rộng khoảng vai.', 'Hạ hông có kiểm soát.', 'Gối đi cùng hướng mũi chân.', 'Giữ 2–3 reps dự phòng.']),
      ex('Bench Press', '3 × 8–10', ['Bả vai kéo nhẹ về sau.', 'Bàn chân chắc trên sàn.', 'Hạ thanh có kiểm soát.']),
      ex('Lat Pulldown', '3 × 10', ['Ngực mở.', 'Kéo thanh về phần trên ngực.', 'Không giật người.']),
      ex('Romanian Deadlift', '3 × 8–10', ['Gối hơi chùng.', 'Đẩy mông ra sau.', 'Giữ lưng trung lập.', 'Đứng lên bằng mông/đùi sau.']),
      ex('Plank', '3 × 45–60s', ['Khuỷu dưới vai.', 'Không võng lưng.', 'Thở đều.']),
    ],
    notes: ['Không failure.', 'Không PR.'],
  },
  {
    day: 2, title: 'Zone 2 + Mobility', subtitle: 'Aerobic base + hip freedom',
    exercises: [
      ex('Treadmill Zone 2', '35–45 min', ['Warm-up 5 phút ở 4.5 km/h, dốc 2–3%.', 'Main: 4.5–5.5 km/h, dốc 5–8%.', 'Bạn vẫn nói được cả câu.', 'Cooldown 5 phút.']),
      ex('90/90 Hip Rotation', '10 / bên', ['Ngồi trên sàn, hai gối gập.', 'Giữ mông trên sàn.', 'Xoay hai chân sang bên đối diện.', 'Làm chậm, không giật.']),
      ex('Hip Flexor Stretch', '2 × 30–45s / bên', ['Quỳ một gối.', 'Siết nhẹ mông bên chân quỳ.', 'Đẩy hông nhẹ về trước.', 'Không ưỡn lưng.']),
      ex('Butterfly Stretch', '2 × 30–45s', ['Hai lòng bàn chân chạm nhau.', 'Giữ lưng tương đối thẳng.', 'Không ép mạnh đầu gối.']),
    ],
    notes: ['Không cần 90 phút nếu chưa quen endurance.'],
  },
  {
    day: 3, title: 'Upper Body + Core', subtitle: 'Strength without heavy fatigue',
    exercises: [
      ex('Bench Press', '3 × 8', ['Giữ 2–3 reps dự phòng.', 'Không bật thanh khỏi ngực.']),
      ex('Lat Pulldown', '3 × 8–12', ['Kéo bằng lưng.', 'Không ngả người quá nhiều.']),
      ex('Incline Dumbbell Press', '3 × 10', ['Ghế dốc vừa.', 'Hạ tạ kiểm soát.']),
      ex('Seated Cable Row', '3 × 10', ['Ngực mở.', 'Kéo khuỷu ra sau.', 'Không giật thân.']),
      ex('Lateral Raise', '2 × 12–15', ['Tạ nhẹ.', 'Không nhún người.']),
      ex('Dead Bug', '2 × 8–10 / bên', ['Nằm ngửa.', 'Duỗi tay phải + chân trái.', 'Giữ lưng dưới ổn định.', 'Đổi bên.']),
      ex('Plank', '3 × 30–60s', ['Thân người thành một đường.', 'Thở bình thường.']),
    ],
    notes: ['Không failure.', 'Ưu tiên kỹ thuật đẹp.'],
  },
  {
    day: 4, title: 'Zone 2 + Mobility', subtitle: 'Recover and keep moving',
    exercises: [
      ex('Zone 2', '35–45 min', ['Giữ cường độ nói được cả câu.', 'Không HIIT.']),
      ex('Cat-Cow', '10 reps', ['Chống bốn điểm.', 'Hít vào mở ngực nhẹ.', 'Thở ra cong lưng.']),
      ex('Deep Squat Hold', '2 × 20–30s', ['Ngồi sâu trong mức thoải mái.', 'Không ép nếu đau gối/hông.']),
      ex('4:6 Breathing', '5 min', ['Hít nhẹ 4 giây.', 'Thở ra 6 giây.', 'Vai và hàm thả lỏng.']),
    ],
    notes: ['Tập nhẹ để hỗ trợ hồi phục.'],
  },
  {
    day: 5, title: 'Lower Body', subtitle: 'Last main leg session',
    exercises: [
      ex('Squat / Leg Press', '3 × 8', ['Không PR.', 'Không failure.']),
      ex('Romanian Deadlift', '3 × 8–10', ['Đẩy mông ra sau.', 'Giữ lưng trung lập.']),
      ex('Bulgarian Split Squat', '2 × 8 / bên', ['Bước chân đủ xa.', 'Hạ có kiểm soát.']),
      ex('Hip Thrust', '3 × 10', ['Lưng trên tựa ghế.', 'Đẩy hông bằng mông.', 'Giữ 1 giây ở đỉnh.', 'Không ưỡn lưng quá mức.']),
      ex('Leg Curl', '2 × 12', ['Giữ nhịp chậm.', 'Không quăng tạ.']),
    ],
    notes: ['Buổi chân chính cuối cùng.', 'Tránh DOMS nặng.'],
  },
  {
    day: 6, title: 'Active Recovery', subtitle: 'Restore, do not exhaust',
    exercises: [
      ex('Zone 2 / Walk', '25–35 min', ['Nhẹ, dễ duy trì.']),
      ex('Bird Dog', '2 × 10 / bên', ['Chống bốn điểm.', 'Duỗi tay phải + chân trái.', 'Không xoay hông.']),
      ex('Glute Bridge', '2 × 15', ['Nằm ngửa, co gối.', 'Siết mông nâng hông.', 'Hạ chậm.']),
      ex('Dead Bug', '2 × 10 / bên', ['Giữ core ổn định.', 'Làm chậm.']),
    ],
    notes: ['Mobility 5–10 phút.'],
  },
  {
    day: 7, title: 'Light Full Body', subtitle: 'Final gym session',
    exercises: [
      ex('Goblet Squat', '2 × 10', ['Dùng 70–80% effort.', 'Không failure.']),
      ex('Dumbbell Bench', '3 × 10', ['Tạ vừa.', 'Tempo kiểm soát.']),
      ex('Lat Pulldown', '3 × 10', ['Ngực mở.', 'Kéo mượt.']),
      ex('Seated Row', '2 × 12', ['Không giật.']),
      ex('Hip Thrust', '2 × 10', ['Siết mông.', 'Không quá nặng.']),
      ex('Side Plank', '2 × 30s / bên', ['Khuỷu dưới vai.', 'Nâng hông, giữ thân thẳng.']),
    ],
    notes: ['Đây là buổi gym cuối.'],
  },
  {
    day: 8, title: 'Taper', subtitle: 'Reduce load, keep mobility',
    exercises: [
      ex('Walk', '30–40 min', ['Đi thoải mái.']),
      ex('90/90', '10 / bên', ['Chậm, không ép.']),
      ex('Hip Flexor Stretch', '30s / bên', ['Thả lỏng hông.']),
      ex('Cat-Cow', '10 reps', ['Nhịp thở đều.']),
    ],
    notes: ['Không tập tạ.', 'Kegel: 5 slow + 5 fast.'],
  },
  {
    day: 9, title: 'Recovery', subtitle: 'Arrive fresh',
    exercises: [
      ex('Optional Walk', '20–30 min', ['Chỉ đi nếu thấy dễ chịu.']),
      ex('Mobility', '5–10 min', ['Nhẹ, không ép dẻo.']),
      ex('4:6 Breathing', '5 min', ['Hít 4 giây.', 'Thở 6 giây.']),
    ],
    notes: ['Không gym.', 'Không HIIT.', 'Không Kegel.', 'Ngủ 8–9h.'],
  },
  {
    day: 10, title: 'Ready Day', subtitle: 'Comfort > performance',
    exercises: [
      ex('Optional Walk', '10–20 min', ['Đi nhẹ.']),
      ex('Light Mobility', '5 min', ['Chỉ để cơ thể thoải mái.']),
      ex('4:6 Breathing', '5 min', ['Hít nhẹ 4 giây.', 'Thở dài 6 giây.']),
    ],
    notes: ['Không gym.', 'Không Kegel.', 'Ăn vừa phải, uống nước đều.', 'Mục tiêu là thoải mái và sẵn sàng.'],
  },
]

export const schedule = [
  ['07:45', 'Thức dậy'], ['07:45–08:05', 'Tắm'], ['08:05–08:30', 'Chuẩn bị sáng + hộp cơm trưa'],
  ['08:35–08:40', 'Rời nhà'], ['08:45', 'Bắt đầu làm việc'], ['12:30', 'Ăn trưa'], ['13:15–13:45', 'Ngủ trưa 30 phút'],
  ['16:30–17:30', 'Snack trước tập nếu cần'], ['18:00', 'Tan làm'], ['18:05–18:15', 'Di chuyển tới phòng tập'],
  ['18:15–19:15', 'Tập / recovery'], ['19:20–20:15', 'Tắm / đi chợ / nấu ăn'], ['20:15–20:45', 'Ăn tối'],
  ['21:00–23:15', 'Game / nhắn tin / thư giãn'], ['23:15', 'Wind-down'], ['23:30–23:45', 'Ngủ'],
]

export const deskBreaks = [
  ['10:00', 'Đi bộ / đứng 3 phút'], ['11:00', 'Đứng 3 phút'], ['13:45', 'Đi bộ nhẹ 3–5 phút sau ngủ trưa'],
  ['15:00', 'Đứng 3 phút'], ['16:00', 'Đứng 3 phút'], ['17:00', 'Đứng + chuẩn bị snack trước tập'],
]
