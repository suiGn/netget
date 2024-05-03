//netget/src/modules/NetGetX/config/loadOrCreateUserConfig.js
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.get');
const USER_CONFIG_FILE = path.join(CONFIG_DIR, 'userConfigX.json');

export default async function loadOrCreateUserConfig() {
    try {
        if (!fs.existsSync(USER_CONFIG_FILE)) {
            console.log(chalk.yellow('User configuration file does not exist. Creating default configuration...'));
            const defaultConfig = {
                nginxConfigurationProceed: false,
                nginxPath: "",
                nginxSitesAvailable: "",
                nginxSitesEnabled: "",
                nginxExecutable: "",
                useSudo: false
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
