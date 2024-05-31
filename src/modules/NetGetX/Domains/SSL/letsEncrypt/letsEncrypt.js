import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { loadOrCreateXConfig, saveXConfig } from '../../../config/xConfig.js';
import checkAndInstallCertbot from '../Certbot/checkAndInstallCertbot.js';
import { obtainSSLCertificates } from '../Certbot/SSLCertificatesHandler.js';

const verifyDNSRecord = async (domain) => {
    return new Promise((resolve, reject) => {
        const command = `nslookup -q=txt _acme-challenge.${domain}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Failed to verify DNS record: ${error.message}`));
                reject(error);
                return;
            }
            if (stdout.includes('NXDOMAIN')) {
                console.error(chalk.red(`DNS record not found for _acme-challenge.${domain}`));
                reject(new Error(`DNS record not found for _acme-challenge.${domain}`));
                return;
            }
            console.log(chalk.green(`DNS record found for _acme-challenge.${domain}`));
            resolve(true);
        });
    });
};

const letsEncryptMethod = async (xConfig) => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'domain',
                message: 'Please enter your domain:',
                validate: input => input ? true : 'Domain is required.'
            },
            {
                type: 'input',
                name: 'email',
                message: 'Please enter your email:',
                validate: input => input ? true : 'Email is required.'
            }
        ]);

        const { domain, email } = answers;

        console.log(chalk.green(`Setting up LetsEncrypt SSL for domain ${domain} with email ${email}...`));

        // Save initial configuration
        await saveXConfig({
            sslMode: 'letsencrypt',
            domain,
            email
        });

        await checkAndInstallCertbot();
        console.log(chalk.green('Certbot and NGINX plugin are ready.'));
        console.log(chalk.green('Using DNS-01 challenge for wildcard certificate...'));

        console.log(chalk.yellow('Please deploy DNS TXT records as requested by Certbot.'));
        await obtainSSLCertificates(domain, email);

        console.log(chalk.green('Verifying DNS record...'));
        await verifyDNSRecord(domain);

        const SSLPath = `/etc/letsencrypt/live/${domain}`;
        await saveXConfig({
            sslMode: 'letsencrypt',
            domain,
            email,
            SSLCertificatesPath: `${SSLPath}/fullchain.pem`,
            SSLCertificateKeyPath: `${SSLPath}/privkey.pem`
        });

        console.log(chalk.green('SSL configuration updated successfully.'));
        await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'SSL setup is complete. Select Continue to return to the main menu.',
                default: true
            }
        ]);
    } catch (error) {
        console.error(chalk.red('An error occurred during the LetsEncrypt setup process:', error.message));

        // Retry option in case of failure
        const retryAnswers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'retry',
                message: 'DNS verification failed. Do you want to retry the verification process?',
                default: true
            }
        ]);

        if (retryAnswers.retry) {
            try {
                console.log(chalk.green('Retrying DNS verification...'));
                await verifyDNSRecord(xConfig.domain);
                console.log(chalk.green('DNS record verified successfully.'));
            } catch (retryError) {
                console.error(chalk.red('Retry failed:', retryError.message));
            }
        }
    }
};

export default letsEncryptMethod;
