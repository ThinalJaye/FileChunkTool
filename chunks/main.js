const path = require('path');
const { splitFile } = require('./fileSplitter');
const { mergeFiles } = require('./fileMerger');

const inputFilePath = path.join(__dirname, 'node-v22.13.1-x64.msi');
const chunksDir = path.join(__dirname, 'chunks');
const outputFilePath = path.join(__dirname, 'out-node-v22.13.1-x64.msi');

try {
  splitFile(inputFilePath, chunksDir);
  mergeFiles(chunksDir, outputFilePath);
} catch (err) {
  console.error(err);
}
