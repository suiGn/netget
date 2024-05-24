// netget/src/modules/Gateways/addGateway.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { addGateway, loadOrCreateGConfig } from './config/gConfig.js';

/**
 * Prompts the user to add a new gateway and updates the configuration.
 */
async function addNewGateway() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new gateway:',
    });

    const { port } = await inquirer.prompt({
        type: 'number',
        name: 'port',
        message: 'Enter the port for the new gateway:',
        validate: (input) => {
            if (Number.isNaN(input) || input <= 0 || input > 65535) {
                return 'Please enter a valid port number (1-65535).';
            }
            return true;
        },
    });

    const newGateway = {
        name,
        port,
        status: 'stopped',
    };

    await addGateway(newGateway);
    console.log(chalk.green(`Gateway "${name}" added successfully on port ${port}.`));

    // Reload the updated configuration
    const updatedConfig = await loadOrCreateGConfig();
    return updatedConfig;
}

export { addNewGateway };
