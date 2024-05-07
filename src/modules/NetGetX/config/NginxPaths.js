// netget/src/modules/NetGetX/config/setNginxPath.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { saveXConfig } from './xConfig.js';

/**
 * Finds the NGINX configuration file and its base directory on the system.
 * @returns {object} An object containing paths to the NGINX configuration file and its base directory or null values if not found.
 */
async function getNginxConfigAndDir() {
    const configPaths = [
        '/etc/nginx/nginx.conf',
        '/usr/local/etc/nginx/nginx.conf',
        '/opt/homebrew/etc/nginx/nginx.conf',
        'C:\\nginx\\nginx.conf'
    ];
    // Check if any standard path exists and return the path and its base directory
    const foundPath = configPaths.find(fs.existsSync);
    if (foundPath) {
        return {
            configPath: foundPath,
            basePath: path.dirname(foundPath)
        };
    }
    // Try to find nginx path in the system PATH and extract the configuration file using 'nginx -t'
    try {
        const systemPath = execSync('which nginx').toString().trim();
        const configTestCmd = `${systemPath} -t`;
        const output = execSync(configTestCmd).toString();
        const match = output.match(/nginx: configuration file (\S*) syntax is ok/);
        if (match && match[1]) {
            return {
                configPath: match[1],
                basePath: path.dirname(match[1])
            };
        }
    } catch (error) {
        console.error(`Failed to locate NGINX via system PATH: ${error.message}`);
    }
    // Return null if no configuration path or base directory could be found
    return { configPath: null, basePath: null };
}


/**
 * Sets the NGINX configuration path in the user configuration.
 * @param {object} xConfig The user configuration object.
 * @param {string} nginxConfigPath The NGINX configuration path to be set.
 * @param {string} nginxBasePath The NGINX base path to be set.
 * @returns {Promise<boolean>} True if the path was set and saved successfully.
 */
async function setNginxConfigAndDir(nginxConfigPath, nginxBasePath) {
    try {
        await saveXConfig({ nginxPath: nginxConfigPath, nginxDir: nginxBasePath});
        return true;
    } catch (error) {
        console.error(`Failed to set NGINX configuration path: ${error.message}`);
        return false;
    }
}


async function setNginxExecutable(xConfig) {
    if (!xConfig.nginxPath) {
        console.log("NGINX configuration path is not set. Please configure it first.");
        return false;  // Ensure NGINX path is set before attempting to set the executable
    }
    console.log("Checking for NGINX executable based on provided configuration path...");
    try {
        // Building a probable executable path based on common NGINX installation practices
        let probableExecutablePath = path.join(path.dirname(xConfig.nginxPath), '../../sbin/nginx');
        if (fs.existsSync(probableExecutablePath)) {
            xConfig.nginxExecutable = probableExecutablePath;
        } else {
            // Fallback to system-wide detection if the derived path doesn't exist
            probableExecutablePath = execSync('which nginx').toString().trim();
            if (probableExecutablePath && fs.existsSync(probableExecutablePath)) {
                xConfig.nginxExecutable = probableExecutablePath;
            } else {
                console.log('Failed to detect NGINX executable. Please ensure NGINX is installed.');
                return false;
            }
        }
        await saveXConfig({
            nginxExecutable: xConfig.nginxExecutable
        });
    //console.log(`NGINX executable path set to: ${xConfig.nginxExecutable}`);
     return true;     
    } catch (error) {
        console.error(`Error detecting NGINX executable: ${error.message}`);
        return false;
    }
}
export {
     getNginxConfigAndDir,
     setNginxConfigAndDir, 
     setNginxExecutable    
        };

/*
Functionality: The functions address different aspects related to NGINX configuration management:
setNginxConfigAndDir: updates the configuration paths in the user's configuration,
    which is straightforward and effective.
getNginxConfigAndDir: attempts to locate the NGINX configuration file either from predefined paths
     or by extracting it from system commands, providing robustness in finding the configuration.
setNginxExecutable: attempts to set the NGINX executable path based on the NGINX path 
    from the configuration or system PATH, ensuring that the executable can be accurately referenced.*/