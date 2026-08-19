import { triggerHaptic } from '../../utils/haptics'
import type { TransitionType } from '../types'

interface AudioSettings {
  bgmVolume: number
  sfxVolume: number
  isMuted: boolean
}

const STORAGE_KEY = 'little_days_audio_settings_v1'

class GameAudioSystem {
  private ctx: AudioContext | null = null
  private settings: AudioSettings = {
    bgmVolume: 0.22,
    sfxVolume: 0.45,
    isMuted: false
  }

  constructor() {
    this.loadSettings()
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        this.settings = JSON.parse(saved)
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
  }

  public getSettings(): AudioSettings {
    return { ...this.settings }
  }

  public initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Play synthesized UI click
  public playClick(type: 'soft' | 'pop' | 'enter' = 'soft') {
    if (this.settings.isMuted) return
    triggerHaptic('light')
    this.initAudioContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.ctx.destination)

    const masterGain = this.settings.sfxVolume

    if (type === 'enter') {
      // Warm chord on entering world
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)
      gain.gain.setValueAtTime(0.3 * masterGain, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45)
      osc.start(now)
      osc.stop(now + 0.45)
    } else if (type === 'pop') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08)
      gain.gain.setValueAtTime(0.25 * masterGain, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
      osc.start(now)
      osc.stop(now + 0.12)
    } else {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06)
      gain.gain.setValueAtTime(0.2 * masterGain, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
    }
  }

  // Play building transition SFX
  public playTransitionSFX(type: TransitionType) {
    if (this.settings.isMuted) return
    triggerHaptic('medium')
    this.initAudioContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const masterGain = this.settings.sfxVolume

    switch (type) {
      case 'water': {
        // Water drop & ripple
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(900, now)
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.25)
        gain.gain.setValueAtTime(0.3 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.3)
        break
      }

      case 'book': {
        // Soft paper swoosh
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(250, now)
        osc.frequency.linearRampToValueAtTime(450, now + 0.15)
        osc.frequency.linearRampToValueAtTime(150, now + 0.3)
        gain.gain.setValueAtTime(0.2 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.3)
        break
      }

      case 'camera': {
        // Shutter click
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1200, now)
        osc.frequency.setValueAtTime(800, now + 0.05)
        gain.gain.setValueAtTime(0.35 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.15)
        break
      }

      case 'moon': {
        // Celestial wind chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.06)
          gain.gain.setValueAtTime(0.18 * masterGain, now + i * 0.06)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.06)
          osc.stop(now + i * 0.06 + 0.4)
        })
        break
      }

      case 'heart': {
        // Warm romantic arpeggio
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now + i * 0.07)
          gain.gain.setValueAtTime(0.2 * masterGain, now + i * 0.07)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.5)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.07)
          osc.stop(now + i * 0.07 + 0.5)
        })
        break
      }

      case 'plane': {
        // Airplane whoosh
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(200, now)
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2)
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.45)
        gain.gain.setValueAtTime(0.25 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.45)
        break
      }

      case 'gear': {
        // Mechanical click
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.setValueAtTime(600, now + 0.04)
        gain.gain.setValueAtTime(0.3 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.12)
        break
      }

      default: {
        // Cloud wipe soft wind
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(350, now)
        osc.frequency.linearRampToValueAtTime(550, now + 0.2)
        osc.frequency.linearRampToValueAtTime(250, now + 0.4)
        gain.gain.setValueAtTime(0.2 * masterGain, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.4)
        break
      }
    }
  }

  // Play building inspection jingle
  public playBuildingInspectSFX(buildingId: string) {
    if (this.settings.isMuted) return
    triggerHaptic('medium')
    this.initAudioContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const masterGain = this.settings.sfxVolume

    switch (buildingId) {
      case 'water':
      case 'beach': {
        // Water splash bubbling
        [800, 1200, 600, 1000].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.05)
          gain.gain.setValueAtTime(0.18 * masterGain, now + i * 0.05)
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.05)
          osc.stop(now + i * 0.05 + 0.15)
        })
        break
      }

      case 'gym': {
        // Workout power chime
        [300, 450, 600, 900].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now + i * 0.04)
          gain.gain.setValueAtTime(0.2 * masterGain, now + i * 0.04)
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.2)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.04)
          osc.stop(now + i * 0.04 + 0.2)
        })
        break
      }

      case 'airport': {
        // Flight boarding ding-dong
        [587.33, 880].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.18)
          gain.gain.setValueAtTime(0.25 * masterGain, now + i * 0.18)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.4)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.18)
          osc.stop(now + i * 0.18 + 0.4)
        })
        break
      }

      default: {
        // Magical storybook chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.06)
          gain.gain.setValueAtTime(0.2 * masterGain, now + i * 0.06)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.06)
          osc.stop(now + i * 0.06 + 0.35)
        })
        break
      }
    }
  }
}

export const audioSystem = new GameAudioSystem()
