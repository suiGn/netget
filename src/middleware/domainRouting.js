import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname equivalent in ES Module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Asynchronously loads the domain configuration from a JSON file.
 * 
 * @returns {Promise<{name: string, domains: Object}>} A promise that resolves to an object containing the name of the domain list and the configurations themselves.
 */
async function loadDomainConfig() {
    const domainsConfigPath = path.join(__dirname, '..', 'config', 'domains.json');
    const config = JSON.parse(await fs.readFile(domainsConfigPath, 'utf-8')); // Corrected to define config
    return {
        name: config.name,
        domains: config.domains
    };
}

/**
 * Asynchronously loads handler functions based on the domain configuration.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object mapping domain names to their respective handler functions.
 */
async function loadHandlers() {
    const { domains } = await loadDomainConfig(); // Corrected to destructure domains from the result
    const handlers = {};
    for (const domain in domains) { // Iterate over domains, not domainsConfig
        const handlerName = domains[domain];
        // Dynamically import ES Module handlers
        handlers[domain] = (await import(`../handlers/${handlerName}.js`)).default;
    }
    return handlers;
}

/**
 * Asynchronous middleware for domain-based routing.
 * Dynamically routes requests to appropriate handlers based on the request's hostname.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export default async function domainRouting(req, res, next) {
    try {
        const handlers = await loadHandlers();
        const hostname = req.hostname;

        if (handlers[hostname]) {
            await handlers[hostname](req, res, next);
        } else {
            res.status(404).send('Domain not recognized');
        }
    } catch (error) {
        next(error); // Pass errors to Express error handling middleware
    }
}
