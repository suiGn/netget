//netget/src/modules/NetGetX/NetGetX.cli.js
import inquirer from 'inquirer';
import { showXBlocks } from './XBlocks/showXBlocks.js'; 
import chalk from 'chalk';
import { handleAddNewXBlock } from './XBlocks/handleAddNewXBlock.js';
import { i_DefaultNetGetX } from './config/i_DefaultNetGetX.js';
import NetGetMainMenu from '../netget_MainMenu.cli.js';
import nginxMenu from './NGINX/nginx_menu.cli.js';
import displayStateAndConfig from './config/x_StateAndConfig.js'; // Correct import statement
import { netGetXSettings } from './netGetXOptions.js'; 

export default async function NetGetX_CLI(x) {
    x = x ?? await i_DefaultNetGetX();
    let exit = false;
    while (!exit) {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'Select an action:',
            choices: [
                'Show XBlocks',
                'Add New XBlock',
                'NetGetX Settings',
                'NGINX Menu',
                'xConfig/xState',
                //'Show X Discovery Nodes',
                //'Add New X Discovery Node',
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
            case 'NetGetX Settings':
                await netGetXSettings();
                break;
            case 'NGINX Menu':
                await nginxMenu();
                break;
            case 'xConfig/xState':
                await displayStateAndConfig(x); // Call the function to display the state and config
                break;
            case 'Main Menu':
                console.log(chalk.blue('Returning to the main menu...'));
                await NetGetMainMenu();
                break;
            case 'Exit':
                console.log(chalk.blue('Exiting NetGetX...'));
                exit = true;
                break;
            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                break;
        }
    }
};
