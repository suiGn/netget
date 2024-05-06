// netget/src/modules/NetGetX/config/settingXPaths.js
import { getGetDirectory, getStaticPath, getDevPath, getStaticPath_dev } from './getDirPaths.js';
import saveUserConfig from './saveUserConfig.js';

/**
 * Verifies and sets the .get directory path in userConfig if not already set.
 * @param {object} userConfig - Configuration object that may contain existing path configurations.
 * @returns {Promise<string>} The set or existing .get directory path.
 */
async function verifyAndGet(userConfig) {
    if (!userConfig.getPath) {
        console.log("Setting .get directory path...");
        userConfig.getPath = getGetDirectory();
        await saveUserConfig({ getPath: userConfig.getPath });
    } else {
        console.log(".get directory path is already set.");
    }
    return userConfig.getPath;
}

/**
 * Verifies and sets the static directory path in userConfig if not already set.
 * @param {object} userConfig - Configuration object that may contain existing path configurations.
 * @returns {Promise<string>} The set or existing static directory path.
 */
async function verifyAndSetStaticPath(userConfig) {
    if (!userConfig.staticPath) {
        console.log("Setting static directory path...");
        userConfig.staticPath = getStaticPath();
        await saveUserConfig({ staticPath: userConfig.staticPath });
    } else {
        console.log("Static directory path is already set.");
    }
    return userConfig.staticPath;
}

/**
 * Verifies and sets the development directory path in userConfig if not already set.
 * @param {object} userConfig - Configuration object that may contain existing path configurations.
 * @returns {Promise<string>} The set or existing development directory path.
 */
async function verifyAndSetDevPath(userConfig) {
    if (!userConfig.devPath) {
        console.log("Setting dev directory path...");
        userConfig.devPath = getDevPath();
        await saveUserConfig({ devPath: userConfig.devPath });
    } else {
        console.log("Dev directory path is already set.");
    }
    return userConfig.devPath;
}

/**
 * Verifies and sets the static directory path within the development directory in userConfig if not already set.
 * @param {object} userConfig - Configuration object that may contain existing path configurations.
 * @returns {Promise<string>} The set or existing static directory path within the development directory.
 */
async function verifyAndSetStaticPathDev(userConfig) {
    if (!userConfig.staticPathDev) {
        console.log("Setting static directory path in dev...");
        userConfig.staticPathDev = getStaticPath_dev();
        await saveUserConfig({ staticPath: userConfig.staticPathDev });
    } else {
        console.log("Static directory path in dev is already set.");
    }
    return userConfig.staticPathDev;
}


export { verifyAndGet, verifyAndSetStaticPath, verifyAndSetDevPath, verifyAndSetStaticPathDev };
