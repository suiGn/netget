import os from 'os';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execShellCommand } from '../../utils/execShellCommand.js';  

const checkForChoco = async () => {
    return new Promise((resolve, reject) => {
        exec('choco', (error, stdout, stderr) => {
            if (error && stderr.includes('is not recognized as an internal or external command, operable program or batch file.')) {
                resolve(false);  // Chocolatey is not installed.
            } else {
                resolve(true);  // Chocolatey is installed or another error not related to existence.
            }
        });
    });
};

const determineInstallCommand = (version) => {
    switch (os.platform()) {
        case 'darwin':
            return 'brew install nginx';
        case 'linux':
            return 'sudo apt-get install nginx -y';
        case 'win32':
            return 'choco install nginx';
        default:
            return null;  // Unsupported OS
    }
};

export const installNginx = async (version) => {
    if (os.platform() === 'win32' && !await checkForChoco()) {
        console.error(chalk.yellow('Chocolatey is not installed. Please install Chocolatey or install NGINX manually.'));
        return false;
    }

    const installCmd = determineInstallCommand(version);
    if (!installCmd) {
        console.error(chalk.red('Unsupported operating system for automatic installation.'));
        return false;
    }

    console.log(chalk.blue(`Using command: ${installCmd}`));
    try {
        await execShellCommand(installCmd);
        console.log(chalk.green("NGINX installation complete."));
        return true;
    } catch (error) {
        return await handleInstallationError(installCmd, error);
    }
};

const handleInstallationError = async (installCmd, error) => {
    // Log the error and provide OS-specific advice
    console.error(chalk.red(`Installation error encountered: ${error.message}`));

    switch (os.platform()) {
        case 'darwin':
            return handleDarwinError(installCmd, error);
        case 'linux':
            return handleLinuxError(installCmd, error);
        case 'win32':
            return handleWindowsError(installCmd, error);
        default:
            console.error(chalk.red('Error handling not available for this OS.'));
            return false;
    }
};

const handleDarwinError = (installCmd, error) => {
    if (error.message.includes('Permission denied')) {
        console.log(chalk.cyan("Homebrew might need permissions to write to its directories. This error may not be fatal, proceeding with setup."));
        return true; // Continue as this might not be fatal
    } else {
        suggestHomebrewFix();
        return false;
    }
};

const handleLinuxError = (installCmd, error) => {
    if (error.message.toLowerCase().includes('permission denied')) {
        console.log(chalk.cyan("Try running the command with sudo or adjust permissions as necessary. Error may not halt setup."));
        return true; // Proceed conditionally
    } else {
        suggestLinuxFix(installCmd);
        return false;
    }
};

const handleWindowsError = (installCmd, error) => {
    if (error.message.toLowerCase().includes('permission denied')) {
        console.log(chalk.cyan("Check if you have administrative privileges to run the installation. Error may not halt setup."));
        return true; // Proceed conditionally
    } else {
        suggestWindowsFix(installCmd);
        return false;
    }
};

const suggestHomebrewFix = () => {
    console.log(chalk.cyan("Ensure Homebrew is properly set up and has necessary permissions. Consider consulting Homebrew's troubleshooting guide."));
};

const suggestLinuxFix = (installCmd) => {
    console.log(chalk.cyan(`If issues persist, manually run '${installCmd}' or consult NGINX's Linux installation guide.`));
};

const suggestWindowsFix = (installCmd) => {
    console.log(chalk.cyan(`Ensure you have the necessary admin rights to run '${installCmd}' or check the installation steps for NGINX on Windows.`));
};
