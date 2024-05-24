//netget/src/modules/NetGetX/Certbot/obtainSSLCertificates.js
import { exec } from 'child_process';
import chalk from 'chalk';

const obtainSSLCertificates = (domain, email) => {
    return new Promise((resolve, reject) => {
        const command = `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${email}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Failed to obtain SSL certificates: ${error.message}`));
                reject(error);
                return;
            }
            console.log(chalk.green(`SSL certificates obtained successfully for ${domain}.`));
            resolve(true);
        });
    });
};



export default obtainSSLCertificates;
