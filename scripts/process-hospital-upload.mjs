import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadedImagePath = 'C:/Users/HP/.gemini/antigravity-ide/brain/0f8c8f99-0b38-47f0-8387-489852961f6e/.user_uploaded/media_1787137601164.jpg';
const outputPngPath = path.join(__dirname, '..', 'public', 'assets', 'buildings', 'hospital.png');
const outputJpgPath = path.join(__dirname, '..', 'public', 'assets', 'buildings', 'hospital.jpg');

async function processHospitalImage() {
  const image = sharp(uploadedImagePath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Flood fill from corners to find all connected background white/near-white pixels
  const visited = new Uint8Array(width * height);
  const isWhite = (x, y) => {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Near white background threshold
    return r > 230 && g > 230 && b > 230;
  };

  const queue = [];
  // Push all border pixels that are near white
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[0 * width + x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width + 0]) { queue.push(0, y); visited[y * width + 0] = 1; }
    if (isWhite(width - 1, y) && !visited[y * width + (width - 1)]) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && isWhite(nx, ny)) {
          visited[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Set alpha = 0 for all flood-filled background pixels with edge softening
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const idx = pIdx * channels;
      if (visited[pIdx]) {
        data[idx + 3] = 0;
      } else {
        // Soften feathering on near-white boundary
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r > 240 && g > 240 && b > 240) {
          // Check if neighboring pixel is transparent
          let hasTransNeighbor = false;
          if (x > 0 && visited[y * width + (x - 1)]) hasTransNeighbor = true;
          if (x < width - 1 && visited[y * width + (x + 1)]) hasTransNeighbor = true;
          if (y > 0 && visited[(y - 1) * width + x]) hasTransNeighbor = true;
          if (y < height - 1 && visited[(y + 1) * width + x]) hasTransNeighbor = true;
          if (hasTransNeighbor) {
            data[idx + 3] = Math.min(data[idx + 3], Math.max(0, 255 - ((r + g + b) / 3 - 235) * 12));
          }
        }
      }
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png()
    .toFile(outputPngPath);

  // Copy raw jpg as fallback
  fs.copyFileSync(uploadedImagePath, outputJpgPath);

  console.log('✅ Successfully processed uploaded Love Hospital image to public/assets/buildings/hospital.png and hospital.jpg');
}

processHospitalImage().catch(console.error);
