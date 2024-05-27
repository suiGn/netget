/** xDefaultServerBlock.js
 * @name xDefaultServerBlock.js
 * @type {Function}
 * @description Default server block for NGINX configuration.
 * @param {object} xConfig The user configuration object.
 * @returns {string} The default server block configuration.
 * @example
 * xDefaultServerBlock(xConfig);
 * @category NetGetX
 * @subcategory Config
 * @module xDefaultServerBlock
 */
const xDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const { XBlocksAvailable, XBlocksEnabled, getPath, xMainOutPutPort, enforceHttps, SSLCertificatesPath, SSLCertificateKeyPath } = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath || !xMainOutPutPort) {
        throw new Error("Invalid user configuration. Missing required paths or port.");
    }

    const httpBlock = `
    server {
        listen 80 default_server;
        server_name _;

        ${enforceHttps ? `
        location / {
            return 301 https://$host$request_uri;
        }` : `
        root ${getPath}/static/default;

        location ~* \.(env|env\\.local|env\\.prod|env\\.production|env\\.save)$ {
            deny all;
            return 404;
        }

        location ~ /\\.ht {
            deny all;
        }

        location ~ /\\.git {
            deny all;
        }

        location / {
            proxy_pass http://localhost:${xMainOutPutPort};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_intercept_errors on;
            error_page 404 = @fallback;
        }

        location @fallback {
            try_files $uri $uri/ =404;
        }`}
    }`;

    const httpsBlock = `
    server {
        listen 443 ssl default_server;
        server_name _;

        ssl_certificate ${SSLCertificatesPath};  # Change to your certificate path
        ssl_certificate_key ${SSLCertificateKeyPath};  # Change to your certificate path
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        root ${getPath}/static/default;

        location ~* \.(env|env\\.local|env\\.prod|env\\.production|env\\.save)$ {
            deny all;
            return 404;
        }

        location ~ /\\.ht {
            deny all;
        }

        location ~ /\\.git {
            deny all;
        }

        location / {
            proxy_pass http://localhost:${xMainOutPutPort};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_intercept_errors on;
            error_page 404 = @fallback;
        }

        location @fallback {
            try_files $uri $uri/ =404;
        }
    }`;

    return `
    events {
        worker_connections 1024;  # High performance tweak
    }
    
    http {
        # Include statements for additional NetGetX server configurations
        include ${XBlocksAvailable}/*.conf;
        include ${XBlocksEnabled}/*;
        
        # Default server configuration
        ${httpBlock}
        ${enforceHttps ? httpsBlock : ''}
    }`;
};

export default xDefaultServerBlock;
