import inquirer from 'inquirer';
import { addXBlock } from './addXBlock.js';  // Make sure this is correctly imported from your file structure

const handleAddNewXBlock = async () => {
  // Ask user for input
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'serverName',
      message: 'Enter the Block Name (Server Name):',
      validate: input => input ? true : 'Server name cannot be empty.'
    },
    {
      type: 'input',
      name: 'proxyPort',
      message: 'Enter the port to forward to (Default is 3432):',
      default: 3432,
      validate: input => (/^\d+$/.test(input) && Number(input) > 0) ? true : 'Please enter a valid port number.'
    }
  ]);

  // Call the function to add the NGINX block
  try {
    await addXBlock(answers.serverName, answers.proxyPort);
  } catch (error) {
    console.error('Failed to add XBlock:', error);
  }
};

export { handleAddNewXBlock };