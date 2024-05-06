// netget/src/modules/NetGetX/config/setupSSLCertificates.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import chalk from 'chalk';
import { getDir } from '../../../scripts/setupConfig.js';  // Assuming getDir is properly exported

const SSL_DIR = path.join(getDir(), 'ssl');

const generateSelfSignedCertificate = (sslDir) => {
  return new Promise((resolve, reject) => {
    const certPath = path.join(sslDir, 'server.crt');
    const keyPath = path.join(sslDir, 'server.key');
    const command = `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=Random/L=Random/O=Random/CN=localhost"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`Error generating SSL certificate: ${error.message}`));
        reject(error);
      } else {
        console.log(chalk.green('SSL certificates generated successfully.'));
        resolve({ certPath, keyPath });
      }
    });
  });
};

const setupLetsEncrypt = async (sslDir) => {
  // Implement the actual setup for Let's Encrypt, this is just a placeholder
  return { certPath: path.join(sslDir, 'letsencrypt.crt'), keyPath: path.join(sslDir, 'letsencrypt.key') };
};

export default async function setupSSLCertificates(userConfig, useLetsEncrypt = false) {
  try {
    if (!fs.existsSync(SSL_DIR)) {
      fs.mkdirSync(SSL_DIR);
      console.log(chalk.green(`Created SSL directory at ${SSL_DIR}`));
    }

    let certDetails;
    if (useLetsEncrypt) {
      console.log(chalk.yellow('Setting up Let\'s Encrypt SSL certificates...'));
      certDetails = await setupLetsEncrypt(SSL_DIR);
    } else {
      console.log(chalk.yellow('Generating self-signed SSL certificates...'));
      certDetails = await generateSelfSignedCertificate(SSL_DIR);
    }

    // Update userConfig with new paths
    userConfig.sslCertificatePath = certDetails.certPath;
    userConfig.sslCertificateKeyPath = certDetails.keyPath;

    // Save updated userConfig to file
    const configFilePath = path.join(getDir(), 'userConfigX.json');
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 4));
    console.log(chalk.green('Updated user configuration with SSL paths.'));

    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to set up SSL certificates: ${error.message}`));
    return false;
  }
}
