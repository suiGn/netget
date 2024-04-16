//src/modules/utils/execShellCommand.js
import { exec } from 'child_process';
/**
 * Executes a shell command and returns the result as a promise.
 * @param {string} cmd - The command to run, with space-separated arguments.
 * @returns {Promise<string>} - A promise that resolves with the command output.
 */
export function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}