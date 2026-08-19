/**
 * Web Audio API Sleep & Relaxation Soundscape Engine (Zero MP3 Dependencies)
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null
  private activeNodes: { stop: () => void }[] = []
  private isPlaying = false
  private currentMode: 'rain' | 'ocean' | '432hz' | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public play(mode: 'rain' | 'ocean' | '432hz') {
    this.stop()
    const ctx = this.getContext()
    this.currentMode = mode
    this.isPlaying = true

    if (mode === '432hz') {
      // 432Hz Calm Harmonic Sine Waves
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(432, ctx.currentTime) // 432Hz Root
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(432 * 1.5, ctx.currentTime) // 648Hz Perfect Fifth

      gain.gain.setValueAtTime(0.08, ctx.currentTime)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start()
      osc2.start()

      this.activeNodes.push({
        stop: () => {
          try {
            osc1.stop()
            osc2.stop()
            osc1.disconnect()
            osc2.disconnect()
          } catch {
            // Ignore
          }
        }
      })
    } else if (mode === 'rain') {
      // White/Pink noise buffer through bandpass filter for rain effect
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
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.12, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      whiteNoise.start()

      this.activeNodes.push({
        stop: () => {
          try {
            whiteNoise.stop()
            whiteNoise.disconnect()
          } catch {
            // Ignore
          }
        }
      })
    } else if (mode === 'ocean') {
      // Modulated noise for Ocean waves
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
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(350, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.05, ctx.currentTime)

      // LFO for wave swelling
      const lfo = ctx.createOscillator()
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime) // 8-second wave cycle
      const lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime)

      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      whiteNoise.start()
      lfo.start()

      this.activeNodes.push({
        stop: () => {
          try {
            whiteNoise.stop()
            lfo.stop()
            whiteNoise.disconnect()
            lfo.disconnect()
          } catch {
            // Ignore
          }
        }
      })
    }
  }

  public stop() {
    this.activeNodes.forEach((node) => node.stop())
    this.activeNodes = []
    this.isPlaying = false
    this.currentMode = null
  }

  public getStatus() {
    return { isPlaying: this.isPlaying, currentMode: this.currentMode }
  }
}

export const soundscapes = new SoundscapeEngine()
