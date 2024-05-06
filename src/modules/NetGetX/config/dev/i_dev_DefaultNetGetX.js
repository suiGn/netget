//i_DefaultNetGetX.js
import chalk from 'chalk';
import { getDir } from '../../../../scripts/setupConfig.js';
import { initializeState } from '../../xState.js';
import loadOrCreateUserConfig_dev from './loadOrCreateUserConfig_dev.js';
import setNginxPaths_dev  from './setNginxPaths_dev.js';
import nginxInstallationOptions  from '../nginxInstallationOptions.cli.js'; 
import verifyNginxInstallation_dev from './verifyNginxInstallation_dev.js';
import { verifyAndGet, verifyAndSetDevPath, verifyAndSetStaticPathDev } from '../verifyAndSetXPaths.js';
import verify_Default_XBlock_dev  from './verify_Default_XBlock_dev.js';  
import setNginxExecutable_dev  from './setNginxExecutable_dev.js';   
import getPublicIP  from '../../../utils/getPublicIP.js';  
import getLocalIP  from '../../../utils/getLocalIP.js';

export async function i_dev_DefaultNetGetX() {
    getDir();
    let userConfig = await loadOrCreateUserConfig_dev();
    const publicIP = await getPublicIP();
    const localIP = await getLocalIP();
    //console.log(publicIP ? `publicIp: ${publicIP}` : chalk.red('No public IP detected. Some features may be limited.'));
    //console.log(`Local IP: ${chalk.green(localIP)}`);

/* Verify NGINX Paths are set correctly.
    ╔═╗┌─┐┌┬┐┬ ┬┌─┐
    ╠═╝├─┤ │ ├─┤└─┐
    ╩  ┴ ┴ ┴ ┴ ┴└─┘*/
    if (!userConfig.nginxPath || !userConfig.XBlocksAvailable || !userConfig.XBlocksEnabled) {
        console.log(chalk.yellow('One or more Developmnet NGINX configuration paths are not set. Attempting to set them...'));
        if (await setNginxPaths_dev(userConfig)) {
            userConfig = await loadOrCreateUserConfig_dev();  // Reload to ensure all config updates are reflected
        }else{
            console.log(chalk.red('Failed to set NGINX configuration paths.'));
            return false;
        }
    } 
    
/* Check and set NGINX executable
    ╔═╗═╗ ╦╔═╗╔═╗╦ ╦╔╦╗╔═╗╔╗ ╦  ╔═╗
    ║╣ ╔╩╦╝║╣ ║  ║ ║ ║ ╠═╣╠╩╗║  ║╣ 
    ╚═╝╩ ╚═╚═╝╚═╝╚═╝ ╩ ╩ ╩╚═╝╩═╝╚═╝*/
if (!userConfig.nginxExecutable) {
     console.log(chalk.yellow("NGINX executable not set. Attempting to set it..."));
     if (await setNginxExecutable_dev(userConfig)) {
        userConfig = await loadOrCreateUserConfig_dev(); // Reload to ensure all config updates are reflected
     }else{
        console.log(chalk.red('Failed to set NGINX executable.'));
         return false;
        }
    } 

/* Verify All Good. 
    ╔╗╔╔═╗╦╔╗╔═╗ ╦  ╔═╗╦ ╦╔═╗╔═╗╦╔═╔═╗
    ║║║║ ╦║║║║╔╩╦╝  ║  ╠═╣║╣ ║  ╠╩╗╚═╗
    ╝╚╝╚═╝╩╝╚╝╩ ╚═  ╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝*/
let nginxVerified = await verifyNginxInstallation_dev(userConfig);
if (!nginxVerified) {
    console.log(chalk.yellow('NGINX is not correctly installed or configured.'));
    console.log(chalk.yellow('Attempting automated configuration options...'));
    await nginxInstallationOptions();
    nginxVerified = await verifyNginxInstallation_dev(userConfig); // Re-check after attempting to fix
    if (!nginxVerified) {
        console.log(chalk.red('NGINX installation or configuration still incorrect after attempted fixes.'));
        console.log(chalk.blue('Please check the manual configuration guidelines or contact support.'));
        return false;
    }
}else{
    console.log(chalk.green('Dev installation and configuration verified.'));
}

/* Verify .get Paths
 ┏┓┏┓┏┳┓
 ┃┓┣  ┃ 
•┗┛┗┛ ┻   
 */
 // Verify and set .get directory path
 if (!userConfig.getPath) {
    console.log("Setting .get directory path...");
    await verifyAndGet(userConfig);
    userConfig = await loadOrCreateUserConfig_dev();} // Reload to ensure all config updates are reflected
    // Verify and set development directory path
if (!userConfig.devPath) {
    console.log("Setting dev directory path...");
    await verifyAndSetDevPath(userConfig);
    userConfig = await loadOrCreateUserConfig_dev();} // Reload to ensure all config updates are reflected
// Verify and set static directory path
if (!userConfig.staticPath) {
    console.log("Setting static directory path...");
    await verifyAndSetStaticPathDev(userConfig);
    userConfig = await loadOrCreateUserConfig_dev();} // Reload configuration to get updated paths

/* Verify NGINX server block is correctly configured for netgetX.
    ╔═╗╔═╗╦═╗╦  ╦╔═╗╦═╗  ╔╗ ╦  ╔═╗╔═╗╦╔═
    ╚═╗║╣ ╠╦╝╚╗╔╝║╣ ╠╦╝  ╠╩╗║  ║ ║║  ╠╩╗
    ╚═╝╚═╝╩╚═ ╚╝ ╚═╝╩╚═  ╚═╝╩═╝╚═╝╚═╝╩ ╩*/
const serverBlockVerified = await verify_Default_XBlock_dev(userConfig);
if (!serverBlockVerified) {
    console.log(chalk.yellow('NGINX server block is not correctly configured.'));
    return false;
    }

let x = {
    ...userConfig, // spreads all properties of userConfig into x
    publicIP: publicIP,
    localIP: localIP
};
initializeState(x);
console.log(chalk.green('Setup Verification Successful.'));
return x;
};

