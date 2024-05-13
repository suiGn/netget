import chalk from 'chalk';
import { exec } from 'child_process';
import handlePermission from '../../utilities/handlePermission'; // Adjust path as necessary

/**
 * Checks the status of NGINX configuration.
 * @param {Object} x - The configuration object containing paths and settings for NGINX.
 */
export async function checkNginxStatus(x) {
    try {
        const nginxCommand = x.nginxExecutable;
        const statusCommand = `${nginxCommand} -t`;
        
        await new Promise((resolve, reject) => {
            exec(statusCommand, async (error, stdout, stderr) => {
                if (error) {
                    if (error.message.includes('permission denied')) {
                        console.error(chalk.red(`Permission denied error: ${error.message}`));
                        await handlePermission(
                            "checking NGINX status",
                            `sudo ${statusCommand}`,
                            `To manually check NGINX status, run the following command with elevated privileges:\n${`sudo ${statusCommand}`}`
                        );
                        reject();
                    } else {
                        console.error(chalk.red(`Error checking NGINX status: ${error.message}`));
                        reject();
                    }
                    return;
                }
                console.log(chalk.blue(`Output:\n${stdout}`));
                if (stderr && !stderr.includes('test is successful')) {
                    console.error(chalk.red(`NGINX Error: ${stderr}`));
                } else {
                    console.log(chalk.green('NGINX is configured correctly.'));
                    if (stderr) {
                        console.log(chalk.yellow(`Notices:\n${stderr}`));
                    }
                }
                resolve();
            });
        });

    } catch (error) {
        console.error(chalk.red(`Failed to load NGINX configuration: ${error.message}`));
    }
}
