// netget/src/modules/NetGetX/config/setNginxPath.js
import saveUserConfig from './saveUserConfig.js'; // Ensure this is imported

/**
 * Sets the NGINX configuration path in the user configuration.
 * @param {object} userConfig The user configuration object.
 * @param {string} nginxConfigPath The NGINX configuration path to be set.
 * @param {string} nginxBasePath The NGINX base path to be set.
 * @returns {Promise<boolean>} True if the path was set and saved successfully.
 */
async function setNginxConfigPath(userConfig, nginxConfigPath, nginxBasePath) {
    try {
        await saveUserConfig({ ...userConfig, nginxPath: nginxConfigPath, nginxDir: nginxBasePath});
        console.log(`NGINX configuration path set to: ${nginxConfigPath}`);
        console.log(`NGINX Dir Path set to: ${nginxBasePath}`);
        return true;
    } catch (error) {
        console.error(`Failed to set NGINX configuration path: ${error.message}`);
        return false;
    }
}

/**
 * Sets the path to the XBlocks-available directory in the user configuration.
 * @param {object} userConfig The user configuration object.
 * @param {string} path The path to set for XBlocks-available.
 * @returns {Promise<boolean>} True if the path was set and saved successfully.
 */
async function setXBlocksAvailablePath(userConfig, path) {
    try {
        userConfig.XBlocksAvailable = path;
        await saveUserConfig({ ...userConfig, XBlocksAvailable: path });
        console.log(`XBlocks-available path set to: ${path}`);
        return true;
    } catch (error) {
        console.error(`Failed to set XBlocks-available path: ${error.message}`);
        return false;
    }
}

/**
 * Sets the path to the XBlocks-enabled directory in the user configuration.
 * @param {object} userConfig The user configuration object.
 * @param {string} path The path to set for XBlocks-enabled.
 * @returns {Promise<boolean>} True if the path was set and saved successfully.
 */
async function setXBlocksEnabledPath(userConfig, path) {
    try {
        userConfig.XBlocksEnabled = path;
        await saveUserConfig({ ...userConfig, XBlocksEnabled: path });
        console.log(`XBlocks-enabled path set to: ${path}`);
        return true;
    } catch (error) {
        console.error(`Failed to set XBlocks-enabled path: ${error.message}`);
        return false;
    }
}

export { setNginxConfigPath, setXBlocksAvailablePath, setXBlocksEnabledPath };
