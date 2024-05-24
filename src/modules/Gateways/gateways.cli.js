import chalk from 'chalk';
import inquirer from 'inquirer';
import NetGetMainMenu from '../netget_MainMenu.cli.js';
import { manageGateway } from './gatewayPM2.js';

export async function Gateways_CLI(g) {
    console.clear();  // Clear the console when entering the Gateways menu
    console.log(chalk.green('Gateways Menu'));

    while (true) {
        const gatewayNames = g.gateways.map(gateway => gateway.name);
        const mainMenuOptions = [
            ...gatewayNames,
            'Show more Gateways...',
            'Add Gateway',
            'Go Back'  // Added Go Back option
        ];

        const { mainMenuSelection } = await inquirer.prompt({
            type: 'list',
            name: 'mainMenuSelection',
            message: 'Select an option:',
            choices: mainMenuOptions,
        });

        switch (mainMenuSelection) {
            case 'Go Back':
                console.clear();  // Clear the console when going back to the main menu
                console.log(chalk.blue('Returning to the main menu...'));
                await NetGetMainMenu();
                return;

            case 'Show more Gateways...':
                console.clear();  // Clear the console when showing more gateways
                console.log(chalk.blue('Showing more gateways...'));
                break;

            case 'Add Gateway':
                console.clear();  // Clear the console when adding a new gateway
                console.log(chalk.blue('Adding a new gateway...'));
                g = await addNewGateway();  // Update the g object with the new gateway
                break;

            default:
                const selectedGateway = g.gateways.find(gateway => gateway.name === mainMenuSelection);
                if (selectedGateway) {
                    console.clear();  // Clear the console before showing gateway actions
                    await showGatewayActions(selectedGateway);
                }
                break;
        }
    }
}

async function showGatewayActions(gateway) {
    while (true) {
        console.log(chalk.yellow(`Interacting with Gateway: ${gateway.name}`));
        const actions = ['start', 'stop', 'restart', 'delete', 'status', 'Go Back'];  // Added status and Go Back option
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: `Select an action for ${gateway.name}:`,
            choices: actions,
        });

        switch (action) {
            case 'Go Back':
                console.clear();  // Clear the console when going back to the previous menu
                return;  // Exit the loop to go back to the previous menu

            case 'start':
            case 'stop':
            case 'restart':
            case 'delete':
            case 'status':
                console.clear();  // Clear the console before performing an action
                await manageGateway(gateway.name, action);  // Pass the gateway name and action to manageGateway
                break;

            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                break;
        }
    }
}
