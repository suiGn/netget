import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
const CONFIG_DIR = path.join(os.homedir(), '.get');
const DEV_CONFIG_DIR = path.join(CONFIG_DIR, 'dev');  // Define the development directory path
const STATIC_DIR = path.join(CONFIG_DIR, 'static');  // Define the development directory path
const DEFAULT = path.join(STATIC_DIR, 'default');  // Define the development directory path
/**
 * Ensures that the main and development configuration directories exist.
 * Returns the paths to both directories.
 * @returns {{configDir: string, devConfigDir: string}} Object containing paths to the main and development config directories.
 */
export const getDir = () => {
    // Ensure the main configuration directory exists
    if (!fs.existsSync(CONFIG_DIR)) {
        try {
            fs.mkdirSync(CONFIG_DIR);
            console.log(chalk.green(`Created main configuration directory at ${CONFIG_DIR}`));
        } catch (error) {
            console.error(chalk.red(`Failed to create main configuration directory: ${error.message}`));
            throw error;  // Rethrow to handle error outside if needed
        }
    }
    // Ensure the development configuration directory exists
    if (!fs.existsSync(DEV_CONFIG_DIR)) {
        try {
            fs.mkdirSync(DEV_CONFIG_DIR);
            console.log(chalk.green(`Created development configuration directory at ${DEV_CONFIG_DIR}`));
        } catch (error) {
            console.error(chalk.red(`Failed to create development configuration directory: ${error.message}`));
            throw error;  // Rethrow to handle error outside if needed
        }
    }
    if (!fs.existsSync(STATIC_DIR)) {
        try {
            fs.mkdirSync(DEV_CONFIG_DIR);
            console.log(chalk.green(`Created development configuration directory at ${DEV_CONFIG_DIR}`));
        } catch (error) {
            console.error(chalk.red(`Failed to create development configuration directory: ${error.message}`));
            throw error;  // Rethrow to handle error outside if needed
        }
    }
    if (!fs.existsSync(DEFAULT)) {
        try {
            fs.mkdirSync(DEV_CONFIG_DIR);
            console.log(chalk.green(`Created development configuration directory at ${DEV_CONFIG_DIR}`));
        } catch (error) {
            console.error(chalk.red(`Failed to create development configuration directory: ${error.message}`));
            throw error;  // Rethrow to handle error outside if needed
        }
    }
    return { configDir: CONFIG_DIR, devConfigDir: DEV_CONFIG_DIR };
};
