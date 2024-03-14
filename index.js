/**
 * Entry point of the application.
 * It exports all NetGet tools as default NetGet
 * Gateway is a customizable gateway server.
 * @module index
 */

// Log the successful loading of NetGet
import NetGet from './src/netget.js';
console.log("NetGet Loaded.");
export default NetGet;