// NetGetX.cli.js
import inquirer from 'inquirer';
import { showXBlocks } from './src/showXBlocks.js'; 
import chalk from 'chalk';
import { handleAddNewXBlock } from './src/handleAddNewXBlock.js';
import NetGetMainMenu  from '../netget_MainMenu.cli.js';
import nginxMenu from './NGINX/nginx_menu.cli.js';
import { getState, updateState } from './xState.js';
//import { showNGXBlocks, addNewNGXBlock, showNGXDiscoveryNode, addNewNGXDiscoveryNode, netGetXSettings, aboutNetGetX } from './netGetXOptions.js'; 
export default async function NetGetX_CLI() {
    const x = getState();
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'Select an action:',
        choices: [
            'Show XBlocks',
            'Add New XBlock',
            'NGINX Menu',
            //'Show X Discovery Nodes',
            //'Add New X Discovery Node',
            //'NetGetX Settings',
            //'About NetGetX',
            'Main Menu',
            'Exit'
        ]
    });

    switch (answers.option) {
        case 'Show XBlocks':
            await showXBlocks();
            console.log('Show XBlocks');
            break;
        case 'Add New XBlock':
            await handleAddNewXBlock();
            console.log('Add New XBlock');
            break;
        case 'NGINX Menu':
            await nginxMenu();
            break;
        case 'Main Menu':
            console.log(chalk.blue('Returning to the main menu...'));
            await NetGetMainMenu();
            break;
        // Continue handling other cases similarly
        case 'Exit':
            console.log(chalk.blue('Exiting NetGetX...'));
            break;
        default:
            await NetGetX(); // Recurse back to the menu unless exiting
            break;
    }
}
