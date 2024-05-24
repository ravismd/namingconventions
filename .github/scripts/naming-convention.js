const fs = require('fs');
const path = require('path');

function validateFileNames(directory, pattern, invalidFiles, isTsx) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      if (file !== 'dist' && file !== 'node_modules') {
        validateFileNames(filePath, pattern, invalidFiles, isTsx);
      }
    } else {
      const ext = path.extname(file);
      if (isTsx === true) {
        if (file.endsWith('index.tsx')) {
          return;
        }
        if (ext !== '.tsx') {
          return;
        }
      } else {
        if (ext !== '.ts' && ext !== '.js') {
          return;
        }
      }
      if (!file.match(pattern)) {
        invalidFiles.push(filePath);
      }
    }
  });
}

const directoryToSearch = 'lib';

let invalidFiles = [];
let invalidTsxFiles = [];

validateFileNames(directoryToSearch, /^[a-z-]+(\.[a-z-]+)?(\.(ts|js))?$/, invalidFiles, false);
validateFileNames(
  directoryToSearch,
  /^([A-Z][a-zA-Z\d]*)?(?:\.[a-zA-Z\d]+)?(\.(test|spec))?\.(tsx?)$/,
  invalidTsxFiles,
  true
);

if (invalidTsxFiles.length) {
  invalidFiles.push(invalidTsxFiles);
}
if (invalidFiles.length > 0) {
  const errorMessage = `The following files do not follow the MTN S2 naming convention:\n${invalidFiles.join('\n')}`;
  throw new Error(errorMessage);
} else {
  console.log('All files follow the MTN S2 naming conventions.');
}

invalidTsxFiles = [];
invalidFiles = [];
