// verifyNginxInstallation.js
import chalk from 'chalk';
import { execShellCommand } from '../../utils/execShellCommand.js';  
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load the current user configuration
async function loadUserConfig() {
    const userConfigPath = path.join(__dirname, 'userConfig.json');
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return {};
    }
}

export const verifyNginxInstallation = async () => {
    const userConfig = await loadUserConfig();
    const nginxCommand = userConfig.useSudo ? 'sudo nginx -v' : 'nginx -v';
    
    try {
        const result = await execShellCommand(nginxCommand);
        console.log(chalk.green(`NGINX successfully verified with output: ${result}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`Verification of NGINX installation failed: ${error.message}`));
        if (error.message.toLowerCase().includes('permission denied')) {
            console.log(chalk.yellow('Permission denied. Trying with sudo...'));
            return handlePermissionDenied(userConfig);
        }
        return false;
    }
};

async function handlePermissionDenied(userConfig) {
    // Update userConfig to use sudo for future commands
    userConfig.useSudo = true;
    const userConfigPath = path.join(__dirname, 'userConfig.json');
    await fs.promises.writeFile(userConfigPath, JSON.stringify(userConfig, null, 2));

    // Retry command with sudo
    try {
        const result = await execShellCommand('sudo nginx -v');
        console.log(chalk.green(`NGINX successfully verified with sudo: ${result}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`Failed to verify NGINX installation with sudo: ${error.message}`));
        return false;
    }
}
