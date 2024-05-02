// configureDefaultServerBlock.js
import fs from 'fs';
import chalk from 'chalk';
import getDefaultServerBlock from './defaultServerBlock.js';  
import inquirer from 'inquirer';
import { execShellCommand } from '../../utils/execShellCommand.js';  // Make sure this is correctly imported

export const configureDefaultServerBlock = async (userConfig) => {
    const serverBlock = getDefaultServerBlock(userConfig);
    try {
        fs.writeFileSync(userConfig.nginxPath, serverBlock);
        console.log(chalk.green(`NGINX default server block has been configured at ${userConfig.nginxPath}.`));
    } catch (error) {
        if (error.code === 'EACCES') {
            console.error(chalk.red(`Permission denied writing to ${userConfig.nginxPath}.`));
            await handlePermissionError(userConfig.nginxPath, serverBlock);
        } else {
            console.error(chalk.red(`Error writing to ${userConfig.nginxPath}: ${error.message}`));
        }
    }
};

const handlePermissionError = async (path, data) => {
    const choices = [
        { name: 'Retry with elevated privileges (sudo)', value: 'sudo' },
        { name: 'Display manual configuration instructions', value: 'manual' },
        { name: 'Cancel operation', value: 'cancel' }
    ];

    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Permission denied. How would you like to proceed?',
        choices: choices
    });

    switch (action) {
        case 'sudo':
            await tryElevatedPrivileges(path, data);
            break;
        case 'manual':
            displayManualInstructions(path, data);
            break;
        case 'cancel':
            console.log(chalk.blue('Operation canceled by the user.'));
            break;
    }
};

const tryElevatedPrivileges = async (path, data) => {
    const escapedData = escapeDataForShell(data);
    const command = `echo '${escapedData}' | sudo tee ${path}`;
    try {
        await execShellCommand(command);
        console.log(chalk.green('Successfully configured NGINX with elevated privileges.'));
    } catch (error) {
        console.error(chalk.red(`Failed with elevated privileges: ${error.message}`));
        displayManualInstructions(path, data);
    }
};

const escapeDataForShell = (data) => {
    return data.replace(/'/g, "'\\''");
};

const displayManualInstructions = (path, data) => {
    console.log(chalk.yellow('Please follow these instructions to manually configure the NGINX server block:'));
    console.info(chalk.blue(`1. Open a terminal as a superuser or with root privileges.`));
    console.info(chalk.blue(`2. Use a text editor to open the NGINX configuration file: sudo nano ${path}`));
    console.info(chalk.blue(`3. Add or replace the following content:`));
    console.info(chalk.green(data));
};
