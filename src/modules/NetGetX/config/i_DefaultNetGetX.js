//i_DefaultNetGetX.js
import chalk from 'chalk';
import { getDir } from '../../../scripts/setupConfig.js';
import fs from 'fs';
import path from 'path';
import { initializeState } from '../xState.js';
import loadOrCreateUserConfig from './loadOrCreateUserConfig.js';
import { 
    findNginxConfigPath, 
    getXBlocksAvailable, 
    getXBlocksEnabled } from './detectNginxPaths.js';
import {
    createXBlocksActiveDir, 
    createXBlocksEnabledDir } from './getDirPaths.js';
import {
    setNginxConfigPath,
    setXBlocksAvailablePath,
    setXBlocksEnabledPath
} from './setNginxPaths.js';
import nginxInstallationOptions  from './nginxInstallationOptions.cli.js'; 
import verifyNginxInstallation from './verifyNginxInstallation.js';
import { 
    verifyAndGet, 
    verifyAndSetStaticPath, 
    verifyAndSetDevPath } from './verifyAndSetXPaths.js';
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
 // Verify and set NGINX configuration path
 if (!userConfig.nginxPath || !userConfig.nginxDir) {
    console.log(chalk.blue("Checking for NGINX configuration path..."));
    const nginxPath = await findNginxConfigPath();
    if (nginxPath) {
        console.log(chalk.green(`Found NGINX configuration path: ${nginxPath.configPath}`));
        await setNginxConfigPath(userConfig, nginxPath.configPath, nginxPath.basePath);
        userConfig = await loadOrCreateUserConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("NGINX configuration path not found."));
    }
}

 // Ensure 'XBlocks-available' directory exists or create it
 const xBlocksAvailablePath = path.join(userConfig.nginxDir, 'XBlocks-available');
 if (!fs.existsSync(xBlocksAvailablePath)) {
     console.log(chalk.blue("XBlocks-available directory not found, creating..."));
     createXBlocksActiveDir(userConfig.nginxDir);
 } 

// Verify and set XBlocks available path
if (!userConfig.XBlocksAvailable) {
    console.log(chalk.blue("Checking for XBlocks available path..."));
    const xBlocksAvailablePath = getXBlocksAvailable(userConfig.nginxDir);
    if (xBlocksAvailablePath) {
        console.log(chalk.green(`Found XBlocks available path: ${xBlocksAvailablePath}`));
        await setXBlocksAvailablePath(userConfig, xBlocksAvailablePath);
        userConfig = await loadOrCreateUserConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("XBlocks available path not found."));
    }
}

 // Ensure 'XBlocks-enabled' directory exists or create it
 const xBlocksEnabledPath = path.join(userConfig.nginxDir, 'XBlocks-enabled');
 if (!fs.existsSync(xBlocksEnabledPath)) {
     console.log(chalk.blue("XBlocks-enabled directory not found, creating..."));
     createXBlocksEnabledDir(userConfig.nginxDir);
 } 

// Verify and set XBlocks enabled path
if (!userConfig.XBlocksEnabled) {
    console.log(chalk.blue("Checking for XBlocks enabled path..."));
    const xBlocksEnabledPath = getXBlocksEnabled(userConfig.nginxDir);
    if (xBlocksEnabledPath) {
        console.log(chalk.green(`Found XBlocks enabled path: ${xBlocksEnabledPath}`));
        await setXBlocksEnabledPath(userConfig, xBlocksEnabledPath);
        userConfig = await loadOrCreateUserConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("XBlocks enabled path not found."));
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

/* Verify .get Paths
 ┏┓┏┓┏┳┓
 ┃┓┣  ┃ 
•┗┛┗┛ ┻   
 */
 // Verify and set .get directory path
 if (!userConfig.getPath) {
    await verifyAndGet(userConfig);
    userConfig = await loadOrCreateUserConfig(); }// Reload configuration to get updated paths
// Verify and set static directory path
if (!userConfig.staticPath) {
    await verifyAndSetStaticPath(userConfig);
    userConfig = await loadOrCreateUserConfig(); }// Reload configuration to get updated paths
// Verify and set development directory path
if (!userConfig.devPath) {
    await verifyAndSetDevPath(userConfig);
    userConfig = await loadOrCreateUserConfig(); // Reload configuration to get updated paths
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

