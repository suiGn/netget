//netget/src/modules/NetGetX/config/dev/loadOrCreateUserConfig_dev.js
import fs, { stat } from 'fs';
import chalk from 'chalk';
import path from 'path';
import os from 'os';

const CONFIG_DIR_DEV = path.join(os.homedir(), '.get/dev');
const USER_CONFIG_FILE = path.join(CONFIG_DIR_DEV, 'userConfigX_dev.json');

export default async function loadOrCreateUserConfig_dev() {
    try {
        if (!fs.existsSync(USER_CONFIG_FILE)) {
            console.log(chalk.yellow('Dev User configuration file does not exist. Creating default configuration...'));
            const defaultConfig_dev = {
                nginxConfigurationProceed: false,
                nginxPath: "",
                nginxDir: "",
                getPath: "",
                devPath: "",
                staticPath: "",
                XBlockDev_DefaultServer: "",
                dev_nginxDir: "",
                XBlocksAvailable: "",
                XBlocksEnabled: "",
                nginxExecutable: "",
                sslCertificatePath: "",
                sslCertificateKeyPath: "",
                useSudo: false
            };
            fs.writeFileSync(USER_CONFIG_FILE, JSON.stringify(defaultConfig_dev, null, 4));
            console.log(chalk.green('Dev User configuration file created.'));
            return defaultConfig_dev;
        } else {
            const data = await fs.promises.readFile(USER_CONFIG_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(chalk.red(`Failed to load or create user configuration: ${error.message}`));
        throw new Error('Failed to initialize user configuration.');
    }
}
