/**
 * Web Audio API Nature Soundscape Generator
 * Synthesizes ultra-relaxing, lightweight ambient nature sounds on the fly.
 */

export type AmbientSoundType = 'waves' | 'rain' | 'fire' | 'stream' | 'crickets'

export interface AmbientTrackInfo {
  id: AmbientSoundType
  name: string
  icon: string
  description: string
  color: string
}

export const AMBIENT_TRACKS: AmbientTrackInfo[] = [
  {
    id: 'waves',
    name: 'Sóng Biển Nha Trang',
    icon: '🌊',
    description: 'Tiếng sóng vỗ bờ cát trắng êm đềm tại Hòn Mun',
    color: '#38d9a9'
  },
  {
    id: 'rain',
    name: 'Mưa Rơi Mái Ngói',
    icon: '🌧️',
    description: 'Tiếng mưa rơi tí tách dịu êm ru giấc ngủ sâu',
    color: '#4dabf7'
  },
  {
    id: 'fire',
    name: 'Lò Sưởi Tổ Ấm',
    icon: '🪵',
    description: 'Tiếng củi tí tách bập bùng ấm cúng bên nhau',
    color: '#ff922b'
  },
  {
    id: 'stream',
    name: 'Suối Nước Thanh Tịnh',
    icon: '⛲',
    description: 'Dòng suối nguồn róc rách thanh lọc tâm hồn',
    color: '#63e6be'
  },
  {
    id: 'crickets',
    name: 'Côn Trùng Đêm Sao',
    icon: '🦗',
    description: 'Tiếng dế mèn du dương dưới vòm trời đêm đầy sao',
    color: '#b197fc'
  }
]

class AmbientSoundEngine {
  private ctx: AudioContext | null = null
  private activeNodes: Map<
    AmbientSoundType,
    {
      gainNode: GainNode
      stop: () => void
    }
  > = new Map()
  private masterGain: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public isPlaying(id: AmbientSoundType): boolean {
    return this.activeNodes.has(id)
  }

  public play(id: AmbientSoundType, volume = 0.6): void {
    if (this.activeNodes.has(id)) {
      this.setVolume(id, volume)
      return
    }

    const ctx = this.getContext()
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), ctx.currentTime + 1.2)
    gainNode.connect(this.masterGain || ctx.destination)

    let stopFn: () => void = () => {}

    switch (id) {
      case 'waves':
        stopFn = this.createWavesNode(ctx, gainNode)
        break
      case 'rain':
        stopFn = this.createRainNode(ctx, gainNode)
        break
      case 'fire':
        stopFn = this.createFireNode(ctx, gainNode)
        break
      case 'stream':
        stopFn = this.createStreamNode(ctx, gainNode)
        break
      case 'crickets':
        stopFn = this.createCricketsNode(ctx, gainNode)
        break
    }

    this.activeNodes.set(id, { gainNode, stop: stopFn })
  }

  public stop(id: AmbientSoundType): void {
    const node = this.activeNodes.get(id)
    if (!node || !this.ctx) return

    node.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8)
    setTimeout(() => {
      node.stop()
      this.activeNodes.delete(id)
    }, 850)
  }

  public stopAll(): void {
    const keys = Array.from(this.activeNodes.keys())
    keys.forEach((k) => this.stop(k))
  }

  public setVolume(id: AmbientSoundType, volume: number): void {
    const node = this.activeNodes.get(id)
    if (node && this.ctx) {
      node.gainNode.gain.setValueAtTime(Math.max(0.001, volume), this.ctx.currentTime)
    }
  }

  /* ── 1. Waves Generator (Filtered Pink Noise with Swell LFO) ── */
  private createWavesNode(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 4
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06
      b6 = white * 0.115926
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, ctx.currentTime)

    // LFO for wave swells (0.15 Hz = ~6.5s per wave cycle)
    const lfo = ctx.createOscillator()
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime)
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(320, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    whiteNoise.connect(filter)
    filter.connect(dest)

    whiteNoise.start()
    lfo.start()

    return () => {
      try {
        whiteNoise.stop()
        lfo.stop()
      } catch { /* noop */ }
    }
  }

  /* ── 2. Rain Generator (High-passed textured noise) ── */
  private createRainNode(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 3
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, ctx.currentTime)
    filter.Q.setValueAtTime(0.6, ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(dest)
    whiteNoise.start()

    return () => {
      try { whiteNoise.stop() } catch { /* noop */ }
    }
  }

  /* ── 3. Fireplace Generator (Crackles and rumble) ── */
  private createFireNode(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Random crackle spikes
      const isCrackle = Math.random() < 0.003
      output[i] = isCrackle ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.05
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(dest)
    whiteNoise.start()

    return () => {
      try { whiteNoise.stop() } catch { /* noop */ }
    }
  }

  /* ── 4. Spring / Stream Generator (Resonant Babbling) ── */
  private createStreamNode(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.12
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.Q.setValueAtTime(2.5, ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(dest)
    whiteNoise.start()

    return () => {
      try { whiteNoise.stop() } catch { /* noop */ }
    }
  }

  /* ── 5. Crickets Generator (Modulated high frequency pulses) ── */
  private createCricketsNode(ctx: AudioContext, dest: AudioNode): () => void {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(4600, ctx.currentTime)

    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0, ctx.currentTime)

    const pulseLfo = ctx.createOscillator()
    pulseLfo.type = 'sawtooth'
    pulseLfo.frequency.setValueAtTime(5.5, ctx.currentTime)

    const pulseGain = ctx.createGain()
    pulseGain.gain.setValueAtTime(0.08, ctx.currentTime)

    pulseLfo.connect(pulseGain)
    pulseGain.connect(amp.gain)

    osc.connect(amp)
    amp.connect(dest)

    osc.start()
    pulseLfo.start()

    return () => {
      try {
        osc.stop()
        pulseLfo.stop()
      } catch { /* noop */ }
    }
  }
}

export const ambientEngine = new AmbientSoundEngine()
