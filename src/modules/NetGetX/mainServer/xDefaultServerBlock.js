const xDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const { XBlocksAvailable, XBlocksEnabled, getPath, xMainOutPutPort, mainServerName} = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath || !xMainOutPutPort) {
        throw new Error("Invalid user configuration. Missing required paths.");
    }

    // SSL certificate paths
    const sslCertificate = `/etc/letsencrypt/live/${mainServerName}/fullchain.pem`;
    const sslCertificateKey = `/etc/letsencrypt/live/${mainServerName}/privkey.pem`;

    return `

    # user www-data;
    # pid /run/nginx.pid;
    worker_processes auto;

    events {
        worker_connections 1024;  # High performance tweak
    }

    http {
        include /etc/nginx/XBlocks-enabled/*;

        sendfile on;
        tcp_nopush on;
        types_hash_max_size 2028;

        ## Access and error logs.
        access_log /var/log/nginx/access.log;
        error_log  /var/log/nginx/error.log info;

        gzip on;

        ##Virtual Host Configs

        include /etc/nginx/conf.d/*.conf;
        
        }`;
};

export default xDefaultServerBlock;