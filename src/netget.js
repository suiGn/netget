// src/netget.js
import Gateway from './gateway.js';
class NetGet {
    constructor() {
      // Initialization code, if necessary
    }
  
    static loadDomainConfig(domainConfigPath) {
      try {
        const data = fs.readFileSync(domainConfigPath, 'utf8');
        const domainConfig = JSON.parse(data);
        console.log('Loaded Domain Configuration:', domainConfig);
        // Additional processing or setup based on the domainConfig
        return domainConfig;
      } catch (err) {
        console.error('Error loading domain configuration:', err);
        return null;  // Or throw an error, depending on your preference
      }
    }
  
    // NetGet related functionalities
  }
NetGet.Gateway = Gateway;
export default NetGet;
