// netget_MainMenu.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import  NetGetX_CLI  from './NetGetX/NetGetX.cli.js';
import { i_DefaultNetGetX } from './NetGetX/config/i_DefaultNetGetX.js';
import { handleGateways } from './Gateways/Gateways.js';
import { handleGets } from './Gets/Gets.js';

console.log(`
Welcome to:
╔╗╔┌─┐┌┬┐╔═╗┌─┐┌┬┐
║║║├┤  │ ║ ╦├┤  │ 
╝╚╝└─┘ ┴ ╚═╝└─┘ ┴ 
`);
console.log(`v2.4.31`);  // Logs the current version of the application
export default async function NetGetMainMenu() {
    /*

╔╗╔┌─┐┌┬┐╔═╗┌─┐┌┬┐
║║║├┤  │ ║ ╦├┤  │ 
╝╚╝└─┘ ┴ ╚═╝└─┘ ┴ 

*/
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Main Menu:',
            choices: ['NetGetX', 'Gateways', 'Gets', new inquirer.Separator(), 'Exit'],
        },
    ]);

    switch (answers.action) {
        case 'NetGetX':
            try {
                const x = await i_DefaultNetGetX();
                if (x) {
                    console.log(`
                    ██╗  ██╗ .nginxPath at: ${chalk.green(x.nginxPath)}
                    ╚██╗██╔╝ .nginxSitesAvailable at: ${chalk.green(x.nginxsitesAvailable)}
                     ╚███╔╝  .nginxSitesEnabled at: ${chalk.green(x.nginxSitesEnabled)}
                     ██╔██╗  .nginxExecutable at: ${chalk.green(x.nginxExecutable)}
                    ██╔╝ ██╗ .publicIP: ${chalk.green(x.publicIP)}
                    ╚═╝  ╚═╝ .localIP: ${chalk.green(x.localIP)}
                                                ...                  
                                                ...`);
         await NetGetX_CLI();  // Proceed to the interactive menu if setup is verified
                } else {
                    console.log(chalk.red('Setup verification failed. Please resolve any issues before proceeding.'));
                    // Optionally, return to the main menu or provide options to retry
                    return false;
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

