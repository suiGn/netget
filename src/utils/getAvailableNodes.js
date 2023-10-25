const mdns = require('mdns');

const getAvailableNodes = async () => {
  console.log('getAvailableNodes() called');
  console.log('getAvailableNodes() starting...');

  const nodes = [];

  // Create a new browser for service discovery
  const browser = mdns.createBrowser(mdns.tcp('http'));

  // Listen for service updates
  browser.on('serviceUp', (service) => {
    const { addresses, port } = service;
    const ip = addresses[0];

    // Add the discovered node to the list
    nodes.push({ ip, port });
    console.log(`Discovered node: ${ip}:${port}`);
  });

  // Start the service discovery
  browser.start();

  // Wait for a specific duration to discover nodes
  await new Promise((resolve) => {
    setTimeout(() => {
      // Stop the service discovery
      browser.stop();
      resolve();
    }, 5000); // Adjust the duration as needed
  });

  console.log('Network scan completed');
  return nodes;
};

module.exports = getAvailableNodes;
