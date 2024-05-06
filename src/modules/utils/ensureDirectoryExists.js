import fs from 'fs';
// Function to ensure the directory exists
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
   // console.log(`Ensuring Directory Exists:${directory}`);
}

export default ensureDirectoryExists;