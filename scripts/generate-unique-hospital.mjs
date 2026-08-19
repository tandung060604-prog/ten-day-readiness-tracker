import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '..', 'public', 'assets', 'buildings', 'hospital.png');

const width = 512;
const height = 512;

// Create a high-detail 3D isometric Love Hospital clinic in Chiikawa / Animal Crossing style
const hospitalSvg = `
<svg width="${width}" height="${height}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients & Filters -->
    <filter id="softShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#5a2a38" flood-opacity="0.32" />
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Wall Gradients -->
    <linearGradient id="wallFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8f2" />
      <stop offset="100%" stop-color="#f5e1d5" />
    </linearGradient>
    <linearGradient id="wallSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#edd2c2" />
      <stop offset="100%" stop-color="#dba894" />
    </linearGradient>

    <!-- Roof Gradients (Pastel Pink Rose Tile) -->
    <linearGradient id="roofTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9ebb" />
      <stop offset="100%" stop-color="#e85d7f" />
    </linearGradient>
    <linearGradient id="roofSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c94465" />
      <stop offset="100%" stop-color="#8f243e" />
    </linearGradient>

    <!-- Tower Roof Gradient -->
    <linearGradient id="towerRoof" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7597" />
      <stop offset="100%" stop-color="#d6336c" />
    </linearGradient>

    <!-- Medical Red Cross Gradient -->
    <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4d6d" />
      <stop offset="100%" stop-color="#c9184a" />
    </linearGradient>

    <!-- Ground Ambient Shadow -->
    <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(40, 15, 25, 0.45)" />
      <stop offset="60%" stop-color="rgba(40, 15, 25, 0.2)" />
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
    </radialGradient>
  </defs>

  <!-- 1. Ground Contact Shadow -->
  <ellipse cx="256" cy="425" rx="190" ry="50" fill="url(#groundShadow)" />

  <g filter="url(#softShadow)">
    <!-- 2. BASE CLINIC MAIN BODY (Isometric Angles) -->
    
    <!-- Left Main Wall -->
    <polygon points="120,290 256,365 256,430 120,355" fill="url(#wallFront)" stroke="#8f5a4e" stroke-width="3" />
    <!-- Right Main Wall -->
    <polygon points="256,365 392,290 392,355 256,430" fill="url(#wallSide)" stroke="#8f5a4e" stroke-width="3" />

    <!-- Wooden Beam Timber Framing on Walls -->
    <line x1="120" y1="355" x2="256" y2="430" stroke="#a06354" stroke-width="6" />
    <line x1="256" y1="430" x2="392" y2="355" stroke="#7a463a" stroke-width="6" />
    <line x1="188" y1="327" x2="188" y2="392" stroke="#a06354" stroke-width="4" />
    <line x1="324" y1="327" x2="324" y2="392" stroke="#7a463a" stroke-width="4" />

    <!-- 3. CLINIC ENTRANCE DOOR (Front Left) -->
    <polygon points="165,345 210,370 210,418 165,393" fill="#845136" stroke="#5a3120" stroke-width="2.5" />
    <!-- Door Window with Warm Light -->
    <polygon points="172,355 203,372 203,388 172,371" fill="#ffe066" stroke="#c49b2f" stroke-width="2" />
    <!-- Medical Heart on Door -->
    <circle cx="188" cy="396" r="6" fill="#ff4d6d" />

    <!-- 4. APOTHECARY PHARMACY WINDOW (Right Wall) -->
    <polygon points="290,345 358,308 358,358 290,395" fill="#ffeaa7" stroke="#8f5a4e" stroke-width="2.5" />
    <!-- Window Frame -->
    <line x1="324" y1="326" x2="324" y2="376" stroke="#8f5a4e" stroke-width="2" />
    <line x1="290" y1="370" x2="358" y2="333" stroke="#8f5a4e" stroke-width="2" />
    <!-- Flower Box with Pink Tulips below Window -->
    <polygon points="285,392 363,350 363,365 285,407" fill="#6c4029" />
    <!-- Pink Flowers in Box -->
    <circle cx="300" cy="385" r="5" fill="#ff758f" />
    <circle cx="316" cy="376" r="6" fill="#ff4d6d" />
    <circle cx="332" cy="367" r="5" fill="#ff758f" />
    <circle cx="348" cy="358" r="6" fill="#ffb3c1" />

    <!-- 5. MAIN ROOF (Slanted Mansard Roof with Clay Tile Curves) -->
    <polygon points="256,180 80,285 256,360 432,285" fill="url(#roofTop)" stroke="#6b1d31" stroke-width="3.5" />
    <!-- Roof Underside Overhang Shadow -->
    <polygon points="80,285 256,360 256,370 80,295" fill="url(#roofSide)" />
    <polygon points="432,285 256,360 256,370 432,295" fill="url(#roofSide)" />

    <!-- Roof Clay Tile Texture Lines -->
    <line x1="124" y1="258" x2="300" y2="333" stroke="#ffb3c1" stroke-width="3" opacity="0.6" />
    <line x1="168" y1="232" x2="344" y2="307" stroke="#ffb3c1" stroke-width="3" opacity="0.6" />
    <line x1="212" y1="206" x2="388" y2="281" stroke="#ffb3c1" stroke-width="3" opacity="0.6" />

    <!-- 6. CENTRAL MEDICAL CLOCK / BELL TOWER (Distinguishes from Sleep Center) -->
    <!-- Tower Base -->
    <polygon points="216,130 296,130 296,210 216,210" fill="#fff5ea" stroke="#8f5a4e" stroke-width="3" />
    <!-- Tower Face Shading -->
    <polygon points="256,150 296,130 296,210 256,230" fill="#edd2c2" stroke="#8f5a4e" stroke-width="2" />
    <polygon points="216,130 256,150 256,230 216,210" fill="#fff8f2" stroke="#8f5a4e" stroke-width="2" />

    <!-- Round Tower Medical Heart Clock -->
    <circle cx="236" cy="180" r="16" fill="#ffffff" stroke="#ffccd5" stroke-width="2.5" />
    <!-- Pink Medical Cross in Clock -->
    <path d="M 233 169 L 239 169 L 239 177 L 247 177 L 247 183 L 239 183 L 239 191 L 233 191 L 233 183 L 225 183 L 225 177 L 233 177 Z" fill="url(#crossGrad)" />

    <!-- 7. TOWER ROOF (Pyramid Steeple with Big Red Cross on Spire) -->
    <polygon points="256,48 200,135 256,155" fill="url(#towerRoof)" stroke="#6b1d31" stroke-width="3" />
    <polygon points="256,48 312,135 256,155" fill="#c9184a" stroke="#6b1d31" stroke-width="3" />

    <!-- 8. BIG GOLDEN SPIRE WITH GLOWING RED-PINK MEDICAL CROSS ON TOP -->
    <line x1="256" y1="48" x2="256" y2="12" stroke="#f59f00" stroke-width="4" />
    <circle cx="256" cy="12" r="5" fill="#ffd43b" />

    <g transform="translate(256, -8)" filter="url(#glow)">
      <!-- Glowing Red Cross -->
      <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#ffccd5" stroke-width="3.5" />
      <path d="M -5 -16 L 5 -16 L 5 -5 L 16 -5 L 16 5 L 5 5 L 5 16 L -5 16 L -5 5 L -16 5 L -16 -5 L -5 -5 Z" fill="url(#crossGrad)" stroke="#ffffff" stroke-width="1.5" />
      <!-- Heart in Center of Cross -->
      <circle cx="0" cy="0" r="4" fill="#ffffff" />
    </g>

    <!-- 9. CHIMNEY PUFFING HEART BUBBLES (Left Roof) -->
    <polygon points="125,185 155,170 155,230 125,245" fill="#a06354" stroke="#5a3120" stroke-width="2.5" />
    <polygon points="125,185 155,170 165,175 135,190" fill="#7a463a" />
    <!-- Heart Bubbles rising from chimney -->
    <text x="110" y="160" font-size="20" fill="#ff758f">💖</text>
    <text x="125" y="130" font-size="16" fill="#ff4d6d">💕</text>
    <text x="105" y="105" font-size="22" fill="#ffb3c1">🌸</text>

    <!-- 10. FRONT CLINIC WOODEN SIGNBOARD -->
    <g transform="translate(256, 445)">
      <rect x="-85" y="-14" width="170" height="30" rx="15" fill="#ffffff" stroke="#ff8da1" stroke-width="3" filter="url(#softShadow)" />
      <text x="0" y="6" font-family="'Nunito', 'Segoe UI', sans-serif" font-size="13.5" font-weight="900" fill="#d6336c" text-anchor="middle" letter-spacing="0.5">🏥 BỆNH VIỆN YÊU 💖</text>
    </g>

    <!-- 11. CUTE MEDICINE BOTTLES & FIRST AID KIT ON ENTRANCE PORCH -->
    <g transform="translate(232, 405)">
      <!-- First Aid Kit Bag -->
      <rect x="-14" y="-10" width="28" height="20" rx="5" fill="#ffffff" stroke="#ff4d6d" stroke-width="2" />
      <path d="M -3 -6 L 3 -6 L 3 -2 L 7 -2 L 7 2 L 3 2 L 3 6 L -3 6 L -3 2 L -7 2 L -7 -2 L -3 -2 Z" fill="#ff4d6d" />
      <!-- Medicine Bottle -->
      <rect x="18" y="-12" width="12" height="22" rx="4" fill="#a5d8ff" stroke="#339af0" stroke-width="1.5" />
      <rect x="20" y="-16" width="8" height="4" fill="#ffffff" stroke="#339af0" stroke-width="1" />
    </g>
  </g>
</svg>
`;

async function generateHospital() {
  await sharp(Buffer.from(hospitalSvg))
    .png()
    .toFile(outputPath);

  console.log('✅ Generated unique Love Hospital 3D Isometric asset at public/assets/buildings/hospital.png');
}

generateHospital().catch(console.error);
