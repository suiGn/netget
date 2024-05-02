// defaultServerBlock.js
const getDefaultServerBlock = (userConfig) => `
events {
    worker_connections 1024;
}

http {
    include ${userConfig.nginxSitesAvailable}/*.conf;
    include ${userConfig.nginxSitesEnabled}/*;

    server {
        listen 80 default_server;
        server_name _;
        root /var/www/html;
        location / {
            return 200 'NGINX Default Response. Server is running.';
        }
    }
}
`;

export default getDefaultServerBlock;
