//netget/src/modules/NetGetX/config/setNginxExecutable.js
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import saveUserConfig from './saveUserConfig.js'; // Ensure this is imported

export default async function setNginxExecutable(userConfig) {
    if (!userConfig.nginxPath) {
        console.log(chalk.yellow("NGINX configuration path is not set. Please configure it first."));
        return false;  // Ensure NGINX path is set before attempting to set the executable
    }
    console.log(chalk.yellow("Checking for NGINX executable based on provided configuration path..."));
    try {
        // Building a probable executable path based on common NGINX installation practices
        let probableExecutablePath = path.join(path.dirname(userConfig.nginxPath), '../../sbin/nginx');
        if (fs.existsSync(probableExecutablePath)) {
            userConfig.nginxExecutable = probableExecutablePath;
        } else {
            // Fallback to system-wide detection if the derived path doesn't exist
            probableExecutablePath = execSync('which nginx').toString().trim();
            if (probableExecutablePath && fs.existsSync(probableExecutablePath)) {
                userConfig.nginxExecutable = probableExecutablePath;
            } else {
                console.log(chalk.red('Failed to detect NGINX executable. Please ensure NGINX is installed.'));
                return false;
            }
        }

        await saveUserConfig({
            nginxExecutable: userConfig.nginxExecutable
        });
    console.log(chalk.green(`NGINX executable path set to: ${userConfig.nginxExecutable}`));
     return true;     
    } catch (error) {
        console.error(chalk.red(`Error detecting NGINX executable: ${error.message}`));
        return false;
    }
}




