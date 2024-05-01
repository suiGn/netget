// defaultServerBlock.js
const defaultServerBlock = `
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

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
export default defaultServerBlock;
