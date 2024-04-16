//configureDefaultServerBlock.js
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userConfigPath = path.join(__dirname, 'userConfig.json');

async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Failed to load user configuration: ${error.message}`));
        return {};
    }
}

const defaultConfigContent = `server {
    listen 80 default_server;
    server_name _;
    root /var/www/html;
    location / {
        return 200 'NGINX Default Response. Server is running.';
    }
}`;

export const configureDefaultServerBlock = async () => {
    const userConfig = await loadUserConfig();
    const nginxPath = userConfig.nginxPath || '/etc/nginx/sites-available/default'; // Fallback to default if not set

    try {
        fs.writeFileSync(nginxPath, defaultConfigContent);
        console.log(chalk.green('NGINX default server block has been configured to match NetGetX requirements.'));
    } catch (error) {
        console.error(chalk.red(`Failed to write NGINX default server block config at ${nginxPath}: ${error.message}`));
    }
};
