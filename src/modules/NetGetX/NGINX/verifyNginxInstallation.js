import { execSync } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';

async function verifyNginxInstallation() {
    const nginxPaths = [
        '/usr/sbin/nginx',
        '/usr/local/nginx/sbin/nginx',
        '/usr/local/sbin/nginx',
        '/usr/local/bin/nginx',
        '/sbin/nginx',
        '/opt/nginx/sbin/nginx',
        '/opt/homebrew/bin/nginx', // Homebrew managed nginx on newer macOS
        'C:\\Program Files\\nginx\\nginx.exe',
        'C:\\nginx\\nginx.exe'
    ];

    // First, try to detect using 'which' or 'where' based on the platform
    try {
        const command = process.platform === 'win32' ? 'where' : 'which';
        const result = execSync(`${command} nginx`).toString().trim();
        if (result) {
            console.log(chalk.green(`NGINX executable at: ${result}`));
            return result;
        }
    } catch (error) {
        console.warn(chalk.yellow(`NGINX not found on system PATH.`));
    }

    // If 'which' or 'where' fails, check common paths directly
    for (let nginxPath of nginxPaths) {
        if (fs.existsSync(nginxPath)) {
            console.log(chalk.green(`NGINX executable found at: ${nginxPath}`));
            return nginxPath;
        }
    }

    console.log(chalk.red("NGINX executable not found on this system."));
    return null;
}

export default verifyNginxInstallation;
