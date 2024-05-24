// netGetXOptions.js
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import NetGetX_CLI from '../NetGetX.cli.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blocksPath = path.join(__dirname, 'XBlocks.json');

async function loadNGXBlocks() {
    try {
        const data = await fs.promises.readFile(blocksPath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load NGXBlocks: ${error.message}`));
        return []; // Return an empty array in case of error
    }
}

export async function showXBlocks() {
    console.log(chalk.blue('Loading NGXBlocks...'));
    const blocks = await loadNGXBlocks();
    
    if (blocks.length === 0) {
        console.log(chalk.yellow('No NGXBlocks Found.'));
        await NetGetX_CLI();  // Return to main menu after showing this message
    } else {
        console.log(chalk.green('List of NGXBlocks:'));
        blocks.forEach((block, index) => {
            console.log(`${index + 1}. ${block.name} - ${block.description}`);
        });
        await NetGetX_CLI();  // Also return to the main menu after listing blocks

    }
}
