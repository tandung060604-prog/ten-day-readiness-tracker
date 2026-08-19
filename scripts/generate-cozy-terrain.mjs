import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function generateCozyTerrain() {
  const width = 1920
  const height = 1080

  console.log('Generating custom cozy island terrain map (1920x1080)...')

  // Build the complete vector terrain map SVG
  const terrainSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients -->
      <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#b8e994" />
        <stop offset="35%" stop-color="#78e08f" />
        <stop offset="70%" stop-color="#38ada9" />
        <stop offset="100%" stop-color="#079992" />
      </linearGradient>

      <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#dff9fb" />
        <stop offset="100%" stop-color="#c7ecee" />
      </linearGradient>

      <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#81ecec" />
        <stop offset="50%" stop-color="#74b9ff" />
        <stop offset="100%" stop-color="#0984e3" />
      </linearGradient>

      <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00cec9" />
        <stop offset="40%" stop-color="#0984e3" />
        <stop offset="100%" stop-color="#1e3799" />
      </linearGradient>

      <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffeaa7" />
        <stop offset="100%" stop-color="#fdcb6e" />
      </linearGradient>

      <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f5e6d3" />
        <stop offset="100%" stop-color="#faeedf" />
      </linearGradient>

      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(20,50,30,0.18)" />
      </filter>

      <!-- Cobblestone Pattern -->
      <pattern id="cobblePattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3" fill="#ecd9c6" opacity="0.6" />
        <circle cx="15" cy="15" r="3.5" fill="#ecd9c6" opacity="0.6" />
        <circle cx="15" cy="5" r="2.5" fill="#dec4aa" opacity="0.5" />
        <circle cx="5" cy="15" r="2.8" fill="#dec4aa" opacity="0.5" />
      </pattern>
    </defs>

    <!-- 1. BASE OCEAN LAYER (Full background) -->
    <rect width="${width}" height="${height}" fill="url(#oceanGrad)" />

    <!-- Ocean wave foam lines in deep sea -->
    <path d="M 1200,800 Q 1500,750 1920,850" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="6" stroke-dasharray="20 15" />
    <path d="M 1100,920 Q 1450,880 1920,980" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="8" stroke-dasharray="30 20" />

    <!-- 2. MAIN ISLAND LANDMASS (Lush Green with Beach Shoreline) -->
    <!-- Sand Shoreline Base -->
    <path d="M 0,0 L 1650,0 Q 1850,300 1780,650 Q 1720,850 1450,960 Q 1200,1050 700,1080 L 0,1080 Z" fill="url(#sandGrad)" filter="url(#softShadow)" />

    <!-- Grass Plateau -->
    <path d="M 0,0 L 1580,0 Q 1760,280 1700,600 Q 1630,800 1380,900 Q 1120,990 650,1020 L 0,1020 Z" fill="url(#grassGrad)" />

    <!-- 3. GENTLE HILL LAYERS (Biome Elevations) -->
    <!-- Northwest Hills (Love Home & Sleep Haven) -->
    <path d="M 0,100 Q 250,80 450,220 Q 350,550 0,600 Z" fill="#9de388" opacity="0.8" />
    <path d="M 0,150 Q 180,140 320,260 Q 220,480 0,520 Z" fill="#b1f09e" opacity="0.6" />

    <!-- Northeast Highland Ridge (Gym Dojo & Library) -->
    <path d="M 500,0 Q 800,50 1150,120 Q 1400,280 1300,520 Q 1000,450 700,320 Q 550,180 500,0 Z" fill="#7ed67b" opacity="0.75" />

    <!-- 4. MEANDERING BLUE RIVER & LAKE -->
    <!-- River Stream flowing from North into Western Lake -->
    <path d="M 0,420 Q 180,380 320,410 Q 520,450 620,380 Q 720,300 900,280 Q 1050,270 1200,180 L 1220,120 Q 1020,200 880,220 Q 680,240 560,330 Q 480,390 300,350 Q 160,320 0,350 Z" fill="url(#riverGrad)" />

    <!-- Lake near Water Fountain -->
    <ellipse cx="990" cy="200" rx="90" ry="45" fill="url(#riverGrad)" />
    <circle cx="990" cy="200" r="30" fill="#74b9ff" opacity="0.8" />

    <!-- Wooden Footbridge crossing the River -->
    <g transform="translate(420, 370) rotate(-25)">
      <rect x="-18" y="-30" width="36" height="60" rx="4" fill="#a0522d" stroke="#5c2c16" stroke-width="2" />
      <line x1="-14" y1="-20" x2="14" y2="-20" stroke="#f5deb3" stroke-width="2" />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#f5deb3" stroke-width="2" />
      <line x1="-14" y1="20" x2="14" y2="20" stroke="#f5deb3" stroke-width="2" />
    </g>

    <!-- 5. COBBLESTONE ROAD NETWORK (Linking all 12 zones) -->
    <!-- Central Circular Plaza -->
    <circle cx="960" cy="560" r="140" fill="url(#roadGrad)" stroke="#dec4aa" stroke-width="6" />
    <circle cx="960" cy="560" r="140" fill="url(#cobblePattern)" />
    <circle cx="960" cy="560" r="60" fill="#e8d5c4" stroke="#d5bba2" stroke-width="4" />

    <!-- Road Arteries -->
    <!-- To Townhall (South) -->
    <path d="M 960,700 L 930,860 L 910,870" fill="none" stroke="url(#roadGrad)" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 960,700 L 930,860 L 910,870" fill="none" stroke="#dec4aa" stroke-width="48" stroke-dasharray="4 8" stroke-linecap="round" />

    <!-- To Home & Sleep Haven (Northwest) -->
    <path d="M 860,490 Q 650,420 420,370 Q 280,340 290,290" fill="none" stroke="url(#roadGrad)" stroke-width="42" stroke-linecap="round" />
    <path d="M 290,290 Q 200,320 250,590" fill="none" stroke="url(#roadGrad)" stroke-width="36" stroke-linecap="round" />

    <!-- To Gym Dojo & Water Fountain (North) -->
    <path d="M 940,420 Q 850,300 640,220" fill="none" stroke="url(#roadGrad)" stroke-width="42" stroke-linecap="round" />
    <path d="M 940,420 Q 980,320 990,220" fill="none" stroke="url(#roadGrad)" stroke-width="38" stroke-linecap="round" />

    <!-- To Library & Photo Album (Northeast) -->
    <path d="M 1060,490 Q 1200,380 1340,240 Q 1480,260 1620,290" fill="none" stroke="url(#roadGrad)" stroke-width="42" stroke-linecap="round" />

    <!-- To Market & Bistro (East / Southeast) -->
    <path d="M 1080,600 Q 1240,550 1420,510" fill="none" stroke="url(#roadGrad)" stroke-width="40" stroke-linecap="round" />
    <path d="M 880,650 Q 650,720 480,820" fill="none" stroke="url(#roadGrad)" stroke-width="40" stroke-linecap="round" />

    <!-- Grand Boulevard to Airport & Nha Trang Beach (Southeast Coast) -->
    <path d="M 1020,660 Q 1200,720 1360,760 L 1680,800" fill="none" stroke="#ffeaa7" stroke-width="56" stroke-linecap="round" />
    <path d="M 1020,660 Q 1200,720 1360,760 L 1680,800" fill="none" stroke="#fdcb6e" stroke-width="56" stroke-dasharray="6 12" stroke-linecap="round" opacity="0.7" />

    <!-- 6. DECORATIVE ELEMENTS (Garden Plots, Flowers, Trees, Palm Trees) -->
    <!-- Flower Gardens around Plaza -->
    <circle cx="860" cy="500" r="16" fill="#ff7675" />
    <circle cx="860" cy="500" r="8" fill="#ffeaa7" />
    <circle cx="1060" cy="500" r="16" fill="#fd79a8" />
    <circle cx="1060" cy="500" r="8" fill="#ffeaa7" />
    <circle cx="960" cy="440" r="18" fill="#a29bfe" />
    <circle cx="960" cy="440" r="9" fill="#ffffff" />

    <!-- Tropical Palm Trees at Nha Trang Coast -->
    <g transform="translate(1620, 710)">
      <path d="M0,0 Q15,-40 25,-70" fill="none" stroke="#a0522d" stroke-width="8" stroke-linecap="round" />
      <path d="M25,-70 Q-10,-95 -35,-85" fill="none" stroke="#20bf6b" stroke-width="6" stroke-linecap="round" />
      <path d="M25,-70 Q60,-95 75,-75" fill="none" stroke="#20bf6b" stroke-width="6" stroke-linecap="round" />
      <path d="M25,-70 Q35,-110 25,-120" fill="none" stroke="#20bf6b" stroke-width="6" stroke-linecap="round" />
    </g>

    <g transform="translate(1740, 780)">
      <path d="M0,0 Q-10,-35 -15,-65" fill="none" stroke="#a0522d" stroke-width="7" stroke-linecap="round" />
      <path d="M-15,-65 Q-50,-85 -70,-75" fill="none" stroke="#26de81" stroke-width="5" stroke-linecap="round" />
      <path d="M-15,-65 Q20,-90 40,-75" fill="none" stroke="#26de81" stroke-width="5" stroke-linecap="round" />
      <path d="M-15,-65 Q-5,-105 -15,-115" fill="none" stroke="#26de81" stroke-width="5" stroke-linecap="round" />
    </g>

    <!-- Sakura Cherry Blossom Trees near Library & Home -->
    <g transform="translate(320, 180)">
      <circle cx="0" cy="0" r="32" fill="#ffb8b8" opacity="0.85" />
      <circle cx="12" cy="-10" r="24" fill="#ff7675" opacity="0.75" />
      <circle cx="-10" cy="8" r="20" fill="#ffffff" opacity="0.5" />
    </g>

    <g transform="translate(1380, 180)">
      <circle cx="0" cy="0" r="35" fill="#ffb8b8" opacity="0.85" />
      <circle cx="-14" cy="-8" r="26" fill="#fd79a8" opacity="0.75" />
      <circle cx="10" cy="12" r="22" fill="#ffffff" opacity="0.5" />
    </g>

    <!-- Nha Trang Tropical Beach Umbrellas & Surfboard -->
    <g transform="translate(1700, 890)">
      <!-- Umbrella -->
      <circle cx="0" cy="-20" r="28" fill="#ff7675" stroke="#ffffff" stroke-width="3" />
      <path d="M-28,-20 L28,-20" stroke="#ffffff" stroke-width="3" />
      <path d="M0,-48 L0,8" stroke="#ffffff" stroke-width="3" />
      <!-- Surfboard -->
      <ellipse cx="40" cy="-5" rx="8" ry="24" transform="rotate(25 40 -5)" fill="#0984e3" stroke="#ffffff" stroke-width="2" />
    </g>
  </svg>
  `

  const terrainBuffer = Buffer.from(terrainSvg)

  // Output crisp JPEG & PNG
  await sharp(terrainBuffer)
    .jpeg({ quality: 96 })
    .toFile(path.join(projectRoot, 'public/assets/game_terrain.jpg'))

  console.log('✅ Successfully generated new high-resolution terrain: public/assets/game_terrain.jpg')
}

generateCozyTerrain().catch(console.error)
