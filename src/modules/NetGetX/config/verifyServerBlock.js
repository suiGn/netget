//verifyServerBlock.js
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { configureDefaultServerBlock } from './configureDefaultServerBlock.js';
import { setNginxPath } from './setNginxPath.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userConfigPath = path.join(__dirname, 'userConfig.json');

async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return { nginxConfigurationProceed: false, nginxPath: '' };
    }
}

async function saveUserConfig(userConfig) {
    await fs.promises.writeFile(userConfigPath, JSON.stringify(userConfig, null, 2), { encoding: 'utf8' });
}

async function verifyServerBlock() {
    console.log(chalk.blue('Running verifyServerBlock...'));
    let userConfig = await loadUserConfig();

    if (!userConfig.nginxPath) {
        await setNginxPath();
        userConfig = await loadUserConfig();  // Reload config after setting path
    }

    if (userConfig.nginxPath) {
        try {
            const defaultConfigData = await fs.promises.readFile(userConfig.nginxPath, 'utf8');
            if (!defaultConfigData.includes("return 200 'NGINX Default Response. Server is running.';")) {
                console.log(chalk.yellow('Default server block configuration does not match the expected setup. Visit Default Server Block Configuration.'));
                if (!userConfig.nginxConfigurationProceed) {
                    const action = await askUserForAction('NGINX');
                    if (action === 'restore') {
                        await configureDefaultServerBlock();
                        //userConfig.nginxConfigurationProceed = true;
                        //await saveUserConfig(userConfig);
                    } else if (action === 'proceed') {
                        userConfig.nginxConfigurationProceed = true;
                        await saveUserConfig(userConfig);
                    }
                }
                return false;
            }
            console.log(chalk.green('NGINX server block is configured correctly.'));
            return true;
        } catch (error) {
            console.error(chalk.red(`Error reading NGINX config: ${error.message}`));
            return false;
        }
    }
    return false;
}

async function askUserForAction(type) {
    const response = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: `How would you like to proceed with the ${type} server block configuration?`,
        choices: [
            { name: 'Set/Restore to Recommended Default Settings', value: 'restore' },
            { name: 'Proceed with current configuration', value: 'proceed' }
        ]
    }]);
    return response.action;
}

export { verifyServerBlock };
