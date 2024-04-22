// setNginxPath.js
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import os from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
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

async function detectNginxPath() {
    const osType = os.type();
    let potentialPaths = [];

    if (osType === 'Linux') {
        potentialPaths.push('/etc/nginx/nginx.conf');
    } else if (osType === 'Darwin') {
        potentialPaths.push('/usr/local/etc/nginx/nginx.conf', '/opt/homebrew/etc/nginx/nginx.conf');
    } else if (osType === 'Windows_NT') {
        potentialPaths.push('C:\\nginx\\nginx.conf');
    }

    for (const path of potentialPaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    return '';
}

async function setNginxPath() {
    const detectedPath = await detectNginxPath();
    if (!detectedPath) {
        console.log(chalk.yellow('Unable to automatically detect the NGINX configuration path.'));
    }

    const responses = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Use the detected path: ${detectedPath}?`,
            default: true,
            when: () => !!detectedPath
        },
        {
            type: 'input',
            name: 'manualPath',
            message: 'Enter the custom path for your NGINX configuration:',
            when: ({ confirm }) => !confirm
        },
        {
            type: 'list',
            name: 'action',
            message: 'No valid NGINX path found. What would you like to do?',
            choices: [
                'Enter Path Manually',
                'Install NGINX',
                'Cancel'
            ],
            when: () => !detectedPath
        }
    ]);

    let finalPath = responses.manualPath || detectedPath;
    if (responses.action === 'Install NGINX') {
        await nginxInstallationOptions();
        return;
    } else if (responses.action === 'Enter Path Manually') {
        finalPath = await inquirer.prompt({
            type: 'input',
            name: 'manualPath',
            message: 'Please enter the custom path for your NGINX configuration:'
        }).then(response => response.manualPath);
    }

    if (finalPath && fs.existsSync(finalPath)) {
        console.log(chalk.green(`NGINX configuration path set to: ${finalPath}`));
        const userConfig = await loadUserConfig();
        userConfig.nginxPath = finalPath;
        await saveUserConfig(userConfig);
        return finalPath;
    } else {
        console.log(chalk.red('No valid NGINX path provided or found.'));
        return '';
    }
}

export { setNginxPath };
