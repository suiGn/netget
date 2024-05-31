import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Parses the server_name directive from an NGINX configuration file.
 * @param {string} filePath - Path to the NGINX configuration file.
 * @returns {Array<string>} - The server_name values or an empty array if none found.
 */
const parseServerNames = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matches = fileContent.match(/server_name\s+([^;]+);/g);
    if (!matches) return [];

    return matches.map(match => match.replace(/server_name\s+([^;]+);/, '$1').trim().split(/\s+/)).flat();
};

/**
 * Checks if a domain is already used in any server block.
 * @param {string} configDir - The directory containing NGINX configuration files.
 * @param {string} domain - The domain to check.
 * @returns {boolean} - True if the domain is already used, false otherwise.
 */
const isDomainUsed = (configDir, domain) => {
    const files = fs.readdirSync(configDir).filter(file => file.endsWith('.conf'));
    for (const file of files) {
        const filePath = path.join(configDir, file);
        const serverNames = parseServerNames(filePath);
        if (serverNames.includes(domain)) {
            return true;
        }
    }
    return false;
};

/**
 * Creates a new XBlock for the specified domain.
 * @param {string} domain - The domain for which to create the XBlock.
 * @param {Object} xConfig - The user configuration object.
 */
const createXBlock = async (domain, xConfig) => {
    const { XBlocksAvailable, domains } = xConfig;

    if (isDomainUsed(XBlocksAvailable, domain)) {
        console.log(chalk.red(`The domain ${domain} is already used in a server block.`));
        return;
    }

    const domainConfig = domains[domain];

    const responses = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'enforceSSL',
            message: 'Do you want to enforce SSL?',
            default: false
        },
        {
            type: 'input',
            name: 'staticPath',
            message: 'Enter the static path for the domain:',
            default: `/var/www/${domain}/html`
        }
    ]);

    if (responses.enforceSSL) {
        if (!fs.existsSync(domainConfig.SSLCertificatesPath)) {
            console.log(chalk.yellow(`SSL certificate for ${domain} not found. Please issue a certificate.`));
            return;
        }
    }

    const xBlockContent = `
server {
    listen 80;
    server_name ${domain};
    root ${responses.staticPath};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    ${responses.enforceSSL ? `
    listen 443 ssl;
    ssl_certificate ${domainConfig.SSLCertificatesPath};
    ssl_certificate_key ${domainConfig.SSLCertificateKeyPath || ''};
    ` : ''}
}
`;

    const xBlockPath = path.join(XBlocksAvailable, `${domain}.conf`);
    fs.writeFileSync(xBlockPath, xBlockContent);
    console.log(chalk.green(`XBlock for ${domain} created successfully at ${xBlockPath}.`));
};

export { createXBlock };