import fetch from 'node-fetch';

async function checkPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            const publicIP = data.ip;
            console.log(`Current public IP: ${publicIP}`);
            return publicIP;
        } else {
            throw new Error('Failed to retrieve IP address');
        }
    } catch (error) {
        console.error(`Error checking public IP: ${error.message}`);
        return null;  // Return null if there is an error or no public IP found
    }
}

export default checkPublicIP;
