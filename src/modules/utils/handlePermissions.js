import { exec } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import os from 'os';

/**
 * Handles permission errors generically.
 * @param {string} taskDescription - Description of the task that requires permission.
 * @param {string} autoCommand - Command to execute for automatic resolution with elevated privileges.
 * @param {string} manualInstructions - Manual instructions for the user to resolve permission issues.
 */
const handlePermission = async (taskDescription, autoCommand, manualInstructions) => {
    const choices = [
        { name: 'Retry with elevated privileges', value: 'sudo' },
        { name: 'Display manual configuration instructions', value: 'manual' },
        { name: 'Cancel operation', value: 'cancel' }
    ];

    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: `Permission denied for ${taskDescription}. How would you like to proceed?`,
        choices: choices
    });

    switch (action) {
        case 'sudo':
            await tryElevatedPrivileges(autoCommand);
            break;
        case 'manual':
            displayManualInstructions(manualInstructions);
            break;
        case 'cancel':
            console.log(chalk.blue('Operation canceled by the user.'));
            break;
    }
};

/**
 * Tries to execute a command with elevated privileges.
 * @param {string} command - Command to execute with elevated privileges.
 */
const tryElevatedPrivileges = async (command) => {
    try {
        await execShellCommand(command);
        console.log(chalk.green('Permissions adjusted with elevated privileges.'));
    } catch (error) {
        console.error(chalk.red(`Failed with elevated privileges: ${error.message}`));
        displayManualInstructions(manualInstructions);
    }
};

/**
 * Displays manual configuration instructions.
 * @param {string} instructions - Instructions for manual permission resolution.
 */
const displayManualInstructions = (instructions) => {
    console.log(chalk.yellow(`To manually configure, follow these instructions:`));
    console.info(chalk.cyan(instructions));
}

const execShellCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(error));
            } else {
                resolve(stdout ? stdout : stderr);
            }
        });
    });
};

export default handlePermission;
