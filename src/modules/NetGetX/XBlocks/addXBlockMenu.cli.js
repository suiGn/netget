import inquirer from 'inquirer';
import chalk from 'chalk';
import { createXBlock } from './createXBlock.js';
import { logDomainInfo, logAllDomainsTable } from '../Domains/domainsOptions.js';

/**
 * Prompts the user to select a domain and create an XBlock for it.
 * @param {Object} x - The user configuration object.
 */
const addXBlockMenu = async (x) => {
    
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

            switch (confirm) {
                case true:
                    try {
                        await createXBlock(selectedDomain, x);
                        console.log(chalk.green(`XBlock for ${selectedDomain} created successfully.`));
                    } catch (error) {
                        console.error(chalk.red(`Failed to create XBlock for ${selectedDomain}: ${error.message}`));
                    }
                    break;
                case false:
                    console.log(chalk.blue('Operation cancelled.'));
                    break;

                default:
                    console.log(chalk.red('Invalid choice, please try again.'));
                    break;
            }
    }
};

export default addXBlockMenu;
