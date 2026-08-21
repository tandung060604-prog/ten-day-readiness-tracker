import '@testing-library/jest-dom'

// jsdom intentionally does not implement Canvas. Keep visual effects testable
// without adding a native canvas dependency to the app.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => ({
    clearRect: () => {},
    fillRect: () => {},
    fillText: () => {},
    beginPath: () => {},
    arc: () => {},
    roundRect: () => {},
    setLineDash: () => {},
    stroke: () => {},
    fill: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    drawImage: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    globalAlpha: 1,
    fillStyle: '#000'
  })
})
Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  configurable: true,
  value: () => 'data:image/png;base64,test',
})

// Mock Web Audio API
class AudioContextMock {
  state = 'running'
  currentTime = 0
  destination = {}
  createGain() {
    return {
      connect: () => {},
      disconnect: () => {},
      gain: {
        value: 1,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
      },
    }
  }
  createOscillator() {
    return {
      connect: () => {},
      disconnect: () => {},
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      start: () => {},
      stop: () => {},
    }
  }
  createBufferSource() {
    return {
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
      buffer: null,
    }
  }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(1024),
    }
  }
  createBiquadFilter() {
    return {
      connect: () => {},
      disconnect: () => {},
      type: 'lowpass',
      frequency: { setValueAtTime: () => {} },
      Q: { setValueAtTime: () => {} },
    }
  }
  resume() {
    return Promise.resolve()
  }
  close() {
    return Promise.resolve()
  }
}

// Attach mocks to global window
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: AudioContextMock,
})
Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: AudioContextMock,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock Web Speech API
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [],
  },
})
