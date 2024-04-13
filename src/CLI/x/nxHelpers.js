import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { nginxConfigMenu } from './nxConfig.js'; // Assuming nginxConfig has the main menu

export async function i_DefaultNetGetX() {
    console.log(chalk.blue('Checking for existing NGINX installation...'));
    try {
        const nginxVersion = await execShellCommand('nginx -v');
        console.log(chalk.green('NGINX is already installed:'), nginxVersion);
        // Optionally, add check and configuration of server block
        checkAndConfigureServerBlock();
    } catch (error) {
        const installConfirmation = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmInstall',
                message: 'NGINX is not installed. Would you like to install it now?',
                default: true
            },
            {
                type: 'list',
                name: 'version',
                message: 'Choose which version of NGINX you want to install:',
                choices: ['Stable', 'Mainline', 'Custom version', 'Back to previous menu'],
                when: (answers) => answers.confirmInstall
            },
            {
                type: 'input',
                name: 'customVersion',
                message: 'Enter the custom version you wish to install:',
                when: (answers) => answers.version === 'Custom version'
            }
        ]);
        
        if (installConfirmation.confirmInstall) {
            switch (installConfirmation.version) {
                case 'Stable':
                case 'Mainline':
                case 'Custom version':
                    console.log(chalk.blue(`Installing ${installConfirmation.version} version of NGINX...`));
                    installNginx(installConfirmation.version, installConfirmation.customVersion);
                    break;
                case 'Back to previous menu':
                    await nginxConfigMenu(); // Call the main configuration menu again
                    break;
            }
        } else {
            console.log(chalk.yellow('Installation aborted by the user.'));
            await nginxConfigMenu(); // Optionally return to config menu
        }
    }
}

function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('NGINX command not found, installing:', cmd);
                reject(stderr || error.message);
            } else {
                resolve(stdout);
            }
        });
    });
}

import os from 'os';
function checkForChoco() {
  return new Promise((resolve, reject) => {
      exec('choco', (error, stdout, stderr) => {
          if (error) {
              if (stderr.includes('is not recognized as an internal or external command')) {
                  resolve(false); // Chocolatey is not installed.
              } else {
                  reject(new Error('Failed to verify Chocolatey installation: ' + stderr));
              }
          } else {
              resolve(true); // Chocolatey is installed.
          }
      });
  });
}
async function installNginx(version, customVersion) {
  if (os.platform() === 'win32') {
      try {
          const hasChoco = await checkForChoco();
          if (!hasChoco) {
              console.error(chalk.yellow('Chocolatey is not installed. Please install Chocolatey or install NGINX manually.'));
              return;
          }
      } catch (error) {
          console.error(chalk.red(error.message));
          return;
      }
  }

  let installCmd = determineInstallCommand(version, customVersion);
  exec(installCmd, (error, stdout, stderr) => {
      if (error) {
          console.error(`Failed to install NGINX: ${stderr || error.message}`);
          return;
      }
      console.log('NGINX has been successfully installed.');
      checkAndConfigureServerBlock(); // Assume this is another function for configuration
  });
}

function determineInstallCommand(version, customVersion) {
  switch (os.platform()) {
      case 'darwin':
          return 'brew install nginx';
      case 'linux':
          return 'sudo apt-get install nginx -y'; // You may need to adapt this for different Linux distributions
      case 'win32':
          return 'choco install nginx';
      default:
          return '';
  }
}

function checkAndConfigureServerBlock() {
    // Placeholder for checking and configuring NGINX server block
    console.log(chalk.blue('Checking and configuring NGINX server block...'));
}

export function configureCustomPath() {
  console.log(chalk.blue('Configuring custom path for NGINX...'));
  // Implementation for configuring custom path
}