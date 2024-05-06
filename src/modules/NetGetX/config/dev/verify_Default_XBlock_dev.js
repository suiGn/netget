// netget/src/modules/NetGetX/config/verifyServerBlock.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import getDefaultServerBlock_dev from './defaultServerBlock_dev.js';
import { XBlocksConfigOptions_dev } from './XBlocksConfigOptions_dev.cli.js';
import ensureDirectoryExists from '../../../utils/ensureDirectoryExists.js';
import saveUserConfig_dev from './saveUserConfig_dev.js';

const verify_Default_XBlock_dev = async (userConfig) => {
    const devConfigPath = path.join(userConfig.dev_nginxDir, 'XBlock_dev_default.conf');
    ensureDirectoryExists(userConfig.dev_nginxDir);

    const expectedServerBlock = getDefaultServerBlock_dev(userConfig);

    try {
        if (fs.existsSync(devConfigPath)) {
            const configData = fs.readFileSync(devConfigPath, 'utf8');
            if (configData.includes(expectedServerBlock.trim())) {
                console.log(chalk.green('Default Server Block is correctly configured.'));
                return true;
            } else {
                console.log(chalk.yellow('Default NGINX server block does not match the expected setup.'));
                if (!userConfig.nginxConfigurationProceed) {
                    return await XBlocksConfigOptions_dev(userConfig);
                }
            }
        } else {
            console.log(chalk.yellow(`Server block configuration file not found at ${devConfigPath}. Creating default configuration.`));
            fs.writeFileSync(devConfigPath, expectedServerBlock);
            await saveUserConfig_dev({ XBlockDev_DefaultServer: devConfigPath });
        }

        console.log(chalk.green('Proceeding with updated configuration.'));
        return true;
    } catch (error) {
        console.error(chalk.red(`Failed to read or create NGINX configuration at ${devConfigPath}: ${error.message}`));
        console.log(chalk.yellow('Please clean your userConfig.json values and try again...'));
        return false;
    }
};

export default verify_Default_XBlock_dev;
