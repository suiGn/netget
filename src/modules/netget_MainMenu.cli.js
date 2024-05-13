// netget_MainMenu.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import  NetGetX_CLI  from './NetGetX/NetGetX.cli.js';
import { i_DefaultNetGetX } from './NetGetX/config/i_DefaultNetGetX.js';
import { handleAccessPoints } from './AccessPoints/AccessPoints.js';
import { handleGateways } from './Gateways/Gateways.js';
import { handleGets } from './Gets/Gets.js';
/**
 * Main menu for the NetGet CLI.
 */
console.log(`
Welcome to:
╔╗╔┌─┐┌┬┐╔═╗┌─┐┌┬┐
║║║├┤  │ ║ ╦├┤  │ 
╝╚╝└─┘ ┴ ╚═╝└─┘ ┴ 
`);
console.log(`v2.4.33`);  // Logs the current version of the application
export default async function NetGetMainMenu() {
    const answers = await inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'Main Menu:',
        choices: ['NetGetX', 'Gateways', 'Gets', 'AccessPoints', new inquirer.Separator(), 'Exit'],
    },
    ]);

    switch (answers.action) {
        case 'NetGetX':
            const x = await i_DefaultNetGetX();  // Load production configuration
            if (x) {
                console.log(`
                        ██╗  ██╗ .nginxPath at: ${chalk.green(x.nginxPath)}
                        ╚██╗██╔╝ .XBlocksAvailable at: ${chalk.green(x.XBlocksAvailable)}
                         ╚███╔╝  .XBlocksEnabled at: ${chalk.green(x.XBlocksEnabled)}
                         ██╔██╗  .netgetXExecutable at: ${chalk.green(x.nginxExecutable)}
                        ██╔╝ ██╗ .publicIP: ${chalk.green(x.publicIP)}
                        ╚═╝  ╚═╝ .localIP: ${chalk.green(x.localIP)}
                        `);
                        await NetGetX_CLI();  // Pass the development flag to the CLI
                    } else {
                        console.log(chalk.red('Setup verification failed. Please resolve any issues before proceeding.'));
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
        case 'AccessPoints':
            console.log(chalk.magenta('Selected AccessPoints'));
            await handleAccessPoints();  // Call AccessPoints functionality here
            break;
        case 'Exit':
            console.log(chalk.green('Exiting NetGet CLI.'));
            process.exit();
    }
}