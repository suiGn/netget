import Gateway from '../src/gateway.js';

/**
 * Creates and tests the NetGet Gateway with the specified configuration.
 * 
 * @remarks
 * This script is used to create and test the Netget Gateway with the specified configuration options. 
 * To run the tests, execute `node tests/test.js` in your terminal.
 * 
 * @example
 * // To run the tests:
 * // node tests/test.js
 * 
 * @see Gateway
 * 
 * @param {object} options - The configuration options for creating the Gateway.
 * @param {number} options.port - The port on which the Gateway will listen for incoming requests.
 * @param {string} options.domainsConfigPath - The path to the JSON file containing domain configuration.
 * 
 * @returns {void}
 */
const testGateway = new Gateway({
    port: 3000,
    routes: {
        'localhost:3000': (req, res) => {
            res.send('Hello from example.com!');
        },
        'localhost:': (req, res) => {
            res.send('Hello from another.com!');
        }
    }
});

testGateway.listen();