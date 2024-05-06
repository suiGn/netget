// defaultServerBlock.js
const getDefaultServerBlock = (userConfig) => `
events {
    worker_connections 1024;  // High performance tweak
}

http {
    # Include statements for additional NetGetX server configurations
    include ${userConfig.XBlocksAvailable}/*.conf;
    include ${userConfig.XBlocksEnabled}/*;
    # Default server configuration
    server {
        listen 80 default_server;  // Listen on HTTP
        listen 443 ssl default_server;  // Listen on HTTPS
        # SSL settings for HTTPS
        ssl_certificate ${userConfig.sslCertificatePath};
        ssl_certificate_key ${userConfig.sslCertificateKeyPath};
        server_name _;  // Catch-all for server names not matched by other server blocks
        # Root directory and default response
        root ${userConfig.getDir}/static/default; // Set to user's .get directory
        location / {
            proxy_pass http://localhost:3432;  // Default reverse proxy to the main gateway
            include proxy_params;  // Includes proxy settings like headers and more
            try_files $uri $uri/ =404;  // Optional: Serve static files or show 404
        }
    }
}
`;

export default getDefaultServerBlock;
