import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import detectNginxPaths from './detectNginxPath.js';  // Ensure the function is correctly imported
import { nginxInstallationOptions } from './nginxInstallationOptions.cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userConfigPath = path.join(__dirname, 'userConfig.json');

async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return {};
    }
}

async function saveUserConfig(userConfig) {
    await fs.promises.writeFile(userConfigPath, JSON.stringify(userConfig, null, 2));
}

async function setNginxPath() {
    let detectedPaths = await detectNginxPaths();
    if (!detectedPaths) {
        console.log(chalk.yellow('Unable to automatically detect NGINX paths. Attempting installation...'));
        const installationSuccess = await nginxInstallationOptions();
        if (installationSuccess) {
            detectedPaths = await detectNginxPaths(); // Retry detection after installation
            if (!detectedPaths) {
                console.log(chalk.red('Failed to detect NGINX paths even after installation.'));
                return; // Stop further execution if still unable to detect
            }
        } else {
            console.log(chalk.red('Installation or configuration aborted.'));
            return false; // Stop further execution if installation was not successful
        }
    }
    // If all goes well and paths are detected
    const userConfig = await loadUserConfig();
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
        userConfig.nginxExecutable = detectedPaths.nginxExecutable;

        // Set up sites-available and sites-enabled
        const baseDir = path.dirname(finalPath);
        userConfig.nginxSitesAvailable = path.join(baseDir, 'sites-available');
        userConfig.nginxSitesEnabled = path.join(baseDir, 'sites-enabled');

        // Ensure directories exist
        if (!fs.existsSync(userConfig.nginxSitesAvailable)) {
            fs.mkdirSync(userConfig.nginxSitesAvailable);
            console.log(chalk.green(`Created directory at ${userConfig.nginxSitesAvailable}`));
        }
        if (!fs.existsSync(userConfig.nginxSitesEnabled)) {
            fs.mkdirSync(userConfig.nginxSitesEnabled);
            console.log(chalk.green(`Created directory at ${userConfig.nginxSitesEnabled}`));
        }

        await saveUserConfig(userConfig);
    } else {
        console.log(chalk.red('No valid NGINX path provided or found.'));
        // If NGINX path is not found, offer to install NGINX
        await nginxInstallationOptions();
    }
}

export { setNginxPath };
