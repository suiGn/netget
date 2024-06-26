import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import { handlePermission } from './handlePermissions.js';

// Determine the path to the hosts file based on the platform
const hostsFilePath = os.platform() === 'win32'
  ? path.join(process.env.SystemRoot, 'System32', 'drivers', 'etc', 'hosts')
  : '/etc/hosts';

/**
 * Checks if a given entry exists in the local hosts file.
 * @param {string} entry - The entry to check for in the local hosts file.
 * @returns {boolean} - True if the entry exists, false otherwise.
 */
const checkLocalHostEntryExists = (entry) => {
  try {
    const data = fs.readFileSync(hostsFilePath, 'utf8');
    return data.includes(entry.trim());
  } catch (err) {
    console.error(chalk.red(`Error reading local hosts file: ${err.message}`));
    throw err;
  }
};

/**
 * Adds a given entry to the local hosts file.
 * @param {string} entry - The entry to add to the local hosts file.
 */
const addLocalHostEntry = async (entry) => {
  if (checkLocalHostEntryExists(entry)) {
    console.log(chalk.blue('Entry already exists in the local hosts file.'));
    return;
  }

  try {
    fs.appendFileSync(hostsFilePath, `${entry}\n`);
    console.log(chalk.green('Entry added to local hosts file successfully.'));
  } catch (err) {
    console.error(chalk.red(`Error writing to local hosts file: ${err.message}`));
    // Handle permission issue
    console.log(chalk.blue('Handling permission error...'));
    await handlePermission(
    'writing to the local hosts file',
    `echo "${entry}" | sudo tee -a ${hostsFilePath}`, // Direct command to append entry to hosts file
    `Please add the following entry to your local hosts file manually:\n${entry}`
    );
// Exit the process after handling permission
return true;
  }
};

export { checkLocalHostEntryExists, addLocalHostEntry };
