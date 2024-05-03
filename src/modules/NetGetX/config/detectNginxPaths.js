// detectNginxPath.js
import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';

const findNginxConfig = () => {
    // Array of potential standard paths for nginx.conf
    const configPaths = [
        '/etc/nginx/nginx.conf',           // Common on Linux
        '/usr/local/etc/nginx/nginx.conf', // Common on Unix/Mac
        '/opt/homebrew/etc/nginx/nginx.conf', // Homebrew on Mac
        'C:\\nginx\\nginx.conf'            // Common on Windows
    ];
    // Check if any standard path exists
    const foundPath = configPaths.find(path => fs.existsSync(path));
    if (foundPath) return foundPath;

    // Try to find nginx path in the system PATH
    try {
        const systemPath = execSync('which nginx').toString().trim();
        // Extract the config file path using nginx -t
        const configTestCmd = `${systemPath} -t`;
        const output = execSync(configTestCmd).toString();
        const match = output.match(/nginx: configuration file (\S*) syntax is ok/);
        if (match && match[1]) return match[1];
    } catch (error) {
        console.error(chalk.red('Failed to locate NGINX via system PATH.'));
    }

    return null;
};


const detectNginxPaths = () => {
    let nginxConfigPath = findNginxConfig();
    if (!nginxConfigPath) {
        console.error(chalk.red('NGINX configuration file not found.'));
        return null;
    }
    // Assuming standard directory structure relative to the main config path
    let baseDir = path.dirname(nginxConfigPath);
    let sitesAvailable = path.join(baseDir, 'sites-available');
    let sitesEnabled = path.join(baseDir, 'sites-enabled');
    return {
        nginxPath: nginxConfigPath,
        nginxSitesAvailable: fs.existsSync(sitesAvailable) ? sitesAvailable : '',
        nginxSitesEnabled: fs.existsSync(sitesEnabled) ? sitesEnabled : ''
    };
};

export default detectNginxPaths;
