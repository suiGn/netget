// NetGetX.cli.js
import inquirer from 'inquirer';
import { showXBlocks } from './src/showXBlocks.js'; 
import chalk from 'chalk';
//import { addNewNGXBlock } from './src/addNewNGXBlock.js'; 
//import { showNGXBlocks, addNewNGXBlock, showNGXDiscoveryNode, addNewNGXDiscoveryNode, netGetXSettings, aboutNetGetX } from './netGetXOptions.js'; 
export async function NetGetX() {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'Select an action:',
        choices: [
            'Show NGXBlocks',
            'Add New NGXBlock',
            'Show NGXDiscoveryNodes',
            'Add New NGXDiscoveryNode',
            'NetGetX Settings',
            'About NetGetX',
            'Exit'
        ]
    });

    switch (answers.option) {
        case 'Show NGXBlocks':
            await showXBlocks();
            console.log('Show NGXBlocks');
            break;
        case 'Add New XBlock':
           // await addNewNGXBlock();
           console.log('Add New XBlock');
            break;
        // Continue handling other cases similarly
        case 'Exit':
            console.log(chalk.blue('Exiting NetGetX...'));
            break;
        default:
            await NetGetXMenu(); // Recurse back to the menu unless exiting
            break;
    }
}
