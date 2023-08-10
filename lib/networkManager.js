// ./lib/networkManager.js
const axios = require('axios');

// This is the original registration function. Rename it to something more descriptive if needed.
function originalRegister(url, port) {
    return axios.post(`${url}/register`, { port });
}

// This function wraps the original function to add specific error handling.
function registerWithRegistry(url, port) {
    return originalRegister(url, port)
        .then(response => {
            console.log('Successfully registered with the registry.');
        })
        .catch(error => {
            if (error.response && error.response.data.code === 'CERT_HAS_EXPIRED') {
                console.warn('Failed to register with registry: certificate has expired, initiating with expired certificate.');
            } else {
                console.error('Failed to register with the registry.', error.message);
            }
        });
}

module.exports = {
    registerWithRegistry,
};
