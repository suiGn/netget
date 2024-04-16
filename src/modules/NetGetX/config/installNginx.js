import os from 'os';
import chalk from 'chalk';
import { exec } from 'child_process';
import { execShellCommand } from '../../utils/execShellCommand.js';  
import { verifyNginxInstallation } from './verifyNginxInstallation.js'; 

const checkForChoco = async () => {
    return new Promise((resolve, reject) => {
        exec('choco', (error, stdout, stderr) => {
            if (error && stderr.includes('is not recognized as an internal or external command')) {
                resolve(false);  // Chocolatey is not installed.
            } else {
                resolve(true);  // Chocolatey is installed or other error.
            }
        });
    });
};

const determineInstallCommand = (version, customVersion) => {
    switch (os.platform()) {
        case 'darwin':
            return 'brew install nginx';  // Homebrew on macOS
        case 'linux':
            return 'sudo apt-get install nginx -y';  // Debian-based Linux
        case 'win32':
            return 'choco install nginx';  // Chocolatey on Windows
        default:
            console.error(chalk.red('Unsupported operating system for automatic installation.'));
            return null;
    }
};

export const installNginx = async (version, customVersion) => {
    if (os.platform() === 'win32' && !await checkForChoco()) {
        console.error(chalk.yellow('Chocolatey is not installed. Please install Chocolatey or install NGINX manually.'));
        return { success: false, message: 'Chocolatey not installed' };
    }

    const installCmd = determineInstallCommand(version, customVersion);
    if (!installCmd) return { success: false, message: 'Unsupported OS for automatic installation' };

    console.log(chalk.blue(`Using command: ${installCmd}`));
    try {
        await execShellCommand(installCmd);
        const isNginxVerified = await verifyNginxInstallation();
        console.log(isNginxVerified ? chalk.green('NGINX is installed and verified successfully.') : chalk.yellow('NGINX is installed but could not be verified.'));
    } catch (error) {
        console.error(chalk.red(`${error.message}`));
        handleInstallationError(error);
    }
};

const handleInstallationError = async (error) => {
    if (error.message.toLowerCase().includes('permission denied')) {
        console.log(chalk.yellow('Please check the permissions or try running the command with elevated privileges.'));
    }
    // Here, you can decide to prompt the user with options to retry, adjust permissions, or exit instead of automatically rerunning checks.
};

const suggestPermissionFix = (filePath) => {
    const permissionAdvice = os.platform() === 'win32' ?
        `Consider adjusting the file permissions manually in the file properties of ${filePath}, or use the 'icacls' command.` :
        `Consider running 'sudo chmod +rw ${filePath}' to fix permission issues.`;
    console.log(chalk.cyan(permissionAdvice));
};
