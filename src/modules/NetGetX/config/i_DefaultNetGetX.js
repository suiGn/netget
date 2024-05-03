//i_DefaultNetGetX.js
import chalk from 'chalk';
import { getDir } from '../../../scripts/setupConfig.js';
import { initializeState } from '../xState.js';
import loadOrCreateUserConfig from './loadOrCreateUserConfig.js';
import setNginxPaths  from './setNginxPaths.js';
import nginxInstallationOptions  from './nginxInstallationOptions.cli.js'; 
import verifyNginxInstallation from './verifyNginxInstallation.js';
import verifyServerBlock  from './verifyServerBlock.js';  
import setNginxExecutable  from './setNginxExecutable.js';   
import getPublicIP  from '../../utils/getPublicIP.js';  
import getLocalIP  from '../../utils/getLocalIP.js';

export async function i_DefaultNetGetX() {
    getDir();
    let userConfig = await loadOrCreateUserConfig();
    const publicIP = await getPublicIP();
    const localIP = await getLocalIP();
    //console.log(publicIP ? `publicIp: ${publicIP}` : chalk.red('No public IP detected. Some features may be limited.'));
    //console.log(`Local IP: ${chalk.green(localIP)}`);

/* Verify NGINX Paths are set correctly.
    ╔═╗┌─┐┌┬┐┬ ┬┌─┐
    ╠═╝├─┤ │ ├─┤└─┐
    ╩  ┴ ┴ ┴ ┴ ┴└─┘*/
if (!userConfig.nginxPath || !userConfig.nginxSitesAvailable || !userConfig.nginxSitesEnabled) {
        console.log(chalk.yellow('One or more NGINX configuration paths are not set. Attempting to set them...'));
        if (await setNginxPaths(userConfig)) {
            userConfig = await loadOrCreateUserConfig();  // Reload to ensure all config updates are reflected
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
     if (await setNginxExecutable(userConfig)) {
        userConfig = await loadOrCreateUserConfig(); // Reload to ensure all config updates are reflected
     }else{
        console.log(chalk.red('Failed to set NGINX executable.'));
         return false;
        }
    } 

/* Verify All Good. 
    ╔╗╔╔═╗╦╔╗╔═╗ ╦  ╔═╗╦ ╦╔═╗╔═╗╦╔═╔═╗
    ║║║║ ╦║║║║╔╩╦╝  ║  ╠═╣║╣ ║  ╠╩╗╚═╗
    ╝╚╝╚═╝╩╝╚╝╩ ╚═  ╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝*/
let nginxVerified = await verifyNginxInstallation(userConfig);
if (!nginxVerified) {
    console.log(chalk.yellow('NGINX is not correctly installed or configured.'));
    console.log(chalk.yellow('Attempting automated configuration options...'));
    await nginxInstallationOptions();
    nginxVerified = await verifyNginxInstallation(userConfig); // Re-check after attempting to fix
    if (!nginxVerified) {
        console.log(chalk.red('NGINX installation or configuration still incorrect after attempted fixes.'));
        console.log(chalk.blue('Please check the manual configuration guidelines or contact support.'));
        return false;
    }
}

/* Verify NGINX server block is correctly configured for netgetX.
    ╔═╗╔═╗╦═╗╦  ╦╔═╗╦═╗  ╔╗ ╦  ╔═╗╔═╗╦╔═
    ╚═╗║╣ ╠╦╝╚╗╔╝║╣ ╠╦╝  ╠╩╗║  ║ ║║  ╠╩╗
    ╚═╝╚═╝╩╚═ ╚╝ ╚═╝╩╚═  ╚═╝╩═╝╚═╝╚═╝╩ ╩*/
const serverBlockVerified = await verifyServerBlock(userConfig);
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

