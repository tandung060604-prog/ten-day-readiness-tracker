import { useEffect, useMemo, useState } from 'react'
import { BreathingTimer } from './components/BreathingTimer'
import { PhotoStrip } from './components/PhotoStrip'
import { clearPhotos } from './db/photos'
import { defaultSettings, deskBreaks, schedule, seededLogs, trainingPlan } from './data/plan'
import type { AppSettings, DailyLog, FoodItem, MealEntry, MealType } from './types'

const STORAGE_KEY = 'ten-day-readiness-v1'
const SETTINGS_KEY = 'ten-day-readiness-settings-v1'
const tabs = ['Today', '10-Day Plan', 'Meals', 'Training', 'Journal', 'Insights', 'Settings'] as const
type Tab = typeof tabs[number]

const mealLabels: Record<MealType, string> = {
  breakfast: 'Bữa sáng', snack: 'Snack', lunch: 'Bữa trưa', 'pre-workout': 'Pre-workout', dinner: 'Bữa tối', other: 'Khác',
}

function loadLogs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '') as DailyLog[] } catch { return seededLogs }
}
function loadSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '') } as AppSettings } catch { return defaultSettings }
}

function readiness(log: DailyLog, target: number) {
  const sleepScore = Math.min(100, ((log.sleep?.nightHours || 0) / 8) * 100)
  const cats = new Set(log.meals.flatMap((m) => m.foods.map((f) => f.category)))
  const nutritionScore = Math.min(100, [cats.has('protein'), cats.has('carb'), cats.has('vegetable'), cats.has('fruit') || cats.has('dairy')].filter(Boolean).length * 25)
  const trainingScore = log.workout?.completed ? 100 : 45
  const hydrationScore = Math.min(100, log.hydrationMl / target * 100)
  const recoveryScore = Math.min(100, (Number(log.mobilityCompleted) * 45) + Math.min(55, log.breathingMinutes * 11))
  const moodScore = Math.max(0, Math.min(100, ((log.energy || 5) + (log.mood || 5) + (10 - (log.stress || 5))) / 3 * 10))
  const avoidanceScore = 100
  return Math.round(sleepScore*.25 + nutritionScore*.2 + trainingScore*.2 + hydrationScore*.1 + recoveryScore*.1 + moodScore*.1 + avoidanceScore*.05)
}

function ProgressRing({ value }: { value: number }) {
  const r = 44, c = 2 * Math.PI * r
  return <div className="ring-wrap">
    <svg viewBox="0 0 110 110" className="ring">
      <circle cx="55" cy="55" r={r} className="ring-bg" />
      <circle cx="55" cy="55" r={r} className="ring-value" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
    <div className="ring-number"><strong>{value}</strong><span>/100</span></div>
  </div>
}

function BarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return <div className="bar-chart">{data.map((d) => <div className="bar-row" key={d.label}>
    <span>{d.label}</span><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, d.value/d.max*100)}%` }} /></div><b>{d.value}</b>
  </div>)}</div>
}

function Advice({ log, day }: { log: DailyLog; day: number }) {
  const tips: string[] = []
  const cats = new Set(log.meals.flatMap(m => m.foods.map(f => f.category)))
  if ((log.sleep?.nightHours || 0) < 7 && log.sleep) tips.push('Ngủ dưới 7h: ưu tiên recovery, đừng tăng volume để “bù”.')
  if (log.sleep && log.sleep.nightHours >= 8) tips.push('Sleep target achieved. Giữ nguyên nhịp ngủ này.')
  if (log.workout?.completed && !cats.has('carb')) tips.push('Sau tập chưa thấy carb rõ ràng: cân nhắc cơm, khoai, bánh mì hoặc chuối.')
  if (!cats.has('vegetable')) tips.push('Thêm khoảng 150–250g rau để bữa trong ngày cân bằng hơn.')
  if ((log.stress || 0) >= 7) tips.push('Stress cao: thử 5 phút thở 4:6.')
  if (day >= 8) tips.push('Giai đoạn taper: không thêm buổi nặng. Mục tiêu bây giờ là hồi phục.')
  if (!tips.length) tips.push('Bạn đang đi đúng nhịp. Giữ bữa ăn quen thuộc, tập đúng lịch và ngủ đủ.')
  return <div className="tip-list">{tips.slice(0, 3).map((t, i) => <div className="tip" key={i}><span>✦</span><p>{t}</p></div>)}</div>
}

function App() {
  const [tab, setTab] = useState<Tab>('Today')
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs)
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [mealModal, setMealModal] = useState(false)
  const [exerciseModal, setExerciseModal] = useState<{ name: string; prescription: string; instructions: string[] } | null>(null)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)) }, [logs])
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); document.documentElement.dataset.theme = settings.theme }, [settings])

  const day = Math.min(10, Math.max(1, settings.currentDay))
  const log = logs.find((l) => l.dayNumber === day) || logs[day - 1]
  const plan = trainingPlan[day - 1]
  const score = readiness(log, settings.waterTargetMl)
  const updateLog = (fn: (current: DailyLog) => DailyLog) => setLogs((all) => all.map((l) => l.dayNumber === day ? fn(l) : l))

  const toggleChecklist = (id: string) => updateLog((l) => ({ ...l, checklist: l.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c) }))
  const addWater = (amount: number) => updateLog((l) => ({ ...l, hydrationMl: Math.max(0, l.hydrationMl + amount) }))
  const toggleWorkout = () => updateLog((l) => ({ ...l, workout: { title: l.workout?.title || plan.title, completed: !l.workout?.completed } }))
  const setMetric = (key: 'energy'|'mood'|'stress'|'soreness', value: number) => updateLog(l => ({ ...l, [key]: value }))

  const exportData = () => {
    const data = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), settings, logs }, null, 2)
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `readiness-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    const parsed = JSON.parse(await file.text())
    if (parsed.logs) setLogs(parsed.logs)
    if (parsed.settings) setSettings({ ...defaultSettings, ...parsed.settings })
  }

  const resetData = async () => {
    if (!confirm('Xóa toàn bộ dữ liệu local và ảnh?')) return
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(SETTINGS_KEY); await clearPhotos(); setLogs(seededLogs); setSettings(defaultSettings)
  }

  const appTitle = settings.privacyMode ? 'Daily Wellness Tracker' : settings.title

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="logo">10</div><div><strong>{appTitle}</strong><small>Local-first · private</small></div></div>
      <nav>{tabs.map(t => <button className={tab===t?'active':''} key={t} onClick={() => setTab(t)}><span>{iconFor(t)}</span>{t}</button>)}</nav>
      <div className="sidebar-bottom"><div className="privacy-chip">● Local only</div><small>Photos never leave this device.</small></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><small className="eyebrow">{appTitle}</small><h1>{tab}</h1></div>
        <div className="top-actions">
          <select aria-label="Chọn ngày" value={day} onChange={e => setSettings(s => ({...s, currentDay:Number(e.target.value)}))}>{Array.from({length:10},(_,i)=><option key={i} value={i+1}>Day {i+1}</option>)}</select>
          <button className="icon-btn" onClick={() => setSettings(s => ({...s, theme:s.theme==='dark'?'light':'dark'}))}>{settings.theme==='dark'?'☀':'☾'}</button>
          <button className="primary compact" onClick={() => setMealModal(true)}>＋ Add</button>
        </div>
      </header>

      {tab === 'Today' && <TodayView log={log} plan={plan} day={day} score={score} settings={settings} toggleChecklist={toggleChecklist} addWater={addWater} toggleWorkout={toggleWorkout} updateLog={updateLog} setMetric={setMetric} onExercise={setExerciseModal} />}
      {tab === '10-Day Plan' && <PlanView currentDay={day} logs={logs} onDay={(d)=>setSettings(s=>({...s,currentDay:d}))} onTraining={()=>setTab('Training')} />}
      {tab === 'Meals' && <MealsView logs={logs} currentDay={day} setLogs={setLogs} onAdd={()=>setMealModal(true)} />}
      {tab === 'Training' && <TrainingView day={day} plan={plan} log={log} toggleWorkout={toggleWorkout} updateLog={updateLog} onExercise={setExerciseModal} />}
      {tab === 'Journal' && <JournalView logs={logs} day={day} updateLog={updateLog} setMetric={setMetric} />}
      {tab === 'Insights' && <InsightsView logs={logs} settings={settings} />}
      {tab === 'Settings' && <SettingsView settings={settings} setSettings={setSettings} exportData={exportData} importData={importData} resetData={resetData} />}
    </main>

    <div className="mobile-nav">{(['Today','10-Day Plan','Meals','Journal','Insights'] as Tab[]).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}><span>{iconFor(t)}</span><small>{t==='10-Day Plan'?'Plan':t}</small></button>)}</div>

    {mealModal && <MealModal day={day} onClose={()=>setMealModal(false)} onSave={(meal)=>{updateLog(l=>({...l,meals:[...l.meals,meal]}));setMealModal(false)}} />}
    {exerciseModal && <Modal title={exerciseModal.name} onClose={()=>setExerciseModal(null)}><div className="exercise-detail"><div className="prescription">{exerciseModal.prescription}</div><ol>{exerciseModal.instructions.map((x,i)=><li key={i}>{x}</li>)}</ol></div></Modal>}
  </div>
}

function iconFor(tab: Tab) {
  return ({'Today':'◉','10-Day Plan':'▦','Meals':'◒','Training':'⌁','Journal':'✎','Insights':'⌁','Settings':'⚙'} as Record<Tab,string>)[tab]
}

function TodayView({ log, plan, day, score, settings, toggleChecklist, addWater, toggleWorkout, updateLog, setMetric, onExercise }:{
  log:DailyLog; plan:typeof trainingPlan[number]; day:number; score:number; settings:AppSettings; toggleChecklist:(id:string)=>void; addWater:(n:number)=>void; toggleWorkout:()=>void;
  updateLog:(fn:(l:DailyLog)=>DailyLog)=>void; setMetric:(k:'energy'|'mood'|'stress'|'soreness',v:number)=>void; onExercise:(e:any)=>void
}) {
  const remaining = 10-day
  return <>
    <section className="hero-card">
      <div><span className="pill">DAY {day} OF 10</span><h2>{remaining ? `${remaining} ngày còn lại` : 'Ready Day'}</h2><p>Build energy. Track recovery. Arrive ready.</p><div className="hero-meta"><span>⏰ Wake {settings.wakeTime}</span><span>🏋 Workout {settings.workoutStart}</span><span>🌙 Bed {settings.bedtimeTarget}</span></div></div>
      <ProgressRing value={score} />
    </section>

    <div className="grid-2">
      <section className="card">
        <div className="section-head"><div><small>TODAY</small><h3>Checklist</h3></div><span>{log.checklist.filter(c=>c.done).length}/{log.checklist.length}</span></div>
        <div className="checklist">{log.checklist.map(c=><label key={c.id} className={c.done?'done':''}><input type="checkbox" checked={c.done} onChange={()=>toggleChecklist(c.id)} /><span className="checkmark">✓</span><span>{c.label}</span></label>)}</div>
      </section>
      <section className="card">
        <div className="section-head"><div><small>READINESS</small><h3>Useful advice</h3></div><span className="soft-badge">General wellness</span></div>
        <Advice log={log} day={day}/>
      </section>
    </div>

    <div className="grid-3">
      <section className="metric-card water"><small>HYDRATION</small><h3>{log.hydrationMl.toLocaleString()} <span>ml</span></h3><div className="progress"><div style={{width:`${Math.min(100,log.hydrationMl/settings.waterTargetMl*100)}%`}} /></div><p>Target {settings.waterTargetMl.toLocaleString()} ml</p><div className="actions"><button onClick={()=>addWater(250)}>+250</button><button onClick={()=>addWater(500)}>+500</button></div></section>
      <section className="metric-card"><small>SLEEP</small><h3>{log.sleep?.nightHours ?? '—'} <span>hours</span></h3><p>{log.sleep ? `Nap ${log.sleep.napMinutes||0} min · Quality ${log.sleep.quality}/5` : 'Log sleep tonight'}</p><div className="sleep-dots">{[1,2,3,4,5].map(x=><i key={x} className={(log.sleep?.quality||0)>=x?'on':''}/>)}</div></section>
      <section className="metric-card"><small>TRAINING</small><h3 className="workout-title">{plan.title}</h3><p>{plan.subtitle}</p><button className={log.workout?.completed?'success wide':'primary wide'} onClick={toggleWorkout}>{log.workout?.completed?'✓ Completed':'Mark complete'}</button></section>
    </div>

    <section className="card">
      <div className="section-head"><div><small>NEXT UP</small><h3>{plan.title}</h3></div><span className="soft-badge">Day {day}</span></div>
      <div className="exercise-grid">{plan.exercises.slice(0,6).map(e=><button className="exercise-card" key={e.name} onClick={()=>onExercise(e)}><div><strong>{e.name}</strong><small>{e.prescription}</small></div><span>›</span></button>)}</div>
    </section>

    <div className="grid-2">
      <section className="card"><div className="section-head"><div><small>SCHEDULE</small><h3>Workday rhythm</h3></div></div><div className="timeline compact-timeline">{schedule.slice(4,15).map(([time,label])=><div key={time}><time>{time}</time><span>{label}</span></div>)}</div></section>
      <section className="card"><div className="section-head"><div><small>CODER MODE</small><h3>Desk breaks</h3></div></div><div className="desk-grid">{deskBreaks.map(([time,label])=><button key={time}><strong>{time}</strong><span>{label}</span><i>Done</i></button>)}</div></section>
    </div>

    <BreathingTimer onMinutes={(m)=>updateLog(l=>({...l,breathingMinutes:l.breathingMinutes+m}))}/>
    <section className="card"><div className="section-head"><div><small>CHECK-IN</small><h3>How are you feeling?</h3></div></div><div className="slider-grid">{(['energy','mood','stress','soreness'] as const).map(k=><label key={k}><span>{k}<b>{log[k] ?? 5}/10</b></span><input type="range" min="1" max="10" value={log[k]??5} onChange={e=>setMetric(k,Number(e.target.value))}/></label>)}</div></section>
  </>
}

function PlanView({ currentDay, logs, onDay, onTraining }:{currentDay:number;logs:DailyLog[];onDay:(d:number)=>void;onTraining:()=>void}) {
  return <section className="card"><div className="section-head"><div><small>10-DAY ARC</small><h3>Build → Taper → Ready</h3></div></div><div className="plan-list">{trainingPlan.map(p=>{
    const l=logs.find(x=>x.dayNumber===p.day); const done=l?.workout?.completed
    return <button key={p.day} onClick={()=>{onDay(p.day);onTraining()}} className={currentDay===p.day?'current':''}><div className={`day-node ${done?'done':''}`}>{done?'✓':p.day}</div><div><strong>{p.title}</strong><span>{p.subtitle}</span></div><div className="plan-status">{done?'Completed':p.day===currentDay?'Today':'Planned'} ›</div></button>
  })}</div></section>
}

function MealsView({ logs, currentDay, setLogs, onAdd }:{logs:DailyLog[];currentDay:number;setLogs:React.Dispatch<React.SetStateAction<DailyLog[]>>;onAdd:()=>void}) {
  const log=logs.find(l=>l.dayNumber===currentDay)!
  const updateMeal=(mealId:string, ids:string[])=>setLogs(all=>all.map(l=>l.dayNumber===currentDay?{...l,meals:l.meals.map(m=>m.id===mealId?{...m,photoIds:ids}:m)}:l))
  return <>
    <section className="card"><div className="section-head"><div><small>DAY {currentDay}</small><h3>Meal log</h3></div><button className="primary" onClick={onAdd}>＋ Add meal</button></div>
      {!log.meals.length?<div className="empty"><div>◒</div><h3>Chưa có bữa ăn nào</h3><p>Add your first meal →</p></div>:<div className="meal-list">{log.meals.map(m=><article className="meal-card" key={m.id}><div className="meal-head"><div><span className="meal-type">{mealLabels[m.mealType]}</span><time>{m.time}</time></div><span>{m.foods.length} items</span></div><div className="food-tags">{m.foods.map(f=><span key={f.id} className={`food ${f.category||'other'}`}>{f.name}{f.amount?` · ${f.amount}${f.unit||''}`:''}</span>)}</div>{m.notes&&<p className="meal-note">{m.notes}</p>}<PhotoStrip photoIds={m.photoIds||[]} onChange={ids=>updateMeal(m.id,ids)}/><div className="privacy-note">🔒 Photos are stored locally on this device only.</div></article>)}</div>}
    </section>
    <section className="card"><div className="section-head"><div><small>QUICK GUIDE</small><h3>Balanced meal</h3></div></div><div className="macro-grid"><div><b>Protein</b><span>Gà · cá · trứng · thịt nạc</span></div><div><b>Carb</b><span>Cơm · khoai · oats · chuối</span></div><div><b>Vegetables</b><span>150–250g mỗi bữa chính</span></div><div><b>Fruit / dairy</b><span>1–2 phần mỗi ngày</span></div></div></section>
  </>
}

function MealModal({day,onClose,onSave}:{day:number;onClose:()=>void;onSave:(m:MealEntry)=>void}) {
  const [type,setType]=useState<MealType>('dinner'); const [time,setTime]=useState('20:30'); const [foods,setFoods]=useState(''); const [notes,setNotes]=useState('')
  const save=()=>{if(!foods.trim())return;const items:FoodItem[]=foods.split(',').map((name,i)=>({id:`f-${Date.now()}-${i}`,name:name.trim(),category:'other'}));onSave({id:`meal-${Date.now()}`,day,mealType:type,time,foods:items,notes})}
  return <Modal title="Add meal" onClose={onClose}><div className="form-grid"><label>Meal<select value={type} onChange={e=>setType(e.target.value as MealType)}>{Object.entries(mealLabels).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label><label>Time<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label><label className="full">Foods <small>(ngăn cách bằng dấu phẩy)</small><textarea value={foods} onChange={e=>setFoods(e.target.value)} placeholder="Ví dụ: 200g cá, 2 bát cơm, cải chíp, chuối"/></label><label className="full">Notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Cảm giác no, tiêu hóa, ghi chú..."/></label><button className="primary full" onClick={save}>Save meal</button></div></Modal>
}

function TrainingView({day,plan,log,toggleWorkout,updateLog,onExercise}:{day:number;plan:typeof trainingPlan[number];log:DailyLog;toggleWorkout:()=>void;updateLog:(fn:(l:DailyLog)=>DailyLog)=>void;onExercise:(e:any)=>void}) {
  return <>
    <section className="training-hero"><div><span className="pill">DAY {day}</span><h2>{plan.title}</h2><p>{plan.subtitle}</p></div><button className={log.workout?.completed?'success':'primary'} onClick={toggleWorkout}>{log.workout?.completed?'✓ Workout completed':'Complete workout'}</button></section>
    <section className="card"><div className="section-head"><div><small>SESSION</small><h3>Exercises</h3></div></div><div className="training-list">{plan.exercises.map((e,i)=><button key={e.name} onClick={()=>onExercise(e)}><span className="num">{String(i+1).padStart(2,'0')}</span><div><strong>{e.name}</strong><small>{e.prescription}</small></div><span>How to ›</span></button>)}</div><div className="note-box">{plan.notes.map(n=><span key={n}>• {n}</span>)}</div></section>
    <div className="grid-2"><section className="card"><div className="section-head"><div><small>PELVIC FLOOR</small><h3>Kegel — light dose</h3></div></div><div className="kegel"><div><strong>Slow</strong><b>5 reps</b><span>Hold 3–5s · relax 5s</span></div><div><strong>Fast</strong><b>5–10</b><span>1s contract · relax fully</span></div></div><p className="muted">More is not always better. Pelvic-floor muscles also need to relax.</p><button className={log.kegelCompleted?'success wide':'wide'} onClick={()=>updateLog(l=>({...l,kegelCompleted:!l.kegelCompleted}))}>{log.kegelCompleted?'✓ Logged':'Log Kegel'}</button></section><BreathingTimer onMinutes={(m)=>updateLog(l=>({...l,breathingMinutes:l.breathingMinutes+m}))}/></div>
  </>
}

function JournalView({logs,day,updateLog,setMetric}:{logs:DailyLog[];day:number;updateLog:(fn:(l:DailyLog)=>DailyLog)=>void;setMetric:(k:'energy'|'mood'|'stress'|'soreness',v:number)=>void}) {
  const log=logs.find(l=>l.dayNumber===day)!
  return <div className="grid-2 journal-layout"><section className="card"><div className="section-head"><div><small>DAY {day}</small><h3>Evening reflection</h3></div></div><div className="slider-grid">{(['energy','mood','stress','soreness'] as const).map(k=><label key={k}><span>{k}<b>{log[k]??5}/10</b></span><input type="range" min="1" max="10" value={log[k]??5} onChange={e=>setMetric(k,Number(e.target.value))}/></label>)}</div><label className="journal-box"><span>Viết tự do</span><textarea value={log.journal||''} onChange={e=>updateLog(l=>({...l,journal:e.target.value}))} placeholder={'Hôm nay cơ thể cảm thấy thế nào?\nBuổi tập có quá nặng không?\nTôi làm tốt điều gì?\nNgày mai muốn điều chỉnh gì?'} /></label></section><section className="card"><div className="section-head"><div><small>TIMELINE</small><h3>10-day feelings</h3></div></div><div className="feelings">{logs.map(l=><div key={l.dayNumber}><span>Day {l.dayNumber}</span><div className="feeling-dot" style={{opacity:.25+((l.energy||5)/14)}}/><strong>{l.energy?`${l.energy}/10`:'—'}</strong><small>{l.journal?l.journal.slice(0,62)+(l.journal.length>62?'…':''):'No reflection yet.'}</small></div>)}</div></section></div>
}

function InsightsView({logs,settings}:{logs:DailyLog[];settings:AppSettings}) {
  const activeLogs=logs.filter(l=>l.dayNumber<=settings.currentDay); const scores=activeLogs.map(l=>readiness(l,settings.waterTargetMl)); const sleep=activeLogs.map(l=>({label:`D${l.dayNumber}`,value:l.sleep?.nightHours||0,max:9})); const water=activeLogs.map(l=>({label:`D${l.dayNumber}`,value:Math.round(l.hydrationMl/100)/10,max:3}));
  return <><div className="grid-3"><section className="metric-card"><small>AVG READINESS</small><h3>{Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}<span>/100</span></h3><p>Personal adherence score</p></section><section className="metric-card"><small>WORKOUTS</small><h3>{activeLogs.filter(l=>l.workout?.completed).length}<span>/{activeLogs.length}</span></h3><p>Completed sessions</p></section><section className="metric-card"><small>8H SLEEP DAYS</small><h3>{activeLogs.filter(l=>(l.sleep?.nightHours||0)>=8).length}<span>days</span></h3><p>Consistency matters</p></section></div><div className="grid-2"><section className="card"><div className="section-head"><div><small>TREND</small><h3>Sleep hours</h3></div></div><BarChart data={sleep}/></section><section className="card"><div className="section-head"><div><small>TREND</small><h3>Hydration · L</h3></div></div><BarChart data={water}/></section></div><section className="card disclaimer">This dashboard is a personal adherence and wellness tracker, not a medical assessment.</section></>
}

function SettingsView({settings,setSettings,exportData,importData,resetData}:{settings:AppSettings;setSettings:React.Dispatch<React.SetStateAction<AppSettings>>;exportData:()=>void;importData:(f:File|undefined)=>void;resetData:()=>void}) {
  const field=(label:string,key:keyof AppSettings)=><label>{label}<input value={String(settings[key])} onChange={e=>setSettings(s=>({...s,[key]: typeof s[key]==='number'?Number(e.target.value):e.target.value}))}/></label>
  return <><section className="card"><div className="section-head"><div><small>PREFERENCES</small><h3>Schedule & privacy</h3></div></div><div className="form-grid">{field('App title','title')}{field('Wake time','wakeTime')}{field('Bedtime target','bedtimeTarget')}{field('Work start','workStart')}{field('Work end','workEnd')}{field('Workout start','workoutStart')}{field('Water target (ml)','waterTargetMl')}<label className="toggle-line"><span>Privacy mode<small>Đổi tên app thành Daily Wellness Tracker</small></span><input type="checkbox" checked={settings.privacyMode} onChange={e=>setSettings(s=>({...s,privacyMode:e.target.checked}))}/></label></div></section><section className="card"><div className="section-head"><div><small>DATA</small><h3>Backup & restore</h3></div></div><div className="data-actions"><button className="primary" onClick={exportData}>Export backup</button><label className="button-file">Import JSON<input type="file" accept="application/json" onChange={e=>importData(e.target.files?.[0])}/></label><button className="danger" onClick={resetData}>Delete all local data</button></div><p className="privacy-note">Data and meal photos are local-first. No analytics or cloud upload is included.</p></section></>
}

function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><div className="modal"><div className="modal-head"><h3>{title}</h3><button onClick={onClose}>×</button></div>{children}</div></div> }

export default App
