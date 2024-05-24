//addXBlock.js
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userConfigPath = path.join(__dirname, 'userConfig.json');

// Function to execute shell commands using Promises
const execShellCommand = (cmd) => {
return new Promise((resolve, reject) => {
exec(cmd, (error, stdout, stderr) => {
if (error) {
reject(stderr || error.message);
} else {
resolve(stdout);
}});
});
};

// Load user configuration
async function loadUserConfig() {
    try {
        const data = await fs.promises.readFile(userConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to load user configuration: ${error.message}`);
        return {};
    }
}

// Function to add a new NGINX server block
const addXBlock = async (serverName, proxyPort = 3432) => {
  const userConfig = await loadUserConfig();
  const sitesAvailablePath = userConfig.nginxSitesAvailable || '/etc/nginx/sites-available';
  const sitesEnabledPath = userConfig.nginxSitesEnabled || '/etc/nginx/sites-enabled';

  const serverBlock = `
server {
    listen 80;
    listen [::]:80;
    server_name ${serverName};

    location / {
        proxy_pass http://localhost:${proxyPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

  try {
    const configFilePath = path.join(sitesAvailablePath, `${serverName}.conf`);
    fs.writeFileSync(configFilePath, serverBlock);
    console.log('NGINX configuration block written successfully.');

    const enabledPath = path.join(sitesEnabledPath, `${serverName}.conf`);
    if (!fs.existsSync(enabledPath)) {
      fs.symlinkSync(configFilePath, enabledPath);
      console.log('Symlink created in sites-enabled.');
    }

    const testOutput = await execShellCommand('nginx -t');
    console.log(testOutput);
    await execShellCommand('nginx -s reload');
    console.log('NGINX reloaded successfully.');
  } catch (error) {
    console.error(`Failed to add NGINX block: ${error}`);
  }
};

export { addXBlock };
