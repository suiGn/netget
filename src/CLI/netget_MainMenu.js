// netget_MainMenu.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { handleNetGetX } from './NetGetX.js';
import { handleGateways } from './Gateways.js';
import { handleGets } from './Gets.js';

export async function NetGetMainMenu() {
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
            await handleNetGetX();
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

