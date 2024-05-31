import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Parses the server_name directive from an NGINX configuration file.
 * @param {string} filePath - Path to the NGINX configuration file.
 * @returns {string} - The server_name value or 'default' if none found.
 */
const parseServerName = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const match = fileContent.match(/server_name\s+([^;]+);/);
    return match ? match[1] : 'default';
};

/**
 * Checks if a given XBlock is enabled by looking for its symlink in XBlocksEnabled.
 * @param {string} xBlocksEnabledDir - The directory where enabled XBlocks symlinks are stored.
 * @param {string} xBlockName - The name of the XBlock file.
 * @returns {boolean} - True if the XBlock is enabled, false otherwise.
 */
const isXBlockEnabled = (xBlocksEnabledDir, xBlockName) => {
    const symlinkPath = path.join(xBlocksEnabledDir, xBlockName);
    return fs.existsSync(symlinkPath);
};

/**
 * Logs the XBlock information to the console in a table format.
 * @param {string} xBlocksAvailableDir - The directory where available XBlocks are stored.
 * @param {string} xBlocksEnabledDir - The directory where enabled XBlocks symlinks are stored.
 */
const showXBlocks = (xBlocksAvailableDir, xBlocksEnabledDir) => {
    const xBlocks = fs.readdirSync(xBlocksAvailableDir).filter(file => file.endsWith('.conf'));

    if (xBlocks.length === 0) {
        console.log(chalk.yellow('No XBlocks Found.'));
        return;
    }

    const xBlockTable = xBlocks.map(xBlockName => {
        const enabled = isXBlockEnabled(xBlocksEnabledDir, xBlockName);
        const serverName = parseServerName(path.join(xBlocksAvailableDir, xBlockName));
        return {
            XBlock: xBlockName,
            ServerName: serverName,
            Enabled: enabled ? 'On' : 'Off'
        };
    });

    console.log(chalk.blue('\nXBlocks Information:'));
    console.table(xBlockTable);
};

export { showXBlocks };
