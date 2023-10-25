// ./lib/security.js
const crypto = require('crypto');
class Security {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    encrypt(data) {
        const cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
        let crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(data) {
        const decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }

    // TODO: Add other security methods like signing, verifying, etc.
}

module.exports = Security;
