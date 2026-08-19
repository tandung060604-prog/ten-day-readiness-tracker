export function triggerConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    document.body.removeChild(canvas)
    return
  }

  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)

  const colors = ['#4ee1aa', '#64a5ff', '#f6c96a', '#ff6d79', '#cc8fff', '#00f2fe']
  const particleCount = 75
  const particles: {
    x: number
    y: number
    w: number
    h: number
    vx: number
    vy: number
    rotation: number
    vRot: number
    color: string
    alpha: number
  }[] = []

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.45 + (Math.random() - 0.5) * 50,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1.2) * 14,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    })
  }

  let animationFrameId: number
  const startTime = Date.now()

  function render() {
    const elapsed = Date.now() - startTime
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight)

    let alive = false
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.35 // gravity
      p.vx *= 0.98 // air resistance
      p.rotation += p.vRot
      if (elapsed > 1200) {
        p.alpha -= 0.025
      }

      if (p.alpha > 0 && p.y < window.innerHeight + 50) {
        alive = true
        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate((p.rotation * Math.PI) / 180)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = Math.max(0, p.alpha)
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx!.restore()
      }
    }

    if (alive && elapsed < 3500) {
      animationFrameId = requestAnimationFrame(render)
    } else {
      cancelAnimationFrame(animationFrameId)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }

  animationFrameId = requestAnimationFrame(render)
}
