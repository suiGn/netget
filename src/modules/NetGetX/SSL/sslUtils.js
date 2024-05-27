//netget/src/modules/NetGetX/config/sslUtils.js
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import { ensureDirectoryExists, Path_Exists } from '../../utils/pathUtils.js';
import handlePermission from '../../utils/handlePermissions.js';
import { loadOrCreateXConfig, saveXConfig } from '../config/xConfig.js';
import generateSelfSignedCerts from './generateSelfSignedCerts.js';

/**
 * Adds a temporary self-signed SSL configuration to the NGINX config file.
 * @param {string} nginxConfigPath - The path to the NGINX configuration file.
 * @param {string} sslDir - The directory containing the self-signed SSL certificates.
 * @category NetGetX
 * @subcategory SSL 
 * @module sslUtils
*/
async function addTemporarySSLConfig(nginxConfigPath, sslDir) {
    if (!nginxConfigPath) {
        console.error(chalk.red("NGINX configuration path is not defined. Cannot add temporary SSL config."));
        return;
    }

    const sslConfig = `
server {
    listen 443 ssl;
    server_name _;

    ssl_certificate ${path.join(sslDir, 'selfsigned.crt')};
    ssl_certificate_key ${path.join(sslDir, 'selfsigned.key')};

    location / {
        return 200 'Temporary SSL setup';
        add_header Content-Type text/plain;
    }
}
`;

    let success = false;
    while (!success) {
        try {
            await fs.appendFile(nginxConfigPath, sslConfig);
            success = true; // Successfully added the SSL configuration
        } catch (error) {
            if (error.code === 'EACCES') {
                const autoCommand = `echo "${sslConfig}" | sudo tee -a ${nginxConfigPath}`;
                const manualInstructions = `echo "${sslConfig}" | sudo tee -a ${nginxConfigPath}`;
                const permissionHandled = await handlePermission('add temporary SSL config', autoCommand, manualInstructions);
                if (!permissionHandled) success = true; // Stop retrying if the user cancels
            } else {
                console.error(chalk.red(`Failed to add temporary SSL config: ${error.message}`));
                success = true; // Break the loop on non-permission errors
            }
        }
    }
}

/**
 * Removes the temporary self-signed SSL configuration from the NGINX config file.
 * @param {string} nginxConfigPath - The path to the NGINX configuration file.
 * @category NetGetX
 * @subcategory SSL 
 * @module sslUtils
*/
async function removeTemporarySSLConfig(nginxConfigPath) {
    if (!nginxConfigPath) {
        console.error(chalk.red("NGINX configuration path is not defined. Cannot remove temporary SSL config."));
        return;
    }

    try {
        const config = await fs.readFile(nginxConfigPath, 'utf-8');
        const updatedConfig = config.replace(/server\s*{[^}]*ssl_certificate[^}]*ssl_certificate_key[^}]*}/, '');
        await fs.writeFile(nginxConfigPath, updatedConfig);
    } catch (error) {
        console.error(chalk.red(`Failed to remove temporary SSL config: ${error.message}`));
    }
}

/**
 * Ensures SSL directories exist and updates the configuration.
 * Handles permission issues if they arise.
 * @param {Object} xConfig - The configuration object.
 * @returns {Promise<Object>} - The updated configuration object.
 * @category NetGetX
 * @subcategory SSL 
 * @module sslUtils
*/
async function ensureSSLDirectories(xConfig) {
    if (xConfig.nginxDir) {
        const sslPaths = [
            { key: 'SSLPath', dirPath: path.join(xConfig.nginxDir, 'ssl') },
            { key: 'SSLCertificatesPath', dirPath: path.join(xConfig.nginxDir, 'ssl/certificates') },
            { key: 'SSLCertificateKeyPath', dirPath: path.join(xConfig.nginxDir, 'ssl/key') }
        ];

        for (const { key, dirPath } of sslPaths) {
            let success = false;
            while (!success) {
                try {
                    await ensureDirectoryExists(dirPath);
                    await saveXConfig({ [key]: dirPath });
                    xConfig = await loadOrCreateXConfig();
                    success = true; // Successfully created the directory and updated config
                } catch (error) {
                    if (error.code === 'EACCES') {
                        const autoCommand = `sudo mkdir -p ${dirPath} && sudo chmod 755 ${dirPath}`;
                        const manualInstructions = `sudo mkdir -p ${dirPath} && sudo chmod 755 ${dirPath}`;
                        const permissionHandled = await handlePermission(`ensure ${key} directory exists`, autoCommand, manualInstructions);
                        if (!permissionHandled) success = true; // Stop retrying if the user cancels
                    } else {
                        console.error(chalk.red(`Failed to ensure ${key} directory exists: ${error.message}`));
                        success = true; // Break the loop on non-permission errors
                    }
                }
            }
        }

        // Generate self-signed certificates if not present
        const sslDir = path.join(xConfig.nginxDir, 'ssl');
        const certPath = path.join(sslDir, 'selfsigned.crt');
        const keyPath = path.join(sslDir, 'selfsigned.key');
        if (!await Path_Exists(certPath) || !await Path_Exists(keyPath)) {
            let success = false;
            while (!success) {
                try {
                    await generateSelfSignedCerts(sslDir);
                    success = true; // Successfully generated the certificates
                } catch (error) {
                    if (error.code === 'EACCES') {
                        const certCommand = `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"`;
                        const manualInstructions = `sudo ${certCommand}`;
                        const permissionHandled = await handlePermission('generate self-signed certificates', certCommand, manualInstructions);
                        if (!permissionHandled) success = true; // Stop retrying if the user cancels
                    } else {
                        console.error(chalk.red(`Failed to generate self-signed certificates: ${error.message}`));
                        success = true; // Break the loop on non-permission errors
                    }
                }
            }
        }
    } else {
        console.error(chalk.red("NGINX base path is not defined. Cannot set up SSL directories."));
    }

    return xConfig;
}

export {
    addTemporarySSLConfig,
    removeTemporarySSLConfig,
    ensureSSLDirectories
};
