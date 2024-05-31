/** xDefaultServerBlock.js
 * @name xDefaultServerBlock.js
 * @type {Function}
 * @description Default server block for NGINX configuration.
 * @param {object} xConfig The user configuration object.
 * @returns {string} The default server block configuration.
 * @example
 * xDefaultServerBlock(xConfig); */
const xDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const { XBlocksAvailable, XBlocksEnabled, getPath, xMainOutPutPort } = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath || !xMainOutPutPort) {
        throw new Error("Invalid user configuration. Missing required paths.");
    }

    return `
    events {
        worker_connections 1024;  # High performance tweak
    }
    
    http {
        # Include statements for additional NetGetX server configurations
        include ${XBlocksAvailable}/*.conf;
        include ${XBlocksEnabled}/*;
        
        # Default server configuration
        server {
            listen 80 default_server;  # Listen only on HTTP
            server_name _;  # Catch-all for server names not matched by other server blocks
            root ${getPath}/static/default;  # Set to user's .get directory
    
            # First try to handle the request through the proxy
            location / {
                proxy_pass http://localhost:${xMainOutPutPort};
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
    
                proxy_intercept_errors on;  # To handle HTTP errors from the proxy
                error_page 404 = @fallback;  # Redirect 404 errors to the @fallback location
            }
    
            # Serve static files if not found by proxy
            location @fallback {
                try_files $uri $uri/ =404;
            }
        }
        
        server {
            listen 443 ssl default_server;  # Listen on HTTPS with SSL
            server_name _;  # Catch-all for server names not matched by other server blocks

            # Self-signed certificate (temporary measure)
            ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
            ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_prefer_server_ciphers on;

            location / {
                root ${getPath}/static/default;
                index index.html;
            }
        }
    }    
`;
};

export default xDefaultServerBlock;
