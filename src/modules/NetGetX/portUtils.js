// portUtils.js
import inquirer from 'inquirer';
import { saveXConfig, loadOrCreateXConfig } from './config/xConfig.js';

/**
 * Ensures that the output port is set in the configuration.
 * @returns {Promise<number>} The output port number.
 * @category NetGetX
 * @subcategory General
 */
export async function ensureOutputPort() {
    let xConfig = await loadOrCreateXConfig();

    if (!xConfig.xMainOutPutPort || xConfig.xMainOutPutPort === 0) {
        const { outputPort } = await inquirer.prompt({
            type: 'input',
            name: 'outputPort',
            message: 'Enter the output port number for the backend server:',
            default: 3432,
            validate: function (value) {
                const valid = !isNaN(parseInt(value));
                return valid || 'Please enter a valid number';
            }
        });

        await saveXConfig({ xMainOutPutPort: parseInt(outputPort, 10) });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    }
    
    return xConfig.xMainOutPutPort;
}

/**
 * Ensures that all required fields in the configuration are set.
 * @returns {Promise<Object>} The updated user configuration object.
 */
export async function ensureRequiredConfig() {
    let xConfig = await loadOrCreateXConfig();
    // Add checks and prompts for other required fields here, if necessary

    // Example for getPath
    if (!xConfig.getPath) {
        const getDefaultPath = DEFAULT_DIRECTORIES.getPath;
        if (Path_Exists(getDefaultPath)) {
            await saveXConfig({ getPath: getDefaultPath });
            xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        } else {
            console.log(`Default getPath does not exist: ${getDefaultPath}, not updating configuration.`);
        }
    }

    return xConfig;
}
