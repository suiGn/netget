//i_DefaultNetGetX.js
import chalk from 'chalk';
import path from 'path';
import { 
    loadOrCreateXConfig,
    saveXConfig } from './xConfig.js';
import { initializeState } from '../xState.js';
import {
    getNginxConfigAndDir,
    setNginxConfigAndDir,
    setNginxExecutable } from './NginxPaths.js';
import { 
    getLocalIP,
    getPublicIP } from '../../utils/ipUtils.js';
import { 
    ensureDirectoryExists,
    Path_Exists } from '../../utils/pathUtils.js';
import { initializeDirectories,
         getDirectoryPaths } from '../../utils/GETDirs.js';
         
import verifyNginxInstallation from '../NGINX/verifyNginxInstallation.js';
import nginxInstallationOptions from '../NGINX/nginxInstallationOptions.cli.js'; 
import verifyNginxConfig from './verifyNginxConfig.js';
import verifyServerBlock from './verifyServerBlock.js'; 

export async function i_DefaultNetGetX() {
initializeDirectories(); // Initialize all necessary directories
let DEFAULT_DIRECTORIES = getDirectoryPaths(); // Get paths to .get default directories

const nginxInstalled = await verifyNginxInstallation(); // Verify NGINX installation
if (!nginxInstalled) {
    console.log(chalk.yellow("NGINX is not installed. Redirecting to installation options..."));
    await nginxInstallationOptions();
    // Optionally re-check after installation attempt
    if (!await verifyNginxInstallation()) {
        console.log(chalk.red("NGINX still not detected after installation attempt. Please manually install NGINX and retry."));
        return false; // Exiting or return to a higher menu level could be handled here
    }
}

let xConfig = await loadOrCreateXConfig();

//console.log("Default Directories" , DEFAULT_DIRECTORIES);
/* Verify .get Paths
 ┏┓┏┓┏┳┓
 ┃┓┣  ┃ 
•┗┛┗┛ ┻   
 */
    if(!xConfig.getPath){
    const getDefaultPath = DEFAULT_DIRECTORIES.getPath;
    if (Path_Exists(getDefaultPath)) {
        await saveXConfig({ getPath: getDefaultPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        } else {
        console.log(`Default getPath does not exist: ${getDefaultPath}, not updating configuration.`);
    }
}

    if(!xConfig.static){
    const getDefaultStatic = DEFAULT_DIRECTORIES.static;
    if (Path_Exists(getDefaultStatic)) {
        await saveXConfig({ static: getDefaultStatic });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(`Default static does not exist: ${getDefaultStatic}, not updating configuration.`);
    }
}  

    if(!xConfig.staticDefault){
    const getDefaultStaticDefault = DEFAULT_DIRECTORIES.staticDefault;
    if (Path_Exists(getDefaultStaticDefault)) {
        await saveXConfig({ staticDefault: getDefaultStaticDefault });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(`Default staticDefault does not exist: ${getDefaultStaticDefault}, not updating configuration.`);
    }   
}


    if(!xConfig.SSLPath){
    const getDefaultSSLPath = DEFAULT_DIRECTORIES.SSLPath;
    if (Path_Exists(getDefaultSSLPath)) {
        await saveXConfig({ SSLPath: getDefaultSSLPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    }else{
        console.log(`Default SSLPath does not exist: ${getDefaultSSLPath}, not updating configuration.`);
    }
}


    if(!xConfig.SSLCertificatesPath){
    const getDefaultSSLCertificatesPath = DEFAULT_DIRECTORIES.SSLCertificatesPath;
    if (Path_Exists(getDefaultSSLCertificatesPath)) {
        await saveXConfig({ SSLCertificatesPath: getDefaultSSLCertificatesPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
    console.log(`Default SSLCertificatesPath does not exist: ${getDefaultSSLCertificatesPath}, not updating configuration.`);
}
}

    if(!xConfig.SSLCertificateKeyPath){
    const getDefaultSSLCertificateKeyPath = DEFAULT_DIRECTORIES.SSLCertificateKeyPath;
    if (Path_Exists(getDefaultSSLCertificateKeyPath)) {
        //console.log(`Default SSLCertificateKeyPath exists: ${getDefaultSSLCertificateKeyPath}`);
        await saveXConfig({ SSLCertificateKeyPath: getDefaultSSLCertificateKeyPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        //console.log(`SSLCertificateKeyPath updated in configuration.`);
    } else {
        console.log(`Default SSLCertificateKeyPath does not exist: ${getDefaultSSLCertificateKeyPath}, not updating configuration.`);
    }
}

    if(!xConfig.devPath){
    const getDefaultDevPath = DEFAULT_DIRECTORIES.devPath;
    if (Path_Exists(getDefaultDevPath)) {
        //console.log(`Default devPath exists: ${getDefaultDevPath}`);
        await saveXConfig({ devPath: getDefaultDevPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        //console.log(`devPath updated in configuration.`);
    } else {
        console.log(`Default devPath does not exist: ${getDefaultDevPath}, not updating configuration.`);
    }
}

    if(!xConfig.devStatic){
    const getDefaultDevStatic = DEFAULT_DIRECTORIES.devStatic;
    if (Path_Exists(getDefaultDevStatic)) {
        await saveXConfig({ devStatic: getDefaultDevStatic });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(`Default devStatic does not exist: ${getDefaultDevStatic}, not updating configuration.`);
    }
}

    if(!xConfig.devStaticDefault){
    const getDefaultDevStaticDefault = DEFAULT_DIRECTORIES.devStaticDefault;
    if (Path_Exists(getDefaultDevStaticDefault)) {
        //console.log(`Default devStaticDefault exists: ${getDefaultDevStaticDefault}`);
        await saveXConfig({ devStaticDefault: getDefaultDevStaticDefault });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        //console.log(`devStaticDefault updated in configuration.`);
    } else {
        console.log(`Default devStaticDefault does not exist: ${getDefaultDevStaticDefault}, not updating configuration.`);
    }
}
    
    if(!xConfig.devSSLPath){
    const getDefaultDevSSLPath = DEFAULT_DIRECTORIES.devSSLPath;
    if (Path_Exists(getDefaultDevSSLPath)) {
        //console.log(`Default devSSLPath exists: ${getDefaultDevSSLPath}`);
        await saveXConfig({ devSSLPath: getDefaultDevSSLPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        //console.log(`devSSLPath updated in configuration.`);
    } else {
        console.log(`Default devSSLPath does not exist: ${getDefaultDevSSLPath}, not updating configuration.`);
    }
}
    
    if(!xConfig.devSSLCertificatesPath){
    const getDefaultDevSSLCertificatesPath = DEFAULT_DIRECTORIES.devSSLCertificatesPath;
    if (Path_Exists(getDefaultDevSSLCertificatesPath)) {
        //console.log(`Default devSSLCertificatesPath exists: ${getDefaultDevSSLCertificatesPath}`);
        await saveXConfig({ devSSLCertificatesPath: getDefaultDevSSLCertificatesPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
        //console.log(`devSSLCertificatesPath updated in configuration.`);
    } else {
        console.log(`Default devSSLCertificatesPath does not exist: ${getDefaultDevSSLCertificatesPath}, not updating configuration.`);
    }
}

    if(!xConfig.devSSLCertificateKeyPath){
    const getDefaultDevSSLCertificateKeyPath = DEFAULT_DIRECTORIES.devSSLCertificateKeyPath;
    if (Path_Exists(getDefaultDevSSLCertificateKeyPath)) {
        await saveXConfig({ devSSLCertificateKeyPath: getDefaultDevSSLCertificateKeyPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(`Default devSSLCertificateKeyPath does not exist: ${getDefaultDevSSLCertificateKeyPath}, not updating configuration.`);
    }
}

/* Verify NGINX Paths are set correctly.
    ╔═╗┌─┐┌┬┐┬ ┬┌─┐
    ╠═╝├─┤ │ ├─┤└─┐
    ╩  ┴ ┴ ┴ ┴ ┴└─┘*/
 // Verify and set NGINX configuration path
 if (!xConfig.nginxPath || !xConfig.nginxDir) {
    const nginxPath = await getNginxConfigAndDir();
    if (nginxPath && nginxPath.configPath) {
        console.log(chalk.green(`Found NGINX configuration path: ${nginxPath.configPath}`));
        const setSuccess = await setNginxConfigAndDir(xConfig, nginxPath.configPath, nginxPath.basePath);
        if (setSuccess) {
            xConfig = await loadOrCreateXConfig();
        } else {
            console.error(chalk.red(`Failed to set NGINX configuration paths.`));
        }
    } else {
        console.log(chalk.yellow(`NGINX configuration path not found.`));
    }
}


/* Check and set NGINX executable
    ╔═╗═╗ ╦╔═╗╔═╗╦ ╦╔╦╗╔═╗╔╗ ╦  ╔═╗
    ║╣ ╔╩╦╝║╣ ║  ║ ║ ║ ╠═╣╠╩╗║  ║╣ 
    ╚═╝╩ ╚═╚═╝╚═╝╚═╝ ╩ ╩ ╩╚═╝╩═╝╚═╝*/
if (!xConfig.nginxExecutable) {
    if (await setNginxExecutable(xConfig)) {
    xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
     }else{
    console.log(chalk.red('Failed to set NGINX executable.'));
    console.log(chalk.red('Please Make Sure NGINX Is Installed.'));
  }  
} 

 // Ensure 'XBlocks-available' directory exists or create it
 const xBlocksAvailablePath = path.join(xConfig.nginxDir, 'XBlocks-available');
 ensureDirectoryExists(xBlocksAvailablePath, 'XBlocks-available');
    if (!xConfig.XBlocksAvailable) {
        if (Path_Exists(xBlocksAvailablePath)) {
            await saveXConfig({ XBlocksAvailable: xBlocksAvailablePath }); 
            xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected         
        } else {
            console.log(chalk.red("XBlocks available path not found."));
        }
    }

    // Ensure 'XBlocks-enabled' directory exists or create it
    const xBlocksEnabledPath = path.join(xConfig.nginxDir, 'XBlocks-enabled');
    ensureDirectoryExists(xBlocksEnabledPath);
    if (!xConfig.XBlocksEnabled) {
    if (Path_Exists(xBlocksEnabledPath)) {
        await saveXConfig({ XBlocksEnabled: xBlocksEnabledPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("XBlocks enabled path not found."));
    }
}
   

    //DEVELOPMENT SETTINGS
// Ensure 'dev_X' directory exists or create it
    const dev_X = path.join(xConfig.nginxDir, 'dev_X');
    ensureDirectoryExists(dev_X);
     if (!xConfig.nginxDevDir) {
    if(Path_Exists(dev_X)){
        await saveXConfig({ nginxDevDir: dev_X });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.yellow("NGINX DevDir Path Not Found..."));
        }
    }

    // Ensure DEV 'XBlocks-available' directory exists or create it
    const dev_xBlocksAvailablePath = path.join(xConfig.nginxDevDir, 'XBlocks-available');
    ensureDirectoryExists(dev_xBlocksAvailablePath);
    if (!xConfig.dev_XBlocksAvailable) {
    if (Path_Exists(dev_xBlocksAvailablePath)) {
        await saveXConfig({ dev_XBlocksAvailable: dev_xBlocksAvailablePath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("Dev XBlocks available path not found."));
    }
}

    // Ensure DEV 'XBlocks-enabled' directory exists or create it
    const dev_xBlocksEnabledPath = path.join(xConfig.nginxDevDir, 'XBlocks-enabled');
    ensureDirectoryExists(dev_xBlocksEnabledPath);
    if (!xConfig.dev_XBlocksEnabled) {
    if (Path_Exists(dev_xBlocksEnabledPath)) {
        await saveXConfig({ dev_XBlocksEnabled: dev_xBlocksEnabledPath });
        xConfig = await loadOrCreateXConfig(); // Reload to ensure all config updates are reflected
    } else {
        console.log(chalk.red("Dev XBlocks enabled path not found."));
    }
}

/* Verify All Good. 
    ╔╗╔╔═╗╦╔╗╔═╗ ╦  ╔═╗╦ ╦╔═╗╔═╗╦╔═╔═╗
    ║║║║ ╦║║║║╔╩╦╝  ║  ╠═╣║╣ ║  ╠╩╗╚═╗
    ╝╚╝╚═╝╩╝╚╝╩ ╚═  ╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝*/
    let nginxVerified = await verifyNginxConfig(xConfig);
    if (!nginxVerified) {
        console.log(chalk.yellow('Initial NGINX verification failed. Attempting to resolve...'));
        try {
            await nginxInstallationOptions();  // Attempt automated fixes
            nginxVerified = await verifyNginxConfig(xConfig);  // Re-check after attempting fixes
            if (!nginxVerified) {
                console.log(chalk.red('NGINX installation or configuration still incorrect after attempted fixes.'));
                console.log(chalk.blue('Please check the manual configuration guidelines or contact support.'));
                return false;
            } else {
                console.log(chalk.green('NGINX issues resolved successfully.'));
            }
        } catch (error) {
            console.log(chalk.red(`An error occurred while attempting to fix NGINX: ${error.message}`));
            console.log(chalk.blue('Please check the manual configuration guidelines or contact support.'));
            return false;
        }
    } 

/* Verify NGINX server block is correctly configured for netgetX.
    ╔═╗╔═╗╦═╗╦  ╦╔═╗╦═╗  ╔╗ ╦  ╔═╗╔═╗╦╔═
    ╚═╗║╣ ╠╦╝╚╗╔╝║╣ ╠╦╝  ╠╩╗║  ║ ║║  ╠╩╗
    ╚═╝╚═╝╩╚═ ╚╝ ╚═╝╩╚═  ╚═╝╩═╝╚═╝╚═╝╩ ╩*/
const serverBlockVerified = await verifyServerBlock(xConfig);
if (!serverBlockVerified) {
    console.log(chalk.yellow('Default Server block is not as NetGetX Default.'));
    return false;
    }

const publicIP = await getPublicIP();  // Properly await the asynchronous call
const localIP = getLocalIP();
let x = {
    ...xConfig, // spreads all properties of xConfig into x
    publicIP: publicIP,
    localIP: localIP
};
initializeState(x);
console.log(chalk.green('Setup Verification Successful.'));
return x;

};

