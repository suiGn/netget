// netget/src/modules/NetGetX/XBlocks/XBlocks.cli.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import NetGetMainMenu from '../../netget_MainMenu.cli.js';
import { showXBlocks,
         getXBlocksList, 
         enableXBlock, 
         disableXBlock, 
         deleteXBlock,
         isXBlockEnabled } from './XBlocksUtils.js';
import { createXBlock } from './createXBlock.js';
import { logDomainInfo, logAllDomainsTable } from '../Domains/domainsOptions.js';

/**
 * Main XBlock menu.
 * @param {Object} x - The user configuration object.
 */
async function XBlockMenu(x) {
    const { XBlocksAvailable, XBlocksEnabled, domains } = x;
    showXBlocks(XBlocksAvailable, XBlocksEnabled);
    let exit = false;
    while (!exit) {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'Select an action:',
            choices: [
                'Show XBlocks',
                'Add XBlock',
                'Select XBlock',
                'Main Menu',
                'Exit'
            ]
        });

        switch (answers.option) {
            case 'Show XBlocks':
                showXBlocks(XBlocksAvailable, XBlocksEnabled);
                break;
            case 'Add XBlock':
                await addXBlockMenu(x);
                break;
            case 'Select XBlock':
                await selectXBlockMenu(x);
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
}

/**
 * Menu for selecting and managing individual XBlocks.
 * @param {Object} x - The user configuration object.
 */
async function selectXBlockMenu(x) {
    const { XBlocksAvailable, XBlocksEnabled } = x;
    const xBlocksList = getXBlocksList(XBlocksAvailable);
    if (xBlocksList.length === 0) {
        console.log(chalk.yellow('No XBlocks available.'));
        return;
    }

    const answers = await inquirer.prompt({
        type: 'list',
        name: 'selectedXBlock',
        message: 'Select an XBlock:',
        choices: [
            ...xBlocksList,
            new inquirer.Separator(),
            { name: 'Go Back', value: 'go_back' }
        ]
    });

    if (answers.selectedXBlock === 'go_back') {
        console.log(chalk.blue('Going back to the previous menu...'));
        return;
    }

    await XBlockMenuOptions(answers.selectedXBlock, x);
}

/**
 * Menu for managing a selected XBlock.
 * @param {string} selectedXBlock - The selected XBlock name.
 * @param {Object} x - The user configuration object.
 */
async function XBlockMenuOptions(selectedXBlock, x) {
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
                'Delete XBlock',
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
            case 'Delete XBlock':
                await deleteXBlockHandler(selectedXBlock, x);
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
}

/**
 * Handler for deleting an XBlock.
 * @param {string} selectedXBlock - The selected XBlock name.
 * @param {Object} x - The user configuration object.
 */
async function deleteXBlockHandler(selectedXBlock, x) {
    const { confirmDelete } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmDelete',
        message: `Are you sure you want to delete the XBlock for ${selectedXBlock}?`
    });

    if (confirmDelete) {
        await deleteXBlock(selectedXBlock, x);
        await XBlockMenu(x); // Go back to XBlocks menu after deletion
    } else {
        console.log(chalk.blue('Deletion cancelled.'));
        await XBlockMenu(x); // Go back to XBlocks menu after cancelling
    }
}

/**
 * Prompts the user to select a domain and create an XBlock for it.
 * @param {Object} x - The user configuration object.
 */
async function addXBlockMenu(x) {
    const { domains } = x;
    if (Object.keys(domains).length === 0) {
        console.log(chalk.red('No domains configured. Please add a domain first.'));
        return;
    }

    logAllDomainsTable(domains);
    const choices = [
        ...Object.keys(domains).map(domain => ({
            name: domains[domain].domain,
            value: domain
        })),
        new inquirer.Separator(),
        { name: 'Go Back', value: 'go_back' }
    ];

    const { selectedDomain } = await inquirer.prompt({
        type: 'list',
        name: 'selectedDomain',
        message: 'Select a domain to create an XBlock:',
        choices
    });

    switch (selectedDomain) {
        case 'go_back':
            console.log(chalk.blue('Going back to the previous menu...'));
            return;
        default:
            const domainConfig = domains[selectedDomain];
            logDomainInfo(domainConfig, selectedDomain);
            const { confirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: `Do you want to create an XBlock for ${selectedDomain}?`
            });

            if (confirm) {
                try {
                    await createXBlock(selectedDomain, x);
                    console.log(chalk.green(`XBlock for ${selectedDomain} created successfully.`));
                } catch (error) {
                    console.error(chalk.red(`Failed to create XBlock for ${selectedDomain}: ${error.message}`));
                }
            } else {
                console.log(chalk.blue('Operation cancelled.'));
            }
    }
}

export default XBlockMenu;