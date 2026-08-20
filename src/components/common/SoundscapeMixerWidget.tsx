import { useState, useEffect } from 'react'
import { ambientEngine, AMBIENT_TRACKS, type AmbientSoundType } from '../../utils/ambientSoundscapes'
import { audioSystem } from '../../game/systems/GameAudioSystem'

interface SoundState {
  playing: boolean
  volume: number
}

export function SoundscapeMixerWidget() {
  const [sounds, setSounds] = useState<Record<AmbientSoundType, SoundState>>({
    waves: { playing: false, volume: 0.6 },
    rain: { playing: false, volume: 0.6 },
    fire: { playing: false, volume: 0.5 },
    stream: { playing: false, volume: 0.5 },
    crickets: { playing: false, volume: 0.4 }
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientEngine.stopAll()
    }
  }, [])

  const toggleSound = (id: AmbientSoundType) => {
    audioSystem.playClick('soft')
    setSounds((prev) => {
      const curr = prev[id]
      const nextPlaying = !curr.playing
      if (nextPlaying) {
        ambientEngine.play(id, curr.volume)
      } else {
        ambientEngine.stop(id)
      }
      return {
        ...prev,
        [id]: { ...curr, playing: nextPlaying }
      }
    })
  }

  const changeVolume = (id: AmbientSoundType, val: number) => {
    ambientEngine.setVolume(id, val)
    setSounds((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: val }
    }))
  }

  const handleStopAll = () => {
    audioSystem.playClick('wood')
    ambientEngine.stopAll()
    setSounds({
      waves: { playing: false, volume: 0.6 },
      rain: { playing: false, volume: 0.6 },
      fire: { playing: false, volume: 0.5 },
      stream: { playing: false, volume: 0.5 },
      crickets: { playing: false, volume: 0.4 }
    })
  }

  const applyPreset = (preset: 'beach' | 'sleep' | 'cozy') => {
    audioSystem.playClick('pop')
    ambientEngine.stopAll()

    if (preset === 'beach') {
      ambientEngine.play('waves', 0.7)
      ambientEngine.play('crickets', 0.3)
      setSounds({
        waves: { playing: true, volume: 0.7 },
        rain: { playing: false, volume: 0.6 },
        fire: { playing: false, volume: 0.5 },
        stream: { playing: false, volume: 0.5 },
        crickets: { playing: true, volume: 0.3 }
      })
    } else if (preset === 'sleep') {
      ambientEngine.play('rain', 0.6)
      ambientEngine.play('stream', 0.4)
      setSounds({
        waves: { playing: false, volume: 0.6 },
        rain: { playing: true, volume: 0.6 },
        fire: { playing: false, volume: 0.5 },
        stream: { playing: true, volume: 0.4 },
        crickets: { playing: false, volume: 0.4 }
      })
    } else if (preset === 'cozy') {
      ambientEngine.play('fire', 0.7)
      ambientEngine.play('rain', 0.4)
      setSounds({
        waves: { playing: false, volume: 0.6 },
        rain: { playing: true, volume: 0.4 },
        fire: { playing: true, volume: 0.7 },
        stream: { playing: false, volume: 0.5 },
        crickets: { playing: false, volume: 0.4 }
      })
    }
  }

  const isAnyPlaying = Object.values(sounds).some((s) => s.playing)

  return (
    <div className="soundscape-mixer-card">
      <div className="soundscape-mixer-header">
        <div className="soundscape-title-box">
          <span className="soundscape-icon">🎧</span>
          <div>
            <h4>Âm Thanh Thiên Nhiên & ASMR Thư Giãn</h4>
            <p>Bật tiếng sóng biển, mưa rơi ru ngủ hay lửa ấm để nghe cùng nhau</p>
          </div>
        </div>
        {isAnyPlaying && (
          <button className="soundscape-stop-all-btn" onClick={handleStopAll}>
            ✕ Tắt Tất Cả
          </button>
        )}
      </div>

      {/* Preset Fast Selection Pills */}
      <div className="soundscape-presets-row">
        <button className="soundscape-preset-chip" onClick={() => applyPreset('beach')}>
          🏖️ Biển Nha Trang
        </button>
        <button className="soundscape-preset-chip" onClick={() => applyPreset('sleep')}>
          🌧️ Mưa Ru Ngủ
        </button>
        <button className="soundscape-preset-chip" onClick={() => applyPreset('cozy')}>
          🪵 Lò Sưởi Ấm
        </button>
      </div>

      {/* Multi-Track Channel Sliders */}
      <div className="soundscape-tracks-grid">
        {AMBIENT_TRACKS.map((t) => {
          const state = sounds[t.id]

          return (
            <div
              key={t.id}
              className={`soundscape-track-item ${state.playing ? 'active' : ''}`}
              style={{ '--track-accent': t.color } as React.CSSProperties}
            >
              <button
                type="button"
                className={`track-toggle-btn ${state.playing ? 'playing' : ''}`}
                onClick={() => toggleSound(t.id)}
              >
                <span className="track-icon">{t.icon}</span>
                <div className="track-text">
                  <strong>{t.name}</strong>
                  <small>{t.description}</small>
                </div>
                <span className="track-status-pill">{state.playing ? 'Đang phát 🔊' : 'Bật ▶'}</span>
              </button>

              {state.playing && (
                <div className="track-volume-wrap">
                  <span>Âm lượng:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={state.volume}
                    onChange={(e) => changeVolume(t.id, parseFloat(e.target.value))}
                    className="track-volume-slider"
                  />
                  <span>{Math.round(state.volume * 100)}%</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
