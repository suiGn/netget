import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { handlePermission } from '../../utils/handlePermissions.js';

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
 * Parses the server_name directive from an NGINX configuration file.
 * @param {string} filePath - Path to the NGINX configuration file.
 * @returns {Array<string>} - The server_name values or an empty array if none found.
 */
const parseServerNames = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matches = fileContent.match(/server_name\s+([^;]+);/g);
    if (!matches) return [];
    return matches.map(match => match.replace(/server_name\s+([^;]+);/, '$1').trim().split(/\s+/)).flat();
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
 * Enables a specified XBlock by creating a symbolic link in the XBlocks-enabled directory.
 * @param {string} domain - The domain for which to enable the XBlock.
 * @param {Object} xConfig - The user configuration object.
 */
const enableXBlock = async (domain, xConfig) => {
    const { XBlocksAvailable, XBlocksEnabled } = xConfig;
    const availablePath = path.join(XBlocksAvailable, `${domain}.conf`);
    const enabledPath = path.join(XBlocksEnabled, `${domain}.conf`);
    try {
        if (fs.existsSync(enabledPath)) {
            console.log(chalk.yellow(`XBlock for ${domain} is already enabled.`));
            return;
        }
        fs.symlinkSync(availablePath, enabledPath);
        console.log(chalk.green(`XBlock for ${domain} enabled successfully.`));
    } catch (error) {
        if (error.code === 'EACCES') {
            await handlePermission(
                `enable XBlock for ${domain}`,
                `ln -s ${availablePath} ${enabledPath}`,
                `Please create a symbolic link manually:\nsudo ln -s ${availablePath} ${enabledPath}`
            );
        } else {
            console.error(chalk.red(`Failed to enable XBlock for ${domain}: ${error.message}`));
        }
    }
};

/**
 * Disables a specified XBlock by removing its symbolic link from the XBlocks-enabled directory.
 * @param {string} domain - The domain for which to disable the XBlock.
 * @param {Object} xConfig - The user configuration object.
 */
const disableXBlock = async (domain, xConfig) => {
    const { XBlocksEnabled } = xConfig;
    const enabledPath = path.join(XBlocksEnabled, `${domain}.conf`);
    try {
        if (!fs.existsSync(enabledPath)) {
            console.log(chalk.yellow(`XBlock for ${domain} is not enabled.`));
            return;
        }
        fs.unlinkSync(enabledPath);
        console.log(chalk.green(`XBlock for ${domain} disabled successfully.`));
    } catch (error) {
        if (error.code === 'EACCES') {
            await handlePermission(
                `disable XBlock for ${domain}`,
                `rm ${enabledPath}`,
                `Please remove the symbolic link manually:\nsudo rm ${enabledPath}`
            );
        } else {
            console.error(chalk.red(`Failed to disable XBlock for ${domain}: ${error.message}`));
        }
    }
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

/**
 * Returns a list of available XBlocks.
 * @param {string} xBlocksAvailableDir - The directory where available XBlocks are stored.
 * @returns {Array<string>} - A list of available XBlock names.
 */
const getXBlocksList = (xBlocksAvailableDir) => {
    return fs.readdirSync(xBlocksAvailableDir).filter(file => file.endsWith('.conf')).map(file => file.replace('.conf', ''));
};

/**
 * Returns a list of enabled XBlocks.
 * @param {string} xBlocksEnabledDir - The directory where enabled XBlocks symlinks are stored.
 * @returns {Array<string>} - A list of enabled XBlock names.
 */
const getXBlocksEnabled = (xBlocksEnabledDir) => {
    return fs.readdirSync(xBlocksEnabledDir).filter(file => {
        const filePath = path.join(xBlocksEnabledDir, file);
        return fs.lstatSync(filePath).isSymbolicLink();
    }).map(file => file.replace('.conf', ''));
};

/**
 * Gets the used domains from NGINX configuration files.
 * @param {string} configDir - The directory containing NGINX configuration files.
 * @returns {Set<string>} - A set of used domains.
 */
const getUsedDomains = (configDir) => {
    const usedDomains = new Set();
    const files = fs.readdirSync(configDir).filter(file => file.endsWith('.conf'));
    for (const file of files) {
        const filePath = path.join(configDir, file);
        const serverNames = parseServerNames(filePath);
        serverNames.forEach(domain => usedDomains.add(domain));
    }
    return usedDomains;
};

/**
 * Gets the available domains by filtering out domains that are already used.
 * @param {Array<Object>} allDomains - The list of all possible domains.
 * @param {Set<string>} usedDomains - The set of used domains.
 * @returns {Array<Object>} - An array of available domain objects.
 */
const filterAvailableDomains = (allDomains, usedDomains) => {
    return allDomains.filter(domain => !usedDomains.has(domain.domain));
};

/**
 * Main function to get available domains.
 * @param {Array<Object>} allDomains - The list of all possible domains from x.domains.
 * @param {string} configDir - The directory containing NGINX configuration files.
 * @returns {Array<Object>} - An array of available domain objects.
 */
const getAvailableDomains = (allDomains, configDir) => {
    const usedDomains = getUsedDomains(configDir);
    return filterAvailableDomains(allDomains, usedDomains);
};

/**
 * Deletes a specified XBlock from the available and enabled directories.
 * @param {string} domain - The domain for which to delete the XBlock.
 * @param {Object} xConfig - The user configuration object.
 */
const deleteXBlock = async (domain, xConfig) => {
    const { XBlocksAvailable, XBlocksEnabled } = xConfig;
    const availablePath = path.join(XBlocksAvailable, `${domain}.conf`);
    const enabledPath = path.join(XBlocksEnabled, `${domain}.conf`);
    
    try {
        if (!fs.existsSync(availablePath)) {
            console.log(chalk.yellow(`XBlock for ${domain} does not exist in the available directory.`));
            return;
        }
        
        if (fs.existsSync(enabledPath)) {
            try {
                fs.unlinkSync(enabledPath);
                console.log(chalk.green(`XBlock for ${domain} disabled and removed from the enabled directory.`));
            } catch (error) {
                if (error.code === 'EACCES') {
                    await handlePermission(
                        `disable XBlock for ${domain}`,
                        `rm ${enabledPath}`,
                        `Please remove the symbolic link manually:\nsudo rm ${enabledPath}`
                    );
                } else {
                    console.error(chalk.red(`Failed to disable XBlock for ${domain}: ${error.message}`));
                }
            }
        }

        fs.unlinkSync(availablePath);
        console.log(chalk.green(`XBlock for ${domain} deleted successfully from the available directory.`));
    } catch (error) {
        if (error.code === 'EACCES') {
            await handlePermission(
                `delete XBlock for ${domain}`,
                `rm ${availablePath} ${enabledPath}`,
                `Please delete the XBlock manually:\nsudo rm ${availablePath} ${enabledPath}`
            );
        } else {
            console.error(chalk.red(`Failed to delete XBlock for ${domain}: ${error.message}`));
        }
    }
};

export { 
    showXBlocks, 
    enableXBlock, 
    disableXBlock, 
    deleteXBlock,
    isXBlockEnabled, 
    getXBlocksList, 
    getAvailableDomains, 
    getUsedDomains,
    getXBlocksEnabled 
};