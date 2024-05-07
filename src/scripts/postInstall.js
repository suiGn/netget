// scripts/postInstall.js
import { initializeDirectories } from '../modules/utils/GETDirs.js';  // Adjust the path as necessary depending on your project structure

// Function to run on post-install
function runPostInstall() {
    try {
        console.log('Initializing default .get directories...');
        initializeDirectories();  // This will create all necessary directories as defined in your GETDirs module
        console.log('All directories have been successfully initialized.');
    } catch (error) {
        console.error('Failed to initialize directories:', error);
    }
}

// Execute the post-install process
runPostInstall();