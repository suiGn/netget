import { exec } from 'child_process';
import chalk from 'chalk';

/**
 * Restarts the NGINX server using the provided configuration.
 * @param {Object} config - The configuration object which should include the NGINX executable path.
 */
const nginxRestart = async (config) => {
    let restartCommand;

    // Determine the command based on the operating system
    switch (process.platform) {
        case 'darwin': // macOS
            restartCommand = 'brew services restart nginx';
            break;
        case 'linux':
            restartCommand = 'sudo systemctl restart nginx';
            break;
        default:
            console.error(chalk.red('Unsupported operating system for automatic restart.'));
            return false;
    }

    return execCommand(restartCommand);
};

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Failed to restart NGINX: ${error.message}`));
                reject(false);
                return;
            }
            if (stderr) {
                console.error(chalk.red(`Error during NGINX restart: ${stderr}`));
                reject(false);
                return;
            }
            console.log(chalk.green('NGINX restarted successfully.'));
            resolve(true);
        });
    });
};

export default nginxRestart;
