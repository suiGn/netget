//netget/src/modules/NetGetX/XBlocks/XBlocksMenu.cli.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import NetGetMainMenu from '../../netget_MainMenu.cli.js';
import { showXBlocks } from './XBlocks.js';
import addXBlockMenu from './addXBlockMenu.cli.js';

export default async function XBlockMenu(x) {
    const { XBlocksAvailable, XBlocksEnabled, domains } = x;
    showXBlocks(XBlocksAvailable, XBlocksEnabled);
    let exit = false;
    while (!exit) {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'Select an action:',
            choices: [
                'Add XBlocks',
                'Main Menu',
                'Exit'
            ]
        });

        switch (answers.option) {
            case 'Add XBlocks':
                await addXBlockMenu(x);
                break;
            case 'Main Menu':
                console.log(chalk.blue('Returning to the main menu...'));
                await NetGetMainMenu();
                break;
            case 'Exit':
                console.log(chalk.blue('Exiting NetGet...'));
                process.exit(); 
            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                break;
        }
    }
};
