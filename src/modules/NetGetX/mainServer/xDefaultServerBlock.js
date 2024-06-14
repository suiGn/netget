const xDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const { XBlocksAvailable, XBlocksEnabled, getPath, xMainOutPutPort, mainServerName, enforceHttps } = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath || !xMainOutPutPort) {
        throw new Error("Invalid user configuration. Missing required paths.");
    }

    // SSL certificate paths
    const sslCertificate = enforceHttps ? `/etc/letsencrypt/live/${mainServerName}/fullchain.pem` : '/etc/ssl/certs/nginx-selfsigned.crt';
    const sslCertificateKey = enforceHttps ? `/etc/letsencrypt/live/${mainServerName}/privkey.pem` : '/etc/ssl/private/nginx-selfsigned.key';

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
            listen 80 default_server;
            listen [::]:80 default_server;

            server_name ${mainServerName || '_'};
            root ${getPath}/static/default;
            index index.html index.htm index.nginx-debian.html;

            location / {
                proxy_pass http://localhost:${xMainOutPutPort};
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                proxy_intercept_errors on;  # To handle HTTP errors from the proxy
                error_page 404 = @fallback;  # Redirect 404 errors to the @fallback location
            }

            location @fallback {
                try_files $uri $uri/ =404;
            }

            error_page 404 /404.html;
            location = /404.html {
                internal;
            }

            error_page 500 502 503 504 /50x.html;
            location = /50x.html {
                internal;
            }
        }

        ${enforceHttps ? `
        server {
            listen 443 ssl default_server;
            listen [::]:443 ssl default_server;

            server_name ${mainServerName || '_'};

            ssl_certificate ${sslCertificate};
            ssl_certificate_key ${sslCertificateKey};
            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_prefer_server_ciphers on;

            location / {
                proxy_pass http://localhost:${xMainOutPutPort};
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                proxy_intercept_errors on;  # To handle HTTP errors from the proxy
                error_page 404 = @fallback;  # Redirect 404 errors to the @fallback location
            }

            location @fallback {
                try_files $uri $uri/ =404;
            }

            error_page 404 /404.html;
            location = /404.html {
                internal;
            }

            error_page 500 502 503 504 /50x.html;
            location = /50x.html {
                internal;
            }
        }
        ` : ''}
    }
    `;
};

export default xDefaultServerBlock;