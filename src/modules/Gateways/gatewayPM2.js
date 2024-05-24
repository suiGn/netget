import pm2 from 'pm2';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Manages PM2 actions for a specified gateway.
 * 
 * @param {string} gatewayName - The name of the gateway to manage.
 * @param {string} action - The action to perform (start, stop, restart, delete, status).
 */
const manageGateway = (gatewayName, action) => {
    const gatewayScript = path.join(__dirname, 'startGateway.js');

    pm2.connect((err) => {
        if (err) {
            console.error(chalk.red('PM2 connection error:'), err);
            process.exit(2);
        }

        const handlePM2Action = (pm2Method, successMessage, errorMessage) => {
            pm2[pm2Method](gatewayName, (err, proc) => {
                if (err) {
                    console.error(chalk.red(errorMessage), err);
                } else {
                    console.log(chalk.green(successMessage));
                }
                pm2.disconnect(); // Disconnects from PM2
            });
        };

        switch (action) {
            case 'status':
                pm2.describe(gatewayName, (err, desc) => {
                    if (err) {
                        console.error(chalk.red(`Failed to get status for ${gatewayName}`), err);
                    } else if (desc && desc.length > 0) {
                        const statusInfo = desc[0].pm2_env;
                        const procInfo = desc[0].monit; // Contains CPU and memory usage
                        console.clear(); // Clear the console before showing status
                        console.log(chalk.blue(`Current status of ${gatewayName}:`));
                        
                        const formatLine = (label, value) => `${chalk.bold(label.padEnd(20, ' '))}: ${chalk.green(value || 'N/A')}`;
            
                        let statusOutput = '';
            
                        statusOutput += formatLine('Name', statusInfo.name) + '\n';
                        statusOutput += formatLine('PID', statusInfo.pm_id) + '\n';
                        statusOutput += formatLine('Status', statusInfo.status) + '\n';
                        if (statusInfo.pm_uptime) {
                            const uptime = Date.now() - statusInfo.pm_uptime;
                            const uptimeFormatted = `${Math.floor(uptime / (1000 * 60 * 60))}h ${Math.floor((uptime / (1000 * 60)) % 60)}m`;
                            statusOutput += formatLine('Started at', new Date(statusInfo.pm_uptime).toLocaleString()) + '\n';
                            statusOutput += formatLine('Uptime', uptimeFormatted) + '\n';
                        }
                        statusOutput += formatLine('Restarts', statusInfo.restart_time) + '\n';
                        if (procInfo) {
                            statusOutput += formatLine('CPU', `${procInfo.cpu}%`) + '\n';
                            statusOutput += formatLine('Memory', `${(procInfo.memory / 1024 / 1024).toFixed(2)} MB`) + '\n';
                        }
                        statusOutput += formatLine('User', statusInfo.username) + '\n';
                        statusOutput += formatLine('Watching', statusInfo.watch ? 'Yes' : 'No') + '\n';
            
                        console.log(statusOutput.trim());
                    } else {
                        console.clear(); // Clear the console before showing the message
                        console.log(chalk.yellow(`${gatewayName} is not currently managed by PM2.`));
                    }
                    pm2.disconnect(); // Disconnects from PM2
                });
                break;

            case 'stop':
                handlePM2Action('stop', `${gatewayName} stopped successfully.`, `Failed to stop ${gatewayName}`);
                break;
            case 'restart':
                handlePM2Action('restart', `${gatewayName} restarted successfully.`, `Failed to restart ${gatewayName}`);
                break;
            case 'delete':
                handlePM2Action('delete', `${gatewayName} deleted successfully.`, `Failed to delete ${gatewayName}`);
                break;
            default:
                console.error(chalk.red('Invalid action for manageGateway'));
                pm2.disconnect();
        }
    });
};

export { manageGateway };
