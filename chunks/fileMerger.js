const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function mergeFiles(chunksDir, outputFilePath, indexFileName) {
  const indexFile = path.join(chunksDir, indexFileName);
  if (!fs.existsSync(indexFile)) {
    throw new Error(`Index file not found: ${indexFile}`);
  }

  const fileMetadata = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const chunks = fileMetadata.chunks.sort((a, b) => a.index - b.index);

  // Verify all chunks exist
  for (const chunk of chunks) {
    const chunkPath = path.join(chunksDir, chunk.fileName);
    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Missing chunk file: ${chunk.fileName}`);
    }
  }

  const writeStream = fs.createWriteStream(outputFilePath);
  const hashStream = crypto.createHash('sha256');

  for (const chunk of chunks) {
    const chunkPath = path.join(chunksDir, chunk.fileName);
    const chunkData = fs.readFileSync(chunkPath);

    const checksum = crypto.createHash('sha256').update(chunkData).digest('hex');
    if (checksum !== chunk.checksum) {
      throw new Error(`Checksum mismatch for chunk ${chunk.fileName}`);
    }

    writeStream.write(chunkData);
    hashStream.update(chunkData);
    console.log(`Merged chunk ${chunk.index}`);
  }

  writeStream.end();

  // Verify complete file checksum
  const finalChecksum = hashStream.digest('hex');
  if (finalChecksum !== fileMetadata.fileChecksum) {
    throw new Error('Final file checksum mismatch');
  }

  console.log(`File merged successfully to: ${outputFilePath}`);
  console.log(`Original filename: ${fileMetadata.fileName}`);
  console.log(`File size: ${fileMetadata.size} bytes`);
  console.log(`Created: ${fileMetadata.created}`);
}

module.exports = { mergeFiles };
