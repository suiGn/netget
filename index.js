/**
 * Entry point of netGet node module.
 * default exports NetGet
 * defaultHandler exports defaultHandler
 * @example
 * import NetGet, { defaultHandler } from 'netget';
 * const netget = new NetGet();
 * const gateway = netget.Gateway({ host: 'localhost', port: 3000 });
 * gateway.listen();
 * gateway.addRoute('example.com', defaultHandler);
 * gateway.addRoute('sub.example.com', (req, res) => { 
 * res.send('Hello from sub.example.com!'); }
 * );
 * @module index
 */

import NetGet from './src/netget.js';
export { defaultHandler } from './src/routes/defaultHandlers.js';
export default NetGet;
console.log("NetGet Loaded.");