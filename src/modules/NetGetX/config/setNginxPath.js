import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import os from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
    // Determine the operating system to suggest more accurate default paths
    const osType = os.type();
    let potentialPaths = [];

    if (osType === 'Linux') {
        potentialPaths.push('/etc/nginx/nginx.conf');
    } else if (osType === 'Darwin') { // macOS
        potentialPaths.push('/usr/local/etc/nginx/nginx.conf', '/opt/homebrew/etc/nginx/nginx.conf'); // Paths for Homebrew installs
    } else if (osType === 'Windows_NT') {
        potentialPaths.push('C:\\nginx\\nginx.conf');
    }

    for (const potentialPath of potentialPaths) {
        if (fs.existsSync(potentialPath)) {
            return potentialPath;
        }
    }
    return '';
}

async function setNginxPath() {
    const detectedPath = await detectNginxPath();
    let finalPath = detectedPath;

    if (!detectedPath) {
        console.log(chalk.yellow('Unable to automatically detect the NGINX configuration path.'));
        // Provide guidance based on OS if automatic detection fails
        console.log(chalk.blue(`Please specify the path manually. Typical locations include:`));
        console.log(chalk.blue(`- Linux: /etc/nginx/nginx.conf`));
        console.log(chalk.blue(`- macOS: /usr/local/etc/nginx/nginx.conf or /opt/homebrew/etc/nginx/nginx.conf`));
        console.log(chalk.blue(`- Windows: C:\\nginx\\nginx.conf`));
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
            name: 'customPath',
            message: 'Please enter the custom path for your NGINX configuration:',
            when: ({ confirm }) => !confirm
        }
    ]);

    if (responses.customPath) {
        finalPath = responses.customPath;
    }

    // Verify the final path
    if (!fs.existsSync(finalPath)) {
        console.log(chalk.red('The specified NGINX configuration path does not exist.'));
        return '';
    }

    // Save the verified path to user config
    const userConfig = await loadUserConfig();
    userConfig.nginxPath = finalPath;
    await saveUserConfig(userConfig);

    console.log(chalk.green(`NGINX configuration path set to: ${finalPath}`));
    return finalPath;
}

export { setNginxPath };
