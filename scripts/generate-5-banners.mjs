import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const outputDir = path.join(projectRoot, 'public/assets/banners')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const width = 1920
const height = 1080

async function generate5Banners() {
  console.log('Generating 5 distinct 16:9 banner concepts...')

  const chiikawa = await sharp(path.join(projectRoot, 'public/assets/chiikawa.png')).resize(440, 440, { fit: 'contain' }).toBuffer()
  const usagi = await sharp(path.join(projectRoot, 'public/assets/usagi.png')).resize(470, 470, { fit: 'contain' }).toBuffer()
  const house = await sharp(path.join(projectRoot, 'public/assets/buildings/house.png')).resize(320, 320, { fit: 'contain' }).toBuffer()
  const gym = await sharp(path.join(projectRoot, 'public/assets/buildings/gym.png')).resize(290, 290, { fit: 'contain' }).toBuffer()
  const townhall = await sharp(path.join(projectRoot, 'public/assets/buildings/townhall.png')).resize(360, 360, { fit: 'contain' }).toBuffer()
  const airport = await sharp(path.join(projectRoot, 'public/assets/buildings/airport.png')).resize(340, 340, { fit: 'contain' }).toBuffer()
  const beach = await sharp(path.join(projectRoot, 'public/assets/buildings/beach.png')).resize(330, 330, { fit: 'contain' }).toBuffer()
  const water = await sharp(path.join(projectRoot, 'public/assets/buildings/water.png')).resize(270, 270, { fit: 'contain' }).toBuffer()
  const restaurant = await sharp(path.join(projectRoot, 'public/assets/buildings/restaurant.png')).resize(320, 320, { fit: 'contain' }).toBuffer()
  const library = await sharp(path.join(projectRoot, 'public/assets/buildings/library.png')).resize(310, 310, { fit: 'contain' }).toBuffer()

  // ══════════════════════════════════════════════════════════════════════
  // BANNER 1: STORYBOOK CLASSIC ANIME (Pastel Fairy-Tale Meadow)
  // ══════════════════════════════════════════════════════════════════════
  const bg1Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b8e994"/><stop offset="100%" stop-color="#78e08f"/></linearGradient>
      <linearGradient id="title1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff6b8b"/><stop offset="100%" stop-color="#ffbe76"/></linearGradient>
      <linearGradient id="sun1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,220,0.4)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#dff9fb"/>
    <!-- Hills -->
    <path d="M0,500 Q500,320 1000,480 Q1500,600 1920,400 L1920,1080 L0,1080 Z" fill="url(#sky1)" />
    <path d="M0,650 Q450,550 960,680 Q1450,750 1920,620 L1920,1080 L0,1080 Z" fill="#38ada9" opacity="0.8" />
    <polygon points="0,0 900,0 1300,1080 0,1080" fill="url(#sun1)" />
    <!-- Header Box -->
    <rect x="380" y="60" width="1160" height="210" rx="36" fill="rgba(255,255,255,0.92)" stroke="#ffccd5" stroke-width="4" />
    <text x="960" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#d6336c" text-anchor="middle" letter-spacing="4">⭐ PHIÊN BẢN 1: CỔ TÍCH ĐỒNG CỎ PASTEL ⭐</text>
    <text x="960" y="195" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#title1)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle">Little Days</text>
    <text x="960" y="240" font-family="sans-serif" font-size="20" font-weight="900" fill="#2b2d42" text-anchor="middle">THỊ TRẤN TÌNH YÊU &amp; 10 NGÀY SẴN SÀNG</text>
  </svg>`
  await sharp(Buffer.from(bg1Svg))
    .composite([
      { input: house, left: 200, top: 340 },
      { input: gym, left: 520, top: 310 },
      { input: townhall, left: 1360, top: 320 },
      { input: water, left: 820, top: 290 },
      { input: chiikawa, left: 500, top: 480 },
      { input: usagi, left: 980, top: 460 }
    ])
    .png()
    .toFile(path.join(outputDir, 'banner_v1_storybook.png'))

  // ══════════════════════════════════════════════════════════════════════
  // BANNER 2: TROPICAL NHA TRANG BEACH & AIRPORT
  // ══════════════════════════════════════════════════════════════════════
  const bg2Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ocean2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#74b9ff"/><stop offset="100%" stop-color="#0984e3"/></linearGradient>
      <linearGradient id="sand2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffeaa7"/><stop offset="100%" stop-color="#fdcb6e"/></linearGradient>
      <linearGradient id="title2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00cec9"/><stop offset="50%" stop-color="#0984e3"/><stop offset="100%" stop-color="#e84393"/></linearGradient>
    </defs>
    <!-- Sky & Ocean -->
    <rect width="${width}" height="600" fill="#81ecec"/>
    <rect y="550" width="${width}" height="530" fill="url(#ocean2)"/>
    <path d="M0,680 Q600,600 1200,720 Q1600,780 1920,660 L1920,1080 L0,1080 Z" fill="url(#sand2)"/>
    <!-- Tropical Sun -->
    <circle cx="1700" cy="180" r="100" fill="#ffeaa7" opacity="0.6"/>
    <!-- Header Box -->
    <rect x="380" y="60" width="1160" height="210" rx="36" fill="rgba(255,255,255,0.92)" stroke="#74b9ff" stroke-width="4" />
    <text x="960" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#0984e3" text-anchor="middle" letter-spacing="4">🌴 PHIÊN BẢN 2: THIÊN ĐƯỜNG BIỂN NHA TRANG 🌴</text>
    <text x="960" y="195" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#title2)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle">Little Days</text>
    <text x="960" y="240" font-family="sans-serif" font-size="20" font-weight="900" fill="#2b2d42" text-anchor="middle">HÀNH TRÌNH TOUR 3 ĐẢO NHA TRANG 27/08</text>
  </svg>`
  await sharp(Buffer.from(bg2Svg))
    .composite([
      { input: airport, left: 240, top: 320 },
      { input: beach, left: 1380, top: 340 },
      { input: chiikawa, left: 520, top: 480 },
      { input: usagi, left: 980, top: 460 }
    ])
    .png()
    .toFile(path.join(outputDir, 'banner_v2_beach.png'))

  // ══════════════════════════════════════════════════════════════════════
  // BANNER 3: COZY SAKURA CHERRY BLOSSOM VALLEY
  // ══════════════════════════════════════════════════════════════════════
  const bg3Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sakuraSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff0f5"/><stop offset="100%" stop-color="#ffd1dc"/></linearGradient>
      <linearGradient id="title3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff758c"/><stop offset="100%" stop-color="#e84393"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#sakuraSky)"/>
    <path d="M0,600 Q500,450 1100,580 Q1600,680 1920,520 L1920,1080 L0,1080 Z" fill="#98eecc"/>
    <path d="M0,720 Q600,620 1200,750 Q1650,820 1920,680 L1920,1080 L0,1080 Z" fill="#79e0ee" opacity="0.6"/>
    <!-- Header Box -->
    <rect x="380" y="60" width="1160" height="210" rx="36" fill="rgba(255,255,255,0.92)" stroke="#ffb8b8" stroke-width="4" />
    <text x="960" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#e84393" text-anchor="middle" letter-spacing="4">🌸 PHIÊN BẢN 3: NÔNG TRẠI HOA ANH ĐÀO 🌸</text>
    <text x="960" y="195" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#title3)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle">Little Days</text>
    <text x="960" y="240" font-family="sans-serif" font-size="20" font-weight="900" fill="#2b2d42" text-anchor="middle">TỔ ẤM YÊU THƯƠNG &amp; THƯ VIỆN KÝ ỨC</text>
  </svg>`
  await sharp(Buffer.from(bg3Svg))
    .composite([
      { input: house, left: 220, top: 330 },
      { input: library, left: 1380, top: 330 },
      { input: water, left: 820, top: 300 },
      { input: chiikawa, left: 520, top: 480 },
      { input: usagi, left: 980, top: 460 }
    ])
    .png()
    .toFile(path.join(outputDir, 'banner_v3_sakura.png'))

  // ══════════════════════════════════════════════════════════════════════
  // BANNER 4: STARRY NIGHT & ROMANTIC BISTRO
  // ══════════════════════════════════════════════════════════════════════
  const bg4Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2c2c54"/><stop offset="60%" stop-color="#474787"/><stop offset="100%" stop-color="#706fd3"/></linearGradient>
      <linearGradient id="title4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffb142"/><stop offset="100%" stop-color="#ff5252"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#nightSky)"/>
    <!-- Moon & Stars -->
    <circle cx="1650" cy="180" r="80" fill="#ffd32a" opacity="0.9"/>
    <circle cx="1620" cy="160" r="70" fill="url(#nightSky)"/>
    <circle cx="300" cy="120" r="4" fill="#ffffff" opacity="0.9"/>
    <circle cx="550" cy="220" r="5" fill="#ffffff" opacity="0.8"/>
    <circle cx="1300" cy="150" r="4" fill="#ffffff" opacity="0.9"/>
    <path d="M0,650 Q600,520 1200,660 Q1600,750 1920,600 L1920,1080 L0,1080 Z" fill="#33d9b2" opacity="0.8"/>
    <!-- Header Box -->
    <rect x="380" y="60" width="1160" height="210" rx="36" fill="rgba(34, 47, 62, 0.88)" stroke="#ffb142" stroke-width="4" />
    <text x="960" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffd32a" text-anchor="middle" letter-spacing="4">🌙 PHIÊN BẢN 4: ĐÊM SAO &amp; BỮA TỐI LÃNG MẠN 🌙</text>
    <text x="960" y="195" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#title4)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle">Little Days</text>
    <text x="960" y="240" font-family="sans-serif" font-size="20" font-weight="900" fill="#f7f1e3" text-anchor="middle">QUEEN ANN SKY LOUNGE &amp; GIẤC MƠ NHA TRANG</text>
  </svg>`
  await sharp(Buffer.from(bg4Svg))
    .composite([
      { input: restaurant, left: 240, top: 340 },
      { input: townhall, left: 1360, top: 340 },
      { input: chiikawa, left: 520, top: 480 },
      { input: usagi, left: 980, top: 460 }
    ])
    .png()
    .toFile(path.join(outputDir, 'banner_v4_twilight.png'))

  // ══════════════════════════════════════════════════════════════════════
  // BANNER 5: RPG ADVENTURE QUEST & GYM DOJO
  // ══════════════════════════════════════════════════════════════════════
  const bg5Svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rpgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff7979"/><stop offset="50%" stop-color="#badc58"/><stop offset="100%" stop-color="#6ab04c"/></linearGradient>
      <linearGradient id="title5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eb4d4b"/><stop offset="50%" stop-color="#f0932b"/><stop offset="100%" stop-color="#f9ca24"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#rpgSky)"/>
    <path d="M0,600 Q550,480 1100,600 Q1550,700 1920,550 L1920,1080 L0,1080 Z" fill="#6ab04c"/>
    <path d="M0,720 Q600,620 1200,750 Q1600,820 1920,680 L1920,1080 L0,1080 Z" fill="#22a6b3" opacity="0.6"/>
    <!-- Header Box -->
    <rect x="380" y="60" width="1160" height="210" rx="36" fill="rgba(255,255,255,0.92)" stroke="#f0932b" stroke-width="4" />
    <text x="960" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#eb4d4b" text-anchor="middle" letter-spacing="4">⚡ PHIÊN BẢN 5: ĐẤU TRƯỜNG LUYỆN THỂ &amp; THỬ THÁCH ⚡</text>
    <text x="960" y="195" font-family="sans-serif" font-size="76" font-weight="900" fill="url(#title5)" stroke="#ffffff" stroke-width="6" paint-order="stroke fill" text-anchor="middle">Little Days</text>
    <text x="960" y="240" font-family="sans-serif" font-size="20" font-weight="900" fill="#2b2d42" text-anchor="middle">RÈN LUYỆN 10 NGÀY &amp; KHỞI HÀNH NHA TRANG</text>
  </svg>`
  await sharp(Buffer.from(bg5Svg))
    .composite([
      { input: gym, left: 240, top: 330 },
      { input: townhall, left: 1360, top: 330 },
      { input: water, left: 820, top: 300 },
      { input: chiikawa, left: 520, top: 480 },
      { input: usagi, left: 980, top: 460 }
    ])
    .png()
    .toFile(path.join(outputDir, 'banner_v5_rpg.png'))

  console.log('✅ Successfully generated all 5 banner versions in public/assets/banners/')
}

generate5Banners().catch(console.error)
