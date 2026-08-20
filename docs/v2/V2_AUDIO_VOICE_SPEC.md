# LITTLE DAYS V2 — AUDIO & VOICE ARCHITECTURE SPECIFICATION

## 1. Overview
In Little Days V2, the audio engine is designed as a **hierarchical, single-context Web Audio API architecture** providing independent mixing, real-time procedural sound synthesis, audio ducking during speech, and zero external MP3 dependencies for essential gameplay soundscapes.

---

## 2. Audio Bus Hierarchy

```text
                                  ┌────────────────────────┐
                                  │      AudioContext      │
                                  └───────────┬────────────┘
                                              │
                                  ┌───────────▼────────────┐
                                  │       MasterGain       │
                                  └───────────┬────────────┘
         ┌──────────────────┬─────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                 ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│    BGM Gain    │ │ Ambience Gain  │ │    SFX Gain    │ │   Vocal Gain   │ │ Narration Gain │
└───────┬────────┘ └───────┬────────┘ └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
        ▼                  ▼                  ▼                  ▼                  ▼
  [Music Loops]     [Soundscapes]      [UI / Rewards]    [Mascot Squeaks]    [TTS / Speech]
```

### Bus Separation & Defaults:
| Bus Name | Default Volume | Description & Routing |
|---|---|---|
| **Master** | `0.80` | Master volume scaling all downstream buses |
| **BGM** | `0.45` | Background music loops with automatic ducking |
| **Ambience** | `0.50` | Procedural soundscapes (Rain, Ocean, 432Hz Zen, Fireplace) |
| **SFX** | `0.65` | UI clicks, transition chimes, achievement fanfares |
| **Vocal** | `0.70` | Procedurally synthesized mascot chirps and exclamations |
| **Narration** | `0.85` | Vietnamese spoken guidance via Web Speech Synthesis |

---

## 3. Audio Ducking Algorithm
When a character vocalization or narration speech begins:
1. **Ducking Ramp-Down**: BGM gain drops to **35% of its set volume** over `250ms` using exponential ramp curve `exponentialRampToValueAtTime`.
2. **Hold**: BGM stays lowered while speech is active.
3. **Smooth Recovery**: Once speech ends, BGM gain ramps back up to **100% of its set volume** over `500ms`.

---

## 4. Accessibility & Subtitle Subsystem
- **Real-Time Subtitle Toast**: Any spoken line or narration emits a `subtitle-event` listened to by `AudioSubtitleToast.tsx`.
- **Mute & Voice Settings**: Users can mute all audio, disable voice only while keeping subtitles active, or customize each bus slider in `AudioMixerModal.tsx`.
- **Tab Visibility Handler**: When `document.hidden` is true (user switches tabs), the shared `AudioContext` automatically suspends; when active, it resumes without stutter.
