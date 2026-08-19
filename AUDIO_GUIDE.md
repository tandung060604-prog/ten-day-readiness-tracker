# Little Days — Audio Architecture & Sound Guide

## 1. Web Audio Synthesizer Engine
All game interaction SFX and transition sounds are synthesized in real-time using `window.AudioContext` oscillators (sine, triangle, exponential frequency ramps).

## 2. Background Music
- Default track: *SECRET - ANH TRAI 'SAY HI'* (Video ID `FqpR7HOCgP0`).
- Volume levels:
  - Default BGM: ~20–25%
  - Default SFX: ~40–50%
- Persistent volume & mute settings saved in `localStorage`.
