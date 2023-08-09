const axios = require('axios');
const Security = require('./security');
class ServiceNode {
    constructor(metadata, secretKey) {
        this.metadata = metadata;
        this.id = null; // this will be set during registration
        this.security = new Security(secretKey);
    }
    async register(registryAddress) {
        try {
            // Optionally encrypt metadata before sending
            const encryptedMetadata = this.security.encrypt(JSON.stringify(this.metadata));
            const response = await axios.post(`${registryAddress}/register`, {
                encryptedData: encryptedMetadata
            });
            if (response.data && response.data.id) {
                this.id = response.data.id; // Set the ID from the response, if it's provided.
            }
            return response.data;
        } catch (error) {
            console.error('Failed to register with registry:', error.message);
            throw error;
        }
    }
    async discover(serviceName, registryAddress) {
        try {
            const response = await axios.get(`${registryAddress}/discover/${serviceName}`);
            if (response.data) {
                // Optionally decrypt the response data if it's encrypted.
                const decryptedData = this.security.decrypt(response.data.encryptedData);
                return JSON.parse(decryptedData);
            }
            return null;
        } catch (error) {
            console.error(`Failed to discover service ${serviceName}:`, error.message);
            throw error;
        }
    }
}
module.exports = ServiceNode;
