import os from 'os';
import path from 'path';
import ensureDirectoryExists from '../../utils/ensureDirectoryExists.js';

/**
 * Gets the path to the `.get` directory in the user's home directory.
 * Ensures that the directory exists or creates it if it doesn't.
 * @returns {string} Path to the `.get` directory.
 */
function getGetDirectory() {
    try {
        const homeDirectory = os.homedir();
        const getDirectory = path.join(homeDirectory, '.get');
        ensureDirectoryExists(getDirectory);
        return getDirectory;
    } catch (error) {
        console.error('Error creating .get directory:', error);
        return null;
    }
}

/**
 * Ensures the 'XBlocks-available' directory exists within a given path.
 * @param {string} givenPath - The base path where the directory should be created.
 * @returns {string} Path to the 'XBlocks-available' directory.
 */
function createXBlocksActiveDir(givenPath) {
    const xBlocksAvailableDir = path.join(givenPath, 'XBlocks-available');
    ensureDirectoryExists(xBlocksAvailableDir);
    return xBlocksAvailableDir;
}

/**
 * Ensures the 'XBlocks-available' directory exists within a given path.
 * @param {string} givenPath - The base path where the directory should be created.
 * @returns {string} Path to the 'XBlocks-available' directory.
 */
function createXBlocksEnabledDir(givenPath) {
    const xBlocksEnabledDir = path.join(givenPath, 'XBlocks-enabled');
    ensureDirectoryExists(xBlocksEnabledDir);
    return xBlocksEnabledDir;
}


/**
 * Gets the path to the 'static' directory within the `.get` directory.
 * Ensures that the directory exists or creates it if it doesn't.
 * @returns {string} Path to the 'static' directory.
 */
function getStaticPath() {
    try {
        const getDirectory = getGetDirectory();
        const staticPath = path.join(getDirectory, 'static');
        ensureDirectoryExists(staticPath);
        return staticPath;
    } catch (error) {
        console.error('Error creating static directory:', error);
        return null;
    }
}

/**
 * Gets the path to the 'dev' directory within the `.get` directory.
 * Ensures that the directory exists or creates it if it doesn't.
 * @returns {string} Path to the 'dev' directory.
 */
function getDevPath() {
    try {
        const getDirectory = getGetDirectory();
        const devPath = path.join(getDirectory, 'dev');
        ensureDirectoryExists(devPath);
        return devPath;
    } catch (error) {
        console.error('Error creating dev directory:', error);
        return null;
    }
}

/**
 * Gets the path to the 'static' directory within the `.get` directory.
 * Ensures that the directory exists or creates it if it doesn't.
 * @returns {string} Path to the 'static' directory.
 */
function getStaticPath_dev() {
    try {
        const devPath = getDevPath();
        const staticPath_dev = path.join(devPath, 'static');
        ensureDirectoryExists(staticPath_dev);
        return staticPath_dev;
    } catch (error) {
        console.error('Error creating static directory in dev:', error);
        return null;
    }
}

export {
     getGetDirectory, 
     getStaticPath, 
     getDevPath, 
     getStaticPath_dev, 
     createXBlocksActiveDir, 
     createXBlocksEnabledDir };
