// fileSplitter.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function splitFile(filePath, outputDir, chunkSize = 1024 * 1024) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileStats = fs.statSync(filePath);
  const originalFileName = path.basename(filePath);
  
  const fileMetadata = {
    fileName: originalFileName,
    size: fileStats.size,
    created: new Date().toISOString(),
    totalChunks: Math.ceil(fileStats.size / chunkSize),
    fileChecksum: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
    chunkSize: chunkSize,
    mimeType: path.extname(filePath).slice(1),
    chunks: []
  };

  let chunkNumber = 0;

  for (let offset = 0; offset < fileBuffer.length; offset += chunkSize) {
    const chunk = fileBuffer.slice(offset, offset + chunkSize);
    const chunkFileName = `chunk_${chunkNumber}.dat`;
    const chunkPath = path.join(outputDir, chunkFileName);

    fs.writeFileSync(chunkPath, chunk);

    fileMetadata.chunks.push({
      index: chunkNumber,
      fileName: chunkFileName,
      size: chunk.length,
      checksum: crypto.createHash('sha256').update(chunk).digest('hex'),
      offset
    });

    console.log(`Created chunk ${chunkNumber}`);
    chunkNumber++;
  }

  const indexFile = path.join(outputDir, `${originalFileName}.index`);
  fs.writeFileSync(indexFile, JSON.stringify(fileMetadata, null, 2));

  console.log(`File split into ${chunkNumber} chunks with index file: ${indexFile}`);
}

module.exports = { splitFile };
