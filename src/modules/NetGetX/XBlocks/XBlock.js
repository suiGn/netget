// netget/src/modules/NetGetX/XBlocks/XBlock.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { enableXBlock, disableXBlock } from './XBlocksUtils.js';

export default async function XBlock(selectedXBlock, x) {
    const { XBlocksEnabled } = x;
    let exit = false;
    while (!exit) {
        const enabled = isXBlockEnabled(XBlocksEnabled, `${selectedXBlock}.conf`);
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: `Select an action for ${selectedXBlock}:`,
            choices: [
                enabled ? 'Disable XBlock' : 'Enable XBlock',
                'Back to XBlock Menu',
                'Exit'
            ]
        });

        switch (answers.option) {
            case 'Enable XBlock':
                await enableXBlock(selectedXBlock, x);
                break;
            case 'Disable XBlock':
                await disableXBlock(selectedXBlock, x);
                break;
            case 'Back to XBlock Menu':
                console.log(chalk.blue('Returning to XBlock menu...'));
                return;
            case 'Exit':
                console.log(chalk.blue('Exiting...'));
                exit = true;
                break;
            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                break;
        }
    }
};
