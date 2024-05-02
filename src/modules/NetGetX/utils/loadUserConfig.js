//netget/src/modules/NetGetX/utils/loadUserConfig.js

import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for the current file to correctly resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Assuming userConfig.json is in the parent directory under 'config'
const userConfigPath = path.join(__dirname, '../config/userConfig.json');

export async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return {};
    }
}
