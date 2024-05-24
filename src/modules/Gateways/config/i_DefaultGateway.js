// netget/src/modules/Gateways/config/i_DefaultGateway.js
import { initializeDirectories, getDirectoryPaths } from '../../utils/GETDirs.js';
import { initializeState } from '../gState.js';
import {  loadOrCreateGConfig, saveGConfig } from './gConfig.js';
import chalk from 'chalk';

async function i_DefaultGateway() {
    console.log(chalk.blue('Initializing Gateway directories...'));
    initializeDirectories();  // Ensure all necessary directories exist
    let DEFAULT_DIRECTORIES = getDirectoryPaths(); // Get paths to .get default directories
    let gConfig = await loadOrCreateGConfig();
    let g = {
        ...gConfig // spreads all properties of gConfig into g
    };
    initializeState(g);
    return g
}

export { i_DefaultGateway };
