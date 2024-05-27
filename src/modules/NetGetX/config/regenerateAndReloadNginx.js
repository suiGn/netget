import fs from 'fs';
import { exec } from 'child_process';
import xDefaultServerBlock from './xDefaultServerBlock.js';
import { loadOrCreateXConfig, saveXConfig } from './config.js';

/**
 * Regenerate NGINX configuration and reload NGINX service.
 * @category NetGetX
 * @subcategory Config
 * @module regenerateAndReloadNginx
 */
const regenerateAndReloadNginx = async () => {
    try {
        const xConfig = await loadOrCreateXConfig();

        // Regenerate NGINX configuration
        const serverBlock = xDefaultServerBlock(xConfig);
        const nginxConfigPath = '/etc/nginx/sites-available/default';  // Adjust path as necessary
        fs.writeFileSync(nginxConfigPath, serverBlock);

        // Reload NGINX to apply the new configuration
        exec('sudo nginx -s reload', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error reloading NGINX: ${error.message}`);
                return;
            }
            console.log('NGINX reloaded successfully:', stdout);
        });
    } catch (error) {
        console.error(`Failed to regenerate and reload NGINX: ${error.message}`);
    }
};

// Example usage
(async () => {
    // Example of updating the configuration
    await saveXConfig({
        xMainOutPutPort: 3000,
        enforceHttps: true
    });

    // Regenerate configuration and reload NGINX
    await regenerateAndReloadNginx();
})();
