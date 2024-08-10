// netget/src/modules/Gateways/gateways.cli.js
import chalk from 'chalk';
import inquirer from 'inquirer';
import NetGetMainMenu from '../netget_MainMenu.cli.js';
import { manageGateway } from './gatewayPM2.js';
import { addNewGateway } from './addGateway.cli.js';
import pm2 from 'pm2';
import { io } from 'socket.io-client';

export async function Gateways_CLI(g) {
    console.clear();
    console.log(chalk.green('Gateways Menu'));

    while (true) {
        const gatewayNames = g.gateways.map(gateway => gateway.name);
        const mainMenuOptions = [
            ...gatewayNames,
            'Add Gateway',
            'Go Back'
        ];

        const { mainMenuSelection } = await inquirer.prompt({
            type: 'list',
            name: 'mainMenuSelection',
            message: 'Select an option:',
            choices: mainMenuOptions,
        });

        switch (mainMenuSelection) {
            case 'Go Back':
                console.clear();
                console.log(chalk.blue('Returning to the main menu...'));
                await NetGetMainMenu();
                return;

            case 'Add Gateway':
                console.clear();
                console.log(chalk.blue('Adding a new gateway...'));
                g = await addNewGateway();
                break;

            default:
                const selectedGateway = g.gateways.find(gateway => gateway.name === mainMenuSelection);
                if (selectedGateway) {
                    console.clear();
                    await showGatewayActions(selectedGateway);
                }
                break;
        }
    }
}

async function showGatewayActions(gateway) {
    await displayGatewayStatus(gateway.name);
    while (true) {
        const actions = [
            'start',
            'stop',
            'restart',
            'delete',
            'status',
            'logs',
            'Go Back'
        ];

        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: `Select an action for ${gateway.name}:`,
            choices: actions,
        });

        if (action === 'Go Back') {
            console.clear();
            return;
        }

        console.clear();
        try {
            const result = await manageGateway(gateway.name, action);

            if (action === 'logs') {
                await displayLogs(gateway.name);
            } else {
                console.log(chalk.blue(`Result of ${action} action:`));
                console.log(result);
            }
        } catch (error) {
            console.error(chalk.red(`Error during ${action} action: ${error}`));
        }

        if (action !== 'status' && action !== 'logs') {
            console.clear();
            await displayGatewayStatus(gateway.name);
        }
    }
}

async function displayLogs(gatewayName) {
    const socket = io('http://localhost:3432'); // Ajusta el puerto y URL según sea necesario
    socket.on('connect', () => {
        console.log(chalk.green('Connected to the log server.'));
    });

    socket.on('log', (message) => {
        console.log(message);
    });

    socket.on('disconnect', () => {
        console.log(chalk.red('Disconnected from the log server.'));
    });

    console.log(chalk.blue(`Displaying logs for ${gatewayName}. Press Ctrl+C to exit.`));
    await new Promise((resolve) => {
        process.once('SIGINT', () => {
            socket.disconnect();
            console.log(chalk.yellow('Stopped displaying logs.'));
            resolve();
        });
    });
}

async function displayGatewayStatus(gatewayName) {
    return new Promise((resolve) => {
        pm2.connect((err) => {
            if (err) {
                console.error(chalk.red('PM2 connection error:'), err);
                process.exit(2);
            }

            pm2.describe(gatewayName, (err, desc) => {
                if (err) {
                    console.error(chalk.red(`Failed to get status for ${gatewayName}`), err);
                } else if (desc && desc.length > 0) {
                    const statusInfo = desc[0].pm2_env;
                    const procInfo = desc[0].monit;
                    console.log(chalk.blue(`Current status of ${gatewayName}:`));
                    const formatLine = (label, value) => `${chalk.bold(label.padEnd(20, ' '))}: ${chalk.green(value || 'N/A')}`;
                    let statusOutput = '';
                    statusOutput += formatLine('Name', statusInfo.name) + '\n';
                    statusOutput += formatLine('PID', desc[0].pid || 'N/A') + '\n';
                    statusOutput += formatLine('Port', statusInfo.env.PORT || 'N/A') + '\n';
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
                    console.log(chalk.yellow(`${gatewayName} is not currently managed by PM2.`));
                }
                pm2.disconnect();
                resolve();
            });
        });
    });
}
