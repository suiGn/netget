// netget/src/modules/NetGetX/config/verifyServerBlock.js
import fs from 'fs';
import chalk from 'chalk';
import getDefaultServerBlock from './defaultServerBlock.js';  // Adjusted import to get the function
import { serverBlockConfigOptions } from './serverBlockConfigOptions.cli.js';

const verifyServerBlock = async (xConfig) => {
    const nginxConfigPath = xConfig.nginxPath;  // Path to nginx.conf
    const expectedServerBlock = getDefaultServerBlock(xConfig);  // Get the dynamic server block
    try {
        const configData = fs.readFileSync(nginxConfigPath, 'utf8');
        if (configData.includes(expectedServerBlock.trim())) {
            console.log(chalk.green('Server Ready for NetGetX...'));
            return true;
        } else {
            console.log(chalk.yellow('Default NGINX server block does not match the expected default setup.'));
            if (xConfig.nginxConfigurationProceed) {
                console.log(chalk.green('Proceeding with existing configuration as per user preference.'));
                return true;
            } else {
                // Prompt the user for action and determine outcome based on their choice
                const configurationSuccess = await serverBlockConfigOptions(xConfig);
                return configurationSuccess;
            }
        }
    } catch (error) {
        console.error(chalk.red(`Failed to read NGINX configuration from ${nginxConfigPath}: ${error.message}`));
        console.log(chalk.yellow('Please clean your userConfig.json values and try again...'));
        return false;
    }
};

export default verifyServerBlock;
