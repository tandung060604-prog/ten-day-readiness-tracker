import { useState } from 'react'
import { Modal } from '../common/Modal'
import { audioManager } from '../../domain/audio/audioManager'
import type { AudioBus, AudioSettings } from '../../domain/audio/types'

interface AudioMixerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AudioMixerModal({ isOpen, onClose }: AudioMixerModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => audioManager.getSettings())

  if (!isOpen) return null

  const handleVolumeChange = (bus: AudioBus, value: number) => {
    audioManager.setVolume(bus, value)
    setSettings(audioManager.getSettings())
  }

  const handleToggleMute = () => {
    const nextMute = !settings.isMuted
    audioManager.setMuted(nextMute)
    setSettings(audioManager.getSettings())
  }

  const handleToggleSubtitles = () => {
    const nextSub = !settings.subtitlesEnabled
    audioManager.saveSettings({ subtitlesEnabled: nextSub })
    setSettings(audioManager.getSettings())
  }

  return (
    <Modal title="Bàn Trộn Âm Thanh & Giọng Nói (Audio Mixer)" onClose={onClose}>
      <div className="audio-mixer-modal-container">
        {/* Quick Toggles Row */}
        <div className="mixer-quick-toggles">
          <button 
            className={`mixer-toggle-btn ${settings.isMuted ? 'muted' : 'active'}`}
            onClick={handleToggleMute}
          >
            {settings.isMuted ? '🔇 Đang Tắt Toàn Bộ Âm Thanh' : '🔊 Âm Thanh Đang Bật'}
          </button>

          <button 
            className={`mixer-toggle-btn ${settings.subtitlesEnabled ? 'active' : 'muted'}`}
            onClick={handleToggleSubtitles}
          >
            💬 Phụ Đề Nổi: {settings.subtitlesEnabled ? 'Bật' : 'Tắt'}
          </button>
        </div>

        {/* Bus Volume Sliders */}
        <div className="mixer-sliders-list">
          {/* 1. Master Volume */}
          <div className="mixer-channel-row master-channel">
            <div className="channel-info">
              <span className="channel-icon">🎛️</span>
              <div>
                <strong>Âm Lượng Tổng (Master)</strong>
                <small>Điều chỉnh toàn bộ hệ thống âm thanh</small>
              </div>
            </div>
            <div className="channel-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                disabled={settings.isMuted}
              />
              <span className="channel-reading">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
          </div>

          {/* 2. BGM */}
          <div className="mixer-channel-row">
            <div className="channel-info">
              <span className="channel-icon">🎵</span>
              <div>
                <strong>Nhạc Nền (BGM Music)</strong>
                <small>Giai điệu êm dịu theo từng bối cảnh</small>
              </div>
            </div>
            <div className="channel-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgmVolume}
                onChange={(e) => handleVolumeChange('bgm', parseFloat(e.target.value))}
                disabled={settings.isMuted}
              />
              <span className="channel-reading">{Math.round(settings.bgmVolume * 100)}%</span>
            </div>
          </div>

          {/* 3. Ambience Soundscapes */}
          <div className="mixer-channel-row">
            <div className="channel-info">
              <span className="channel-icon">🌧️</span>
              <div>
                <strong>Âm Môi Trường (Ambience)</strong>
                <small>Tiếng mưa rơi, sóng biển, tần số 432Hz</small>
              </div>
            </div>
            <div className="channel-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.ambienceVolume}
                onChange={(e) => handleVolumeChange('ambience', parseFloat(e.target.value))}
                disabled={settings.isMuted}
              />
              <span className="channel-reading">{Math.round(settings.ambienceVolume * 100)}%</span>
            </div>
          </div>

          {/* 4. SFX */}
          <div className="mixer-channel-row">
            <div className="channel-info">
              <span className="channel-icon">🔔</span>
              <div>
                <strong>Hiệu Ứng Âm Thanh (SFX)</strong>
                <small>Tiếng click, rót nước, pháo hoa</small>
              </div>
            </div>
            <div className="channel-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                disabled={settings.isMuted}
              />
              <span className="channel-reading">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
          </div>

          {/* 5. Mascot Voice & Narration */}
          <div className="mixer-channel-row">
            <div className="channel-info">
              <span className="channel-icon">🎙️</span>
              <div>
                <strong>Giọng Nói & Linh Vật (Voice)</strong>
                <small>Tiếng kêu dễ thương & thuyết minh</small>
              </div>
            </div>
            <div className="channel-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.vocalVolume}
                onChange={(e) => handleVolumeChange('vocal', parseFloat(e.target.value))}
                disabled={settings.isMuted}
              />
              <span className="channel-reading">{Math.round(settings.vocalVolume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
