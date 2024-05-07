// verifyNginxInstallation.js
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';

export default async function verifyNginxConfig(xConfig) {
    //console.log(chalk.blue('Verifying NGINX installation...'));
    // Verify if all required paths are set and exist
    if (!xConfig.nginxPath || !fs.existsSync(xConfig.nginxPath)) {
        console.log(chalk.red('NGINX configuration path is not set or does not exist.'));
        return false;
    }

    // Verify if NGINX executable can be run to check its version
    if (!xConfig.nginxExecutable || !fs.existsSync(xConfig.nginxExecutable)) {
        console.log(chalk.red('NGINX executable path is not set or does not exist.'));
        return false;
    }

    try {
        const nginxVersionCommand = `${xConfig.nginxExecutable} -v 2>&1`; // Redirect stderr to stdout
        const output = execSync(nginxVersionCommand).toString();
        console.log(`NGINX Executable is Operational: ${chalk.blue(output)}`);
    } catch (error) {
        console.log(chalk.red(`Failed to execute NGINX: ${error.message}`));
        return false;
    }
    return true;
}

