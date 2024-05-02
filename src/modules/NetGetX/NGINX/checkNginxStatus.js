// netget/src/modules/NetGetX/NGINX/checkNginxStatus.js
import chalk from 'chalk';
import { exec } from 'child_process';
import { loadUserConfig } from '../utils/loadUserConfig.js';  

export async function checkNginxStatus() {
    try {
        const userConfig = await loadUserConfig();  // Load the configuration
        const nginxCommand = userConfig.nginxExecutable;
        // Form the command to check the status of NGINX with userConfig
        const statusCommand = `${nginxCommand} -t`;

        // Wrap exec in a Promise to handle async operations correctly
        await new Promise((resolve, reject) => {
            exec(statusCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(chalk.red(`Error checking NGINX status: ${error.message}`));
                    reject();
                    return;
                }

                // Log stdout and check if stderr contains actual errors
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
