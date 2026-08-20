import { triggerHaptic } from '../../utils/haptics'
import type {
  AudioBus,
  AudioSettings,
  MascotVocalType,
  SoundscapeMode,
  SubtitleListener,
  SubtitlePayload
} from './types'

const STORAGE_KEY = 'little_days_audio_v2_settings'

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.8,
  bgmVolume: 0.45,
  ambienceVolume: 0.5,
  sfxVolume: 0.65,
  vocalVolume: 0.7,
  narrationVolume: 0.85,
  isMuted: false,
  subtitlesEnabled: true
}

export class AudioManager {
  private static instance: AudioManager | null = null
  private ctx: AudioContext | null = null

  // Gain Nodes Hierarchy
  private masterGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private ambienceGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private vocalGain: GainNode | null = null
  private narrationGain: GainNode | null = null

  // Active Soundscape Nodes
  private activeAmbienceNodes: { stop: () => void }[] = []
  private currentAmbienceMode: SoundscapeMode | null = null

  // Settings State
  private settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS }
  private subtitleListeners: Set<SubtitleListener> = new Set()

  constructor() {
    this.loadSettings()
    this.setupVisibilityListener()
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      // ignore
    }
  }

  public saveSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
    } catch {
      // ignore
    }
    this.applyBusVolumes()
  }

  public getSettings(): AudioSettings {
    return { ...this.settings }
  }

  /**
   * Initializes single shared Web Audio context & routing nodes on user gesture.
   */
  public initContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.setupAudioGraph()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  private setupAudioGraph() {
    if (!this.ctx) return

    // Create Hierarchical Gain Nodes
    this.masterGain = this.ctx.createGain()
    this.bgmGain = this.ctx.createGain()
    this.ambienceGain = this.ctx.createGain()
    this.sfxGain = this.ctx.createGain()
    this.vocalGain = this.ctx.createGain()
    this.narrationGain = this.ctx.createGain()

    // Route Sub-buses to Master Gain
    this.bgmGain.connect(this.masterGain)
    this.ambienceGain.connect(this.masterGain)
    this.sfxGain.connect(this.masterGain)
    this.vocalGain.connect(this.masterGain)
    this.narrationGain.connect(this.masterGain)

    // Route Master Gain to Speaker Destination
    this.masterGain.connect(this.ctx.destination)

    this.applyBusVolumes()
  }

  private safeSetGain(param: AudioParam | undefined | null, value: number, time?: number) {
    if (!param) return
    const now = time ?? (this.ctx?.currentTime || 0)
    try {
      if (typeof param.setValueAtTime === 'function') {
        param.setValueAtTime(value, now)
      } else {
        param.value = value
      }
    } catch {
      try { param.value = value } catch { /* ignore */ }
    }
  }

  private applyBusVolumes() {
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime

    const masterVal = this.settings.isMuted ? 0 : this.settings.masterVolume
    this.safeSetGain(this.masterGain?.gain, masterVal, now)

    if (this.bgmGain) this.safeSetGain(this.bgmGain.gain, this.settings.bgmVolume, now)
    if (this.ambienceGain) this.safeSetGain(this.ambienceGain.gain, this.settings.ambienceVolume, now)
    if (this.sfxGain) this.safeSetGain(this.sfxGain.gain, this.settings.sfxVolume, now)
    if (this.vocalGain) this.safeSetGain(this.vocalGain.gain, this.settings.vocalVolume, now)
    if (this.narrationGain) this.safeSetGain(this.narrationGain.gain, this.settings.narrationVolume, now)
  }

  public setVolume(bus: AudioBus, volume: number) {
    const clamped = Math.max(0, Math.min(1, volume))
    const key = `${bus}Volume` as keyof AudioSettings
    this.saveSettings({ [key]: clamped })
  }

  public setMuted(muted: boolean) {
    this.saveSettings({ isMuted: muted })
  }

  private setupVisibilityListener() {
    if (typeof document === 'undefined') return
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend()
        }
      } else {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume()
        }
      }
    })
  }

  // ─── 2. AUDIO DUCKING ───
  public duckBGM(duckRatio = 0.35, durationMs = 250) {
    if (!this.ctx || !this.bgmGain || this.settings.isMuted) return
    const now = this.ctx.currentTime
    const target = this.settings.bgmVolume * duckRatio
    try {
      if (typeof this.bgmGain.gain.cancelScheduledValues === 'function') {
        this.bgmGain.gain.cancelScheduledValues(now)
      }
      if (typeof this.bgmGain.gain.setValueAtTime === 'function') {
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value ?? this.settings.bgmVolume, now)
      }
      if (typeof this.bgmGain.gain.exponentialRampToValueAtTime === 'function') {
        this.bgmGain.gain.exponentialRampToValueAtTime(Math.max(0.001, target), now + durationMs / 1000)
      } else {
        this.bgmGain.gain.value = target
      }
    } catch {
      this.safeSetGain(this.bgmGain.gain, target, now)
    }
  }

  public restoreBGM(durationMs = 500) {
    if (!this.ctx || !this.bgmGain || this.settings.isMuted) return
    const now = this.ctx.currentTime
    const target = this.settings.bgmVolume
    try {
      if (typeof this.bgmGain.gain.cancelScheduledValues === 'function') {
        this.bgmGain.gain.cancelScheduledValues(now)
      }
      if (typeof this.bgmGain.gain.setValueAtTime === 'function') {
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value ?? target, now)
      }
      if (typeof this.bgmGain.gain.exponentialRampToValueAtTime === 'function') {
        this.bgmGain.gain.exponentialRampToValueAtTime(Math.max(0.001, target), now + durationMs / 1000)
      } else {
        this.bgmGain.gain.value = target
      }
    } catch {
      this.safeSetGain(this.bgmGain.gain, target, now)
    }
  }

  // ─── 3. PROCEDURAL SOUNDSCAPES ───
  public playAmbience(mode: SoundscapeMode) {
    this.stopAmbience()
    const ctx = this.initContext()
    if (!ctx || !this.ambienceGain) return

    this.currentAmbienceMode = mode

    if (mode === '432hz') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(432, ctx.currentTime)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(432 * 1.5, ctx.currentTime)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ambienceGain)

      osc1.start()
      osc2.start()

      this.activeAmbienceNodes.push({
        stop: () => {
          try {
            osc1.stop()
            osc2.stop()
            osc1.disconnect()
            osc2.disconnect()
          } catch { /* ignore */ }
        }
      })
    } else if (mode === 'rain' || mode === 'ocean') {
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = mode === 'rain' ? 'bandpass' : 'lowpass'
      filter.frequency.setValueAtTime(mode === 'rain' ? 1200 : 450, ctx.currentTime)

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.07, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.ambienceGain)

      whiteNoise.start()

      this.activeAmbienceNodes.push({
        stop: () => {
          try {
            whiteNoise.stop()
            whiteNoise.disconnect()
            filter.disconnect()
          } catch { /* ignore */ }
        }
      })
    }
  }

  public stopAmbience() {
    for (const node of this.activeAmbienceNodes) {
      node.stop()
    }
    this.activeAmbienceNodes = []
    this.currentAmbienceMode = null
  }

  // ─── 4. SYNTHESIZED CHARACTER VOCALIZATION ───
  public playVocalization(vocal: MascotVocalType) {
    if (this.settings.isMuted) return
    const ctx = this.initContext()
    if (!ctx || !this.vocalGain) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(this.vocalGain)

    this.duckBGM(0.3, 150)

    try {
      if (vocal === 'chiikawa_squeak') {
        osc.type = 'sine'
        if (typeof osc.frequency.setValueAtTime === 'function') {
          osc.frequency.setValueAtTime(600, now)
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12)
        }
        if (typeof gain.gain.setValueAtTime === 'function') {
          gain.gain.setValueAtTime(0.3, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        }
        osc.start(now)
        osc.stop(now + 0.15)
      } else if (vocal === 'usagi_yaha') {
        osc.type = 'sawtooth'
        if (typeof osc.frequency.setValueAtTime === 'function') {
          osc.frequency.setValueAtTime(450, now)
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.18)
        }
        if (typeof gain.gain.setValueAtTime === 'function') {
          gain.gain.setValueAtTime(0.35, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
        }
        osc.start(now)
        osc.stop(now + 0.22)
      } else {
        osc.type = 'triangle'
        if (typeof osc.frequency.setValueAtTime === 'function') {
          osc.frequency.setValueAtTime(520, now)
          osc.frequency.exponentialRampToValueAtTime(1040, now + 0.15)
        }
        if (typeof gain.gain.setValueAtTime === 'function') {
          gain.gain.setValueAtTime(0.25, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
        }
        osc.start(now)
        osc.stop(now + 0.18)
      }
    } catch {
      // ignore in environments without full Web Audio oscillator support
    }
    setTimeout(() => this.restoreBGM(350), 220)
  }

  // ─── 5. NARRATION & SUBTITLES ───
  public emitSubtitle(payload: SubtitlePayload) {
    if (!this.settings.subtitlesEnabled) return
    this.subtitleListeners.forEach(listener => listener(payload))
    setTimeout(() => {
      this.subtitleListeners.forEach(listener => listener(null))
    }, payload.durationMs)
  }

  public subscribeSubtitles(listener: SubtitleListener): () => void {
    this.subtitleListeners.add(listener)
    return () => this.subtitleListeners.delete(listener)
  }

  public speakNarration(
    text: string,
    speakerName = 'Bé Chiikawa',
    character: 'chiikawa' | 'usagi' | 'narrator' = 'chiikawa'
  ) {
    const durationMs = Math.max(3000, text.length * 90)

    // Emit subtitle toast
    this.emitSubtitle({
      id: `sub_${Date.now()}`,
      speakerName,
      text,
      durationMs,
      avatarCharacter: character
    })

    // Vocal sound cue
    if (character === 'usagi') {
      this.playVocalization('usagi_yaha')
    } else {
      this.playVocalization('chiikawa_squeak')
    }

    // Optional Browser Speech Synthesis TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !this.settings.isMuted) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'vi-VN'
        utterance.rate = character === 'usagi' ? 1.15 : 0.95
        utterance.pitch = character === 'usagi' ? 1.3 : 1.15

        this.duckBGM(0.25, 200)

        utterance.onend = () => {
          this.restoreBGM(500)
        }

        utterance.onerror = () => {
          this.restoreBGM(300)
        }

        window.speechSynthesis.speak(utterance)
      } catch {
        // Fallback to subtitles only
      }
    }
  }
}

export const audioManager = AudioManager.getInstance()
