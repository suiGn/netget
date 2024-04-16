//i_DefaultNetGetX.js
import chalk from 'chalk';
import { verifyNginxInstallation } from './verifyNginxInstallation.js';  
import { nginxInstallationOptions } from './nginxInstallationOptions.cli.js';  
import { verifyServerBlock } from './verifyServerBlock.js';  
import checkPublicIP from '../../utils/checkPublicIP.js';  

export async function i_DefaultNetGetX() {
    console.log(chalk.blue('Running Enviroment Check...'));
     // Check for public IP first
     const publicIP = await checkPublicIP();
     if (publicIP) {
         console.log(chalk.green(`Public IP detected: ${publicIP}`));
         // You can implement logic based on having a public IP here
     } else {
         console.log(chalk.red('No public IP detected. Some features may be limited.'));
         // Handle the case where no public IP is available if necessary
     }
 
    // Verify NGINX installation and configuration
    let nginxVerified = await verifyNginxInstallation();

    if (!nginxVerified) {
        console.log(chalk.yellow('NGINX is not correctly installed or configured.'));
        await nginxInstallationOptions();

        // Recheck after installation options might have changed the state
        nginxVerified = await verifyNginxInstallation();
        if (!nginxVerified) {
            console.log(chalk.red('NGINX installation or configuration still incorrect after attempted fixes.'));
            return false;  // Exit after rechecking and still failing
        }
    }

    console.log(chalk.blue('Verifying NGINX server block...'));
    const serverBlockVerified = await verifyServerBlock();
    if (!serverBlockVerified) {
        console.log(chalk.yellow('NGINX server block is not correctly configured.'));
        return false;  // Exit if server block cannot be verified or fixed
    }

    console.log(chalk.green('All configurations are correct.'));
    // Proceed to main functionality
    return true;
}