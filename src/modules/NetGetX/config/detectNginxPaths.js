// detectNginxPath.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Finds the NGINX configuration file and its base directory on the system.
 * @returns {object} An object containing paths to the NGINX configuration file and its base directory or null values if not found.
 */
export function findNginxConfigPath() {
    const configPaths = [
        '/etc/nginx/nginx.conf',
        '/usr/local/etc/nginx/nginx.conf',
        '/opt/homebrew/etc/nginx/nginx.conf',
        'C:\\nginx\\nginx.conf'
    ];

    // Check if any standard path exists and return the path and its base directory
    const foundPath = configPaths.find(fs.existsSync);
    if (foundPath) {
        return {
            configPath: foundPath,
            basePath: path.dirname(foundPath)
        };
    }

    // Try to find nginx path in the system PATH and extract the configuration file using 'nginx -t'
    try {
        const systemPath = execSync('which nginx').toString().trim();
        const configTestCmd = `${systemPath} -t`;
        const output = execSync(configTestCmd).toString();
        const match = output.match(/nginx: configuration file (\S*) syntax is ok/);
        if (match && match[1]) {
            return {
                configPath: match[1],
                basePath: path.dirname(match[1])
            };
        }
    } catch (error) {
        console.error(chalk.red(`Failed to locate NGINX via system PATH: ${error.message}`));
    }

    // Return null if no configuration path or base directory could be found
    return { configPath: null, basePath: null };
}

/**
 * Gets the path to the directory containing available XBlocks.
 * @param {string} baseDir The base directory of NGINX configurations.
 * @returns {string|null} The path to the XBlocks-available directory, or null if not found.
 */
export function getXBlocksAvailable(baseDir) {
    const xBlocksAvailablePath = path.join(baseDir, 'XBlocks-available');
    return fs.existsSync(xBlocksAvailablePath) ? xBlocksAvailablePath : null;
}

/**
 * Gets the path to the directory containing enabled XBlocks.
 * @param {string} baseDir The base directory of NGINX configurations.
 * @returns {string|null} The path to the XBlocks-enabled directory, or null if not found.
 */
export function getXBlocksEnabled(baseDir) {
    const xBlocksEnabledPath = path.join(baseDir, 'XBlocks-enabled');
    return fs.existsSync(xBlocksEnabledPath) ? xBlocksEnabledPath : null;
}
