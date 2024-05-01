// verifyNginxInstallation.js
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';

export async function verifyNginxInstallation(userConfig) {
    console.log(chalk.blue('Verifying NGINX installation...'));

    // Verify if all required paths are set and exist
    if (!userConfig.nginxPath || !fs.existsSync(userConfig.nginxPath)) {
        console.log(chalk.red('NGINX configuration path is not set or does not exist.'));
        return false;
    }else{
        console.log(chalk.green('NGINX configuration path is set and exists.'));
    }

    if (!userConfig.nginxSitesAvailable || !fs.existsSync(userConfig.nginxSitesAvailable)) {
        console.log(chalk.red('NGINX sites-available path is not set or does not exist.'));
        return false;
    }else{
        console.log(chalk.green('NGINX sites-available path is set and exists.'));
    }

    if (!userConfig.nginxSitesEnabled || !fs.existsSync(userConfig.nginxSitesEnabled)) {
        console.log(chalk.red('NGINX sites-enabled path is not set or does not exist.'));
        return false;
        }else{
        console.log(chalk.green('NGINX sites-enabled path is set and exists.'));
    }

    // Verify if NGINX executable can be run to check its version
    if (!userConfig.nginxExecutable || !fs.existsSync(userConfig.nginxExecutable)) {
        console.log(chalk.red('NGINX executable path is not set or does not exist.'));
        return false;
    }else{
        console.log(chalk.green('NGINX executable path is set and exists.'));
    }

    try {
        const nginxVersionCommand = `${userConfig.nginxExecutable} -v 2>&1`; // Redirect stderr to stdout
        const output = execSync(nginxVersionCommand).toString();
        console.log(chalk.green('NGINX executable is operational.'));
        console.log(chalk.blue(`NGINX version: ${output}`));  // Now this should correctly log the output
    } catch (error) {
        console.log(chalk.red(`Failed to execute NGINX: ${error.message}`));
        return false;
    }

    console.log(chalk.green('All NGINX configurations and executable are correct and operational.'));
    return true;
}

