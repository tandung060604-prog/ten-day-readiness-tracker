# SPEC / PROMPT CHO CODEX — 10-DAY READINESS TRACKER

## 0. Mục tiêu dự án

Xây dựng một website cá nhân chạy được:

1. **Localhost** khi phát triển.
2. **GitHub Pages** khi deploy.
3. Không cần backend ở phiên bản đầu.
4. Dữ liệu cá nhân lưu **local-first** trên trình duyệt.
5. Cho phép theo dõi kế hoạch 10 ngày gồm:
   - Ăn uống.
   - Tập luyện.
   - Ngủ nghỉ.
   - Nước uống.
   - Mobility.
   - Kegel/pelvic floor.
   - Bài thở.
   - Caffeine/rượu bia.
   - Ảnh bằng chứng từng bữa ăn.
   - Nhật ký cảm nhận mỗi ngày.
   - Lời khuyên theo trạng thái ngày.
   - Tổng hợp tiến độ, streak và mức độ hoàn thành.

Website mang tinh thần **wellness / performance / recovery tracker**, không thiết kế theo phong cách dung tục hoặc quá trực diện về tình dục.

---

# 1. Tech stack

Ưu tiên stack đơn giản, dễ deploy GitHub Pages:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **Recharts** cho chart
- **date-fns**
- **IndexedDB** qua `idb` hoặc `Dexie.js` để lưu ảnh và dữ liệu lớn
- Có thể dùng `localStorage` cho settings nhỏ

Không dùng server/database cloud trong bản MVP.

## 1.1. Deploy

Phải cấu hình để chạy được:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Và deploy GitHub Pages:

```bash
npm run deploy
```

Có thể dùng package `gh-pages` hoặc GitHub Actions.

Nếu dùng React Router, phải xử lý route phù hợp GitHub Pages hoặc ưu tiên SPA một trang không cần route sâu.

---

# 2. Tên website

Tên hiển thị mặc định:

**10-Day Readiness**

Subtitle:

> Build energy. Track recovery. Arrive ready.

Cho phép đổi tên trong Settings.

Có chế độ **Privacy Mode** để tên website chuyển thành:

**Daily Wellness Tracker**

---

# 3. Định hướng giao diện

## 3.1. Visual style

Phong cách:

- Hiện đại.
- Minimal.
- Premium.
- Dark mode đẹp.
- Mobile-first.
- Dashboard giống app sức khỏe cao cấp.
- Không dùng quá nhiều màu.
- Card bo góc lớn.
- Shadow rất nhẹ.
- Typography rõ ràng.
- Có subtle gradient nhưng không lòe loẹt.

## 3.2. Palette đề xuất

Dark mode mặc định:

- Background: gần đen / navy rất tối.
- Surface: charcoal.
- Primary: emerald / teal.
- Accent: amber nhẹ cho warning.
- Danger: red nhẹ.
- Text primary: off-white.
- Text secondary: gray.

Light mode:

- Background trắng ngà.
- Card trắng.
- Primary emerald.
- Border xám rất nhẹ.

## 3.3. Responsive

Phải đẹp ở:

- iPhone / Android.
- Tablet.
- Desktop 1440px.

Desktop:
- Sidebar trái.
- Main content giữa.
- Right rail optional cho “Today Tips”.

Mobile:
- Bottom navigation.

---

# 4. Navigation

Các mục chính:

1. **Today**
2. **10-Day Plan**
3. **Meals**
4. **Training**
5. **Journal**
6. **Insights**
7. **Settings**

Mobile bottom nav chỉ cần:

- Today
- Plan
- Add
- Journal
- Insights

Nút `+ Add` mở modal quick-add.

---

# 5. Dashboard — Today

Đây là màn hình quan trọng nhất.

## 5.1. Header

Hiển thị:

- `Day X of 10`
- Ngày hiện tại.
- Countdown: `X days until Day 10`
- Progress ring tổng thể.

Ví dụ:

> Day 3 of 10  
> 7 days remaining  
> Overall readiness: 84%

Không dùng chữ "performance" quá trực diện.

## 5.2. Daily readiness score

Tính điểm 0–100 dựa trên:

- Sleep: 25%
- Nutrition: 20%
- Training/recovery adherence: 20%
- Hydration: 10%
- Mobility/breathing/pelvic floor: 10%
- Stress/mood: 10%
- Avoidance compliance: 5%

Không trình bày điểm như chẩn đoán y tế.

Tooltip:

> This is a personal adherence score, not a medical assessment.

## 5.3. Today's checklist

Ví dụ:

```text
[ ] Ăn sáng đủ protein + carb
[ ] Ăn trưa
[ ] Pre-workout snack
[ ] Workout
[ ] Mobility
[ ] Kegel
[ ] 2.0–2.5 L nước
[ ] Không rượu bia
[ ] Ngủ trước 23:45
```

Mỗi mục có:
- checkbox.
- timestamp khi hoàn thành.
- nút note nhỏ.

---

# 6. Daily schedule

Website phải hỗ trợ lịch cố định sau.

## Lịch ngày làm việc

```text
07:45  Thức dậy
07:45–08:05  Tắm
08:05–08:30  Chuẩn bị bữa sáng + hộp cơm trưa
08:30–08:35  Ăn sáng / hoàn tất
08:35–08:40  Rời nhà
08:45  Bắt đầu làm việc

12:30  Ăn trưa
13:15–13:45  Ngủ trưa 30 phút

16:30–17:30  Bữa phụ trước tập nếu cần

18:00  Tan làm
18:05–18:15  Di chuyển tới phòng tập
18:15–19:00/19:15  Tập

19:20–20:15  Về nhà / tắm / đi chợ / nấu ăn
20:15–20:45  Ăn tối

21:00–23:15  Chơi game / nhắn tin / thư giãn
23:15  Wind-down
23:30–23:45  Ngủ
```

Khoảng cách:
- Nhà → công ty: 5–10 phút.
- Nhà → phòng tập: 5–10 phút.

---

# 7. Micro-break cho công việc coder

Người dùng làm công việc ngồi nhiều.

Website phải có module **Desk Breaks**.

Default checklist:

```text
10:00  Stand / walk 3 phút
11:00  Stand / walk 3 phút
13:45  Walk nhẹ 3–5 phút sau ngủ trưa
15:00  Stand 3 phút
16:00  Stand 3 phút
17:00  Stand + pre-workout snack
```

Micro routine:

```text
10 shoulder rolls
5–10 hip extensions
20–30s hip-flexor stretch mỗi bên
1–2 phút đi bộ
```

Có quick button:

`Done — 3 min break`

---

# 8. Meal tracking

## 8.1. Mỗi meal entry

```ts
type MealEntry = {
  id: string
  day: number
  mealType: "breakfast" | "snack" | "lunch" | "pre-workout" | "dinner" | "other"
  time: string
  foods: FoodItem[]
  notes?: string
  photoIds?: string[]
  hungerBefore?: number
  fullnessAfter?: number
  estimatedProtein?: number
  estimatedCarbs?: number
  estimatedCalories?: number
}
```

## 8.2. Food item

```ts
type FoodItem = {
  name: string
  amount?: number
  unit?: string
  category?: "protein" | "carb" | "vegetable" | "fruit" | "dairy" | "fat" | "drink" | "other"
}
```

---

# 9. Meal photo evidence

Feature bắt buộc.

Ở mỗi bữa ăn:

- Nút `Add meal photo`.
- Upload từ camera hoặc gallery.
- Preview ảnh.
- Cho phép nhiều ảnh.
- Có timestamp.
- Có caption.
- Cho phép xóa ảnh.
- Lưu ảnh vào IndexedDB dưới dạng Blob.
- Không upload ảnh lên cloud.
- Badge `Photo logged ✓`.

Privacy text:

> Photos are stored locally on this device only.

Có:
- `Export all data`
- `Delete all local data`

---

# 10. Nutrition guidance

Không cần calorie tracking quá hardcore.

Mỗi meal hiển thị 4 pill:

- Protein
- Carb
- Vegetables
- Fruit / dairy

Ví dụ:

```text
Protein      ✓
Carb         ✓
Vegetables   ✓
Fruit        —
```

## Guidance rules

### Sau tập
Nếu meal có protein nhưng không có carb:

> Bạn đã có đủ protein. Cân nhắc thêm cơm, khoai, yến mạch hoặc chuối để hỗ trợ phục hồi.

### Bữa quá nhiều protein
Nếu > 60–70g protein ước tính:

> Protein đã khá cao trong bữa này. Không cần cố thêm trứng hoặc thịt nếu đã no.

### Ít rau
Nếu không có vegetable:

> Thêm khoảng 150–250g rau sẽ làm bữa cân bằng hơn.

### Pre-workout
Nếu còn 30–90 phút trước tập:

> Ưu tiên snack dễ tiêu: chuối, sữa, yogurt hoặc bánh mì.

---

# 11. Food suggestions library

## Protein
- Ức gà.
- Đùi gà bỏ bớt da nếu nhiều mỡ.
- Cá basa.
- Cá nục.
- Cá thu.
- Cá hồi.
- Thịt heo nạc.
- Thịt bò nạc.
- Trứng.
- Sữa không đường.
- Greek yogurt không đường.
- Sữa chua không đường.

## Carb
- Cơm.
- Khoai lang.
- Khoai tây.
- Yến mạch.
- Bánh mì nguyên cám.
- Chuối.

## Vegetables
- Đậu bắp.
- Cải chíp.
- Bông cải.
- Rau muống.
- Cà rốt.
- Cà chua.
- Rau xanh theo mùa.

## Fruit
- Chuối.
- Cam.
- Ổi.
- Táo.
- Kiwi.

---

# 12. Things to avoid

Tạo card `Avoid / Limit`:

- Rượu bia: tốt nhất 0 hoặc rất thấp.
- Thuốc/kẹo/mật ong “tăng sinh lý” không rõ nguồn gốc.
- Tự dùng Viagra/Cialis khi không có chỉ định.
- Pre-workout / caffeine quá muộn.
- Cắt carb mạnh.
- Ăn quá no trước tập.
- Ăn quá no ngay trước buổi tối quan trọng.
- HIIT/leg day nặng trong 48 giờ cuối.
- Tập failure liên tục.
- Kegel quá mức.
- Thức khuya.
- Đồ ăn lạ dễ gây đau bụng.
- Massage vùng kín bằng sản phẩm không rõ thành phần.
- Dùng sản phẩm gốc dầu cùng bao cao su latex.

---

# 13. Training plan — 10 days

## Day 1 — Full Body

Status mặc định: `Completed`

```text
Squat                 3 × 8
Bench Press           3 × 8–10
Lat Pulldown          3 × 10
Romanian Deadlift     3 × 8–10
Seated Cable Row      2 × 10–12
Plank                 3 × 45–60s
Dead Bug              2 × 10/side
```

Rule:
- Không failure.
- Giữ 2–3 reps in reserve.

## Day 2 — Zone 2 + Mobility

Status mặc định: `Completed`

```text
Warm-up               5 min
Zone 2 cardio         35–45 min
Cooldown              5 min

90/90 Hip Rotation    10/side
Hip Flexor Stretch    2 × 30–45s/side
Butterfly Stretch     2 × 30–45s
```

Treadmill suggestion:

```text
Warm-up:
4.5 km/h
2–3% incline
5 min

Main:
4.5–5.5 km/h
5–8% incline
25–35 min

Cooldown:
1–2% incline
5 min
```

Rule:
- Có thể nói cả câu.
- Không cần 90 phút nếu không quen endurance.
- Không vịn treadmill để “ăn gian” độ dốc.

## Day 3 — Upper Body + Core

```text
Bench Press                3 × 8
Lat Pulldown               3 × 8–12
Incline Dumbbell Press     3 × 10
Seated Cable Row           3 × 10
Lateral Raise              2 × 12–15
Biceps Curl                2 × 10–12
Triceps Pushdown           2 × 10–12

Plank                      3 × 30–60s
Dead Bug                   2 × 8–10/side
```

Không failure.

## Day 4 — Zone 2 + Mobility

```text
Zone 2                     35–45 min
Cat-Cow                    10 reps
90/90                      10/side
Hip Flexor Stretch         2 × 30–45s/side
Butterfly                  2 × 30–45s
Deep Squat Hold            2 × 20–30s
Breathing                  5 min
```

## Day 5 — Lower Body

Buổi chân chính cuối cùng.

```text
Squat / Leg Press          3 × 8
Romanian Deadlift          3 × 8–10
Bulgarian Split Squat      2 × 8/side
Hip Thrust                 3 × 10
Leg Curl                   2 × 12
Calf Raise                 3 × 12–15
Plank                      2 × 45–60s
```

Rule:
- Không PR.
- Không failure.
- Tránh DOMS nặng.

## Day 6 — Active Recovery

```text
Zone 2 / walk              25–35 min
Bird Dog                   2 × 10/side
Glute Bridge               2 × 15
Dead Bug                   2 × 10/side
Mobility                   5–10 min
```

## Day 7 — Light Full Body

Dùng khoảng 70–80% mức tạ thông thường.

```text
Goblet Squat               2 × 10
Dumbbell Bench             3 × 10
Lat Pulldown               3 × 10
Seated Row                 2 × 12
Hip Thrust                 2 × 10
Lateral Raise              2 × 15
Side Plank                 2 × 30s/side
```

Đây là buổi gym cuối cùng.

## Day 8 — Taper

```text
Walk                       30–40 min
90/90                      10/side
Hip Flexor Stretch         30s/side
Butterfly                  30s
Cat-Cow                    10 reps
Deep Squat Hold            20–30s
```

Không tập tạ.

## Day 9 — Recovery

```text
Optional walk              20–30 min
Mobility                   5–10 min
Breathing                  5 min
```

Không:
- Gym.
- HIIT.
- Running dài.
- Leg day.
- Kegel.

Sleep target: `8–9h`

## Day 10 — Ready Day

```text
No gym
Optional walk              10–20 min
Light mobility
Breathing                  5 min
```

Không Kegel.

---

# 14. Exercise instruction cards

Mỗi exercise phải có modal `How to`.

## 14.1. 90/90 hip rotation

```text
1. Ngồi trên sàn.
2. Gập hai gối khoảng 90 độ.
3. Một chân phía trước, một chân phía sau.
4. Giữ mông trên sàn.
5. Xoay hai chân sang phía đối diện.
6. Thực hiện chậm, không giật.
```

## 14.2. Hip flexor stretch

```text
1. Quỳ một gối.
2. Chân còn lại đặt phía trước.
3. Giữ lưng trung lập.
4. Siết nhẹ mông bên chân đang quỳ.
5. Đẩy hông nhẹ về trước.
6. Cảm giác căng phía trước hông, không đau lưng.
```

## 14.3. Butterfly

```text
1. Ngồi xuống.
2. Hai lòng bàn chân chạm nhau.
3. Đầu gối mở sang hai bên.
4. Giữ lưng tương đối thẳng.
5. Nghiêng nhẹ về trước.
6. Không dùng tay ép mạnh đầu gối.
```

## 14.4. Dead bug

```text
1. Nằm ngửa.
2. Hai tay hướng lên.
3. Hông và gối khoảng 90 độ.
4. Duỗi tay phải + chân trái.
5. Trở về.
6. Đổi bên.
7. Giữ lưng dưới ổn định.
```

## 14.5. Bird dog

```text
1. Chống bốn điểm.
2. Duỗi tay phải + chân trái.
3. Không xoay hông.
4. Giữ thân ổn định.
5. Trở về và đổi bên.
```

## 14.6. Glute bridge

```text
1. Nằm ngửa.
2. Co gối.
3. Bàn chân trên sàn.
4. Siết mông và nâng hông.
5. Giữ 1 giây.
6. Hạ chậm.
```

## 14.7. Hip thrust

```text
1. Lưng trên tựa ghế.
2. Bàn chân chắc trên sàn.
3. Đẩy hông lên bằng mông.
4. Dừng khoảng 1 giây ở đỉnh.
5. Không ưỡn lưng quá mức.
```

---

# 15. Pelvic floor / Kegel

Không gamify theo hướng càng nhiều càng tốt.

Ngày 2–7:

```text
Slow:
5 reps
Hold 3–5s
Relax 5s

Fast:
5–10 reps
1s contract
Relax fully
```

Day 8:

```text
5 slow + 5 fast
```

Day 9–10: `Rest`

Warning:

> More is not always better. Pelvic-floor muscles also need to relax.

> Do not repeatedly practice by stopping urine flow.

Có checkbox:

`Pelvic floor felt relaxed after session`

Nếu user chọn tight/sore/uncomfortable:

> Skip the next session and prioritize relaxation.

---

# 16. Breathing module

Bài mặc định:

```text
Inhale: 4 seconds
Exhale: 6 seconds
Duration: 3–5 minutes
```

Cho phép sử dụng nhiều lần trong ngày.

UI:
- Animated breathing circle.
- Countdown.
- Start / Pause / Reset.

Text:

> Keep the breath gentle. Do not force very deep breaths.

Nếu user nhập `dizzy`:

> Stop and return to normal breathing.

---

# 17. Sleep tracking

```ts
type SleepEntry = {
  date: string
  bedtime: string
  wakeTime: string
  napMinutes?: number
  quality: 1 | 2 | 3 | 4 | 5
  notes?: string
}
```

Targets:

- Bedtime: `23:30–23:45`
- Wake: `07:45`
- Nap: `13:15–13:45`

Dashboard:

```text
Night sleep: 8h 02m
Nap: 30m
Sleep target: ✓
```

Không tính nap như sự thay thế hoàn toàn cho ngủ đêm.

---

# 18. Hydration

Daily target default: `2.0–2.5 L`

UI:
- Add 250 ml.
- Add 500 ml.
- Custom amount.
- Progress ring.

Đồ uống log được:
- Water.
- Milk.
- Tea.
- Coffee.

---

# 19. Caffeine

User có uống trà nhài Cozy.

Cho phép log:

```text
Drink: Jasmine Tea
Volume: 500 ml
Tea bags: 2
Sugar: 1 sachet
Time: 10:30
```

Rule:

Nếu caffeine sau 15:00–16:00:

> Có thể ảnh hưởng giấc ngủ. Nếu bạn nhạy caffeine, cân nhắc chuyển sang đồ không caffeine.

---

# 20. Journal

Mỗi ngày có journal card.

### Morning

```text
Mức năng lượng sáng nay? 1–10
Đau cơ? 1–10
Stress? 1–10
Mood? 1–10
```

### Evening reflection

```text
Hôm nay cơ thể cảm thấy thế nào?
Buổi tập có quá nặng không?
Tiêu hóa có ổn không?
Tôi có cảm thấy stress / áp lực không?
Điều gì hôm nay tôi làm tốt?
Ngày mai muốn điều chỉnh điều gì?
```

Có textarea tự do:

`Write freely...`

---

# 21. Daily feelings timeline

Hiển thị timeline 10 ngày:

```text
Day 1  Energetic      8/10
Day 2  Recovered      8/10
Day 3  ...
```

Chart:
- Energy.
- Mood.
- Stress.
- Muscle soreness.
- Sleep.

---

# 22. Insights

Charts:

1. Sleep hours over 10 days.
2. Water intake.
3. Training load.
4. Daily readiness score.
5. Mood / stress.
6. Protein/carb completeness.
7. Checklist completion.

Không cần calorie chart nếu dữ liệu không chính xác.

---

# 23. Rules engine / Useful Advice

## Sleep
Nếu ngủ < 7h:

> Ưu tiên recovery hôm nay. Không cần tăng volume tập để “bù”.

Nếu ngủ >= 8h:

> Sleep target achieved. Keep the same rhythm.

## Training
Nếu soreness >= 7/10:

> Giảm tải hoặc chuyển sang recovery session.

Nếu Day >= 8:

> Avoid adding extra heavy training. The goal now is recovery.

## Nutrition
Nếu không có carb trước/sau tập:

> Thêm nguồn carb dễ tiêu nếu phù hợp: cơm, khoai, bánh mì hoặc chuối.

## Stress
Nếu stress >= 7:

> Try a 5-minute 4:6 breathing session.

---

# 24. Readiness day / Day 10 checklist

```text
[ ] Slept 8h+
[ ] Ate normal breakfast
[ ] Ate balanced lunch
[ ] No heavy gym
[ ] Hydrated
[ ] No excessive alcohol
[ ] No unverified enhancement products
[ ] Condom ready
[ ] Water/silicone-based lubricant ready
[ ] Comfortable meal 2–3h beforehand
[ ] 5-minute breathing
```

Text:

> The goal is comfort and readiness, not hitting a performance target.

Không hiển thị KPI về số lần quan hệ.

---

# 25. Meal before evening event

Gợi ý:

```text
1–1.5 bowls rice
120–180g fish/chicken/lean meat
vegetables
fruit if desired
water
```

Nếu đi date:
- Không ăn quá no.
- Không cần “food aphrodisiac”.
- Hàu có thể ăn như món giàu dinh dưỡng, không coi là thuốc tăng hiệu suất tức thời.
- Ưu tiên hải sản chín kỹ.

---

# 26. Initial data seed

Website phải seed dữ liệu đã có.

## Day 1

```json
{
  "day": 1,
  "training": "Full Body",
  "trainingCompleted": true,
  "sleepHours": 8,
  "dinner": [
    "250g chicken breast",
    "150g okra",
    "tomato",
    "2 boiled eggs",
    "2 bowls rice"
  ]
}
```

## Day 2

```json
{
  "day": 2,
  "training": "Zone 2 + Mobility + Kegel",
  "trainingCompleted": true,
  "sleepHours": 8,
  "breakfast": [
    "banana",
    "1/2 bowl rice",
    "meat / egg",
    "tomato",
    "180ml unsweetened Dalat Milk"
  ],
  "preWorkout": ["1 banana"],
  "dinner": [
    "chicken thigh",
    "bok choy",
    "2 small pork ribs"
  ]
}
```

## Day 3

Known morning items:

```json
{
  "day": 3,
  "plannedTraining": "Upper Body + Core",
  "morningExtras": [
    "1 TH unsweetened yogurt",
    "1 banana"
  ],
  "midMorningDrink": {
    "name": "Cozy jasmine tea",
    "volumeMl": 500,
    "teaBags": 2,
    "sugarSachets": 1
  }
}
```

Không tự đánh dấu Day 3 workout completed cho đến khi user check.

---

# 27. Grocery section

Mini grocery list:

```text
Protein:
[ ] Chicken
[ ] Eggs
[ ] Fish
[ ] Lean pork/beef

Carb:
[ ] Rice
[ ] Oats
[ ] Potatoes
[ ] Bread
[ ] Bananas

Vegetables:
[ ] Bok choy
[ ] Okra
[ ] Broccoli
[ ] Tomatoes
[ ] Seasonal greens

Dairy:
[ ] Unsweetened milk
[ ] Unsweetened yogurt
[ ] Greek yogurt
```

Có:
- quantity.
- bought checkbox.
- estimated price optional.

---

# 28. Settings

Cho phép cấu hình:

```text
Plan start date
Day 10 date
Wake time
Bedtime target
Work start
Work end
Lunch time
Nap time
Workout start
Water target
Dark/light mode
Privacy mode
```

Default:

```text
Wake: 07:45
Work: 08:45–18:00
Lunch: 12:30
Nap: 13:15–13:45
Workout: 18:15
Bed target: 23:30–23:45
```

---

# 29. Data export / backup

## Export JSON

Button: `Export Backup`

Tạo file:

```text
readiness-backup-YYYY-MM-DD.json
```

Bao gồm:
- logs.
- settings.
- journal.
- meal metadata.

Ảnh có thể export riêng dưới dạng ZIP nếu đơn giản triển khai được.

## Import

Cho phép import JSON backup.

## Delete data

Button danger: `Delete all local data`

Có confirmation modal.

---

# 30. PWA — optional bonus

Nếu đơn giản:

- Add web manifest.
- App icon.
- Installable trên điện thoại.
- Offline-first.

Không bắt buộc nếu làm chậm MVP.

---

# 31. Accessibility

Bắt buộc:

- Keyboard navigation.
- Contrast tốt.
- Buttons >= 44px mobile.
- Alt text cho ảnh meal.
- Không chỉ dựa vào màu để biểu thị trạng thái.

---

# 32. UX details

## Quick Add modal

Nút `+`:

```text
Add Meal
Add Water
Add Workout
Add Sleep
Add Journal
Add Photo
Add Mood
```

Mobile:
- Tap card để expand.
- Không cần gesture phức tạp.

---

# 33. Empty states

Meal:

> Chưa có bữa ăn nào được log.  
> Add your first meal →

Journal:

> No reflection yet.  
> Take 2 minutes to check in with yourself.

---

# 34. Success animation

Khi hoàn thành daily checklist:

`Day complete ✓`

Animation tinh tế, không confetti quá nhiều.

---

# 35. Privacy / tone

Không dùng các từ quá trực diện ở homepage.

Không hiển thị:
- “sex score”
- “erection score”
- “sexual performance score”

Thay bằng:
- Readiness.
- Recovery.
- Energy.
- Wellness.

Chỉ trong Day 10 checklist mới có mục cần thiết về condom/lubricant/alcohol/meal timing.

---

# 36. Folder structure đề xuất

```text
src/
  components/
    layout/
    dashboard/
    meals/
    training/
    journal/
    insights/
    ui/

  pages/
    TodayPage.tsx
    PlanPage.tsx
    MealsPage.tsx
    TrainingPage.tsx
    JournalPage.tsx
    InsightsPage.tsx
    SettingsPage.tsx

  data/
    initialPlan.ts
    foodLibrary.ts
    exerciseLibrary.ts
    adviceRules.ts

  db/
    index.ts
    schema.ts

  hooks/
    useDailyLog.ts
    useReadinessScore.ts
    useHydration.ts

  utils/
    readiness.ts
    nutrition.ts
    dates.ts
    export.ts

  types/
    index.ts

  App.tsx
  main.tsx
```

---

# 37. Data model tổng quát

```ts
type DailyLog = {
  id: string
  dayNumber: number
  date: string

  sleep?: SleepEntry
  meals: MealEntry[]
  hydrationMl: number

  workout?: WorkoutLog
  mobilityCompleted?: boolean
  kegelCompleted?: boolean
  breathingMinutes?: number

  caffeine?: DrinkLog[]
  alcoholUnits?: number

  energy?: number
  mood?: number
  stress?: number
  soreness?: number

  journal?: string

  checklist: ChecklistItem[]
}
```

---

# 38. Readiness score pseudo-code

```ts
score =
  sleepScore * 0.25 +
  nutritionScore * 0.20 +
  trainingScore * 0.20 +
  hydrationScore * 0.10 +
  recoveryScore * 0.10 +
  moodScore * 0.10 +
  avoidanceScore * 0.05
```

Clamp 0–100.

Không gọi đây là scientific health score.

---

# 39. Acceptance criteria

Dự án hoàn thành MVP khi:

- [ ] Chạy được `npm run dev`.
- [ ] Build thành công.
- [ ] Deploy được GitHub Pages.
- [ ] Có dashboard Day X/10.
- [ ] Có lịch cố định theo giờ.
- [ ] Có đầy đủ training 10 ngày.
- [ ] Có hướng dẫn từng exercise.
- [ ] Log được meal.
- [ ] Upload được ảnh meal.
- [ ] Ảnh vẫn còn sau refresh.
- [ ] Log water.
- [ ] Log sleep.
- [ ] Log workout completion.
- [ ] Log Kegel.
- [ ] Có breathing timer.
- [ ] Có journal.
- [ ] Có mood/stress/energy.
- [ ] Có charts.
- [ ] Có useful advice tự động.
- [ ] Có export/import.
- [ ] Có delete local data.
- [ ] Có dark mode.
- [ ] Mobile responsive.
- [ ] Initial seed Day 1–3 đúng dữ liệu đã biết.
- [ ] Không có backend bắt buộc.
- [ ] Không có tracker/analytics bên thứ ba mặc định.

---

# 40. Codex implementation order

## Phase 1 — Scaffold

1. Vite React TypeScript.
2. Tailwind.
3. Layout.
4. Theme.
5. Navigation.
6. Static 10-day plan.

## Phase 2 — Local storage

1. IndexedDB schema.
2. Daily logs.
3. Meals.
4. Photos.
5. Sleep.
6. Water.
7. Journal.

## Phase 3 — Dashboard

1. Checklist.
2. Progress.
3. Readiness score.
4. Today schedule.
5. Advice.

## Phase 4 — Training

1. Workout cards.
2. Exercise instructions.
3. Mobility.
4. Kegel.
5. Breathing timer.

## Phase 5 — Insights

1. Charts.
2. Trends.
3. Completion history.

## Phase 6 — Backup

1. JSON export.
2. Import.
3. Reset.

## Phase 7 — Deploy

1. GitHub Pages config.
2. Test static asset paths.
3. Mobile QA.

---

# 41. Final instruction to Codex

Hãy xây website này như một **personal health / recovery dashboard chất lượng production**, dù chạy local-first.

Ưu tiên:

1. UX đẹp.
2. Mobile usability.
3. Privacy.
4. Data persistence.
5. Clear feedback.
6. Maintainable TypeScript.
7. Không over-engineer.

Không thêm backend nếu chưa cần.
Không thêm authentication ở MVP.
Không thêm AI API ở MVP.

Các lời khuyên trong app phải mang tính general wellness, tránh khẳng định chẩn đoán hoặc hiệu quả y khoa.

Khi hoàn thành:
- cung cấp README.
- hướng dẫn chạy localhost.
- hướng dẫn deploy GitHub Pages.
- mô tả data storage.
- mô tả backup/restore.
- liệt kê các file chính đã tạo.
