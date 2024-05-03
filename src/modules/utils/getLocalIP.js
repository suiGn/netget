// getLocalIP.js
import os from 'os';

/**
 * Gets the local IP address of the machine.
 * @returns {string|null} The local IP address or null if not found.
 */
export default function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-ipv4 and internal (i.e., 127.0.0.1) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;  // Return null if no suitable IP address found.
}

// Now, this function can be imported into other modules using ES Module syntax:
// import { getLocalIP } from './getLocalIP.js';
