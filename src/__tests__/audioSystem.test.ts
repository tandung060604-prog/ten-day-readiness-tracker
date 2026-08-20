import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AudioManager, DEFAULT_AUDIO_SETTINGS } from '../domain/audio/audioManager'
import type { SubtitlePayload } from '../domain/audio/types'

describe('Audio and Voice V2 Architecture Suite — Phase 06', () => {
  let manager: AudioManager

  beforeEach(() => {
    localStorage.clear()
    manager = AudioManager.getInstance()
    manager.saveSettings(DEFAULT_AUDIO_SETTINGS)
  })

  describe('1. Singleton Lifecycle & Settings Persistence', () => {
    it('provides a singleton instance', () => {
      const instance1 = AudioManager.getInstance()
      const instance2 = AudioManager.getInstance()
      expect(instance1).toBe(instance2)
    })

    it('loads and applies default audio settings', () => {
      const settings = manager.getSettings()
      expect(settings.masterVolume).toBe(0.8)
      expect(settings.bgmVolume).toBe(0.45)
      expect(settings.isMuted).toBe(false)
      expect(settings.subtitlesEnabled).toBe(true)
    })

    it('persists individual bus volume updates', () => {
      manager.setVolume('bgm', 0.25)
      manager.setVolume('sfx', 0.9)
      manager.setVolume('ambience', 0.3)

      const updated = manager.getSettings()
      expect(updated.bgmVolume).toBe(0.25)
      expect(updated.sfxVolume).toBe(0.9)
      expect(updated.ambienceVolume).toBe(0.3)
    })

    it('clamps volume values strictly between 0.0 and 1.0', () => {
      manager.setVolume('vocal', 1.5)
      expect(manager.getSettings().vocalVolume).toBe(1.0)

      manager.setVolume('vocal', -0.5)
      expect(manager.getSettings().vocalVolume).toBe(0.0)
    })

    it('toggles global mute state cleanly', () => {
      manager.setMuted(true)
      expect(manager.getSettings().isMuted).toBe(true)

      manager.setMuted(false)
      expect(manager.getSettings().isMuted).toBe(false)
    })
  })

  describe('2. Subtitle Broadcast & Speech Narration', () => {
    it('broadcasts subtitle payloads to registered subscribers', () => {
      const listener = vi.fn()
      const unsubscribe = manager.subscribeSubtitles(listener)

      const payload: SubtitlePayload = {
        id: 'test_sub_1',
        speakerName: 'Bé Chiikawa',
        text: 'Chúc bạn một ngày tràn đầy niềm vui! 🌸',
        durationMs: 3000,
        avatarCharacter: 'chiikawa'
      }

      manager.emitSubtitle(payload)
      expect(listener).toHaveBeenCalledWith(payload)

      unsubscribe()
      manager.emitSubtitle({ ...payload, id: 'test_sub_2' })
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('dispatches narration and auto-formats subtitle payloads', () => {
      const listener = vi.fn()
      manager.subscribeSubtitles(listener)

      manager.speakNarration('Tập luyện xong rồi nè! Bé mang nước tới đây!', 'Bé Chiikawa', 'chiikawa')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          speakerName: 'Bé Chiikawa',
          text: 'Tập luyện xong rồi nè! Bé mang nước tới đây!',
          avatarCharacter: 'chiikawa'
        })
      )
    })

    it('suppresses subtitle emission when subtitles are disabled in settings', () => {
      const listener = vi.fn()
      manager.subscribeSubtitles(listener)
      manager.saveSettings({ subtitlesEnabled: false })

      manager.emitSubtitle({
        id: 'test_sub_disabled',
        speakerName: 'Narrator',
        text: 'Hidden subtitle',
        durationMs: 1000
      })

      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('3. Soundscapes & Ducking Safe Calls', () => {
    it('executes soundscape commands without throwing exceptions', () => {
      expect(() => manager.playAmbience('rain')).not.toThrow()
      expect(() => manager.playAmbience('432hz')).not.toThrow()
      expect(() => manager.stopAmbience()).not.toThrow()
    })

    it('executes audio ducking and restoration safely', () => {
      expect(() => manager.duckBGM(0.3, 100)).not.toThrow()
      expect(() => manager.restoreBGM(200)).not.toThrow()
    })

    it('executes mascot vocalization synthesis safely', () => {
      expect(() => manager.playVocalization('chiikawa_squeak')).not.toThrow()
      expect(() => manager.playVocalization('usagi_yaha')).not.toThrow()
    })
  })
})
