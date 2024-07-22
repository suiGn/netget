const xDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const mainServerName = xConfig.mainServerName || 'netget.site';

    const { XBlocksAvailable, XBlocksEnabled, getPath, xMainOutPutPort} = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath || !xMainOutPutPort) {
        throw new Error("Invalid user configuration. Missing required paths.");
    }

    // SSL certificate paths
    const sslCertificate = `/etc/letsencrypt/live/${mainServerName}/fullchain.pem`;
    const sslCertificateKey = `/etc/letsencrypt/live/${mainServerName}/privkey.pem`;

    return `
        error_log /var/log/nginx-error.log info;
  
        events {
            worker_connections 1024;  # High performance tweak
        }
        
        http {
            include /etc/nginx/XBlocks-available/*.conf;
            #include /etc/nginx/XBlocks-enabled/*;

            server {
                listen 80;
                listen [::]:80 ipv6only=on;
                return 301 https://$host$request_uri;
                root ${getPath}/static/default;
                index index.html index.htm index.nginx-debian.html;   
            }
        
            server {
                listen 443 ssl;
                listen [::]:443 ssl;
                server_name ${mainServerName}, *.${mainServerName};
                
                ssl_certificate ${sslCertificate};
                ssl_certificate_key ${sslCertificateKey};
 
                include snippets/ssl-params.conf

                
                location / {
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header X-NginX-Proxy true;
                    proxy_pass http://localhost:${xMainOutPutPort};
                    proxy_ssl_session_reuse off;
                    proxy_set_header Host $http_host;
                    proxy_cache_bypass $http_upgrade;
                    proxy_redirect off;
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
        }`;
};

export default xDefaultServerBlock;