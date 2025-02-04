// fileSplitter.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CHUNK_SIZE = 1024 * 1024;

function splitFile(filePath, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const chunkIndex = [];
  let chunkNumber = 0;

  for (let offset = 0; offset < fileBuffer.length; offset += CHUNK_SIZE) {
    const chunk = fileBuffer.slice(offset, offset + CHUNK_SIZE);
    const chunkFileName = path.join(outputDir, `chunk_${chunkNumber}.dat`);

    fs.writeFileSync(chunkFileName, chunk);

    const checksum = crypto.createHash('sha256').update(chunk).digest('hex');
    chunkIndex.push({
      chunkNumber,
      fileName: `chunk_${chunkNumber}.dat`,
      size: chunk.length,
      checksum,
      offset
    });

    console.log(`Created chunk ${chunkNumber}`);
    chunkNumber++;
  }

  const indexFile = path.join(outputDir, 'chunks.index');
  fs.writeFileSync(indexFile, JSON.stringify(chunkIndex, null, 2));

  console.log(`File split into ${chunkNumber} chunks with index file.`);
}

module.exports = { splitFile };
