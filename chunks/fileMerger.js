const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function mergeFiles(chunksDir, outputFilePath) {
  const indexFile = path.join(chunksDir, 'chunks.index');
  const chunkIndex = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

  chunkIndex.sort((a, b) => a.chunkNumber - b.chunkNumber);

  const writeStream = fs.createWriteStream(outputFilePath);

  for (const chunk of chunkIndex) {
    const chunkPath = path.join(chunksDir, chunk.fileName);
    const chunkData = fs.readFileSync(chunkPath);

    const checksum = crypto.createHash('sha256').update(chunkData).digest('hex');
    if (checksum !== chunk.checksum) {
      throw new Error(`Checksum mismatch for chunk ${chunk.fileName}`);
    }

    writeStream.write(chunkData);
    console.log(`Merged chunk ${chunk.chunkNumber}`);
  }

  writeStream.end();
  console.log('File merge completed successfully');
}

module.exports = { mergeFiles };
