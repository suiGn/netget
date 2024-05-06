// defaultServerBlock_dev.js
const getDefaultServerBlock_dev = (userConfig) => `
events {
    worker_connections 1024;  // High performance tweak suitable for both environments
}

http {
    # Include statements for additional NetGetX server configurations specific to development
    include ${userConfig.XBlocksAvailable}/*.conf;
    include ${userConfig.XBlocksEnabled}/*;

    # Default server configuration optimized for development
    server {
        listen 8080 default_server;  // Use a different port in development to avoid conflicts
        listen 8443 ssl default_server;  // Use a different SSL port in development

        # SSL settings for HTTPS - using development specific paths
        ssl_certificate ${userConfig.sslCertificatePath};
        ssl_certificate_key ${userConfig.sslCertificateKeyPath};

        server_name localhost;  // Set to localhost for development purposes

        # Root directory and default response setup for development
        root /var/www/html_dev;  // Use a different root directory for development
        location / {
            proxy_pass http://localhost:3000;  // Assuming the development gateway runs on the same local port
            include proxy_params;  // Includes proxy settings like headers and more
            try_files $uri $uri/ =404;  // Optionally serve static files or show 404
        }
    }
}
`;

export default getDefaultServerBlock_dev;
