//netget/src/modules/NetGetX/XBlocks/getAvailableDomains.js
import fs from 'fs';
import path from 'path';

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

export { getAvailableDomains, getUsedDomains };
