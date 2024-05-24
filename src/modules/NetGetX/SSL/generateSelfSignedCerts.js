// netget/src/modules/NetGetX/config/generateSelfSignedCerts.js
import { exec } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

/**
 * Ensures the directory exists, creating it if necessary.
 * @param {string} dirPath - The path to the directory to ensure.
 */
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Generates self-signed SSL certificates.
 * @param {string} basePath - The base path where SSL certificates and keys will be stored.
 * @returns {Promise<boolean>} - A promise that resolves to true if the certificates were generated successfully, otherwise false.
 */
const generateSelfSignedCerts = (basePath) => {
    return new Promise((resolve, reject) => {
        const sslDir = path.join(basePath, 'ssl');
        const certDir = path.join(sslDir, 'certificates');
        const keyDir = path.join(sslDir, 'key');

        // Ensure directories exist
        ensureDirectoryExists(certDir);
        ensureDirectoryExists(keyDir);

        const certPath = path.join(certDir, 'nginx.crt');
        const keyPath = path.join(keyDir, 'nginx.key');

        // OpenSSL command to generate self-signed certificates
        const command = `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Failed to generate self-signed certificates: ${error.message}`));
                reject(false);
                return;
            }
            console.log(chalk.green(`Self-signed certificates generated successfully at ${certPath} and ${keyPath}`));
            resolve(true);
        });
    });
};

export default generateSelfSignedCerts;
