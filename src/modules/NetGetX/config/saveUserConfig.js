//netget/src/modules/NetGetX/config/saveUserConfig.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
/* Usage example:
await saveUserConfig({
    nginxPath: userConfig.nginxPath,
    nginxSitesAvailable: userConfig.nginxSitesAvailable,
    nginxSitesEnabled: userConfig.nginxSitesEnabled
});
*/
// Define the directory and file path for user configuration
const CONFIG_DIR = path.join(os.homedir(), '.get');
const USER_CONFIG_FILE = path.join(CONFIG_DIR, 'userConfigX.json');

/**
 * Updates the user configuration file with specific key-value pairs.
 * @param {Object} updates - An object containing the key-value pairs to update.
 */
async function saveUserConfig(updates) {
    try {
        // Ensure the configuration directory exists
        if (!fs.existsSync(CONFIG_DIR)) {
            console.log(chalk.yellow(`Configuration directory does not exist at ${CONFIG_DIR}.`));
           return false;
        }

        let config = {};
        // Check if the configuration file exists and read the current configuration
        if (fs.existsSync(USER_CONFIG_FILE)) {
            const data = await fs.promises.readFile(USER_CONFIG_FILE, 'utf8');
            config = JSON.parse(data);
        }

        // Update the configuration object with new values
        Object.assign(config, updates);

        // Write the updated configuration back to the file
        await fs.promises.writeFile(USER_CONFIG_FILE, JSON.stringify(config, null, 4));
        console.log(chalk.green('userConfigX Updated successfully.'));
    } catch (error) {
        console.error(chalk.red(`Failed to update user configuration: ${error.message}`));
        throw new Error('Failed to update user configuration.');
    }
}

export default saveUserConfig ;
