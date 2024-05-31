//netget/src/modules/NetGetX/Domains/SSL/ssl.cli.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadOrCreateXConfig, saveXConfig } from '../../config/xConfig.js';
import checkAndInstallCertbot from './Certbot/checkAndInstallCertbot.js';
import { 
    verifySSLCertificate, 
    renewSSLCertificate, 
    verifyDNSRecord, 
    obtainSSLCertificates,
    checkCertificates } from './SSLCertificates.js';
import printCertbotLogs from './Certbot/certbot.js';

const displayCurrentSSLConfiguration = (domainConfig, domain) => {
    console.log('\nCurrent SSL Configuration:');
    console.log(`
███████ ███████ ██ .domain: ${chalk.green(domain)}  
██      ██      ██ .email: ${chalk.green(domainConfig.email)} 
███████ ███████ ██ .enforceHttps: ${chalk.green(domainConfig.enforceHttps)}
     ██      ██ ██ .SSLCertificatesPath: ${chalk.green(domainConfig.SSLCertificatesPath)}
███████ ███████ ███████ .SSLCertificatesPath: ${chalk.green(domainConfig.SSLCertificatesPath)}
.SSL Verification: ${chalk.green("Good/Bad")}`);
};

const domainSSLConfiguration = async (domain) => {
    try {
           // Check and install Certbot before proceeding with SSL Configuration
           const certbotInstalled = await checkAndInstallCertbot();
           if (!certbotInstalled) {
               console.log(chalk.red('Certbot installation failed. Cannot proceed with SSL configuration.'));
               return;
           }
        const xConfig = await loadOrCreateXConfig();
        const domainConfig = xConfig.domains[domain];

        if (!domainConfig) {
            console.log(chalk.red(`Domain ${domain} configuration not found.`));
            return;
        }

        const certificatesIssued = await checkCertificates(domain);

        if (certificatesIssued) {

            if (!domainConfig.SSLCertificatesPath || !domainConfig.SSLCertificateKeyPath) {
            domainConfig.SSLCertificatesPath = `/etc/letsencrypt/live/${domain}/fullchain.pem`;
            domainConfig.SSLCertificateKeyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;
            await saveXConfig({ domains: { [domain]: domainConfig } });
        }            

            displayCurrentSSLConfiguration(domainConfig, domain);

            const options = [
                { name: 'Verify SSL Certificate', value: 'verifyCertificate' },
                { name: 'Renew SSL Certificate', value: 'renewCertificate' },
                { name: 'View Certbot Logs', value: 'viewLogs' },
                { name: 'Back to Domains Menu', value: 'back' },
                { name: 'Exit', value: 'exit' }
            ];

            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'Select an SSL Configuration option:',
                    choices: options
                }
            ]);

            switch (answer.action) {
                case 'verifyCertificate':
                    await verifySSLCertificate(domain);
                    break;
                case 'renewCertificate':
                    await renewSSLCertificate(domain);
                    break;
                case 'viewLogs':
                    await printCertbotLogs();
                    break;
                case 'editSSLMethod':
                    await saveXConfig({ domain, sslMode: null });
                    console.log(chalk.green('SSL Configuration method has been reset.'));
                    break;
                case 'back':
                    return;
                case 'exit':
                    console.log(chalk.blue('Exiting NetGet...'));
                    process.exit(); 
                default:
                    console.log(chalk.red('Invalid selection. Please try again.'));
            }
        } else {
            console.log(chalk.yellow(`No certificates found for ${domain}.`));
            const { issueCertificates } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'issueCertificates',
                    message: `No certificates found for ${domain}. Would you like to issue certificates?`,
                    default: true
                }
            ]);

            if (issueCertificates) {
                await obtainSSLCertificates(domain, domainConfig.email);
                domainConfig.SSLCertificatesPath = `/etc/letsencrypt/live/${domain}/fullchain.pem`;
                domainConfig.SSLCertificateKeyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;
                await saveXConfig({ domains: { [domain]: domainConfig } });
            }
        }

        // After an action, redisplay the menu
        await displayCurrentSSLConfiguration(domain);
    } catch (error) {
        console.error(chalk.red('An error occurred in the SSL Configuration Menu:', error.message));
    }
};

export default domainSSLConfiguration;
