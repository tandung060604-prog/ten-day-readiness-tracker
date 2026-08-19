import { useEffect, useRef } from 'react'

interface SmokeParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  maxLife: number
  life: number
}

interface WaterDrop {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

interface SakuraPetal {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  vAngle: number
  size: number
  alpha: number
}

export function MapAnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = 1920)
    let height = (canvas.height = 1080)

    // Chimney positions in 1920x1080 coordinates
    const chimneys = [
      { x: 1920 * 0.155, y: 1080 * 0.22 }, // House chimney
      { x: 1920 * 0.335, y: 1080 * 0.15 }, // Gym chimney
      { x: 1920 * 0.26, y: 1080 * 0.71 }, // Restaurant chimney
      { x: 1920 * 0.705, y: 1080 * 0.17 } // Library chimney
    ]

    // Particle state pools
    const smokeParticles: SmokeParticle[] = []
    const waterDrops: WaterDrop[] = []
    const ripples: Ripple[] = []
    const sakuraPetals: SakuraPetal[] = []

    // Fountain center
    const fountain = { x: 1920 * 0.52, y: 1080 * 0.2 }

    // Beach wave time
    let waveTime = 0

    // Duck position along river
    let duckT = 0

    // Mascot patrol along circular plaza
    let mascotAngle = 0

    // Spawning timer
    let frameCount = 0

    const render = () => {
      frameCount++
      ctx.clearRect(0, 0, width, height)

      // ── 1. REAL WATER CURRENT & SHIMMER ON RIVER ──
      ctx.save()
      // Draw flowing curved water stream lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'

      for (let i = 0; i < 6; i++) {
        const offset = ((frameCount * 1.5 + i * 120) % 800) / 800
        const startX = 1920 * (0.05 + offset * 0.35)
        const startY = 1080 * (0.42 + Math.sin(offset * Math.PI * 2) * 0.08)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo(
          startX + 40,
          startY + Math.cos(frameCount * 0.05 + i) * 6,
          startX + 80,
          startY + Math.sin(frameCount * 0.05 + i) * 8
        )
        ctx.stroke()
      }
      ctx.restore()

      // ── 2. SWIMMING DUCKS WITH WAKE RIPPLES IN RIVER ──
      duckT = (duckT + 0.0008) % 1
      const duckX = 1920 * (0.08 + duckT * 0.3)
      const duckY = 1080 * (0.45 + Math.sin(duckT * Math.PI * 3) * 0.05)

      // Duck wake ripples
      if (frameCount % 20 === 0) {
        ripples.push({
          x: duckX,
          y: duckY + 4,
          radius: 2,
          maxRadius: 18,
          alpha: 0.6
        })
      }

      // Draw duck
      ctx.save()
      ctx.fillStyle = '#ffcc00'
      ctx.beginPath()
      ctx.ellipse(duckX, duckY, 7, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ff6600'
      ctx.beginPath()
      ctx.arc(duckX + 7, duckY - 1, 2.5, 0, Math.PI * 2)
      ctx.fill()
      // Duckling 1
      ctx.fillStyle = '#ffdb4d'
      ctx.beginPath()
      ctx.ellipse(duckX - 14, duckY + 3, 4.5, 3.5, 0, 0, Math.PI * 2)
      ctx.fill()
      // Duckling 2
      ctx.beginPath()
      ctx.ellipse(duckX - 26, duckY + 6, 4, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── 3. OCEAN SURF FOAM ON NHA TRANG BEACH ──
      waveTime += 0.025
      const waveOffset = Math.sin(waveTime) * 18
      const waveAlpha = (Math.sin(waveTime) + 1) * 0.35 + 0.2

      ctx.save()
      // Foam wave 1
      ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha})`
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(1920 * 0.78, 1080 * 0.68 + waveOffset)
      ctx.bezierCurveTo(
        1920 * 0.84,
        1080 * 0.74 + waveOffset * 0.8,
        1920 * 0.9,
        1080 * 0.8 + waveOffset * 1.2,
        1920 * 0.98,
        1080 * 0.88 + waveOffset
      )
      ctx.stroke()

      // Foam wave 2 (receding)
      const wave2Alpha = (Math.cos(waveTime) + 1) * 0.25
      ctx.strokeStyle = `rgba(220, 245, 255, ${wave2Alpha})`
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(1920 * 0.79, 1080 * 0.71 - waveOffset * 0.5)
      ctx.bezierCurveTo(
        1920 * 0.85,
        1080 * 0.77 - waveOffset * 0.4,
        1920 * 0.91,
        1080 * 0.83 - waveOffset * 0.6,
        1920 * 0.99,
        1080 * 0.9 - waveOffset * 0.5
      )
      ctx.stroke()
      ctx.restore()

      // ── 4. CHIMNEY SMOKE PARTICLES ──
      if (frameCount % 6 === 0) {
        chimneys.forEach((c) => {
          smokeParticles.push({
            x: c.x + (Math.random() - 0.5) * 4,
            y: c.y,
            vx: (Math.random() - 0.3) * 0.6,
            vy: -1.2 - Math.random() * 0.8,
            size: 6 + Math.random() * 4,
            alpha: 0.65,
            maxLife: 80 + Math.random() * 40,
            life: 0
          })
        })
      }

      ctx.save()
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.size += 0.28
        p.alpha = Math.max(0, 0.65 * (1 - p.life / p.maxLife))

        if (p.life >= p.maxLife) {
          smokeParticles.splice(i, 1)
          continue
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`)
        grad.addColorStop(0.6, `rgba(240, 240, 245, ${p.alpha * 0.7})`)
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // ── 5. FOUNTAIN WATER JET SPRAY & SPLASHES ──
      if (frameCount % 3 === 0) {
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI * 2 * i) / 3 + frameCount * 0.1
          const speed = 2 + Math.random() * 1.5
          waterDrops.push({
            x: fountain.x,
            y: fountain.y - 12,
            vx: Math.cos(angle) * speed,
            vy: -3.5 - Math.random() * 2,
            alpha: 0.9,
            size: 2.2 + Math.random() * 1.5
          })
        }
      }

      ctx.save()
      for (let i = waterDrops.length - 1; i >= 0; i--) {
        const d = waterDrops[i]
        d.x += d.vx
        d.y += d.vy
        d.vy += 0.18 // Gravity

        // If hits fountain pool surface
        if (d.y >= fountain.y + 14) {
          ripples.push({
            x: d.x,
            y: fountain.y + 14,
            radius: 1,
            maxRadius: 12,
            alpha: 0.7
          })
          waterDrops.splice(i, 1)
          continue
        }

        ctx.fillStyle = `rgba(180, 230, 255, ${d.alpha})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // ── 6. EXPANDING WATER RIPPLES ──
      ctx.save()
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius += 0.4
        r.alpha -= 0.02

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1)
          continue
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(r.x, r.y, r.radius * 1.6, r.radius, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      // ── 7. FALLING SAKURA BLOSSOMS FROM CHERRY TREES ──
      if (frameCount % 12 === 0) {
        sakuraPetals.push({
          x: 1920 * (0.65 + Math.random() * 0.2),
          y: 1080 * 0.12,
          vx: -0.8 - Math.random() * 1.2,
          vy: 0.9 + Math.random() * 0.8,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.08,
          size: 5 + Math.random() * 4,
          alpha: 0.85
        })
      }

      ctx.save()
      for (let i = sakuraPetals.length - 1; i >= 0; i--) {
        const s = sakuraPetals[i]
        s.x += s.vx + Math.sin(frameCount * 0.05 + i) * 0.5
        s.y += s.vy
        s.angle += s.vAngle

        if (s.y >= 1080 * 0.85 || s.x <= 0) {
          sakuraPetals.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.angle)
        ctx.fillStyle = `rgba(255, 183, 197, ${s.alpha})`
        ctx.beginPath()
        ctx.ellipse(0, 0, s.size, s.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // ── 8. MOVING PLAZA CITIZENS / PATROL MASCOTS ──
      mascotAngle += 0.008
      const plazaCenterX = 1920 * 0.5
      const plazaCenterY = 1080 * 0.52
      const plazaR = 52

      const mX = plazaCenterX + Math.cos(mascotAngle) * plazaR
      const mY = plazaCenterY + Math.sin(mascotAngle) * (plazaR * 0.55)

      // Footstep dust puff
      if (frameCount % 18 === 0) {
        ctx.save()
        ctx.fillStyle = 'rgba(215, 195, 175, 0.4)'
        ctx.beginPath()
        ctx.arc(mX, mY + 6, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="map-living-animation-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 18
      }}
    />
  )
}
