const ServiceNode = require('./lib/serviceNode');
const registryAddress = 'https://registry.netget.me'; // Placeholder for your registry

const node = new ServiceNode({ 
    nodeName: 'YourNodeName',
     address: 'http://localhost:3000' 
    },
      'your_secret_key'
      );

node.register(registryAddress)
    .then(response => {
        console.log('Registered node:', response);
    })
    .catch(error => {
        console.error('Registration failed:', error.message);
    });

node.discover('AnotherNodeName', registryAddress)
    .then(service => {
        console.log('Discovered service:', service);
    })
    .catch(error => {
        console.error('Discovery failed:', error.message);
    });