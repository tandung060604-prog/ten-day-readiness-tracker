import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildingsDir = path.join(__dirname, '..', 'public', 'assets', 'buildings');

async function createHospitalAsset() {
  const baseImgPath = path.join(buildingsDir, 'sleep.png');
  const outputPath = path.join(buildingsDir, 'hospital.png');

  const base = sharp(baseImgPath);
  const metadata = await base.metadata();
  const { width = 512, height = 512 } = metadata;

  // Create an SVG overlay for the Hospital Heart & Cross Emblem, Glowing Pink Clinic Aura, and Red Cross Badge
  const svgBadge = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="pinkAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff6b8b" stop-opacity="0.6"/>
        <stop offset="60%" stop-color="#ff8da1" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffccd5" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff477e" />
        <stop offset="100%" stop-color="#ff0054" />
      </linearGradient>
    </defs>

    <!-- Warm Healing Rose Tint Ambient -->
    <ellipse cx="${width * 0.5}" cy="${height * 0.65}" rx="${width * 0.42}" ry="${height * 0.28}" fill="url(#pinkAura)" />

    <!-- Hospital Roof Top Sign: Heart & Pink Cross -->
    <g transform="translate(${width * 0.5}, ${height * 0.16})" filter="url(#glow)">
      <!-- Outer White Glow Circle -->
      <circle cx="0" cy="0" r="38" fill="#ffffff" stroke="#ffccd5" stroke-width="4" filter="drop-shadow(0 6px 12px rgba(255, 71, 126, 0.4))" />
      <circle cx="0" cy="0" r="32" fill="#fff0f5" />
      
      <!-- Pink Medical Cross -->
      <path d="M -6 -20 L 6 -20 L 6 -6 L 20 -6 L 20 6 L 6 6 L 6 20 L -6 20 L -6 6 L -20 6 L -20 -6 L -6 -6 Z" fill="url(#crossGrad)" stroke="#ffffff" stroke-width="1.5" />
      
      <!-- Central Mini Heart -->
      <path d="M 0 3 C -3 -2, -8 -2, -8 -6 C -8 -10, -3 -12, 0 -8 C 3 -12, 8 -10, 8 -6 C 8 -2, 3 -2, 0 3 Z" transform="translate(0, 1) scale(0.65)" fill="#ffffff" />
    </g>

    <!-- Hospital Entrance Signboard: "LOVE CLINIC 🏥" -->
    <g transform="translate(${width * 0.5}, ${height * 0.88})">
      <rect x="-65" y="-14" width="130" height="28" rx="14" fill="#ffffff" stroke="#ffccd5" stroke-width="2.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))" />
      <text x="0" y="5" font-family="'Nunito', 'Segoe UI', sans-serif" font-size="12" font-weight="900" fill="#d6336c" text-anchor="middle" letter-spacing="0.5">🏥 BỆNH VIỆN YÊU</text>
    </g>
  </svg>
  `;

  await sharp(baseImgPath)
    .composite([
      {
        input: Buffer.from(svgBadge),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toFile(outputPath);

  console.log('✅ Generated public/assets/buildings/hospital.png successfully!');
}

createHospitalAsset().catch(console.error);
