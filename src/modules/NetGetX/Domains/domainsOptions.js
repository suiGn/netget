import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadOrCreateXConfig, saveXConfig } from '../config/xConfig.js';

const logDomainInfo = (domainConfig, domain) => {
    console.log(chalk.blue('\nDomain Information:'));
    console.table([{
        Domain: domain,
        Email: domainConfig.email,
        SSLCertificatesPath: domainConfig.SSLCertificatesPath
    }]);
};

const displayDomains = (domains) => {
    console.log('\nConfigured Domains:');
    domains.forEach(domain => console.log(`- ${domain}`));
};

/**
 * Logs the domain information to the console for all domains in the domains object.
 * @param {Object} domainsConfig - The domains configuration object from xConfig.
 */
const logAllDomainsTable = (domainsConfig) => {
    console.log(chalk.blue('\nDomains Information:'));
    const domainTable = Object.keys(domainsConfig).map(domain => ({
        Domain: domainsConfig[domain].domain,
        Email: domainsConfig[domain].email,
        SSLCertificatesPath: domainsConfig[domain].SSLCertificatesPath || 'N/A'
    }));
    console.table(domainTable);
};

const addNewDomain = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'domain',
            message: 'Enter the new domain:',
            validate: input => input ? true : 'Domain is required.'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Enter the email associated with this domain:',
            validate: input => input ? true : 'Email is required.'
        }
    ]);

    const { domain, email } = answers;
    const xConfig = await loadOrCreateXConfig();

    if (!xConfig.domains) {
        xConfig.domains = {};
    }

    if (xConfig.domains[domain]) {
        console.log(chalk.red(`Domain ${domain} already exists.`));
        return;
    }

    const newDomainConfig = {
        sslMode: 'letsencrypt',
        email: email
    };


    // Save only the new domain configuration
    await saveXConfig({ domain, ...newDomainConfig });

    console.log(chalk.green(`Domain ${domain} added successfully.`));
};

const editOrDeleteDomain = async (domain) => {
    try {
        const xConfig = await loadOrCreateXConfig();
        const domainConfig = xConfig.domains[domain];

        if (!domainConfig) {
            console.log(chalk.red(`Domain ${domain} configuration not found.`));
            return;
        }

        const options = [
            { name: 'Edit Domain', value: 'editDomain' },
            { name: 'Delete Domain', value: 'deleteDomain' },
            { name: 'Back to Domains Menu', value: 'back' }
        ];

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Select an option:',
                choices: options
            }
        ]);

        switch (answer.action) {
            case 'editDomain':
                // Implement edit domain functionality
                console.log(chalk.green(`Editing domain ${domain}...`));
                // Add your edit domain logic here
                break;
            case 'deleteDomain':
                // Implement delete domain functionality
                delete xConfig.domains[domain];
                await saveXConfig(xConfig);
                console.log(chalk.green(`Domain ${domain} deleted successfully.`));
                return;
            case 'back':
                return;
            default:
                console.log(chalk.red('Invalid selection. Please try again.'));
        }

        // After an action, redisplay the menu
        await editOrDeleteDomain(domain);
    } catch (error) {
        console.error(chalk.red('An error occurred in the Edit/Delete Domain Menu:', error.message));
    }
};

export {
    displayDomains,
    addNewDomain,
    editOrDeleteDomain,
    logDomainInfo,
    logAllDomainsTable
};
