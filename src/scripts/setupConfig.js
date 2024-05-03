import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.get');

/**
 * Ensures that the directory for storing configuration exists and returns the directory path.
 * @returns {string} The path to the configuration directory.
 */
export const getDir = () => {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR);  // Simplicity as it's directly under home
        console.log(chalk.green(`Created configuration directory at ${CONFIG_DIR}`));
    }
    return CONFIG_DIR;
};
