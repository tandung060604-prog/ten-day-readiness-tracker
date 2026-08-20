# CHARACTER STATE MACHINE SPECIFICATION

## 1. State Definition Matrix

The mascot companion lifecycle is strictly governed by a 14-state typed finite state machine:

```text
               ┌─────────────┐
               │    IDLE     │◄───────────────────┐
               └──────┬──────┘                    │
          ┌───────────┼───────────┐               │
          ▼           ▼           ▼               │
     ┌─────────┐ ┌─────────┐ ┌─────────┐          │
     │ WALKING │ │ SLEEPING│ │ THINKING│          │
     └────┬────┘ └────┬────┘ └────┬────┘          │
          │           │           │               │
          ▼           ▼           ▼               │
     ┌─────────┐ ┌─────────┐ ┌─────────┐          │
     │ RUNNING │ │  HAPPY  │ │SURPRISED│          │
     └────┬────┘ └────┬────┘ └────┬────┘          │
          │           │           │               │
          ▼           ▼           ▼               │
   ┌─────────────┐ ┌─────────────┐ ┌─────────┐    │
   │  TRAINING   │ │ CELEBRATING │ │ EATING  │    │
   └──────┬──────┘ └──────┬──────┘ └────┬────┘    │
          │               │             │         │
          ▼               ▼             ▼         │
   ┌─────────────┐ ┌─────────────┐ ┌─────────┐    │
   │   HUGGING   │ │ INTERACTING │ │ VICTORY │    │
   └─────────────┴───────────────┴───────────┴────┘
```

---

## 2. Character States & Behaviors

| State | Visual Animation | Audio Trigger | Allowed Transitions | Trigger Condition |
|---|---|---|---|---|
| `idle` | Gentle breathing bounce | Soft chime | `walking`, `thinking`, `happy`, `sleeping`, `interacting` | Default resting state |
| `walking` | Left-right step waddle | Footstep taps | `idle`, `running`, `surprised` | Navigating between landmarks |
| `running` | Fast hurried dash | Quick patter | `idle`, `victory`, `surprised` | Sprints (Usagi pulling luggage, etc.) |
| `happy` | Cheerful bobbing + sparkles | Cute squeak | `idle`, `celebrating`, `hugging` | Positive check-in or quest progress |
| `sad` | Gentle drooping ears/whimper | Low soft tone | `idle`, `thinking` | Missed goals or low energy log |
| `sleeping` | Floating Zzz particles | Gentle lullaby | `idle`, `surprised` | Night time or Sleep Haven interior |
| `eating` | Chewing motion with food item | Mogu-mogu crunch | `idle`, `happy` | Little Market meal plan or date meal |
| `training` | High-energy bouncing jumps | Whistle & cheer | `idle`, `victory` | Dojo gym workout plan active |
| `celebrating` | Confetti burst & spins | Fanfare brass | `idle`, `victory` | Milestone reached or quest claimed |
| `thinking` | Pondering bubble `...?` | Clock tick | `idle`, `happy`, `surprised` | Choosing date idea / viewing stats |
| `surprised` | Exclamation mark `!` jump | Pop chime | `idle`, `happy`, `celebrating` | Unexpected reward or milestone |
| `hugging` | Heart particles + blush | Warm chord | `idle`, `happy` | High bond duo interaction |
| `interacting` | Speech bubble active | Vocalization chirp | `idle`, `happy` | User clicks companion avatar |
| `victory` | Trophy pose + starry sparkles | Achievement jingle | `idle`, `celebrating` | 100% daily readiness score |

---

## 3. Transition Rules & Invariants
1. **No Invalid Teleportation**: A companion cannot transition directly from `sleeping` to `running` without waking up (`idle` or `surprised`).
2. **Auto-Reversion**: Ephemeral states (`celebrating`, `surprised`, `victory`, `interacting`) automatically revert to `idle` after their animation duration expires (typically 2.5s – 4.0s).
3. **Context Sensitivity**: Entering a building scene immediately triggers appropriate state overrides (e.g. entering `gym` triggers `training`, entering `sleep` triggers `sleeping`).
