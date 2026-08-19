import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildingsDir = path.join(__dirname, '..', 'public', 'assets', 'buildings');

async function processImage(filename) {
  const inputPath = path.join(buildingsDir, filename);
  const outName = filename.replace(/\.(jpg|jpeg|png)$/, '.png');
  const outputPath = path.join(buildingsDir, outName);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Flood fill from corners to find all connected background white/near-white pixels
  const visited = new Uint8Array(width * height);
  const isWhite = (x, y) => {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Background is near white (threshold > 235 on all channels)
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

  // Set alpha = 0 for all connected background pixels, with soft edge feathering
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * channels;
      if (visited[idx]) {
        data[pIdx + 3] = 0; // Completely transparent
      } else {
        // Check if adjacent to a visited pixel for anti-aliasing
        let nearBg = false;
        if (x > 0 && visited[idx - 1]) nearBg = true;
        else if (x < width - 1 && visited[idx + 1]) nearBg = true;
        else if (y > 0 && visited[idx - width]) nearBg = true;
        else if (y < height - 1 && visited[idx + width]) nearBg = true;

        if (nearBg) {
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];
          // If edge pixel is bright, soften alpha
          const avg = (r + g + b) / 3;
          if (avg > 210) {
            data[pIdx + 3] = Math.max(0, Math.floor(255 * (1 - (avg - 210) / 45)));
          }
        }
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Processed transparent PNG: ${outName}`);
}

async function run() {
  const files = fs.readdirSync(buildingsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  for (const f of files) {
    await processImage(f);
  }
  console.log('All building backgrounds removed successfully!');
}

run().catch(console.error);
