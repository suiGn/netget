// netget_MainMenu.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { NetGetX } from './NetGetX/NetGetX.cli.js';
import { i_DefaultNetGetX } from './NetGetX/config/i_DefaultNetGetX.js';
import { handleGateways } from './Gateways/Gateways.js';
import { handleGets } from './Gets/Gets.js';
console.log(`
Welcome to:
╔╗╔┌─┐┌┬┐╔═╗┌─┐┌┬┐
║║║├┤  │ ║ ╦├┤  │ 
╝╚╝└─┘ ┴ ╚═╝└─┘ ┴ 
`);

export async function NetGetMainMenu() {
    /*

╔╗╔┌─┐┌┬┐╔═╗┌─┐┌┬┐
║║║├┤  │ ║ ╦├┤  │ 
╝╚╝└─┘ ┴ ╚═╝└─┘ ┴ 

*/
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['NetGetX', 'Gateways', 'Gets', new inquirer.Separator(), 'Exit'],
        },
    ]);

    switch (answers.action) {
        case 'NetGetX':
            console.log(chalk.blue('Initializing NetGetX...'));
            try {
                const setupVerified = await i_DefaultNetGetX();
                if (setupVerified) {
                    console.log(chalk.green('Setup verification successful.'));
                    console.log(`
                    ██╗  ██╗
                    ╚██╗██╔╝
                     ╚███╔╝ 
                     ██╔██╗ 
                    ██╔╝ ██╗
                    ╚═╝  ╚═╝
                    `);
                    await NetGetX();  // Proceed to the interactive menu if setup is verified
                } else {
                    console.log(chalk.red('Setup verification failed. Please resolve any issues before proceeding.'));
                    // Optionally, return to the main menu or provide options to retry
                }
            } catch (error) {
                console.log(chalk.red(`An error occurred during setup verification: ${error.message}`));
                // Error handling or further actions can be defined here
            }
            break;
        case 'Gateways':
            console.log(chalk.yellow('Selected Gateways'));
            // Call Gateways functionality here
            break;
        case 'Gets':
            console.log(chalk.yellow('Selected Gets'));
            // Call Gets functionality here
            break;
        case 'Exit':
            console.log(chalk.green('Exiting NetGet CLI.'));
            process.exit();
    }
}

