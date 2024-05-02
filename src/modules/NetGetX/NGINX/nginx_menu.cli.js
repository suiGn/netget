// nginx_menu.cli.js
//NGINX Management Menu 
import inquirer from 'inquirer';
import { exec } from 'child_process';
import chalk from 'chalk';
import { checkNginxStatus } from './checkNginxStatus.js';
import { NetGetX } from '../NetGetX.cli.js';

export async function nginxMenu() {
    console.log(chalk.green('NGINX Management Menu'));
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'nginxAction',
        message: 'Select NGINX operation:',
        choices: [
            'Check NGINX Status',
            'Start NGINX',
            'Stop NGINX',
            'Restart NGINX',
            'Reload NGINX',
            'View NGINX Logs',
            'Back to NetGetX Menu'
        ]
    });

    switch (answers.nginxAction) {
        case 'Check NGINX Status':
            await checkNginxStatus();
            break;
        case 'Start NGINX':
        case 'Stop NGINX':
        case 'Restart NGINX':
        case 'Reload NGINX':
        case 'View NGINX Logs':
            await execCommand(resolveCommand(answers.nginxAction));
            break;
        case 'Back to NetGetX Menu':
            await NetGetX();
            return; // Exit to prevent loop
    }

    // Recursive call to show the menu again unless going back to main menu
    await nginxMenu();
}

function resolveCommand(action) {
    switch (action) {
        case 'Start NGINX':
            return 'systemctl start nginx';
        case 'Stop NGINX':
            return 'systemctl stop nginx';
        case 'Restart NGINX':
            return 'systemctl restart nginx';
        case 'Reload NGINX':
            return 'nginx -s reload';
        case 'View NGINX Logs':
            return 'tail -f /var/log/nginx/error.log';
        default:
            throw new Error('Unsupported action');
    }
}

async function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Error: ${error.message}`));
                reject(error);
                return;
            }
            if (stderr) {
                console.error(chalk.red(`STDERR: ${stderr}`));
                reject(new Error(stderr));
                return;
            }
            console.log(chalk.green(`STDOUT: ${stdout}`));
            resolve(stdout);
        });
    });
}