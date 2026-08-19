import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function createOpeningBanner() {
  const width = 1920
  const height = 1080

  console.log('Generating 16:9 anime opening banner (1920x1080)...')

  // 1. Base Background (Terrain)
  const terrainBg = await sharp(path.join(projectRoot, 'public/assets/game_terrain.jpg'))
    .resize(width, height, { fit: 'cover' })
    .modulate({ brightness: 1.05, saturation: 1.15 })
    .toBuffer()

  // 2. Mini Simulation World Buildings in Background
  const house = await sharp(path.join(projectRoot, 'public/assets/buildings/house.png'))
    .resize(320, 320, { fit: 'contain' })
    .toBuffer()

  const townhall = await sharp(path.join(projectRoot, 'public/assets/buildings/townhall.png'))
    .resize(360, 360, { fit: 'contain' })
    .toBuffer()

  const gym = await sharp(path.join(projectRoot, 'public/assets/buildings/gym.png'))
    .resize(290, 290, { fit: 'contain' })
    .toBuffer()

  const airport = await sharp(path.join(projectRoot, 'public/assets/buildings/airport.png'))
    .resize(340, 340, { fit: 'contain' })
    .toBuffer()

  const beach = await sharp(path.join(projectRoot, 'public/assets/buildings/beach.png'))
    .resize(330, 330, { fit: 'contain' })
    .toBuffer()

  const water = await sharp(path.join(projectRoot, 'public/assets/buildings/water.png'))
    .resize(270, 270, { fit: 'contain' })
    .toBuffer()

  // 3. Main Characters (Chiikawa & Usagi) in the center foreground
  const chiikawa = await sharp(path.join(projectRoot, 'public/assets/chiikawa.png'))
    .resize(440, 440, { fit: 'contain' })
    .toBuffer()

  const usagi = await sharp(path.join(projectRoot, 'public/assets/usagi.png'))
    .resize(470, 470, { fit: 'contain' })
    .toBuffer()

  // 4. SVG Title and Atmospheric Glow Overlay
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Title Gradient -->
      <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff758c" />
        <stop offset="50%" stop-color="#ff4b72" />
        <stop offset="100%" stop-color="#ffc069" />
      </linearGradient>

      <!-- Badge Gradient -->
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff8da1" />
        <stop offset="100%" stop-color="#e05780" />
      </linearGradient>

      <!-- Soft Vignette Gradient -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
        <stop offset="40%" stop-color="rgba(0,0,0,0)" />
        <stop offset="100%" stop-color="rgba(10,30,20,0.4)" />
      </radialGradient>

      <!-- Sunbeam Gradient -->
      <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,220,0.35)" />
        <stop offset="40%" stop-color="rgba(255,240,180,0.15)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      </linearGradient>

      <!-- Glow filter -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Sunbeam Rays from Top-Left -->
    <polygon points="0,0 800,0 1200,1080 0,1080" fill="url(#sunbeam)" />

    <!-- Soft Dark Vignette -->
    <rect width="${width}" height="${height}" fill="url(#vignette)" />

    <!-- Center Card Frosted Header Backdrop -->
    <rect x="${width / 2 - 580}" y="60" width="1160" height="210" rx="36" fill="rgba(255, 255, 255, 0.88)" stroke="#ffccd5" stroke-width="4" filter="url(#glow)" />

    <!-- Tag Badge -->
    <rect x="${width / 2 - 250}" y="85" width="500" height="34" rx="17" fill="url(#badgeGrad)" />
    <text x="${width / 2}" y="108" font-family="'Nunito', 'Segoe UI', Arial, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      ⭐ A COZY ANIME SIMULATION FOR OUR LOVE JOURNEY ⭐
    </text>

    <!-- Main Game Title: Little Days -->
    <text x="${width / 2}" y="195" font-family="'Nunito', 'Arial Rounded MT Bold', sans-serif" font-size="78" font-weight="900" fill="url(#titleGrad)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle" letter-spacing="-1">
      Little Days
    </text>

    <!-- Subtitle -->
    <text x="${width / 2}" y="240" font-family="'Nunito', 'Segoe UI', Arial, sans-serif" font-size="20" font-weight="900" fill="#2b2d42" text-anchor="middle" letter-spacing="1">
      THỊ TRẤN TÌNH YÊU &amp; 10 NGÀY SẴN SÀNG (NHA TRANG 27/08)
    </text>

    <!-- Character Crown / Name Badges -->
    <g transform="translate(${width / 2 - 260}, 920)">
      <rect x="-100" y="-18" width="200" height="38" rx="19" fill="#ff8da1" stroke="#ffffff" stroke-width="3" filter="url(#glow)" />
      <text x="0" y="6" font-family="'Nunito', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">
        👑 Dũng (Chiikawa)
      </text>
    </g>

    <g transform="translate(${width / 2 + 260}, 920)">
      <rect x="-100" y="-18" width="200" height="38" rx="19" fill="#ffd166" stroke="#ffffff" stroke-width="3" filter="url(#glow)" />
      <text x="0" y="6" font-family="'Nunito', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">
        👑 Em Yêu (Usagi)
      </text>
    </g>

    <!-- Center Heart connecting them -->
    <circle cx="${width / 2}" cy="780" r="32" fill="#ff4b72" stroke="#ffffff" stroke-width="4" filter="url(#glow)" />
    <text x="${width / 2}" y="790" font-family="sans-serif" font-size="28" fill="#ffffff" text-anchor="middle">
      💖
    </text>
  </svg>
  `

  const svgBuffer = Buffer.from(svgOverlay)

  // 5. Composite all layers into the single master opening banner
  await sharp(terrainBg)
    .composite([
      // Background Simulation World Buildings
      { input: house, left: 160, top: 320 },
      { input: gym, left: 480, top: 280 },
      { input: water, left: 780, top: 270 },
      { input: townhall, left: 1360, top: 280 },
      { input: airport, left: 1040, top: 270 },
      { input: beach, left: 1460, top: 620 },

      // Foreground Main Characters
      { input: chiikawa, left: Math.round(width / 2 - 470), top: 480 },
      { input: usagi, left: Math.round(width / 2 + 30), top: 460 },

      // Typography & Atmospheric Overlay
      { input: svgBuffer, left: 0, top: 0 }
    ])
    .png({ quality: 95 })
    .toFile(path.join(projectRoot, 'public/assets/opening_banner.png'))

  console.log('✅ Successfully created: public/assets/opening_banner.png')
}

createOpeningBanner().catch(console.error)
