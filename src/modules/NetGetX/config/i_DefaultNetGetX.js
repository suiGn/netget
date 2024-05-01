//i_DefaultNetGetX.js
import chalk from 'chalk';
import os from 'os';
import { verifyNginxInstallation } from './verifyNginxInstallation.js';  
import { nginxInstallationOptions } from './nginxInstallationOptions.cli.js';  
import { verifyServerBlock } from './verifyServerBlock.js';  
import { setNginxPath } from './setNginxPath.js';
import { setNginxExecutable } from './setNginxExecutable.js';
import checkPublicIP from '../../utils/checkPublicIP.js';  
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userConfigPath = path.join(__dirname, 'userConfig.json');

export async function i_DefaultNetGetX() {
    console.log(chalk.blue('Running Environment Check...'));
    const platform = os.platform();
    const type = os.type();
    const release = os.release();
    console.log(`Operating System: ${type} (${platform})`);
    console.log(`Release: ${release}`);

    const publicIP = await checkPublicIP();
    console.log(publicIP ? `Public IP detected: ${publicIP}` : chalk.red('No public IP detected. Some features may be limited.'));
    
    console.log(chalk.blue('Verifying NGINX Paths...'));
    let userConfig = await loadUserConfig();
    if (!userConfig.nginxPath || !userConfig.nginxSitesAvailable || !userConfig.nginxSitesEnabled) {
        console.log(chalk.yellow('One or more NGINX configuration paths are not set. Attempting to set them...'));
        await setNginxPath();
        userConfig = await loadUserConfig();  // Reload to get updated paths
    } else {
        console.log(chalk.green('All required NGINX configuration paths are already set.'));
    }

    // check and set NGINX executable
    if (!userConfig.nginxExecutable) {
    console.log(chalk.yellow("NGINX executable not set. Attempting to set it..."));
    await setNginxExecutable(userConfig);
    userConfig = await loadUserConfig();  // Reload to ensure all config updates are reflected
    }

    const serverBlockVerified = await verifyServerBlock(userConfig);
    if (!serverBlockVerified) {
        console.log(chalk.yellow('NGINX server block is not correctly configured.'));
        return false;
    }

  // Final check to verify NGINX installation
let nginxVerified = await verifyNginxInstallation(userConfig);

if (!nginxVerified) {
    console.log(chalk.yellow('NGINX is not correctly installed or configured.'));
    console.log(chalk.yellow('Attempting automated configuration options...'));
    await nginxInstallationOptions();
    nginxVerified = await verifyNginxInstallation(userConfig); // Re-check after attempting to fix

    if (!nginxVerified) {
        console.log(chalk.red('NGINX installation or configuration still incorrect after attempted fixes.'));
        // Consider providing additional help or exit the process
        console.log(chalk.blue('Please check the manual configuration guidelines or contact support.'));
        return false;
    }
}

console.log(chalk.green('Starting NetGetX...'));
return true;
}

async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return {};
    }
}

