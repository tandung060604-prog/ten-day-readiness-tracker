# PHASE 06 — AUDIO AND VOICE V2

## Goal

Replace prototype audio behavior with a reusable game audio system.

---

## Audio Architecture

Create one shared manager:

```text
AudioManager
├── Master
├── BGM
├── Ambience
├── SFX
├── Character Vocal
└── Narration
```

Expose independent volume controls:

- Master
- Music
- Ambience
- SFX
- Voice

---

## Critical Technical Rule

Do not create a new `AudioContext` for every interaction.

Use:

- one shared context/manager;
- cached buffers;
- pooling;
- suspend/resume;
- visibility handling;
- safe unlock after user gesture.

---

## BGM

Use local or clearly licensed loops where practical.

Do not make the product depend on one YouTube source.

Suggested scene identities:

- World Map — cozy daytime theme
- Home — warm piano/acoustic
- Gym — playful energetic percussion
- Water — soft bells/water
- Sleep — music box/ambient
- Library — piano/page ambience
- Market — cheerful acoustic
- Restaurant — romantic instrumental
- Airport — airy travel
- Beach — tropical acoustic
- Wellness — very soft calming ambience

---

## Ambience

Separate ambience from music.

Examples:

- Home: fireplace/birds
- Library: page turns
- Beach: waves
- Market: distant crowd
- Sleep: night insects
- Airport: terminal room tone

Use randomized intervals for incidental sounds.

Avoid repetitive loops that become annoying.

---

## Character Vocalization

Use original short sounds.

Chiikawa direction:

- soft squeak;
- surprised chirp;
- tiny cheer;
- shy giggle.

Usagi direction:

- energetic original exclamation;
- jump sound;
- victory yell;
- chaotic laugh.

Do not use ripped anime clips.

---

## Narration

For longer Vietnamese speech:

Priority:

1. user-provided/local recorded voice with explicit consent;
2. optional supported TTS provider if later configured;
3. browser Speech Synthesis fallback;
4. subtitles-only fallback.

Do not pretend browser TTS is a real character voice.

---

## Voice Profiles

Chiikawa dialogue style:

- softer;
- shorter sentences;
- warmer;
- slightly slower.

Usagi:

- shorter bursts;
- energetic;
- playful;
- faster cadence.

Personality should come from writing and timing, not only pitch shifting.

---

## Ducking

When narration/voice plays:

- smoothly lower BGM;
- keep ambience subtle;
- restore BGM after speech.

Avoid hard volume jumps.

---

## Performance

Implement:

- lazy scene audio;
- preload only critical UI sounds;
- audio cache;
- unload large unused tracks;
- tab visibility pause/resume;
- mute persistence.

---

## Accessibility

Always show subtitles for meaningful character speech.

Support:

- mute;
- voice off but subtitles on;
- reduced sudden sounds;
- persistent volume settings.

---

## Tests

Test:

- shared audio manager singleton/service lifecycle;
- volume persistence;
- mute;
- category levels;
- ducking;
- visibility pause;
- missing-audio fallback.

---

## Acceptance Criteria

- [ ] Shared audio manager exists.
- [ ] No repeated AudioContext creation pattern remains.
- [ ] BGM, ambience, SFX and voice are separated.
- [ ] Volume settings persist.
- [ ] Character vocalization does not clone official actors.
- [ ] Narration has fallback behavior.
- [ ] Subtitles work.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/V2_AUDIO_VOICE_SPEC.md`
- `docs/v2/AUDIO_ASSET_MANIFEST.md`
- `docs/v2/reports/PHASE_06_REPORT.md`

Then stop.
