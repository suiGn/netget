// domainConfigUtils.js
// src/config/domainConfigUtils.js
import fs from 'fs/promises';
import path from 'path';

export async function loadDomainConfig(domainsConfigPath) {
    try {
        // If domainsConfigPath is already correct, just use it directly
        const config = JSON.parse(await fs.readFile(domainsConfigPath, 'utf-8'));
        return config;
    } catch (err) {
        console.error('Error loading domain configuration:', err);
        throw err;
    }
}
