const getDefaultServerBlock = (xConfig) => {
    if (!xConfig) {
        throw new Error("User configuration must be provided.");
    }

    const { XBlocksAvailable, XBlocksEnabled, getPath } = xConfig;
    if (!XBlocksAvailable || !XBlocksEnabled || !getPath) {
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

        # Root directory and default response
        root ${getPath}/static/default;  # Set to user's .get directory

        location / {
            proxy_pass http://localhost:3004;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            try_files $uri $uri/ =404;
        }
    }
}
`;
};

export default getDefaultServerBlock;
