//nginxConfig.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { i_DefaultNetGetX } from './i_DefaultNetGetX.js';
import { NetGetMainMenu } from '../../netget_MainMenu.cli.js'; 
export async function nxConfigMenu() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Options:',
        choices: [
        'Install NetGetX Default Configuration (Recommended)',
        'Costum NetGetX Configuration',
        'About NetGetX',
          new inquirer.Separator(),
          'Return to Main Menu',
          'Exit'
        ],
      },
    ]);
    switch (answers.action) {
        case 'Install NetGetX Default Configuration (Recommended)':
          await i_DefaultNetGetX();
          break;
        case 'About NetGetX':
          console.log(chalk.blue('NetGetX manages network gateways efficiently...'));
          // Add more informational content or link to documentation
          break;
        case 'Return to Main Menu':
          await NetGetMainMenu();
          break;
        case 'Exit':
          console.log(chalk.green('Exiting NetGet CLI.'));
          process.exit();
          break;
        default:
          console.log(chalk.red('Invalid option, please try again.'));
          await nginxConfigMenu();
      }
  }

