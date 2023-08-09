// ./lib/networkManager.js
const axios = require('axios');

const registerWithRegistry = async (REGISTRY_URL, PORT) => {
    try {
        await axios.post(`${REGISTRY_URL}/register`, {
            nodeName: 'YourNodeName',
            nodeAddress: `http://localhost:${PORT}`,
            network: 'development'
            // ... any other meta data ...
        });
    } catch (error) {
        console.error('Failed to register with registry:', error.message);
    }
};

module.exports = {
    registerWithRegistry
};
