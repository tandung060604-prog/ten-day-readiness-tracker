import type { PhotoboothTemplate, PhotoboothFilter } from './types'

export interface RenderOptions {
  template: PhotoboothTemplate
  photos: (string | null)[]
  filter: PhotoboothFilter
  coupleTitle: string
  dateText: string
  customMessage: string
  frameColor?: string
}

/**
 * Load an image source into HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timeout = window.setTimeout(() => reject(new Error('Timed out loading image: ' + src)), 800)
    img.crossOrigin = 'anonymous'
    img.onload = () => { window.clearTimeout(timeout); resolve(img) }
    img.onerror = () => { window.clearTimeout(timeout); reject(new Error('Failed to load image: ' + src)) }
    img.src = src
  })
}

/**
 * Apply canvas filter effect
 */
function applyFilterToContext(ctx: CanvasRenderingContext2D, filter: PhotoboothFilter) {
  switch (filter) {
    case 'pastel':
      ctx.filter = 'contrast(0.95) brightness(1.08) saturate(1.15) hue-rotate(-5deg)'
      break
    case 'warm':
      ctx.filter = 'sepia(0.2) contrast(1.05) brightness(1.02) saturate(1.1)'
      break
    case 'bw':
      ctx.filter = 'grayscale(1) contrast(1.15) brightness(0.95)'
      break
    case 'rosy':
      ctx.filter = 'contrast(0.92) brightness(1.1) saturate(1.25) hue-rotate(340deg)'
      break
    default:
      ctx.filter = 'none'
      break
  }
}

/**
 * Draw an image cropped to aspect ratio into target rectangle
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  borderRadius = 8
) {
  ctx.save()
  
  // Rounded corner clip path
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, borderRadius)
  ctx.clip()

  // Calculate cover dimensions
  const imgAspect = img.width / img.height
  const targetAspect = w / h

  let drawW = w
  let drawH = h
  let offsetX = x
  let offsetY = y

  if (imgAspect > targetAspect) {
    drawW = h * imgAspect
    offsetX = x - (drawW - w) / 2
  } else {
    drawH = w / imgAspect
    offsetY = y - (drawH - h) / 2
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  ctx.restore()
}

/**
 * Draw placeholder for empty slot
 */
function drawEmptySlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  index: number,
  template: PhotoboothTemplate
) {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, 8)
  ctx.fillStyle = template.backgroundColor === '#1a1a24' ? '#252636' : '#ffffff'
  ctx.fill()
  ctx.strokeStyle = template.themeColor
  ctx.lineWidth = 2
  ctx.setLineDash([6, 6])
  ctx.stroke()

  ctx.fillStyle = template.textColor
  ctx.font = 'bold 20px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`+ Ô Ảnh ${index + 1}`, x + w / 2, y + h / 2 - 10)

  ctx.font = '12px "Segoe UI", sans-serif'
  ctx.fillStyle = '#888888'
  ctx.fillText('Bấm để chọn ảnh', x + w / 2, y + h / 2 + 15)

  ctx.restore()
}

/**
 * Draw cute faux-barcode and authenticity stamps
 */
function drawLife4CutsFooter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  title: string,
  subtitle: string,
  dateText: string,
  template: PhotoboothTemplate
) {
  ctx.save()
  ctx.textAlign = 'center'

  // Couple Title
  ctx.font = 'bold 18px "Segoe UI", sans-serif'
  ctx.fillStyle = template.textColor
  ctx.fillText(title, x + w / 2, y + 22)

  // Subtitle / Date
  ctx.font = '12px "Segoe UI", sans-serif'
  ctx.fillStyle = template.accentColor
  ctx.fillText(`${subtitle} • ${dateText}`, x + w / 2, y + 42)

  // Draw Faux Barcode Lines
  const barcodeY = y + 54
  const barcodeW = Math.min(180, w - 60)
  const barcodeStartX = x + (w - barcodeW) / 2
  
  ctx.fillStyle = template.textColor
  const barPattern = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2]
  let currentBarX = barcodeStartX
  for (let i = 0; i < barPattern.length; i++) {
    const bW = barPattern[i]
    if (i % 2 === 0) {
      ctx.fillRect(currentBarX, barcodeY, bW * 1.5, 14)
    }
    currentBarX += bW * 2.5
  }

  // Stamp Badge
  if (template.stickers.stampText) {
    ctx.font = 'bold 9px "Segoe UI", sans-serif'
    ctx.fillStyle = template.accentColor
    ctx.fillText(`★ ${template.stickers.stampText} ★`, x + w / 2, y + 80)
  }

  ctx.restore()
}

function getMascotSources(template: PhotoboothTemplate): string[] {
  if (template.stickers.character === 'all') return ['./assets/chiikawa.png', './assets/hachiware.png', './assets/usagi.png']
  return [`./assets/${template.stickers.character ?? 'chiikawa'}.png`]
}

async function drawMascots(ctx: CanvasRenderingContext2D, template: PhotoboothTemplate, footerY: number) {
  const mascots = await Promise.all(getMascotSources(template).map(source => loadImage(source).catch(() => null)))
  const visible = mascots.filter((mascot): mascot is HTMLImageElement => mascot !== null)
  const size = visible.length > 1 ? 38 : 46
  visible.forEach((mascot, index) => ctx.drawImage(mascot, 12 + index * (size - 4), footerY + 2, size, size))
}

/**
 * Photobooth Algorithm: Main Canvas Rendering Generator
 */
export async function renderPhotoboothStrip(options: RenderOptions): Promise<string> {
  const { template, photos, filter, coupleTitle, dateText, customMessage, frameColor } = options

  const isDark = template.backgroundColor === '#1a1a24'
  const finalBgColor = frameColor || template.themeColor

  let canvasWidth = 360
  let canvasHeight = 960

  if (template.layout === 'strip_1x4') {
    canvasWidth = 340
    canvasHeight = 980
  } else if (template.layout === 'grid_2x2') {
    canvasWidth = 520
    canvasHeight = 620
  } else if (template.layout === 'grid_2x3') {
    canvasWidth = 520
    canvasHeight = 840
  } else if (template.layout === 'film_strip_2x3') {
    canvasWidth = 540
    canvasHeight = 860
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    // Graceful fallback for environments without canvas bindings (e.g. JSDOM unit tests)
    const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}"><rect width="100%" height="100%" fill="${finalBgColor}"/><text x="50%" y="50%" fill="${template.textColor}" font-family="sans-serif" font-size="16" text-anchor="middle">${template.name}</text></svg>`
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgFallback)))}`
  }

  // 1. Draw Frame Background
  ctx.fillStyle = finalBgColor
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 2. Draw Subtle Background Pattern
  if (template.patternType === 'hearts') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    for (let py = 10; py < canvasHeight; py += 40) {
      for (let px = 10; px < canvasWidth; px += 40) {
        ctx.font = '12px sans-serif'
        ctx.fillText('♥', px, py)
      }
    }
  } else if (template.patternType === 'stars') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    for (let py = 15; py < canvasHeight; py += 45) {
      for (let px = 15; px < canvasWidth; px += 45) {
        ctx.font = '10px sans-serif'
        ctx.fillText('★', px, py)
      }
    }
  } else if (template.patternType === 'dots') {
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    for (let py = 10; py < canvasHeight; py += 25) {
      for (let px = 10; px < canvasWidth; px += 25) {
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // 3. Calculate Photo Slots Positions
  interface SlotRect { x: number; y: number; w: number; h: number }
  const slots: SlotRect[] = []

  if (template.layout === 'strip_1x4') {
    const pad = 20
    const slotW = canvasWidth - pad * 2
    const slotH = 175
    const gap = 14
    for (let i = 0; i < 4; i++) {
      slots.push({
        x: pad,
        y: pad + i * (slotH + gap),
        w: slotW,
        h: slotH
      })
    }
  } else if (template.layout === 'grid_2x2') {
    const pad = 20
    const slotW = 225
    const slotH = 210
    const gap = 14
    slots.push({ x: pad, y: pad, w: slotW, h: slotH })
    slots.push({ x: pad + slotW + gap, y: pad, w: slotW, h: slotH })
    slots.push({ x: pad, y: pad + slotH + gap, w: slotW, h: slotH })
    slots.push({ x: pad + slotW + gap, y: pad + slotH + gap, w: slotW, h: slotH })
  } else if (template.layout === 'grid_2x3' || template.layout === 'film_strip_2x3') {
    const pad = 20
    const slotW = 225
    const slotH = 210
    const gap = 14
    for (let r = 0; r < 3; r++) {
      slots.push({ x: pad, y: pad + r * (slotH + gap), w: slotW, h: slotH })
      slots.push({ x: pad + slotW + gap, y: pad + r * (slotH + gap), w: slotW, h: slotH })
    }
  }

  // 4. Render Photo Slots with Selected Filter
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]
    const photoSrc = photos[i]

    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc)
        ctx.save()
        applyFilterToContext(ctx, filter)
        drawCoverImage(ctx, img, slot.x, slot.y, slot.w, slot.h, 6)
        ctx.restore()

        // Cute slot border
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 6)
        ctx.stroke()
      } catch (err) {
        console.warn('Error rendering slot image', err)
        drawEmptySlot(ctx, slot.x, slot.y, slot.w, slot.h, i, template)
      }
    } else {
      drawEmptySlot(ctx, slot.x, slot.y, slot.w, slot.h, i, template)
    }
  }

  // 5. Draw Decorative Emojis & Mascot Accents
  ctx.save()
  const emojis = template.stickers.emojis || ['🌸', '💖']
  if (template.layout === 'strip_1x4') {
    ctx.font = '22px sans-serif'
    ctx.fillText(emojis[0] || '🌸', 24, canvasHeight - 75)
    ctx.fillText(emojis[1] || '💖', canvasWidth - 44, canvasHeight - 75)
  } else {
    ctx.font = '24px sans-serif'
    ctx.fillText(emojis[0] || '🌸', 26, canvasHeight - 65)
    ctx.fillText(emojis[1] || '✨', canvasWidth - 50, canvasHeight - 65)
  }
  ctx.restore()

  // 6. Draw Footer Branding & Life4Cuts Typography
  let footerY = 780
  if (template.layout === 'strip_1x4') {
    footerY = 790
  } else if (template.layout === 'grid_2x2') {
    footerY = 485
  } else if (template.layout === 'grid_2x3' || template.layout === 'film_strip_2x3') {
    footerY = 710
  }

  await drawMascots(ctx, template, footerY)
  drawLife4CutsFooter(
    ctx,
    0,
    footerY,
    canvasWidth,
    coupleTitle || template.defaultTitle,
    customMessage || template.defaultSubtitle,
    dateText || new Date().toLocaleDateString('vi-VN'),
    template
  )

  return canvas.toDataURL('image/png')
}
