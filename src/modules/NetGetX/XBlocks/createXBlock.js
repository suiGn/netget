//netget/src/modules/NetGetX/XBlocks/createXBlock.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { checkCertificates, obtainSSLCertificates } from '../Domains/SSL/SSLCertificates.js';
import { handlePermission } from '../../utils/handlePermissions.js';

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
        const certExists = await checkCertificates(domain);
        if (!certExists) {
            console.log(chalk.yellow(`SSL certificate for ${domain} not found. Do you want to issue a certificate?`));
            const { issueCert } = await inquirer.prompt({
                type: 'confirm',
                name: 'issueCert',
                message: `Do you want to issue a certificate for ${domain}?`,
                default: true
            });
            if (issueCert) {
                await obtainSSLCertificates(domain, domainConfig.email);
            } else {
                console.log(chalk.red('SSL certificate not found. Cannot enforce SSL without a certificate.'));
                return;
            }
        }
    }

    const xMainOutPutPort = xConfig.xMainOutPutPort;
    const mainServerName = xConfig.mainServerName;;

    // SSL certificate paths
    const sslCertificate = `/etc/letsencrypt/live/${mainServerName}/fullchain.pem`;
    const sslCertificateKey = `/etc/letsencrypt/live/${mainServerName}/privkey.pem`;

    const xBlockContent = `
        server {
            listen 80 default_server; oa link oa
            listen [::]:80 default_server;
            server_name *.${domain}
            return 301 https://$host$request_uri;
        }

            ${responses.enforceSSL ? `
        server {
            listen 443 ssl;
            listen [::]:443 ssl;
            server_name *.${domain};

            ssl_certificate ${sslCertificate};
            ssl_certificate_key ${sslCertificateKey};

            include snippets/ssl-params.conf;

            root ${getPath}/static/default;
            index index.html index.htm index.nginx-debian.html;            

            location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:${xMainOutPutPort};
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
            }
        }
            ` : ''}
        `;

    const xBlockPath = path.join(XBlocksAvailable, `${domain}.conf`);

    try {
        fs.writeFileSync(xBlockPath, xBlockContent);
        console.log(chalk.green(`XBlock for ${domain} created successfully at ${xBlockPath}.`));
    } catch (error) {
        if (error.code === 'EACCES') {
            await handlePermission(
                `creating XBlock for ${domain}`,
                `echo "${xBlockContent}" | sudo tee ${xBlockPath}`,
                `Manually create the XBlock configuration file at ${xBlockPath} with the following content:\n\n${xBlockContent}`
            );
        } else {
            console.error(chalk.red(`Failed to create XBlock for ${domain}: ${error.message}`));
        }
    }
};

export { createXBlock };
