import fs from 'fs';

// Function to ensure the directory exists
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Directory created: ${directory}`);
    }else{
    return true;
    }
}

/**
 * Checks if a specified path (directory or file) exists.
 * @param {string} path - The path to check.
 * @returns {boolean} - True if the path exists, false otherwise.
 */
function Path_Exists(path) {
    return fs.existsSync(path);
}

// Export both functions explicitly
export { ensureDirectoryExists, Path_Exists };
