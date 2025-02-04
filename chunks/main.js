const path = require('path');
const { splitFile } = require('./fileSplitter');
const { mergeFiles } = require('./fileMerger');

const usage = `
Usage:
  Split:  node main.js --split <inputFile> <outputDir> [--size <chunkSizeMB>]
  Merge:  node main.js --merge <indexFile> <outputFile>

Options:
  --size     Chunk size in MB (optional, default: 1)
`;

const args = process.argv.slice(2);

try {
  if (args.length < 3) {
    console.log(usage);
    process.exit(1);
  }

  const command = args[0];

  switch (command) {
    case '--split': {
      const inputFile = args[1];
      const outputDir = args[2];
      const sizeIndex = args.indexOf('--size');
      const chunkSize = sizeIndex > -1 ? 
        parseInt(args[sizeIndex + 1]) * 1024 * 1024 : 
        undefined;

      splitFile(path.resolve(inputFile), path.resolve(outputDir), chunkSize);
      break;
    }

    case '--merge': {
      const indexFile = args[1];
      const outputFile = args[2];
      
      mergeFiles(
        path.resolve(path.dirname(indexFile)),
        path.resolve(outputFile),
        path.basename(indexFile)
      );
      break;
    }

    default:
      console.log('Invalid command. Use --split or --merge');
      console.log(usage);
  }
} catch (err) {
  console.error('Error:', err.message);
}
