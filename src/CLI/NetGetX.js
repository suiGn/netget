// NetGetX.js
import chalk from 'chalk';
import { exec } from 'child_process';

/**
 * Executes a shell command and returns it as a promise.
 * @param {string} cmd - The command to run, with space-separated arguments
 * @returns {Promise<string>} - A promise which resolves with the output of the command
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Handle interactions with NetGetX.
 */
import { nginxConfigMenu } from './x/nxConfig.js';

export async function handleNetGetX() {
  console.log(chalk.yellow('NetGetX:'));
  try {
    const result = await execShellCommand('nginx -v');
    console.log(chalk.green('NGINX is installed:'), result);
  } catch (error) {
    await nginxConfigMenu();
  }
}


