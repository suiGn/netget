//netget/src/modules/NetGetX/config/setNginxPath.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import detectNginxPaths from './detectNginxPaths.js';
import  saveUserConfig  from './saveUserConfig.js'; // Ensure this is imported
import  nginxInstallationOptions from './nginxInstallationOptions.cli.js';

async function setNginxPaths(userConfig) {
    console.log(chalk.blue('Verifying NGINX Paths...'));
    let detectedPaths = detectNginxPaths();
    if (!detectedPaths) {
        console.log(chalk.yellow('Unable to automatically detect NGINX paths. Attempting installation...'));
        if (!await nginxInstallationOptions()) {
            console.log(chalk.red('Installation or configuration aborted.'));
            return false;
        }
        detectedPaths = detectNginxPaths(); // Retry detection after installation
        if (!detectedPaths) {
            console.log(chalk.red('Failed to detect NGINX paths even after installation.'));
            return false;
        }
    }

    const responses = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Detected NGINX configuration path: ${detectedPaths.nginxPath}. Use this path?`,
            default: true
        },
        {
            type: 'input',
            name: 'manualPath',
            message: 'Enter the custom path for your NGINX configuration:',
            when: ({ confirm }) => !confirm
        }
    ]);

    let finalPath = responses.manualPath || detectedPaths.nginxPath;
    if (finalPath && fs.existsSync(finalPath)) {
        console.log(chalk.green(`NGINX configuration path set to: ${finalPath}`));
        userConfig.nginxPath = finalPath;
        
        const baseDir = path.dirname(finalPath);
        userConfig.nginxSitesAvailable = path.join(baseDir, 'sites-available');
        userConfig.nginxSitesEnabled = path.join(baseDir, 'sites-enabled');

        if (!fs.existsSync(userConfig.nginxSitesAvailable)) {
            fs.mkdirSync(userConfig.nginxSitesAvailable);
            console.log(chalk.green(`Created directory at ${userConfig.nginxSitesAvailable}`));
        }
        if (!fs.existsSync(userConfig.nginxSitesEnabled)) {
            fs.mkdirSync(userConfig.nginxSitesEnabled);
            console.log(chalk.green(`Created directory at ${userConfig.nginxSitesEnabled}`));
        }

        await saveUserConfig({
            nginxPath: userConfig.nginxPath,
            nginxSitesAvailable: userConfig.nginxSitesAvailable,
            nginxSitesEnabled: userConfig.nginxSitesEnabled
        });
     return true;
    } else {
        console.log(chalk.red('No valid NGINX path provided or found.'));
        await nginxInstallationOptions();
        return false;
    }
}

export default setNginxPaths;
