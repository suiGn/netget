// verifyNginxInstallation.js
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';

export default async function verifyNginxInstallation(userConfig) {
    //console.log(chalk.blue('Verifying NGINX installation...'));
    // Verify if all required paths are set and exist
    if (!userConfig.nginxPath || !fs.existsSync(userConfig.nginxPath)) {
        console.log(chalk.red('NGINX configuration path is not set or does not exist.'));
        return false;
    }/*else{
        console.log(`userConfig.nginxPath at: ${chalk.green(userConfig.nginxPath)} , Set and Exists: ${chalk.green("Verified.")}`);
    }*/

    if (!userConfig.nginxSitesAvailable || !fs.existsSync(userConfig.nginxSitesAvailable)) {
        console.log(chalk.red('NGINX sites-available path is not set or does not exist.'));
        return false;
    }/*else{
        console.log(`userConfig.nginxSitesAvailable at: ${chalk.green(userConfig.nginxSitesAvailable)} , Set and Exists: ${chalk.green("Verified.")}`);
    }*/

    if (!userConfig.nginxSitesEnabled || !fs.existsSync(userConfig.nginxSitesEnabled)) {
        console.log(chalk.red('NGINX sites-enabled path is not set or does not exist.'));
        return false;
        }/*else{
        console.log(`userConfig.nginxSitesEnabled at: ${chalk.green(userConfig.nginxSitesEnabled)} , Set and Exists: ${chalk.green("Verified.")}`);
    }*/

    // Verify if NGINX executable can be run to check its version
    if (!userConfig.nginxExecutable || !fs.existsSync(userConfig.nginxExecutable)) {
        console.log(chalk.red('NGINX executable path is not set or does not exist.'));
        return false;
    }/*else{
        console.log(`userConfig.nginxExecutable at: ${chalk.green(userConfig.nginxExecutable)} , Set and Exists: ${chalk.green("Verified.")}`);
    }*/

    try {
        const nginxVersionCommand = `${userConfig.nginxExecutable} -v 2>&1`; // Redirect stderr to stdout
        const output = execSync(nginxVersionCommand).toString();
        //console.log(`NGINX Executable is Operational: ${chalk.blue(output)}`);
    } catch (error) {
        console.log(chalk.red(`Failed to execute NGINX: ${error.message}`));
        return false;
    }
    return true;
}

