// netget/src/modules/NetGetX/config/setSSLCertificates.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import chalk from 'chalk';

const generateSelfSignedCertificate = (certificatesDir) => {
  return new Promise((resolve, reject) => {
    const certPath = path.join(certificatesDir, 'nginx.crt');
    const keyPath = path.join(certificatesDir, 'nginx.key');
    const command = `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=Random/L=Random/O=Random/CN=localhost"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`Error generating SSL certificate: ${error.message}`));
        reject(error);
      } else {
        console.log(chalk.green('SSL certificates generated successfully.'));
        console.log(`Certificate path: ${certPath}`);
        console.log(`Key path: ${keyPath}`);
        resolve({ certPath, keyPath });
      }
    });
  });
};

const setupLetsEncrypt = async (certificatesDir) => {
  // Placeholder implementation for Let's Encrypt setup
  return { certPath: path.join(certificatesDir, 'letsencrypt.crt'), keyPath: path.join(certificatesDir, 'letsencrypt.key') };
};

export default async function setupSSLCertificates(xConfig, useLetsEncrypt = false) {
  const SSL_DIR = xConfig.SSLPath;
  const CERTIFICATES_DIR = path.join(SSL_DIR, 'certificates');

  try {
    if (!fs.existsSync(SSL_DIR)) {
      fs.mkdirSync(SSL_DIR);
      console.log(chalk.green(`Created SSL directory at ${SSL_DIR}`));
    }
    if (!fs.existsSync(CERTIFICATES_DIR)) {
      fs.mkdirSync(CERTIFICATES_DIR);
      console.log(chalk.green(`Created certificates directory at ${CERTIFICATES_DIR}`));
    }

    let certDetails;
    if (useLetsEncrypt) {
      console.log(chalk.yellow('Setting up Let\'s Encrypt SSL certificates...'));
      certDetails = await setupLetsEncrypt(CERTIFICATES_DIR);
    } else {
      console.log(chalk.yellow('Generating self-signed SSL certificates...'));
      certDetails = await generateSelfSignedCertificate(CERTIFICATES_DIR);
    }

    // Update xConfig with new paths
    xConfig.SSLCertificatesPath = certDetails.certPath;
    xConfig.SSLCertificateKeyPath = certDetails.keyPath;

    // Save updated xConfig to file
    const configFilePath = path.join(xConfig.getPath, 'userConfigX.json');
    fs.writeFileSync(configFilePath, JSON.stringify(xConfig, null, 4));
    console.log(chalk.green('Updated user configuration with SSL paths.'));

    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to set up SSL certificates: ${error.message}`));
    return false;
  }
}
