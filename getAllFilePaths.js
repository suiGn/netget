import { readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Recursively get all file paths in a directory
 * @param {string} dir - The directory to read
 * @param {Array} fileList - The list of file paths
 * @returns {Array} - The list of file paths
 */
function getAllFilePaths(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      fileList = getAllFilePaths(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const directoryPath = '../../../../../../Sandbox/dev_tools/assets/better-docs/tmpl';
const paths = getAllFilePaths(directoryPath);

console.log(paths);
