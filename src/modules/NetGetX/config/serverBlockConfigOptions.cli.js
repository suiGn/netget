import inquirer from 'inquirer';
import chalk from 'chalk';
import { configureDefaultServerBlock } from './configureDefaultServerBlock.js';

export const serverBlockConfigOptions = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'How would you like to proceed with the server block configuration?',
            choices: [
                'Restore NGINX Default to Recommended Settings',
                'Proceed with Current Configuration',
                'Exit and Adjust Manually'
            ]
        }
    ]);

    switch (answers.action) {
        case 'Restore NGINX Default to Recommended Settings':
            await configureDefaultServerBlock();
            break;
        case 'Proceed with Current Configuration':
            console.log(chalk.yellow('Proceeding with existing NGINX configuration.'));
            break;
        case 'Exit and Adjust Manually':
            console.log(chalk.green('Please adjust your NGINX configuration manually as needed.'));
            process.exit(0);
            break;
    }
};
