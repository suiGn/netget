// verifyNginxInstallation.js
import chalk from 'chalk';
import { execShellCommand } from '../../utils/execShellCommand.js';  

export const verifyNginxInstallation = async () => {
    try {
        const result = await execShellCommand('nginx -v');
        console.log(chalk.green(`NGINX successfully verified...`));
        return true;  // Call the callback function with true indicating success
    } catch (error) {
        console.error(chalk.red(`Verification of NGINX installation failed: ${error.message}`));
        return false;  // Call the callback function with false indicating failure
    }
};
