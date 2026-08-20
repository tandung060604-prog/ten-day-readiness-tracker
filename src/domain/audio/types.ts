// ─── 1. AUDIO BUSES & VOLUMES ───
export type AudioBus = 'master' | 'bgm' | 'ambience' | 'sfx' | 'vocal' | 'narration'

export interface AudioSettings {
  masterVolume: number
  bgmVolume: number
  ambienceVolume: number
  sfxVolume: number
  vocalVolume: number
  narrationVolume: number
  isMuted: boolean
  subtitlesEnabled: boolean
}

// ─── 2. SOUNDSCAPE & VOCAL TYPES ───
export type SoundscapeMode = 'rain' | 'ocean' | '432hz' | 'fireplace' | 'windchimes'

export type MascotVocalType =
  | 'chiikawa_squeak'
  | 'chiikawa_chirp'
  | 'chiikawa_cheer'
  | 'usagi_yaha'
  | 'usagi_ura'
  | 'usagi_rocket'

// ─── 3. SUBTITLE & SPEECH EVENT ───
export interface SubtitlePayload {
  id: string
  speakerName: string
  text: string
  durationMs: number
  avatarCharacter?: 'chiikawa' | 'usagi' | 'narrator'
}

export type SubtitleListener = (payload: SubtitlePayload | null) => void
