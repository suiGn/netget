//netget/src/modules/NetGetX/config/dev/detectNginxPaths_dev.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import findNginxConfig from '../../NGINX/findNginxConfig.js' 

const detectNginxPaths_dev = () => {
    let nginxConfigPath = findNginxConfig();
    if (!nginxConfigPath) {
        console.error(chalk.red('NGINX configuration file not found.'));
        return null;
    }
    // Assuming standard directory structure relative to the main config path
    let baseDir = path.dirname(nginxConfigPath);
    const devBaseDir = path.join(baseDir, 'dev_X'); 
    let XBlocksAvailable = path.join(devBaseDir, 'dev-XBlocks-available');
    let XBlocksEnabled = path.join(devBaseDir, 'dev-XBlocks-enabled');
    return {
        nginxPath: nginxConfigPath,
        XBlocks_Available: fs.existsSync(XBlocksAvailable) ? XBlocksAvailable : '',
        XBlocks_Enabled: fs.existsSync(XBlocksEnabled) ? XBlocksEnabled : ''
    };
};
export default detectNginxPaths_dev;

