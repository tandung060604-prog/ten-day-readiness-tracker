const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
  { url: 'https://static.wikia.nocookie.net/chiikawa/images/2/2c/AdorableCutieChiikawa.png/revision/latest', name: 'chiikawa.png' },
  { url: 'https://static.wikia.nocookie.net/chiikawa/images/4/43/YahaUsagi.png/revision/latest', name: 'usagi.png' },
  { url: 'https://static.wikia.nocookie.net/chiikawa/images/6/61/SweetBabyHachiware2.png/revision/latest', name: 'hachiware.png' }
];

function fetchFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved:', dest);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    const dest = path.join(__dirname, 'public', 'assets', item.name);
    await fetchFile(item.url, dest);
  }
  console.log('All downloads completed!');
}

run().catch(console.error);
