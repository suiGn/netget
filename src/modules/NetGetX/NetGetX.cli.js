//netget/src/modules/NetGetX/NetGetX.cli.js
import inquirer from 'inquirer';
//import { showXBlocks } from './XBlocks/showXBlocks.js'; 
import chalk from 'chalk';
import  XBlocksMenu  from './XBlocks/XBlocksMenu.cli.js'; // Import the new addXBlockMenu
import { i_DefaultNetGetX } from './config/i_DefaultNetGetX.js';
import NetGetMainMenu from '../netget_MainMenu.cli.js';
import nginxMenu from './NGINX/nginx_menu.cli.js';
import displayStateAndConfig from './config/x_StateAndConfig.js'; // Correct import statement
import netGetXSettingsMenu from './NetGetX_Settings.cli.js'; 
import domainsMenu from './Domains/domains.cli.js';

export default async function NetGetX_CLI(x) {
    x = x ?? await i_DefaultNetGetX();
    let exit = false;
    while (!exit) {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'Select an action:',
            choices: [
                'XBlocks',
                'Domains and Certificates',
                'Settings',
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
            case 'XBlocks':
                await XBlocksMenu(x);
                break;
            case 'Domains and Certificates':
                await domainsMenu();
                break;
            case 'Settings':
                await netGetXSettingsMenu(x);
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
                console.log(chalk.blue('Exiting NetGet...'));
                process.exit(); 
            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                break;
        }
    }
};
