import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.get');
const USER_CONFIG_FILE = path.join(CONFIG_DIR, 'xConfig.json');

/**
 * Loads the user configuration file or creates it if it doesn't exist.
 * @returns {Promise<Object>} The user configuration object.
 * @category NetGetX
 * @subcategory Config
 * @module xConfig
 */
async function loadOrCreateXConfig() {
    try {
        if (!fs.existsSync(USER_CONFIG_FILE)) {
            console.log(chalk.yellow('Default xConfig file does not exist. Creating...'));
            const defaultConfig = {
                nginxConfigurationProceed: false,
                nginxPath: "",
                nginxDir: "",
                nginxExecutable: "",
                xMainOutPutPort: 3432,
                publicIP: "",
                localIP: "",
                XBlocksAvailable: "",
                XBlocksEnabled: "",
                nginxDevDir: "",
                dev_XBlocksAvailable: "",
                dev_XBlocksEnabled: "",
                getPath: "",
                static: "",
                staticDefault: "",
                SSLPath: "",
                SSLCertificatesPath: "",
                SSLCertificateKeyPath: "",
                devPath: "",
                devStatic: "",
                devStaticDefault: "",
                devSSLPath: "",
                devSSLCertificatesPath: "",
                devSSLCertificateKeyPath: "",
                useSudo: false,
            };
            fs.writeFileSync(USER_CONFIG_FILE, JSON.stringify(defaultConfig, null, 4));
            return defaultConfig;
        } else {
            const data = await fs.promises.readFile(USER_CONFIG_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(chalk.red(`Failed to load or create user configuration: ${error.message}`));
        throw new Error('Failed to initialize user configuration.');
    }
}

/**
 * Updates the user configuration file with specific key-value pairs.
 * @param {Object} updates - An object containing the key-value pairs to update.
 * @category NetGetX
 * @subcategory Config
 * @module xConfig
 */
async function saveXConfig(updates) {
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

        // Apply updates
        Object.assign(config, updates);
        // Write the updated configuration back to the file
        await fs.promises.writeFile(USER_CONFIG_FILE, JSON.stringify(config, null, 4));
        // Convert updates object to string for better readability in the log
        const updatesStr = JSON.stringify(updates, null, 2);  // Pretty print the updates object
        for (const [key, value] of Object.entries(updates)) {
            console.log(`xConfig.${chalk.bgWhite.black.bold(key)}: ${chalk.yellow(value)} : ${chalk.bgGreen.bold("Success")}.`);
        }  
        } catch (error) {
        console.error(chalk.red(`Failed to update user configuration: ${error.message}`));
        throw new Error('Failed to update user configuration.');
    }
}

export { loadOrCreateXConfig, saveXConfig };
