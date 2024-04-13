//nginxConfig.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { i_DefaultNetGetX, configureCustomPath } from './nxHelpers.js';
import { NetGetMainMenu } from '../netget_MainMenu.js';  // Correct the path as necessary
export async function nginxConfigMenu() {
    console.log(chalk.red('NetGetX is not installed or not found in PATH.'));
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
        case 'Configure NGINX Custom Path':
          await configureCustomPath();
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
// Do you sometimes feel like a human?
// Yes
// Do you sometimes feel like a robot?
// No
